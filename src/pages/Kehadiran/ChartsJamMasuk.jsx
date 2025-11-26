import { useState, useEffect } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import api from "@/lib/api";

const chartConfig = {
  presensi: {
    label: "Presensi",
    color: "hsl(var(--chart-1))",
  },
};

export function ChartsJamMasuk() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/jammasuk");
        const data = response.data.data;
        const today = new Date().toLocaleDateString("id-ID");
        const defaultData = {
          Hadir: { keterangan: "Hadir", jumlah: 0 },
          Sakit: { keterangan: "Sakit", jumlah: 0 },
          Ijin: { keterangan: "Ijin", jumlah: 0 },
        };

        data.forEach((entry) => {
          const entryDate = new Date(entry.jammasuk).toLocaleDateString(
            "id-ID"
          );
          if (entryDate === today) {
            let keterangan;
            switch (entry.keterangan) {
              case "h":
                keterangan = "Hadir";
                break;
              case "s":
                keterangan = "Sakit";
                break;
              case "i":
                keterangan = "Ijin";
                break;
              default:
                keterangan = entry.keterangan;
            }

            if (defaultData[keterangan]) {
              defaultData[keterangan].jumlah += 1;
            }
          }
        });

        const chartDataArray = Object.values(defaultData);
        setChartData(chartDataArray);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Presensi Jam Masuk</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea>
          <ChartContainer
            config={chartConfig}
            className="min-h-[200px] w-full mb-2"
          >
            <BarChart data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="keterangan"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dashed" />}
              />
              <Bar
                dataKey="jumlah"
                fill={chartConfig.presensi.color}
                radius={4}
              />
            </BarChart>
          </ChartContainer>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
