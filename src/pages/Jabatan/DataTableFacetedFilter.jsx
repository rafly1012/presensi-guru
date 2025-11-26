import { CheckIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export function DataTableFacetedFilter({ column, title, options }) {
  const facets = column?.getFacetedUniqueValues();
  const selectedValues = new Set(column?.getFilterValue() || []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          {title}
          {selectedValues?.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedValues.size} dipilih
              </Badge>
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <ScrollArea className="h-64">
          <DropdownMenuLabel>{title}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup className="space-y-1">
            {options.map((option) => {
              const isSelected = selectedValues.has(option.value);
              return (
                <DropdownMenuItem
                  key={option.value}
                  onSelect={() => {
                    if (isSelected) {
                      selectedValues.delete(option.value);
                    } else {
                      selectedValues.add(option.value);
                    }
                    const filterValues = Array.from(selectedValues);
                    column?.setFilterValue(
                      filterValues.length ? filterValues : undefined
                    );
                  }}
                  className={cn(
                    "flex items-center",
                    isSelected ? "bg-secondary text-primary" : ""
                  )}
                >
                  <div
                    className={cn(
                      "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "opacity-50"
                    )}
                  >
                    <CheckIcon className={cn("h-4 w-4")} />
                  </div>
                  <span>{option.label}</span>
                  {facets?.get(option.value) && (
                    <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                      {facets.get(option.value)}
                    </span>
                  )}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuGroup>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
