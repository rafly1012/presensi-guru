import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { User } from "lucide-react";

import Logo from "./assets/logo.png";
import { Button } from "@/components/ui/button";

import { Root } from "@/components/partials/Root";
import { SearchNIP } from "./components/partials/searchnip";
import QrReader from "./components/partials/cam";
import { TIME_RANGES, DAYS_OF_WEEK } from "@/lib/check";

// Fungsi untuk menghitung jarak (dalam meter) antara dua koordinat (Haversine)
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Radius bumi dalam meter
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // dalam meter
}

// Lokasi yang diizinkan (ganti dengan koordinat sebenarnya)
const ALLOWED_LOCATION = {
  latitude: -10.1766587,   // Ganti dengan latitude sebenarnya
  longitude: 123.6342151,  // Ganti dengan longitude sebenarnya
};
const MAX_RADIUS_METERS = 100; // 100 meter

function App() {
  const [time, setTime] = useState(new Date());
  const [message, setMessage] = useState("");
  const [locationStatus, setLocationStatus] = useState("checking"); // 'checking' | 'allowed' | 'denied'
  const [userLocation, setUserLocation] = useState(null);

  // Cek waktu presensi
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const now = new Date();
    const currentTime = `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;
    const currentDayIndex = now.getDay();
    const currentDay = currentDayIndex === 0 ? "Minggu" : DAYS_OF_WEEK[currentDayIndex - 1]; // Sesuaikan jika DAYS_OF_WEEK mulai dari Senin

    let currentMessage = "Presensi Belum Dibuka.";

    const { jammasuk, jamkeluar } = TIME_RANGES;

    if (currentTime >= jammasuk.start && currentTime <= jammasuk.end) {
      currentMessage = `Waktu masuk.`;
    } else if (currentTime >= jamkeluar.start && currentTime <= jamkeluar.end) {
      currentMessage = `Waktu keluar.`;
    }

    if (!DAYS_OF_WEEK.includes(currentDay)) {
      currentMessage = "Hari ini bukan hari kerja.";
    }

    setMessage(currentMessage);
  }, [time]);

  // Cek lokasi pengguna saat komponen dimuat
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationStatus("denied");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });

        const distance = getDistance(
          latitude,
          longitude,
          ALLOWED_LOCATION.latitude,
          ALLOWED_LOCATION.longitude
        );

        if (distance <= MAX_RADIUS_METERS) {
          setLocationStatus("allowed");
        } else {
          setLocationStatus("denied");
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        setLocationStatus("denied");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }, []);

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
        <div className="container relative">
          {/* Opsional: tampilkan info lokasi */}
          {locationStatus === "checking" && (
            <p className="text-center text-muted-foreground py-4">Memeriksa lokasi Anda...</p>
          )}
          {locationStatus === "denied" && (
            <div className="text-center py-6 text-destructive">
              <p>❌ Anda harus berada di area sekolah untuk melakukan presensi.</p>
              {userLocation && (
                <p className="text-sm mt-1">
                  Lokasi Anda: {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
                </p>
              )}
            </div>
          )}
        </div>
      </main>

      <footer className="py-6 md:px-8 md:py-0">
        {locationStatus === "allowed" ? (
          <>
            <QrReader />
            <SearchNIP />
          </>
        ) : null}
      </footer>
    </Root>
  );
}

export default App;
