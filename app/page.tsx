"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Sidebar } from "@/components/qr-code/sidebar";
import { QRCodeTable } from "@/components/qr-code/qr-code-table";
import { QRCodeGrid } from "@/components/qr-code/qr-code-grid";
import { SearchBar } from "@/components/qr-code/search-bar";
import { StatusFilter } from "@/components/qr-code/status-filter";
import { QRCodeForm } from "@/components/qr-code/qr-code-form";
import { ViewQRModal } from "@/components/qr-code/view-qr-modal";
import { DeleteConfirmModal } from "@/components/qr-code/delete-confirm-modal";
import { SuccessModal } from "@/components/qr-code/success-modal";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { CloudCog, Layout, LayoutGrid } from "lucide-react";
import { useQRCodes } from "@/lib/hooks/use-qr-codes";
import { useCreateQRCode } from "@/lib/hooks/use-create-qr-code";
import { useUpdateQRCode } from "@/lib/hooks/use-update-qr-code";
import { useDeleteQRCode } from "@/lib/hooks/use-delete-qr-code";
import { useQRCodeState } from "@/lib/hooks/use-qr-code-state";
import type {
  QRCode,
  CreateQRCodeInput,
  UpdateQRCodeInput,
} from "@/lib/types/qr-code";
import Image from "next/image";
import { signOut } from "next-auth/react";

export default function Page() {
  const state = useQRCodeState();
  const { qrCodes, pagination, isLoading } = useQRCodes({
    page: state.page,
    pageSize: state.pageSize,
    search: state.search,
    status: state.status,
    sortBy: state.sortBy,
    sortOrder: state.sortOrder,
  });

  console.log(qrCodes);

  const { create, isLoading: isCreating } = useCreateQRCode();
  const { update, isLoading: isUpdating } = useUpdateQRCode();
  const { delete: deleteQR, isLoading: isDeleting } = useDeleteQRCode();

  const [viewedQRCode, setViewedQRCode] = useState<QRCode | null>(null);
  const [editingQRCode, setEditingQRCode] = useState<QRCode | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // Handle create form submission
  const handleCreateSubmit = async (data: CreateQRCodeInput) => {
    const result = await create(data);
    if (result) {
      setIsCreateModalOpen(false);
      setIsSuccessModalOpen(true);
    }
  };

  // Handle update form submission
  const handleUpdateSubmit = async (data: UpdateQRCodeInput) => {
    if (!editingQRCode) return;
    const result = await update(editingQRCode._id, data);
    if (result) {
      setEditingQRCode(null);
      setIsCreateModalOpen(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!state.selectedQRId) return;
    const success = await deleteQR(state.selectedQRId);
    if (success) {
      state.setIsDeleteModalOpen(false);
      state.setSelectedQRId(null);
    }
  };

  // Handle view QR
  const handleView = (_id: string) => {
    const qr = qrCodes.find((q) => q._id === _id);
    if (qr) {
      setViewedQRCode(qr);
      setIsViewModalOpen(true);
    }
  };

  // Handle edit QR
  const handleEdit = (id: string) => {
    const qr = qrCodes.find((q) => q._id === id);
    if (qr) {
      setEditingQRCode(qr);
      setIsCreateModalOpen(true);
    }
  };

  // Handle delete trigger
  const handleDeleteTrigger = (id: string) => {
    state.setSelectedQRId(id);
    state.setIsDeleteModalOpen(true);
  };

  // Handle download QR code
  const handleDownload = (id: string) => {
    const qr = qrCodes.find((q) => q._id === id);
    if (qr?.qrCode) {
      const link = document.createElement("a");
      link.href = qr.qrCode;
      link.download = `${qr.gameName}-qr-code.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Handle modal close
  const handleCreateModalClose = () => {
    setIsCreateModalOpen(false);
    setEditingQRCode(null);
  };

  // Handle view modal close
  const handleViewModalClose = () => {
    setIsViewModalOpen(false);
    setViewedQRCode(null);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar
        onLogout={() => {
          localStorage.removeItem("authToken");
          signOut({ callbackUrl: "/login" });
        }}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-hidden flex flex-col">
        {/* Header */}
        <header className="border-b bg-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-linear-to-r from-indigo-600 to-purple-500 bg-clip-text text-transparent font-heading">
                QR Code Dashboard
              </h1>
              <p className="text-muted-foreground ">
                Manage your game QR codes and links
              </p>
            </div>
            <Button
              onClick={() => {
                setEditingQRCode(null);
                setIsCreateModalOpen(true);
              }}
              className="gradient-primary text-white hover:shadow-lg hover:shadow-purple-400/30 transition-shadow font-heading"
            >
              Add New QR
            </Button>
          </div>

          {/* Filters and Search */}
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <SearchBar value={state.search} onChange={state.setSearch} />
            </div>
            {/* <StatusFilter value={state.status} onChange={(value) => {
              state.setStatus(value)
              state.resetPagination()
            }} /> */}

            {/* View Toggle */}
            <div className="flex gap-2 bg-muted p-1 rounded-lg">
              <Button
                variant={state.viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => state.setViewMode("list")}
                className={
                  state.viewMode === "list"
                    ? "bg-gradient-to-r from-indigo-600 to-purple-500 text-white"
                    : ""
                }
              >
                <Layout className="h-4 w-4" />
              </Button>
              <Button
                variant={state.viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => state.setViewMode("grid")}
                className={
                  state.viewMode === "grid"
                    ? "bg-linear-to-r from-indigo-600 to-purple-500 text-white"
                    : ""
                }
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {state.viewMode === "list" ? (
            <QRCodeTable
              qrCodes={qrCodes}
              isLoading={isLoading}
              sortBy={state.sortBy}
              sortOrder={state.sortOrder}
              onSort={state.toggleSort}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDeleteTrigger}
              onDownload={handleDownload}
            />
          ) : (
            <QRCodeGrid
              qrCodes={qrCodes}
              isLoading={isLoading}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDeleteTrigger}
              onDownload={handleDownload}
            />
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => state.setPage(Math.max(1, state.page - 1))}
                      className={
                        state.page === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>

                  {Array.from(
                    { length: pagination.totalPages },
                    (_, i) => i + 1
                  ).map((pageNum) => (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        onClick={() => state.setPage(pageNum)}
                        isActive={state.page === pageNum}
                        className="cursor-pointer"
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        state.setPage(
                          Math.min(pagination.totalPages, state.page + 1)
                        )
                      }
                      className={
                        state.page === pagination.totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </main>

      {/* Create/Update Modal */}
      <Dialog
        key={editingQRCode?._id || "create"}
        open={isCreateModalOpen}
        onOpenChange={handleCreateModalClose}
      >
        <DialogContent className="!max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="text-[#6366F1] text-4xl font-heading pb-10">
              {editingQRCode ? "Update QR Code" : "Create New QR Code"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-6">
            <div className="">
              <div className="pb-10">
                <h3 className="font-semibold font-heading text-[28px] ">
                  Game Details
                </h3>
                <p className="text-muted-foreground text-sm">
                  Enter the game name and link to generate a QR code
                </p>
              </div>
              <QRCodeForm
                qrCode={editingQRCode}
                onSubmit={
                  editingQRCode ? handleUpdateSubmit : handleCreateSubmit
                }
                isLoading={isCreating || isUpdating}
                onCancel={handleCreateModalClose}
              />
            </div>
            {editingQRCode ? (
              <Image
                src={editingQRCode.qrCode}
                alt="QR Code"
                width={600}
                height={600}
                className="w-full h-full object-contain"
              />
            ) : (
              <div>
                <h3 className="font-semibold mb-4 font-heading text-[28px]">
                  QR Code Preview
                </h3>
                <div className="bg-muted p-6 rounded-lg flex items-center justify-center h-64">
                  <p className="text-muted-foreground text-center text-sm">
                    Your generated QR code will appear here
                  </p>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* View QR Modal */}
      <ViewQRModal
        key={viewedQRCode?._id}
        qrCode={viewedQRCode}
        isOpen={isViewModalOpen}
        onClose={handleViewModalClose}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={state.isDeleteModalOpen}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => {
          state.setIsDeleteModalOpen(false);
          state.setSelectedQRId(null);
        }}
      />

      {/* Success Modal */}
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => {
          setIsSuccessModalOpen(false);
          // Refresh the list
          window.location.reload();
        }}
        onAddAnother={() => {
          setIsSuccessModalOpen(false);
          setIsCreateModalOpen(true);
        }}
      />
    </div>
  );
}
