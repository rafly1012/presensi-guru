import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

import api from "@/lib/api";
import { formJabatanSchema } from "@/lib/form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { FormInputLayout } from "@/components/partials/FormLayout";

import { toast } from "sonner";

export function EditJabatan({
  id,
  setLoading: setParentLoading,
  fetchJabatan,
}) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(formJabatanSchema),
    defaultValues: {
      nama: "",
    },
  });

  useEffect(() => {
    const fetchJabatanDetail = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/jabatan/${id}`);
        if (response.data.success) {
          const jabatanData = response.data.data;
          form.reset(jabatanData);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchJabatanDetail();
  }, [id, form]);

  const onSubmit = async (data) => {
    setLoading(true);
    setParentLoading(true);
    try {
      const response = await api.put(`/jabatan/${id}`, data);
      if (response.data.success) {
        navigate("/jabatan");
        fetchJabatan();
        toast.success("Berhasil memperbarui data jabatan", {
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
        <CardTitle>Perbarui Data Jabatan</CardTitle>
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
