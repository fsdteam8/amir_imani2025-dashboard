import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Download, Edit2, Trash2 } from "lucide-react";
import type { QRCode, SortField, SortOrder } from "@/lib/types/qr-code";
import Link from "next/link";

interface QRCodeTableProps {
  qrCodes: QRCode[];
  isLoading: boolean;
  sortBy: SortField;
  sortOrder: SortOrder;
  onSort: (field: SortField) => void;
  onView: (id: string) => void;
  onEdit: (_id: string) => void;
  onDelete: (id: string) => void;
  onDownload: (id: string) => void;
}

export function QRCodeTable({
  qrCodes,
  isLoading,
  sortBy,
  sortOrder,
  onSort,
  onView,
  onEdit,
  onDelete,
  onDownload,
}: QRCodeTableProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading QR codes...</p>
      </div>
    );
  }

  console.log(qrCodes);

  if (qrCodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">No QR codes found</p>
      </div>
    );
  }

  const SortableHeader = ({
    field,
    label,
  }: {
    field: SortField;
    label: string;
  }) => (
    <TableHead
      className="cursor-pointer hover:bg-muted/50"
      onClick={() => onSort(field)}
    >
      <div className="flex items-center gap-2">
        {label}
        {sortBy === field && (sortOrder === "asc" ? "↑" : "↓")}
      </div>
    </TableHead>
  );

  return (
    <Table>
      <TableHeader
        className={`text-[#6366F1] text-center bg-[#E1E2FC66] font-heading`}
      >
        <TableRow>
          <SortableHeader field="gameName" label="Game Name" />
          <TableHead className="pl-2">Link</TableHead>
          <TableHead className="pl-6">QR Code</TableHead>
          {/* <SortableHeader field="status" label="Status" /> */}
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {qrCodes.map((qr, idx) => (
          <TableRow
            key={qr._id}
            className={` ${idx % 2 !== 0 ? "bg-[#E1E2FC66]" : ""}`}
          >
            <TableCell className="font-medium">{qr.gameName}</TableCell>
            <TableCell>
              <Link
                href={qr.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#6366F1] cursor-pointer hover:underline text-sm truncate max-w-xs "
              >
                {qr.link}
              </Link>
            </TableCell>
            <TableCell>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onView(qr._id)}
                className="text-[#6366F1] cursor-pointer"
              >
                <Eye className="h-4 w-4" />
                View QR
              </Button>
            </TableCell>
            {/* <TableCell>
              <Badge variant={qr.status === 'Active' ? 'default' : 'secondary'} className='bg-[#E6FAEE] text-[#1F9854]'>
                {"Active"}
              </Badge>
            </TableCell> */}
            <TableCell>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDownload(qr._id)}
                  title="Download"
                >
                  <Download className="h-4 w-4 text-[#6366F1]" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(qr._id)}
                  className="text-[#6366F1]"
                  title="Edit"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(qr._id)}
                  className="text-destructive"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
