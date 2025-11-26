import api from "@/lib/api";

export const keterangans = [
  { value: "h", label: "Hadir" },
  { value: "s", label: "Sakit" },
  { value: "i", label: "Ijin" },
  { value: "", label: "Tanpa Keterangan" },
];

export const fetchJabatans = async () => {
  try {
    const response = await api.get("/jabatan");
    if (response.data.success) {
      const jabatans = response.data.data.map((jabatan) => ({
        value: jabatan.id,
        label: jabatan.nama,
      }));
      return jabatans;
    }
  } catch (error) {
    console.error(error);
  }
};

export const kelass = [
  { value: "10", label: "10" },
  { value: "11", label: "11" },
  { value: "12", label: "12" },
];