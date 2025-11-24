import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { QRCode } from "@/lib/types/qr-code";
import Image from "next/image";
import { XIcon } from "lucide-react";

interface ViewQRModalProps {
  qrCode: QRCode | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ViewQRModal({ qrCode, isOpen, onClose }: ViewQRModalProps) {
  if (!qrCode) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-card">
        <DialogHeader className="pb-10">
          <div>
            <DialogTitle className="font-heading text-[32px]">
              QR Details
            </DialogTitle>
            <span className="text-muted-foreground">
              View your generated QR code details.
            </span>
          </div>
          <DialogClose className="absolute cursor-pointer rounded-sm top-10 right-10 font-heading px-6 py-3 text-base text-(--base-color) border w-[95px] h-[48px] border-(--base-color) hover:bg-(--base-color) hover:text-white">
            Close
          </DialogClose>
        </DialogHeader>

        <div className="space-y-6">
          {/* <div>
            <p className="text-sm font-medium text-muted-foreground">Link Status</p>
            <p className={`text-sm mt-1 ${qrCode.linkStatus === 'active' ? 'text-green-600' : 'text-red-600'}`}>
              {qrCode.linkStatus === 'active' ? 'Link is active and accessible' : 'Link is inactive'}
            </p>
          </div> */}

          <div className="space-y-2">
            <p className="text-base font-medium">Game Name</p>
            <p className="text-sm text-muted-foreground mt-1 ">
              {qrCode.gameName}
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-base font-medium">Game Link</p>
            <a
              href={qrCode.link}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline text-sm mt-1 text-primary"
            >
              {qrCode.link}
            </a>
          </div>

          <div className="space-y-2">
            <p className="text-base font-medium">QR Code</p>
            {qrCode.qrCode && (
              <div className="flex justify-center">
                <Image
                  height={800}
                  width={800}
                  src={qrCode.qrCode || "/placeholder.svg"}
                  alt="QR Code"
                  className="h-[332px] w-[332px] object-contain p-2"
                />
              </div>
            )}
          </div>

          <Button onClick={onClose} className="w-full">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
