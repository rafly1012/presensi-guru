import { z } from "zod";

const formLoginSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: "Username harus memiliki dua karakter lebih",
    })
    .regex(/^\S*$/, {
      message: "Username tidak boleh mengandung spasi",
    })
    .max(50),
  password: z
    .string()
    .min(4, { message: "Password harus memiliki empat karakter" }),
});

const formGuruSchema = z.object({
  nama: z.string().min(1, { message: "Nama tidak boleh kosong" }),
  nip: z.string().min(1, { message: "NIP tidak boleh kosong" }),
  jabatan: z.string().min(1, { message: "Jabatan tidak boleh kosong" }),
  jeniskelamin: z
    .string()
    .min(1, { message: "Jenis Kelamin tidak boleh kosong" }),
  alamat: z.string().min(1, { message: "Alamat tidak boleh kosong" }),
  nohp: z.string().min(1, { message: "Nomor HP tidak boleh kosong" }),
});

const formSuratFileSchema = z.object({
  file: z.any().optional(),
});

const formJabatanSchema = z.object({
  nama: z.string().min(1, { message: "Nama tidak boleh kosong" }),
});

export {
  formLoginSchema,
  formGuruSchema,
  formSuratFileSchema,
  formJabatanSchema,
};
