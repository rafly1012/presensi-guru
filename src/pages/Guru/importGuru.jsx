import React, { useState } from 'react';
import * as XLSX from 'xlsx';

import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import api from '@/lib/api';

export function ImportGuru() {
    const [loading, setLoading] = useState(false);

    const handleFileUpload = async (e) => {
        setLoading(true);
        try {
            const file = e.target.files[0];

            const reader = new FileReader();
            reader.onload = async (event) => {
                try {
                    const data = new Uint8Array(event.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });

                    // Mengambil data dari sheet pertama
                    const sheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetName];

                    // Mengonversi data sheet menjadi JSON
                    const jsonData = XLSX.utils.sheet_to_json(worksheet);

                    // Mengirim data ke server menggunakan axios
                    const response = await api.post('/guru/import', jsonData);
                    if (response.data.success) {
                        toast.success("Berhasil menambahkan Guru", {
                            description: new Intl.DateTimeFormat("id-ID", {
                                dateStyle: "full",
                            }).format(),
                        });
                    }
                } catch (error) {
                    console.error(error);
                    toast.error("Terjadi kesalahan saat mengirim data");
                } finally {
                    setLoading(false);
                }
            };

            reader.readAsArrayBuffer(file);
        } catch (error) {
            console.error(error);
            toast.error("Terjadi kesalahan saat memproses file");
            setLoading(false);
        }
    };

    return (
        <div>
            <Input
                type="file"
                onChange={handleFileUpload}
                accept=".xls,.xlsx"
                className="h-8"
                disabled={loading}
            />
        </div>
    );
}
