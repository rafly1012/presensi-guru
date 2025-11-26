import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { File } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CardAllGuru } from "./cardAllGuru";
import { ImportGuru } from "./importGuru";

const download = () => {
  const doc = new jsPDF({ orientation: "landscape" });
  const today = new Date();
  const dateString = today.toLocaleDateString();

  doc.setFontSize(12);

  doc.text("SMK Negeri 7 Kota Kupang", 14, 20);
  doc.text("Laporan Data Guru", 14, 25);
  doc.text(`Tanggal: ${dateString}`, 14, 30);

  const columns = [
    { header: "No", dataKey: "column0" },
    { header: "Nama Guru", dataKey: "column2" },
    { header: "NIP", dataKey: "column3" },
    { header: "Jabatan", dataKey: "column4" },
    { header: "Jenis Kelamin", dataKey: "column5" },
    { header: "Alamat", dataKey: "column6" },
    { header: "Nomor Hp", dataKey: "column7" },
  ];

  const rows = Array.from(document.querySelectorAll("#myGuru tbody tr")).map(
    (row, index) => {
      const cells = row.querySelectorAll("td");
      console.log(cells[1]);
      return {
        column0: index + 1,
        column2: cells[1].innerText,
        column3: cells[2].innerText,
        column4: cells[3].innerText,
        column5: cells[4].innerText,
        column6: cells[5].innerText,
        column7: cells[6].innerText,
        column8: cells[7].innerText,
      };
    }
  );

  autoTable(doc, {
    columns: columns,
    body: rows,
    startY: 40,
    styles: {
      lineColor: [0, 0, 0],
    },
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
    columnStyles: {
      0: { cellWidth: "auto" },
      1: { cellWidth: "auto" },
      2: { cellWidth: "auto" },
      3: { cellWidth: "auto" },
      4: { cellWidth: "auto" },
      5: { cellWidth: "auto" },
      6: { cellWidth: "auto" },
      7: { cellWidth: "auto" },
      8: { cellWidth: "auto" },
    },
  });

  const footerText = `File ini didownload di www.smkn7kotakupang.com - pada tanggal: ${dateString}`;
  const footerY = doc.internal.pageSize.height - 20;
  doc.text(footerText, 14, footerY);

  doc.save(`Data Guru - ${dateString}.pdf`);
};

export function DataTableViewOptions() {
  return (
    <div className="ml-auto flex items-center gap-2">
      <Button
        onClick={download}
        size="sm"
        variant="outline"
        className="h-8 gap-1 text-sm"
      >
        <File className="h-3.5 w-3.5" />
        <span className="sr-only sm:not-sr-only">Ekspor</span>
      </Button>
      <CardAllGuru />
    </div>
  );
}
