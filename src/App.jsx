import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { User } from "lucide-react";

import Logo from "./assets/logo.png";
import { Button } from "@/components/ui/button";

import { Root } from "@/components/partials/Root";
import { SearchNIP } from "./components/partials/searchnip";
import QrReader from "./components/partials/cam";
import { TIME_RANGES, DAYS_OF_WEEK } from "@/lib/check";

function App() {
  const [time, setTime] = useState(new Date());
  const [message, setMessage] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const now = new Date();
    const currentTime = `${now.getHours()}:${now.getMinutes()}`;
    const currentDay = DAYS_OF_WEEK[now.getDay() - 1];

    let currentMessage = "Presensi Belum Dibuka.";

    const { jammasuk, jamkeluar } = TIME_RANGES;

    if (currentTime >= jammasuk.start && currentTime <= jammasuk.end) {
      currentMessage = `Waktu masuk.`;
    } else if (
      currentTime >= jamkeluar.start &&
      currentTime <= jamkeluar.end
    ) {
      currentMessage = `Waktu keluar.`;
    }

    if (!DAYS_OF_WEEK.includes(currentDay)) {
      currentMessage = "Hari ini bukan hari kerja.";
    }

    setMessage(currentMessage);
  }, [time]);


  return (
    <Root>
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <svg
          aria-hidden="true"
          className="absolute left-[max(50%,25rem)] top-0 h-[64rem] w-[128rem] -translate-x-1/2 stroke-border [mask-image:radial-gradient(64rem_64rem_at_top,white,transparent)]"
        >
          <defs>
            <pattern
              x="50%"
              y={-1}
              id="e813992c-7d03-4cc4-a2bd-151760b470a0"
              width={200}
              height={200}
              patternUnits="userSpaceOnUse"
            >
              <path d="M100 200V.5M.5 .5H200" fill="none" />
            </pattern>
          </defs>
          <svg x="50%" y={-1} className="overflow-visible fill-accent">
            <path
              d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M-300.5 600h201v201h-201Z"
              strokeWidth={0}
            />
          </svg>
          <rect
            fill="url(#e813992c-7d03-4cc4-a2bd-151760b470a0)"
            width="100%"
            height="100%"
            strokeWidth={0}
          />
        </svg>
      </div>
      <header className="sticky top-0 z-50 w-full border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center">
          <div className="mr-4 flex">
            <Link to="/" className="mr-4 flex items-center space-x-2 lg:mr-6">
              <img
                src={Logo}
                alt="Logo SMK Negeri 7 Kota Kupang"
                className="h-6 w-6"
              />
              <span className="hidden font-bold lg:inline-block">
                SMK Negeri 7 Kota Kupang
              </span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="w-full flex-1 md:w-auto md:flex-none"></div>
            <nav className="flex items-center space-x-2">
              <Button variant="outline">
                <marquee>{message}</marquee>
              </Button>
              <Button variant="outline">
                {time.toLocaleDateString()} {time.toLocaleTimeString()}
              </Button>
              <Button asChild variant="outline" size="icon">
                <Link to="/login">
                  <User className="w-5 h-5" />
                  <span className="sr-only">Login</span>
                </Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container relative"></div>
      </main>
      <footer className="py-6 md:px-8 md:py-0">
        <QrReader />
        <SearchNIP />
      </footer>
    </Root>
  );
}

export default App;
