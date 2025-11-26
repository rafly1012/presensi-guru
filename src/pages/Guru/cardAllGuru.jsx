import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import QRCode from "qrcode";
import { QrCode } from "lucide-react";

import { fetchJabatans } from "./data";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";

export function CardAllGuru() {
  const [guru, setGuru] = useState([]);
  const [jabatanOptions, setJabatanOptions] = useState([]);

  const fetchGuru = async () => {
    try {
      const response = await api.get("/guru");
      if (response.data.success) {
        setGuru(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchGuru();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const jabatans = await fetchJabatans();
      setJabatanOptions(jabatans);
    };

    fetchData();
  }, []);

  const generatePDF = async () => {
    const doc = new jsPDF({
      orientation: "portrait",
    });

    const cardWidth = 54;
    const cardHeight = 90;
    const qrCodeSize = 40;
    const margin = 5;
    const cardsPerRow = 3;

    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    let xOffset = 10;
    let yOffset = 10;

    for (let i = 0; i < guru.length; i++) {
      const teacher = guru[i];
      const qrCodeUrl = await QRCode.toDataURL(teacher.nip, {
        errorCorrectionLevel: "H",
        width: qrCodeSize * 10,
        margin: 1,
      });

      doc.setLineWidth(1);
      doc.rect(xOffset, yOffset, cardWidth, cardHeight, "S");

      doc.addImage(qrCodeUrl, "PNG", xOffset + (cardWidth - qrCodeSize) / 2, yOffset + 15, qrCodeSize, qrCodeSize);

      doc.setFontSize(10);
      doc.text("SMK Negeri 7 Kupang", xOffset + cardWidth / 2, yOffset + 10, { align: "center" });
      doc.setFontSize(8);
      doc.text(`Nama: ${teacher.nama}`, xOffset + cardWidth / 2, yOffset + 65, { align: "center" });
      doc.text(`Jabatan: ${teacher.jabatan}`, xOffset + cardWidth / 2, yOffset + 70, { align: "center" });
      doc.text(`NIP: ${teacher.nip}`, xOffset + cardWidth / 2, yOffset + 75, { align: "center" });

      if ((i + 1) % cardsPerRow === 0) {
        xOffset = 10;
        yOffset += cardHeight + margin;
      } else {
        xOffset += cardWidth + margin;
      }

      if (i === guru.length - 1 || xOffset + cardWidth > pageWidth) {
        if (i !== guru.length - 1) {
          doc.addPage();
        }
        xOffset = 10;
        yOffset = 10;
      }
    }

    doc.save("ID_Card_Guru.pdf");
  };

  return (
    <div className="ml-auto flex items-center gap-2">
      <Button
        size="sm"
        variant="outline"
        className="h-8 gap-1 text-sm"
        onClick={generatePDF}
      >
        <QrCode className="h-3.5 w-3.5" />
        <span className="sr-only sm:not-sr-only">QR Code</span>
      </Button>
    </div>
  );
}
