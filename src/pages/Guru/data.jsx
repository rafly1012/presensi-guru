import api from "@/lib/api";

export const jenikelamins = [
  { value: "l", label: "Laki-laki" },
  { value: "p", label: "Perempuan" },
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
