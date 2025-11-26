import { useEffect, useState } from "react";

import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import { Header } from "./Dashboard/header";
import { Sidebar } from "./Dashboard/sidebar";
import { ChartsJamMasuk } from "./Kehadiran/ChartsJamMasuk";
import { ChartsJamKeluar } from "./Kehadiran/ChartsJamKeluar";
import { DataTable } from "./Kehadiran/DataTable";
import { columns } from "./Kehadiran/columns";

export default function Dashboard() {
  const [kehadiranGuru, setKehadiranGuru] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchKehadiranGuru = async () => {
    setLoading(true);
    try {
      const [masukResponse, keluarResponse, guruResponse] = await Promise.all([
        api.get("/jammasuk"),
        api.get("/jamkeluar"),
        api.get("/guru"),
      ]);

      if (
        masukResponse.data.success &&
        keluarResponse.data.success &&
        guruResponse.data.success
      ) {
        const masukData = masukResponse.data.data;
        const keluarData = keluarResponse.data.data;
        const guruData = guruResponse.data.data;

        const combinedData = {};

        masukData.forEach((masuk) => {
          const guru = guruData.find((s) => s.id === masuk.idguru);
          if (guru) {
            const dateKey = new Date(masuk.jammasuk).toISOString().split('T')[0];
            const guruKey = `${dateKey}-${guru.id}`;
            if (!combinedData[guruKey]) {
              combinedData[guruKey] = {
                jammasuk: masuk.jammasuk,
                keteranganMasuk: masuk.keterangan,
                jamkeluar: null,
                keteranganKeluar: null,
                nama: guru.nama,
                nip: guru.nip,
                jabatan: guru.jabatan,
              };
            } else {
              combinedData[guruKey].jammasuk = masuk.jammasuk;
              combinedData[guruKey].keteranganMasuk = masuk.keterangan;
            }
          }
        });

        keluarData.forEach((keluar) => {
          const guru = guruData.find((s) => s.id === keluar.idguru);
          if (guru) {
            const dateKey = new Date(keluar.jamkeluar).toISOString().split('T')[0];
            const guruKey = `${dateKey}-${guru.id}`;
            if (!combinedData[guruKey]) {
              combinedData[guruKey] = {
                jammasuk: null,
                keteranganMasuk: null,
                jamkeluar: keluar.jamkeluar,
                keteranganKeluar: keluar.keterangan,
                nama: guru.nama,
                nip: guru.nip,
                jabatan: guru.jabatan,
              };
            } else {
              combinedData[guruKey].jamkeluar = keluar.jamkeluar;
              combinedData[guruKey].keteranganKeluar = keluar.keterangan;
            }
          }
        });
        setKehadiranGuru(Object.values(combinedData));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKehadiranGuru();
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Sidebar />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <Header />
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="mx-auto grid max-w-full flex-1 auto-rows-max gap-4">
            <div className="grid gap-4 md:grid-cols-2 lg:gap-8">
              <ChartsJamMasuk />
              <ChartsJamKeluar />
            </div>
            <div className="overflow-hidden">
              <Card>
                <CardHeader>
                  <CardTitle>Kehadiran Guru</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea>
                    <div className="p-0.5 mb-4">
                      <DataTable
                        columns={columns}
                        data={kehadiranGuru}
                        loading={loading}
                      />
                    </div>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
