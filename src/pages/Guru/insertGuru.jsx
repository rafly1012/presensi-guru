import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import api from "@/lib/api";
import { formGuruSchema } from "@/lib/form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import {
  FormInputLayout,
  FormSelectLayout,
  FormTextareaLayout,
} from "@/components/partials/FormLayout";

import { jenikelamins, fetchJabatans } from "./data";

export function InsertGuru({ setLoading: setParentLoading, fetchGuru }) {
  const [jabatanOptions, setJabatanOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formGuruSchema),
    defaultValues: {
      nama: "",
      nip: "",
      jabatan: "",
      jeniskelamin: "",
      alamat: "",
      nohp: "",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      const jabatans = await fetchJabatans();
      setJabatanOptions(jabatans);
    };

    fetchData();
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    setParentLoading(true);
    try {
      const response = await api.post("/guru", data);
      if (response.data.success) {
        form.reset();
        fetchGuru();
        toast.success("Berhasil menambahkan Guru", {
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
        <CardTitle>Tambahkan Guru</CardTitle>
      </CardHeader>
      <CardContent className="text-sm">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-0.5 mb-2">
              <FormInputLayout
                control={form.control}
                name="nama"
                label="Nama "
                description="Masukkan nama guru"
                type="text"
                disabled={loading}
              />
              <FormInputLayout
                control={form.control}
                name="nip"
                label="NIP "
                description="Masukkan nip guru"
                type="number"
                disabled={loading}
              />
               <FormInputLayout
                  control={form.control}
                  name="jabatan"
                  label="Jabatan "
                  description="Masukkan jabatan guru"
                  type="text"
                  disabled={loading}
              />
              <FormSelectLayout
                control={form.control}
                name="jeniskelamin"
                label="Jenis Kelamin"
                placeholder="Pilih Jenis Kelamin"
                description="Pilih Jenis Kelamin"
                options={jenikelamins}
                disabled={loading}
              />
              <FormTextareaLayout
                control={form.control}
                name="alamat"
                label="Alamat "
                description="Masukkan alamat guru"
                disabled={loading}
              />
              <FormInputLayout
                control={form.control}
                name="nohp"
                label="Nomor Handphone "
                description="Masukkan nomor hp guru"
                type="number"
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
