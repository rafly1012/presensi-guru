import { Cross2Icon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { DataTableViewOptions } from "./DataTableViewOptions";

export function DataTableToolbar({ table }) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center py-1.5 space-x-1.5">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter nama jabatan..."
          value={table.getColumn("nama")?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn("nama")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {isFiltered && (
          <Button
            className="h-8"
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions />
    </div>
  );
}
