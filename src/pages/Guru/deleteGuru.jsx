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

export function DeleteGuru({ id }) {
  const [loading, setLoading] = useState(false);
  const [namaGuru, setNamaGuru] = useState("");

  useEffect(() => {
    const fetchGuruDetail = async () => {
      try {
        const response = await api.get(`/guru/${id}`);
        if (response.data.success) {
          setNamaGuru(response.data.data.nama);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchGuruDetail();
  }, [id]);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await api.delete(`/guru/${id}`);
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
        <Button variant="ghost" className="w-full text-destructive">
          Hapus Data Guru
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <span className="text-muted-foreground font-normal">
              Anda Ingin Menghapus Guru{" "}
            </span>
            {namaGuru}
            <span className="text-muted-foreground font-normal">?</span>
          </AlertDialogTitle>
          <AlertDialogDescription>
            Tindakan ini tidak bisa dibatalkan. Ini akan menghapus guru itu
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
