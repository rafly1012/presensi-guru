import { NavLink } from "react-router-dom";
import { ChartBarStacked, Home, PanelLeft, Users2 } from "lucide-react";
import Logo from "../../assets/logo.png";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Logout } from "../auth/logout";

export function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs">
          <nav className="grid gap-6 text-lg font-medium">
            <NavLink
              to="#"
              className="group flex h-10 w-10 shrink-0 items-center justify-center"
            >
              <img
                src={Logo}
                alt="Logo SMK Negeri 7 Kupang"
                className="h-9 w-9 transition-all group-hover:scale-110"
              />
              <span className="sr-only">Logo SMK Negeri 7 Kupang</span>
            </NavLink>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center gap-4 px-2.5 text-foreground"
                  : "flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
              }
            >
              <Home className="h-5 w-5" />
              Dashboard
            </NavLink>
            <NavLink
              to="/guru"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center gap-4 px-2.5 text-foreground"
                  : "flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
              }
            >
              <Users2 className="h-5 w-5" />
              Guru
            </NavLink>
            <NavLink
              to="/jabatan"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center gap-4 px-2.5 text-foreground"
                  : "flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
              }
            >
              <ChartBarStacked className="h-5 w-5" />
              Jabatan
            </NavLink>
          </nav>
        </SheetContent>
      </Sheet>
      <div className="relative ml-auto flex-1 md:grow-0" />
      <Logout />
    </header>
  );
}
