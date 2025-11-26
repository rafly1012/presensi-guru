import { useState, useEffect } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { jenikelamins, fetchJabatans } from "./data";
import { DataTableColumnHeader } from "./DataTableColumnHeader";
import { DataTableRowActions } from "./DataTableRowActions";
import { CardGuru } from "./cardGuru";

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
                <span className="max-w-[100px] truncate font-medium">
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
                <span className="max-w-[100px] truncate font-medium capitalize">
                  {row.getValue("nip")}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" className="capitalize">
              {row.getValue("nip")}
            </TooltipContent>
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
        <div className="flex space-x-2">
                <span className="max-w-[100px] truncate font-medium capitalize">
                {row.getValue("jabatan")}
                </span>
              </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "jeniskelamin",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Jenis Kelamin" />
    ),
    cell: ({ row }) => {
      const jeniskelamin = jenikelamins.find(
        (jenikelamin) => jenikelamin.value === row.getValue("jeniskelamin")
      );

      if (!jeniskelamin) return null;

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex space-x-2">
                <span className="max-w-[100px] truncate font-medium capitalize">
                  {jeniskelamin.label}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" className="capitalize">
              {jeniskelamin.label}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "alamat",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Alamat" />
    ),
    cell: ({ row }) => {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex space-x-2">
                <span className="max-w-[100px] truncate font-medium capitalize">
                  {row.getValue("alamat")}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" className="capitalize">
              {row.getValue("alamat")}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: "nohp",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nomor HP" />
    ),
    cell: ({ row }) => {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex space-x-2">
                <span className="max-w-[100px] truncate font-medium capitalize">
                  {row.getValue("nohp")}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" className="capitalize">
              {row.getValue("nohp")}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  
  {
    accessorKey: "foto",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Foto" />
    ),
    cell: ({ row }) => {
      return <CardGuru row={row} />;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
