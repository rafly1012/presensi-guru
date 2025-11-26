import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import api from "@/lib/api";
import { formJabatanSchema } from "@/lib/form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { FormInputLayout } from "@/components/partials/FormLayout";

export function InsertJabatan({ setLoading: setParentLoading, fetchJabatan }) {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formJabatanSchema),
    defaultValues: {
      nama: "",
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setParentLoading(true);
    try {
      const response = await api.post("/jabatan", data);
      if (response.data.success) {
        form.reset();
        fetchJabatan();
        toast.success("Berhasil menambahkan Jabatan", {
          description: new Intl.DateTimeFormat("id-ID", {
            dateStyle: "full",
          }).format(),
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setParentLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tambahkan Jabatan</CardTitle>
      </CardHeader>
      <CardContent className="text-sm">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-0.5 mb-2">
              <FormInputLayout
                control={form.control}
                name="nama"
                label="Nama Jabatan"
                type="text"
                disabled={loading}
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? "Memuat . . ." : "Simpan data"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
