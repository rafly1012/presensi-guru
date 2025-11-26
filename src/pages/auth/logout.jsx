import { useState, useEffect } from "react";
import { User } from "lucide-react";

import api from "@/lib/api";
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
  const [nama, setNama] = useState(null);

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const adminData = JSON.parse(localStorage.getItem("adminData"));
        setNama(adminData.nama);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchAdminProfile();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await api.post("/auth/admin/logout");
      if (response.status === 200) {
        localStorage.removeItem("adminData");
        window.location.href = "/login";
      }
    } catch (error) {
      console.error(error);
    }
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
