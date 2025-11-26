import { useEffect, useRef, useState, useCallback } from "react";
import QrScanner from "qr-scanner";
import { toast } from "sonner";

import QrFrame from "../../assets/qr-frame.svg";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";

import { TIME_RANGES, DAYS_OF_WEEK } from "@/lib/check";

const QrReader = () => {
  const scanner = useRef();
  const videoEl = useRef(null);
  const qrBoxEl = useRef(null);
  const [qrOn, setQrOn] = useState(false);
  const [scannedResult, setScannedResult] = useState("");
  const [guruData, setGuruData] = useState(null);
  const [message, setMessage] = useState("");
  const [linkMessage, setLinkMessage] = useState("");

  const onScanSuccess = async (result) => {
    setScannedResult(result?.data);
  };

  const onScanFail = (err) => {
    console.log(err);
  };

  const fetchGuruData = async (nip) => {
    try {
      const response = await api.get(`/guru/nip/${nip}`);
      setGuruData(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const submitAttendance = useCallback(async (endpoint) => {
    try {
      await api.post(endpoint, {
        idguru: guruData.id,
        keterangan: 'h',
      });
      setMessage("Berhasil presensi.");
      toast.success("Presensi berhasil dikirim.", {
        description: new Intl.DateTimeFormat("id-ID", {
          dateStyle: "full",
          timeStyle: "short",
        }).format(new Date()),
      });

      const now = new Date();
      const currentTime = `${now.getHours()}:${now.getMinutes()}`;

      let currentMessage = "";

      const { jammasuk, jamkeluar } = TIME_RANGES;
      if (currentTime >= jammasuk.start && currentTime <= jammasuk.end) {
        currentMessage = `Waktu Masuk.`;
      } else if (
        currentTime >= jamkeluar.start &&
        currentTime <= jamkeluar.end
      ) {
        currentMessage = `Waktu Keluar.`;
      }
    } catch (error) {
      console.error(error);
      toast.error("Gagal mengirim presensi.");
    }
  }, [guruData]);

  const checkAttendance = async () => {
    if (guruData) {
      try {
        const now = new Date();
        const currentTime = `${now.getHours()}:${now.getMinutes()}`;
        const currentDay = DAYS_OF_WEEK[now.getDay() - 1];
        let currentMessage = "Presensi Belum Dibuka.";
        let endpoint = "";
        let isWithinSession = false;

        const { jammasuk, jamkeluar } = TIME_RANGES;
        if (currentTime >= jammasuk.start && currentTime <= jammasuk.end) {
          currentMessage = `Waktu Masuk.`;
          endpoint = "/jammasuk";
          isWithinSession = true;
        } else if (
          currentTime >= jamkeluar.start &&
          currentTime <= jamkeluar.end
        ) {
          currentMessage = `Waktu Keluar.`;
          endpoint = "/jamkeluar";
          isWithinSession = true;
        }

        if (!DAYS_OF_WEEK.includes(currentDay)) {
          setMessage("Hari ini bukan hari kerja.");
          return;
        }

        if (!isWithinSession) {
          setMessage("Presensi Belum Dibuka.");
          return;
        }

        if (endpoint) {
          const response = await api.get(`${endpoint}/${guruData.id}`);
          const hasAttended = response.data.data;
          const today = now.toLocaleDateString("id-ID");

          const hasAttendanceToday = hasAttended.some((attendance) => {
            const attendanceDate = new Date(
              attendance.jammasuk || attendance.jamkeluar
            ).toLocaleDateString("id-ID");
            return attendanceDate === today;
          });

          if (hasAttendanceToday) {
            setMessage("Sudah Presensi");
          } else {
            await submitAttendance(endpoint);
            setMessage(currentMessage);
          }
        }
      } catch (error) {
        console.error(error);
        setMessage("Terjadi kesalahan.");
      }
    }
  };

  useEffect(() => {
    if (scannedResult) {
      fetchGuruData(scannedResult);
    } else {
      setGuruData(null);
    }
  }, [scannedResult]);

  useEffect(() => {
    checkAttendance();
  }, [guruData]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      if (videoEl.current) {
        videoEl.current.srcObject = stream;
        videoEl.current.play();
        setQrOn(true);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const stopCamera = () => {
    if (videoEl.current) {
      const stream = videoEl.current.srcObject;
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
      setQrOn(false);
    }
  };

  useEffect(() => {
    if (videoEl?.current && !scanner.current) {
      scanner.current = new QrScanner(videoEl?.current, onScanSuccess, {
        onDecodeError: onScanFail,
        preferredCamera: "environment",
        highlightScanRegion: true,
        highlightCodeOutline: true,
        overlay: qrBoxEl?.current || undefined,
      });

      scanner?.current
        ?.start()
        .then(() => setQrOn(true))
        .catch((err) => {
          if (err) setQrOn(false);
        });
    }

    return () => {
      if (!videoEl?.current) {
        scanner?.current?.stop();
      }
    };
  }, []);

  return (
    <div className="text-center">
      <div className="flex justify-center items-center">
        <div className="relative w-[430px] h-[430px] p-4">
          <video ref={videoEl} className="w-full h-full object-cover"></video>
          <div ref={qrBoxEl} className="w-full h-full">
            <img src={QrFrame} alt="Qr Frame" width={256} height={256} />
          </div>
        </div>
      </div>
      <div className="mt-4">
        <Button
          className={`btn ${qrOn ? "btn-danger" : "btn-primary"}`}
          onClick={() => (qrOn ? stopCamera() : startCamera())}
        >
          {qrOn ? "Matikan Kamera" : "Aktifkan Kamera"}
        </Button>
        {message && (
          <>
            <p className="text-xl text-destructive font-semibold">
              {message}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default QrReader;
