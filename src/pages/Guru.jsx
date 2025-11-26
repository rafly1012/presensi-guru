import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import api from "@/lib/api";
import { Header } from "./Dashboard/header";
import { Sidebar } from "./Dashboard/sidebar";

import { DataTable } from "./Guru/DataTable";
import { columns } from "./Guru/columns";
import { InsertGuru } from "./Guru/insertGuru";
import { EditGuru } from "./Guru/editGuru";
import { EditFotoGuru } from "./Guru/editFotoGuru";

export default function Guru() {
  const [guru, setGuru] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  const fetchGuru = async () => {
    setLoading(true);
    try {
      const response = await api.get("/guru");
      if (response.data.success) {
        setGuru(response.data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuru();
  }, [id]);

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
                      <CardTitle>Guru</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea>
                        <div className="p-0.5 mb-4">
                          <DataTable
                            columns={columns}
                            data={guru}
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
                  <InsertGuru
                    fetchGuru={fetchGuru}
                    setLoading={setLoading}
                  />
                ) : (
                  <>
                    <EditGuru
                      id={id}
                      fetchGuru={fetchGuru}
                      setLoading={setLoading}
                    />
                    <EditFotoGuru
                      id={id}
                      fetchGuru={fetchGuru}
                      setLoading={setLoading}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
