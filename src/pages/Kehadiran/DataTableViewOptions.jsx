import React, { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { File } from "lucide-react";
import { Button } from "@/components/ui/button";

// Fungsi bantu untuk parse tanggal Indonesia ke format yyyy-mm-dd
function parseTanggalIndo(tanggalStr) {
  const [tanggalPart] = tanggalStr.split("pukul");
  const bulanMap = {
    Januari: "01",
    Februari: "02",
    Maret: "03",
    April: "04",
    Mei: "05",
    Juni: "06",
    Juli: "07",
    Agustus: "08",
    September: "09",
    Oktober: "10",
    November: "11",
    Desember: "12",
  };

  const parts = tanggalPart.trim().split(" ");
  if (parts.length !== 3) return null;

  const tanggal = parts[0].padStart(2, "0");
  const bulan = bulanMap[parts[1]];
  const tahun = parts[2];

  if (!bulan) return null;

  return `${tahun}-${bulan}-${tanggal}`;
}

// Fungsi bantu untuk konversi gambar URL ke base64
const loadImageFromUrl = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = reject;
    img.src = url;
  });
};

const download = async (filterDate, filterMonth, filterYear) => {
  const doc = new jsPDF({ orientation: "landscape" });
  const today = new Date();
  const dateString = today.toLocaleDateString("id-ID");

  // URL logo
  const logoUrl = "/logo.png";

  try {
    const logoBase64 = await loadImageFromUrl(logoUrl);
    doc.addImage(logoBase64, "PNG", 14, 10, 25, 25); // x, y, width, height
  } catch (error) {
    console.warn("Gagal memuat logo:", error);
  }

  doc.setFontSize(12);
  doc.text("SMK Negeri 7 Kota Kupang", 45, 20);
  doc.text("Laporan Data Kehadiran Guru", 45, 25);
  doc.text(`Tanggal Cetak: ${dateString}`, 45, 30);

  const columns = [
    { header: "No", dataKey: "column0" },
    { header: "Nama", dataKey: "column1" },
    { header: "NIP", dataKey: "column2" },
    { header: "Jabatan", dataKey: "column3" },
    { header: "Jam Masuk", dataKey: "column4" },
    { header: "Keterangan Masuk", dataKey: "column5" },
    { header: "Jam Keluar", dataKey: "column6" },
    { header: "Keterangan Keluar", dataKey: "column7" },
    { header: "Keterangan", dataKey: "column8" },
  ];

  const rows = Array.from(document.querySelectorAll("#myKehadiran tbody tr"))
    .map((row, index) => {
      const cells = row.querySelectorAll("td");
      return {
        column0: index + 1,
        column1: cells[1].innerText,
        column2: cells[2].innerText,
        column3: cells[3].innerText,
        column4: cells[4].innerText,
        column5: cells[5].innerText,
        column6: cells[6].innerText,
        column7: cells[7].innerText,
        column8: cells[8].innerText,
      };
    })
    .filter((data) => {
      const jamMasuk = parseTanggalIndo(data.column4);
      const jamKeluar = parseTanggalIndo(data.column6);

      if (!filterDate && !filterMonth && !filterYear) return true;
      if (filterDate) return jamMasuk === filterDate || jamKeluar === filterDate;

      const targetPrefix = `${filterYear || ""}-${filterMonth || ""}`;
      return (
        (jamMasuk && jamMasuk.startsWith(targetPrefix)) ||
        (jamKeluar && jamKeluar.startsWith(targetPrefix))
      );
    });

  if (rows.length === 0) {
    alert("Tidak ada data sesuai filter.");
    return;
  }

  autoTable(doc, {
    columns,
    body: rows,
    startY: 40,
    styles: { lineColor: [0, 0, 0] },
    headStyles: {
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
      lineWidth: 0.5,
      minCellHeight: 10,
    },
    bodyStyles: {
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
      lineWidth: 0.5,
    },
  });

  const footerText = `File ini didownload di www.smkn7kotakupang.com - pada tanggal: ${dateString}`;
  const footerY = doc.internal.pageSize.height - 20;
  doc.text(footerText, 14, footerY);

  const filename = `Data Kehadiran Guru ${filterDate || `${filterMonth || ""}-${filterYear || ""}`}.pdf`;
  const pageWidth = doc.internal.pageSize.width;

doc.setFontSize(12);
doc.text("Kupang, " + dateString, pageWidth - 50, footerY - 25);
doc.text("Kepala Sekolah,", pageWidth - 50, footerY - 20);

// Ruang kosong untuk tanda tangan
doc.text("Mario Kenge", pageWidth - 50, footerY + 5);

  doc.save(filename);
};

export function DataTableViewOptions() {
  const [filterDate, setFilterDate] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [filterYear, setFilterYear] = useState("");

  const handleDownload = () => {
    download(filterDate, filterMonth, filterYear);
  };

  return (
    <div className="ml-auto flex flex-col sm:flex-row items-center gap-2">
      <input
        type="date"
        value={filterDate}
        onChange={(e) => setFilterDate(e.target.value)}
        className="border rounded px-2 py-1 text-sm"
      />

      <select
        value={filterMonth}
        onChange={(e) => setFilterMonth(e.target.value)}
        className="border rounded px-2 py-1 text-sm"
      >
        <option value="">-- Bulan --</option>
        {[...Array(12)].map((_, i) => {
          const val = String(i + 1).padStart(2, "0");
          return (
            <option key={val} value={val}>
              {val}
            </option>
          );
        })}
      </select>

      <input
        type="number"
        placeholder="Tahun"
        value={filterYear}
        onChange={(e) => setFilterYear(e.target.value)}
        className="border rounded px-2 py-1 text-sm w-[100px]"
      />

      <Button
        onClick={handleDownload}
        size="sm"
        variant="outline"
        className="h-8 gap-1 text-sm"
      >
        <File className="h-3.5 w-3.5" />
        <span className="sr-only sm:not-sr-only">Ekspor</span>
      </Button>
    </div>
  );
}
