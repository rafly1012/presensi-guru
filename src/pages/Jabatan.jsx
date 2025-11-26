import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import api from "@/lib/api";
import { Header } from "./Dashboard/header";
import { Sidebar } from "./Dashboard/sidebar";

import { DataTable } from "./Jabatan/DataTable";
import { columns } from "./Jabatan/columns";
import { InsertJabatan } from "./Jabatan/insertJabatan";
import { EditJabatan } from "./Jabatan/editJabatan";

export default function Jabatan() {
  const [jabatan, setJabatan] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  const fetchJabatan = async () => {
    setLoading(true);
    try {
      const response = await api.get("/jabatan");
      if (response.data.success) {
        setJabatan(response.data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJabatan();
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Sidebar />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <Header />
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="mx-auto grid max-w-full flex-1 auto-rows-max gap-4">
            <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
              <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                <div className="overflow-hidden">
                  <Card>
                    <CardHeader>
                      <CardTitle>Jabatan</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea>
                        <div className="p-0.5 mb-4">
                          <DataTable
                            columns={columns}
                            data={jabatan}
                            loading={loading}
                          />
                        </div>
                        <ScrollBar orientation="horizontal" />
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>
              </div>
              <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                {!id ? (
                  <InsertJabatan
                    fetchJabatan={fetchJabatan}
                    setLoading={setLoading}
                  />
                ) : (
                  <EditJabatan
                    id={id}
                    fetchJabatan={fetchJabatan}
                    setLoading={setLoading}
                  />
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
