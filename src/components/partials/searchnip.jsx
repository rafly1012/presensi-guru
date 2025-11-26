import { useState, useEffect } from "react";
import { LoaderCircle, Search, CircleX } from "lucide-react";
import { toast } from "sonner";

import api from "@/lib/api";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { TIME_RANGES, DAYS_OF_WEEK } from "@/lib/check";

export function SearchNIP() {
  const [value, setValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [guruData, setGuruData] = useState(null);
  const [namaJabatan, setNamaJabatan] = useState(null);
  const [selectedValue, setSelectedValue] = useState("");
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const checkAttendance = async () => {
      if (guruData) {
        try {
          const now = new Date();
          const currentTime = `${now.getHours()}:${now.getMinutes()}`;
          const currentDay = DAYS_OF_WEEK[now.getDay() - 1];
          let currentMessage = "Presensi Belum Dibuka.";
          let showFormFlag = false;
          let endpoint = "";
          let isWithinSession = false;

          const { jammasuk, jamkeluar } = TIME_RANGES;
          if (currentTime >= jammasuk.start && currentTime <= jammasuk.end) {
            currentMessage = `Waktu Masuk.`;
            showFormFlag = true;
            endpoint = "/jammasuk";
            isWithinSession = true;
          } else if (
            currentTime >= jamkeluar.start &&
            currentTime <= jamkeluar.end
          ) {
            currentMessage = `Waktu Keluar.`;
            showFormFlag = true;
            endpoint = "/jamkeluar";
            isWithinSession = true;
          }

          if (!DAYS_OF_WEEK.includes(currentDay)) {
            setMessage("Hari ini bukan hari kerja.");
            setShowForm(false);
            return;
          }

          if (!isWithinSession) {
            setMessage("Presensi Belum Dibuka.");
            setShowForm(false);
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
              setShowForm(false);
            } else {
              setMessage(currentMessage);
              setShowForm(showFormFlag);
            }
          }
        } catch (error) {
          console.error(error);
          setMessage("Terjadi kesalahan.");
          setShowForm(false);
        }
      }
    };

    checkAttendance();
  }, [guruData]);

  useEffect(() => {
    if (value) {
      const fetchData = async () => {
        try {
          const guruResponse = await api.get(`/guru/nip/${value}`);
          setGuruData(guruResponse.data.data);

          if (guruResponse.data.data && guruResponse.data.data.idjabatan) {
            const jabatanResponse = await api.get(
              `/jabatan/${guruResponse.data.data.idjabatan}`
            );
            setNamaJabatan(jabatanResponse.data.data.nama);
          }
        } catch (error) {
          console.log(error);
        }
      };
      fetchData();
    } else {
      setGuruData(null);
      setNamaJabatan(null);
    }
  }, [value]);

  const handleChange = (e) => {
    const { value } = e.target;
    if (/^\d*$/.test(value)) {
      setValue(value);
    }

    setIsTyping(true);

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    setTypingTimeout(
      setTimeout(() => {
        setIsTyping(false);
      }, 500)
    );
  };

  const handleReset = () => {
    setValue("");
    setIsTyping(false);
    setGuruData(null);
    setNamaJabatan(null);
  };

  const handleToggleChange = (value) => {
    setSelectedValue(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const now = new Date();
    const currentTime = `${now.getHours()}:${now.getMinutes()}`;
    let endpoint = "";

    const { jammasuk, jamkeluar } = TIME_RANGES;

    if (currentTime >= jammasuk.start && currentTime <= jammasuk.end) {
      endpoint = "/jammasuk";
    } else if (
      currentTime >= jamkeluar.start &&
      currentTime <= jamkeluar.end
    ) {
      endpoint = "/jamkeluar";
    }

    if (!selectedValue) {
      toast.error("Keterangan kehadiran tidak boleh kosong.");
      return;
    }

    try {
      await api.post(endpoint, {
        idguru: guruData.id,
        keterangan: selectedValue,
      });
      setMessage("Berhasil presensi.");
      setShowForm(false);
      toast.success("Berhasil", {
        description: new Intl.DateTimeFormat("id-ID", {
          dateStyle: "full",
        }).format(),
      });
      const now = new Date();
      const currentTime = `${now.getHours()}:${now.getMinutes()}`;
      const currentDay = DAYS_OF_WEEK[now.getDay() - 1];
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

      if (selectedValue === 'h') {
        const phone = `whatsapp:+${guruData.nohportu}`;
        const messages = `Dear Orang tua\nAnak Anda ${guruData.nama} hadir di Sekolah, pada Jam ${currentTime}, ${currentMessage} di ${currentDay}\nFrom SMK Negeri 7 Kota Kupang`
        const response = await fetch("http://localhost:3000/api/send-sms", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            body: messages,
            to: phone,
          }),
        });
  
        if (response.ok) {
          console.log('Message sent successfully!');
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="overflow-x-hidden">
      <div className="container flex flex-col items-center justify-between gap-4 mb-2">
        {value && (
          <Card className="w-full md:w-[400px] rounded-md">
            {guruData ? (
              <>
                <CardHeader>
                  <CardTitle>Data Guru</CardTitle>
                </CardHeader>
                <CardContent>
                  <img
                    className="aspect-square w-full rounded-md object-cover border border-dashed"
                    src={`http://localhost:3000/uploads/${guruData.foto}`}
                    alt={`Foto Guru ${guruData.nama}`}
                  />
                  <p className="text-lg text-primary font-semibold">
                    {guruData.nama}
                  </p>
                  <p className="text-sm text-muted-foreground font-semibold">
                    {guruData.nip}
                  </p>
                  <p className="text-sm text-muted-foreground font-semibold">
                    {namaJabatan}
                  </p>
                </CardContent>
                <CardFooter>
                  <div className="mx-auto">
                    {showForm ? (
                      <form onSubmit={handleSubmit}>
                        <p className="text-sm text-primary font-semibold">
                          {message}
                        </p>
                        <ToggleGroup
                          type="single"
                          value={selectedValue}
                          onValueChange={handleToggleChange}
                        >
                          <ToggleGroupItem value="h" aria-label="Toggle Hadir">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 384 512"
                              className="w-4 h-4"
                            >
                              <path d="M320 256l0 192c0 17.7 14.3 32 32 32s32-14.3 32-32l0-224 0-160c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 128L64 192 64 64c0-17.7-14.3-32-32-32S0 46.3 0 64L0 448c0 17.7 14.3 32 32 32s32-14.3 32-32l0-192 256 0z" />
                            </svg>
                          </ToggleGroupItem>
                          <ToggleGroupItem value="s" aria-label="Toggle Sakit">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 320 512"
                              className="w-4 h-4"
                            >
                              <path d="M99.1 105.4C79 114 68.2 127.2 65.2 144.8c-2.4 14.1-.7 23.2 2 29.4c2.8 6.3 7.9 12.4 16.7 18.6c19.2 13.4 48.3 22.1 84.9 32.5c1 .3 1.9 .6 2.9 .8c32.7 9.3 72 20.6 100.9 40.7c15.7 10.9 29.9 25.5 38.6 45.1c8.8 19.8 10.8 42 6.6 66.3c-7.3 42.5-35.3 71.7-71.8 87.3c-35.4 15.2-79.1 17.9-123.7 10.9l-.2 0s0 0 0 0c-24-3.9-62.7-17.1-87.6-25.6c-4.8-1.7-9.2-3.1-12.8-4.3C5.1 440.8-3.9 422.7 1.6 405.9s23.7-25.8 40.5-20.3c4.9 1.6 10.2 3.4 15.9 5.4c25.4 8.6 56.4 19.2 74.4 22.1c36.8 5.7 67.5 2.5 88.5-6.5c20.1-8.6 30.8-21.8 33.9-39.4c2.4-14.1 .7-23.2-2-29.4c-2.8-6.3-7.9-12.4-16.7-18.6c-19.2-13.4-48.3-22.1-84.9-32.5c-1-.3-1.9-.6-2.9-.8c-32.7-9.3-72-20.6-100.9-40.7c-15.7-10.9-29.9-25.5-38.6-45.1c-8.8-19.8-10.8-42-6.6-66.3l31.5 5.5L2.1 133.9C9.4 91.4 37.4 62.2 73.9 46.6c35.4-15.2 79.1-17.9 123.7-10.9c13 2 52.4 9.6 66.6 13.4c17.1 4.5 27.2 22.1 22.7 39.2s-22.1 27.2-39.2 22.7c-11.2-3-48.1-10.2-60.1-12l4.9-31.5-4.9 31.5c-36.9-5.8-67.5-2.5-88.6 6.5z" />
                            </svg>
                          </ToggleGroupItem>
                          <ToggleGroupItem value="i" aria-label="Toggle Ijin">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 320 512"
                              className="w-4 h-4"
                            >
                              <path d="M32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l96 0 0 320-96 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l256 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0 0-320 96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L160 32 32 32z" />
                            </svg>
                          </ToggleGroupItem>
                        </ToggleGroup>
                        <input
                          type="hidden"
                          name="keterangan"
                          value={selectedValue}
                        />
                        <input
                          type="hidden"
                          name="idguru"
                          value={guruData.id}
                        />
                        <Button type="submit" className="w-full mt-1">
                          Kirim
                        </Button>
                      </form>
                    ) : (
                      <p className="text-xl text-destructive font-semibold">
                        {message}
                      </p>
                    )}
                  </div>
                </CardFooter>
              </>
            ) : (
              value.length > 0 && (
                <>
                  <CardHeader></CardHeader>
                  <CardContent>
                    {isTyping ? (
                      <LoaderCircle className="h-20 w-20 shrink-0 text-primary animate-spin mx-auto" />
                    ) : (
                      <p className="text-center text-destructive font-semibold">
                        Data Guru Tidak Ditemukan
                      </p>
                    )}
                  </CardContent>
                  <CardFooter></CardFooter>
                </>
              )
            )}
          </Card>
        )}
      </div>
      <div className="container flex flex-col items-center justify-between md:h-24">
        <div className="flex items-center w-full md:w-[400px] border-2 px-2 rounded-md shadow focus-within:border-primary focus-within:text-primary">
          <input
            type="text"
            value={value}
            onChange={handleChange}
            className="flex h-10 w-full rounded-md bg-background py-3 text-sm font-semibold outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Cari Nomor Induk Pegawai..."
          />
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="h-8"
              onClick={handleReset}
            >
              {isTyping ? (
                <LoaderCircle className="h-4 w-4 shrink-0 text-muted-foreground animate-spin" />
              ) : (
                <>
                  {value ? (
                    <CircleX className="h-4 w-4 shrink-0 text-muted-foreground" />
                  ) : (
                    <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
                  )}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
