import { useState, useEffect } from "react";

import api from "@/lib/api";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export function DeleteJabatan({ id }) {
  const [loading, setLoading] = useState(false);
  const [nama, setNama] = useState("");

  useEffect(() => {
    const fetchJabatanDetail = async () => {
      try {
        const response = await api.get(`/jabatan/${id}`);
        if (response.data.success) {
          setNama(response.data.data.nama || "");
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchJabatanDetail();
  }, [id]);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await api.delete(`/jabatan/${id}`);
      if (response.data.success) {
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          className="w-full text-destructive hover:text-destructive"
        >
          Hapus Jabatan
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <span className="text-muted-foreground font-normal">
              Anda Ingin menghapus jabatan{" "}
            </span>
            {nama}
            <span className="text-muted-foreground font-normal">?</span>
          </AlertDialogTitle>
          <AlertDialogDescription>
            Tindakan ini tidak bisa dibatalkan. Ini akan menghapus jabatan itu
            secara permanen dan menghapus data dari server kami.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <Button onClick={handleDelete} disabled={loading}>
            {loading ? "Menghapus..." : "Hapus"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
