import { useState, useEffect, useRef } from "react";
import { QRCode } from "react-qrcode-logo";
import { toPng } from "html-to-image";

import Logo from "../../assets/logo.png";

import { useMediaQuery } from "@/lib/use-media-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import api from "@/lib/api";

export function CardGuru({ row }) {
  const [open, setOpen] = useState(false);
  const [namajabatan, setNamaJabatan] = useState("");
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const cardRef = useRef();

  useEffect(() => {
    const fetchJabatan = async () => {
      try {
        const response = await api.get(`/jabatan/${row.original.idjabatan}`);
        if (response.data.success) {
          setNamaJabatan(response.data.data.nama);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchJabatan();
  }, [row.original.idjabatan]);

  const qrCodeValue = `${row.original.nip}`;
  const downloadImage = async () => {
    if (cardRef.current) {
      const dataUrl = await toPng(cardRef.current, {
        canvasWidth: 576,
        canvasHeight: 204,
      });
      const link = document.createElement("a");
      link.download = `${row.original.nama}-IDCard.png`;
      link.href = dataUrl;
      link.click();
    }
  };

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Card</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Card</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when youre done.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center">
            <div
              ref={cardRef}
              className="p-4 w-[576px] h-[204px] bg-background shadow-md rounded-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-md font-semibold">Kartu Guru</p>
                  <p className="text-lg text-primary font-semibold">
                    SMK Negeri 7 Kota Kupang
                  </p>
                </div>
                <img
                  src={Logo}
                  alt=""
                  className="object-cover"
                  width={36}
                  height={36}
                />
              </div>
              <div className="flex items-center justify-between space-x-2 mt-2">
                <QRCode
                  value={qrCodeValue}
                  size={108}
                  bgColor={"#ffffff"}
                  fgColor={"#000000"}
                  level={"L"}
                  includeMargin={false}
                  logoImage={Logo}
                  logoWidth={24}
                  logoHeight={24}
                  logoOpacity={1}
                />
                <dl className="mt-2 text-left flex flex-wrap">
                  <div className="w-full flex">
                    <dt className="w-14 text-xs font-semibold">Nama</dt>
                    <dt className="w-2 text-xs font-semibold">:</dt>
                    <dd className="text-xs font-bold">{row.original.nama}</dd>
                  </div>
                  <div className="w-full flex">
                    <dt className="w-14 text-xs font-semibold">NIP</dt>
                    <dt className="w-2 text-xs font-semibold">:</dt>
                    <dd className="text-xs font-bold">{row.original.nip}</dd>
                  </div>
                  <div className="w-full flex">
                    <dt className="w-16 text-xs font-semibold">Jabatan</dt>
                    <dt className="w-2 text-xs font-semibold">:</dt>
                    <dd className="text-xs font-bold">{namajabatan}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
          <DialogFooter>
          <Button onClick={downloadImage}>Download</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">Card</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Card</DrawerTitle>
          <DrawerDescription>
            Make changes to your profile here. Click save when youre done.
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4">
          <div className="flex flex-col items-center justify-center">
            <div
              ref={cardRef}
              className="p-4 w-[576px] h-[204px] bg-background shadow-md rounded-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-md font-semibold">Kartu Guru</p>
                  <p className="text-lg text-primary font-semibold">
                    SMK Negeri 7 Kota Kupang
                  </p>
                </div>
                <img
                  src={Logo}
                  alt=""
                  className="object-cover"
                  width={36}
                  height={36}
                />
              </div>
              <div className="flex items-center justify-between space-x-2 mt-2">
                <QRCode
                  value={qrCodeValue}
                  size={108}
                  bgColor={"#ffffff"}
                  fgColor={"#000000"}
                  level={"L"}
                  includeMargin={false}
                  logoImage={Logo}
                  logoWidth={24}
                  logoHeight={24}
                  logoOpacity={1}
                />
                <dl className="mt-2 text-left flex flex-wrap">
                  <div className="w-full flex">
                    <dt className="w-14 text-xs font-semibold">Nama</dt>
                    <dt className="w-2 text-xs font-semibold">:</dt>
                    <dd className="text-xs font-bold">{row.original.nama}</dd>
                  </div>
                  <div className="w-full flex">
                    <dt className="w-14 text-xs font-semibold">NIP</dt>
                    <dt className="w-2 text-xs font-semibold">:</dt>
                    <dd className="text-xs font-bold">{row.original.nip}</dd>
                  </div>
                  <div className="w-full flex">
                    <dt className="w-16 text-xs font-semibold">Jabatan</dt>
                    <dt className="w-2 text-xs font-semibold">:</dt>
                    <dd className="text-xs font-bold">{namajabatan}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <DrawerFooter className="pt-2">
          <Button onClick={downloadImage}>Download</Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
