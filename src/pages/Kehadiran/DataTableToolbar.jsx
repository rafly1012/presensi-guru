import { useState, useEffect } from "react";
import { Cross2Icon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";

import { fetchJabatans } from "./data";
import { DataTableViewOptions } from "./DataTableViewOptions";
import { DataTableFacetedFilter } from "./DataTableFacetedFilter";

export function DataTableToolbar({ table }) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const [jabatans, setJabatans] = useState([]);

  useEffect(() => {
    const loadJabatans = async () => {
      const fetchedJabatans = await fetchJabatans();
      setJabatans(fetchedJabatans);
    };
    loadJabatans();
  }, []);

  return (
    <div className="flex items-center py-1.5 space-x-1.5">
      <div className="flex flex-1 items-center space-x-2">
        {table.getColumn("jabatan") && (
          <DataTableFacetedFilter
            column={table.getColumn("jabatan")}
            title="Jabatan"
            options={jabatans}
          />
        )}
        {isFiltered && (
          <Button
            className="h-8"
            variant="ghost"
            onClick={() => {
              table.resetColumnFilters();
            }}
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
