import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { File } from "lucide-react";

import { Button } from "@/components/ui/button";

const download = () => {
  const doc = new jsPDF({ orientation: "landscape" });
  const today = new Date();
  const dateString = today.toLocaleDateString();

  doc.setFontSize(12);

  doc.text("SMK Negeri 7 Kota Kupang", 14, 20);
  doc.text("Data Jabatan", 14, 25);
  doc.text(`Tanggal: ${dateString}`, 14, 30);

  const columns = [
    { header: "No", dataKey: "column0" },
    { header: "Jabatan", dataKey: "column1" }
  ];

  const rows = Array.from(document.querySelectorAll("#my tbody tr")).map(
    (row, index) => {
      const cells = row.querySelectorAll("td");
      return {
        column0: index + 1,
        column1: cells[1].innerText,
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
    },
  });

  const footerText = `File ini didownload di www.smkn7kotakupang.com - pada tanggal: ${dateString}`;
  const footerY = doc.internal.pageSize.height - 20;
  doc.text(footerText, 14, footerY);

  doc.save(`Data Jabatan - ${dateString}.pdf`);
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
    </div>
  );
}
