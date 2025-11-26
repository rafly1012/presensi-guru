import { NavLink } from "react-router-dom";
import { ChartBarStacked, Home, Users2 } from "lucide-react";
import Logo from "../../assets/logo.png";

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 py-4">
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
              ? "flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              : "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
          }
        >
          <Home className="h-5 w-5" />
          <span className="sr-only">Dashboard</span>
        </NavLink>
        <NavLink
          to="/guru"
          className={({ isActive }) =>
            isActive
              ? "flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              : "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
          }
        >
          <Users2 className="h-5 w-5" />
          <span className="sr-only">Guru</span>
        </NavLink>
        <NavLink
          to="/jabatan"
          className={({ isActive }) =>
            isActive
              ? "flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              : "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
          }
        >
          <ChartBarStacked className="h-5 w-5" />
          <span className="sr-only">Jabatan</span>
        </NavLink>
      </nav>
    </aside>
  );
}
