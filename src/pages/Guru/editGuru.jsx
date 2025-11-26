import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import api from "@/lib/api";
import { formGuruSchema } from "@/lib/form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import {
  FormTextareaLayout,
  FormInputLayout,
  FormSelectLayout,
} from "@/components/partials/FormLayout";

import { jenikelamins, fetchJabatans } from "./data";

export function EditGuru({ id, setLoading: setParentLoading, fetchGuru }) {
  const [jabatanOptions, setJabatanOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(formGuruSchema),
    defaultValues: {
      nama: "",
      nip: "",
      jabatan: "",
      jeniskelamin: "",
      alamat: "",
      nohp: "",
      idjabatan: "",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jabatans = await fetchJabatans();
        if (jabatans) {
          setJabatanOptions(jabatans);
        }
      } catch (error) {
        console.error("Error fetching jabatans:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchGuruDetail = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/guru/${id}`);
        if (response.data.success) {
          const guruData = response.data.data;
          form.reset(guruData);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchGuruDetail();
    }
  }, [id, form]);

  const onSubmit = async (data) => {
    setLoading(true);
    setParentLoading(true);
    try {
      const response = await api.put(`/guru/${id}`, data);
      if (response.data.success) {
        navigate("/guru");
        fetchGuru();
        toast.success("Berhasil memperbarui data guru", {
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
        <CardTitle>Perbarui Data Guru</CardTitle>
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
              />
              <FormInputLayout
                control={form.control}
                name="nip"
                label="NIP "
                description="Masukkan nip guru"
                type="number"
              />
              <FormInputLayout
                control={form.control}
                name="jabatan"
                label="Jabatan "
                description="Masukkan jabatan guru"
                type="text"
              />
              <FormSelectLayout
                control={form.control}
                name="jeniskelamin"
                label="Jenis Kelamin"
                placeholder="Pilih Jenis Kelamin"
                description="Pilih Jenis Kelamin"
                options={jenikelamins}
              />
              <FormTextareaLayout
                control={form.control}
                name="alamat"
                label="Alamat "
                description="Masukkan alamat guru"
              />
              <FormInputLayout
                control={form.control}
                name="nohp"
                label="Nomor Handphone "
                description="Masukkan nomor hp guru"
                type="number"
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? "Memuat..." : "Simpan data"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
