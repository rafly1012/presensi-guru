import { useState, useEffect, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { QrCode } from "lucide-react";

import Logo from "../../assets/logo.png";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";

export function CardGuru({ row }) {
  const [namajabatan, setNamaJabatan] = useState("");
  const qrCodeRef = useRef(null);

  useEffect(() => {
    const fetchJabatan = async () => {
      try {
        const response = await api.get(`/jabatan/${row.original.idjabatan}`);
        if (response.data.success) {
          setNamaJabatan(response.data.data.nama);
        }
      } catch (error) {
        console.error("Failed to fetch jabatan:", error);
      }
    };

    fetchJabatan();
  }, [row.original.idjabatan]);

  const qrCodeValue = `${row.original.nip}`;

  const downloadImage = () => {
    if (qrCodeRef.current) {
      const qrCanvas = qrCodeRef.current.querySelector("canvas");
      if (qrCanvas) {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const cmToPx = (cm) => cm * 37.795275591; // Konversi cm ke piksel
        const qrSize = cmToPx(3); // Ukuran QR code (3 cm x 3 cm)
        const totalWidth = cmToPx(5.4); // 5.4 cm
        const totalHeight = cmToPx(9); // 9 cm

        canvas.width = totalWidth;
        canvas.height = totalHeight;

        const x = (totalWidth - qrSize) / 2;
        const y = cmToPx(1); // Jarak dari atas, 1 cm

        // Fill background
        ctx.fillStyle = "#f0f0f0";
        ctx.fillRect(0, 0, totalWidth, totalHeight);

        // Draw QR code
        ctx.drawImage(qrCanvas, x, y, qrSize, qrSize);

        // Set text styles and add text
        ctx.fillStyle = "#000000";
        ctx.font = "bold 10px Arial";
        ctx.textAlign = "center";
        ctx.fillText(`SMK Negeri 7 Kupang`, totalWidth / 2, y + qrSize + 20);
        ctx.fillText(`Nama: ${row.original.nama}`, totalWidth / 2, y + qrSize + 50);
        ctx.fillText(`Jabatan: ${row.original.jabatan}`, totalWidth / 2, y + qrSize + 70);
        ctx.fillText(`NIP: ${row.original.nip}`, totalWidth / 2, y + qrSize + 90);

        // Create and click the download link
        const link = document.createElement("a");
        link.download = `${row.original.nama}-IDCard.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      }
    }
  };

  return (
    <>
      <div ref={qrCodeRef} style={{ display: "none" }}>
        <QRCodeCanvas
          value={qrCodeValue}
          size={128}
          bgColor={"#ffffff"}
          fgColor={"#000000"}
          includeMargin={false}
          imageSettings={{
            src: Logo,
            height: 24,
            width: 24,
            excavate: true,
          }}
        />
      </div>
      <Button onClick={downloadImage} size="icon" variant="outline">
        <QrCode className="w-4 h-4" />
      </Button>
    </>
  );
}
