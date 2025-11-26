import { Link } from "react-router-dom";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { DeleteJabatan } from "./deleteJabatan";

export function DataTableRowActions({ row }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <Link to={`/jabatan/detail/${row.original.id}`}>
          <Button variant="ghost" className="w-full">
            Perbarui Jabatan
          </Button>
        </Link>
        <DropdownMenuSeparator />
        <DeleteJabatan id={row.original.id} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
