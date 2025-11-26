import { useState, useEffect } from "react";
import { User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Logout() {
  const [nama, setNama] = useState("");

  useEffect(() => {
    try {
      const adminData = JSON.parse(localStorage.getItem("adminData"));
      if (adminData) {
        // sesuaikan properti nama
        setNama(adminData.nama || adminData.username || "Admin");
      }
    } catch (error) {
      console.error("Failed to parse adminData:", error);
    }
  }, []);

  const handleLogout = () => {
    // hapus token & data lokal
    localStorage.removeItem("adminData");
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="overflow-hidden rounded-full"
        >
          <User className="w-6 h-6" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{nama}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
