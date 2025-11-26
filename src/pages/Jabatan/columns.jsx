import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { DataTableColumnHeader } from "./DataTableColumnHeader";
import { DataTableRowActions } from "./DataTableRowActions";

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
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
