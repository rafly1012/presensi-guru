import { useState, useEffect } from "react";
import { LoaderCircle, Upload } from "lucide-react";
import { toast } from "sonner";

import placeholder from "../../assets/placeholder.svg";
import api from "@/lib/api";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function EditFotoGuru({
  id,
  setLoading: setParentLoading,
  fetchGuru,
}) {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [fotoUrl, setFotoUrl] = useState("");
  const [foto, setFoto] = useState("");

  useEffect(() => {
    const fetchFileDetails = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/guru/${id}`);
        if (response.data.success) {
          const file = response.data.data.foto;
          setFileName(file);
          setFotoUrl(file ? `http://localhost:3000/uploads/${file}` : "");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchFileDetails();
  }, [id]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      fetchGuru();

      const reader = new FileReader();
      reader.onloadend = () => {
        setFoto(reader.result);
      };

      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setParentLoading(true);
    try {
      const formData = new FormData();
      formData.append("foto", file);

      const response = await api.patch(`/guru/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        const newFile = response.data.data.file;
        setFotoUrl(newFile ? `http://localhost:3000/uploads/${newFile}` : "");
        setFileName(newFile || "");
        window.location.reload();
        fetchSiswa();
        toast.success("Foto berhasil diperbarui", {
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
        <CardTitle>Foto Guru</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          {fotoUrl ? (
            <img
              src={fotoUrl}
              title="Foto Guru"
              alt="Foto Guru"
              className="aspect-square w-full rounded-md object-cover border border-dashed"
            />
          ) : (
            <img
              src={placeholder}
              title="Foto Guru"
              alt="Foto Guru"
              className="aspect-square w-full rounded-md object-cover"
            />
          )}
          <form onSubmit={handleSubmit}>
            <p className="font-semibold text-xs text-primary">Preview</p>
            <div className="grid grid-cols-3 gap-2">
              <label htmlFor="foto">
                <img
                  className="aspect-square w-full rounded-md object-cover border border-dashed hover:cursor-pointer"
                  height="20"
                  src={foto || fotoUrl || placeholder}
                  width="20"
                />
                {fileName && (
                  <p className="font-semibold text-xs text-muted-foreground">
                    Nama file: {fileName}
                  </p>
                )}
                <input
                  id="foto"
                  name="foto"
                  type="file"
                  accept=".png, .jpg, .jpeg"
                  onChange={handleFileChange}
                  className="hidden"
                  required
                />
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full h-8 mt-0.5"
                >
                  {loading ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  <span className="sr-only">
                    {loading ? "Memuat..." : "Upload"}
                  </span>
                </Button>
              </label>
            </div>
            <p className="font-semibold text-xs text-primary">
              File foto harus berupa .png
            </p>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
