import { useState, useEffect } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { fetchJabatans } from "./data";
import { DataTableColumnHeader } from "./DataTableColumnHeader";

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
};

const getKeteranganText = (keteranganMasuk, keteranganKeluar) => {
  if (keteranganMasuk === "h" && keteranganKeluar === "h") return "Hadir";
  if (keteranganMasuk === "s" && keteranganKeluar === "s") return "Sakit";
  if (keteranganMasuk === "i" && keteranganKeluar === "i") return "Ijin";
  if (keteranganMasuk === "h" && keteranganKeluar === "s") return "Sakit";
  if (keteranganMasuk === "h" && keteranganKeluar === "i") return "Ijin";
  if (keteranganMasuk === "s" && keteranganKeluar === null) return "Sakit";
  if (keteranganMasuk === "i" && keteranganKeluar === null) return "Ijin";
  if (keteranganMasuk === "h" && keteranganKeluar === null) return "Bolos";
  if (keteranganMasuk === null && keteranganKeluar === null) return "Alpa";
  return "Tidak Ada Data";
};

const getKeterangan = (keterangan) => {
  switch (keterangan) {
    case "h":
      return "Hadir";
    case "s":
      return "Sakit";
    case "i":
      return "Ijin";
    default:
      return "Tidak Ada Data";
  }
};

export const columns = [
  {
    id: "select",
    header: <div />,
    cell: <div />,
  },
  {
    accessorKey: "nama",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nama" />
    ),
    cell: ({ row }) => {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex space-x-2">
                <span className="max-w-full truncate font-medium">
                  {row.getValue("nama")}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">{row.getValue("nama")}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: "nip",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="NIP" />
    ),
    cell: ({ row }) => {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex space-x-2">
                <span className="max-w-[100px] truncate font-medium">
                  {row.getValue("nip")}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">{row.getValue("nip")}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: "jabatan",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Jabatan" />
    ),
    cell: ({ row }) => {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex space-x-2">
                <span className="max-w-full truncate font-medium">
                  {row.getValue("jabatan")}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">{row.getValue("jabatan")}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: "jammasuk",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Jam Masuk" />
    ),
    cell: ({ row }) => {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex space-x-2">
                <span className="max-w-[100px] truncate font-medium">
                  {formatDate(row.getValue("jammasuk"))}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">
              {formatDate(row.getValue("jammasuk"))}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: "keteranganMasuk",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Keterangan Masuk" />
    ),
    cell: ({ row }) => {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex space-x-2">
                <span className="max-w-[100px] truncate font-medium">
                  {getKeterangan(row.getValue("keteranganMasuk"))}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">
              {getKeterangan(row.getValue("keteranganMasuk"))}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: "jamkeluar",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Jam Keluar" />
    ),
    cell: ({ row }) => {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex space-x-2">
                <span className="max-w-[100px] truncate font-medium">
                  {formatDate(row.getValue("jamkeluar"))}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">
              {formatDate(row.getValue("jamkeluar"))}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: "keteranganKeluar",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Keterangan Keluar" />
    ),
    cell: ({ row }) => {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex space-x-2">
                <span className="max-w-[100px] truncate font-medium">
                  {getKeterangan(row.getValue("keteranganKeluar"))}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">
              {getKeterangan(row.getValue("keteranganKeluar"))}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: "keterangan",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Keterangan" />
    ),
    cell: ({ row }) => {
      const keteranganMasuk = row.getValue("keteranganMasuk");
      const keteranganKeluar = row.getValue("keteranganKeluar");
      const keterangan = getKeteranganText(keteranganMasuk, keteranganKeluar);

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex space-x-2">
                <span className="max-w-[100px] truncate font-medium">
                  {keterangan}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">{keterangan}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
];
