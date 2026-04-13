import { useRef, useState } from "react";
import { Button } from "@/shared/ui/button";
import { toast } from "sonner";
import { FiPaperclip, FiUpload } from "react-icons/fi";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { useCardDetailContext } from "@/features/providers/CardDetailProvider";
import {
  getCardAttachmentSignature,
  uploadFileToCloudinary,
} from "@/shared/lib/cloudinary";

interface AttachmentFileToCardProps {
  cardId: string;
}

export function AttachmentFileToCard({ cardId }: AttachmentFileToCardProps) {
  const { handleAddAttachmentToCard } = useCardDetailContext();

  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_SIZE = 20 * 1024 * 1024; // 20MB

  const reset = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const pickFile = (file: File | null) => {
    if (!file) return;

    if (file.size > MAX_SIZE) {
      toast.error("File size must be less than 20MB", {
        position: "top-center",
      });
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setIsUploading(true);

      const signature = await getCardAttachmentSignature({
        cardId,
        fileName: selectedFile.name,
        mimeType: selectedFile.type || "application/octet-stream",
        fileSize: parseInt(selectedFile.size.toString()),
      });

      const url = await uploadFileToCloudinary(selectedFile, signature);

      await handleAddAttachmentToCard({
        cardId,
        file_name: selectedFile.name,
        url,
        mime_type: selectedFile.type || undefined,
        size_bytes: selectedFile.size.toString(),
      });

      toast.success("Attachment uploaded successfully", {
        position: "top-center",
      });

      setOpen(false);
      reset();
    } catch (err) {
      console.error("Failed to upload attachment", err);
      toast.error("Failed to upload attachment", { position: "top-center" });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      {/* Option button trong Popover */}
      <button
        type="button"
        className="w-full flex justify-between items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors text-left"
        onClick={() => setOpen(true)}
      >
        <div className="flex items-center gap-2">
          <FiPaperclip className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-semibold">Attach file</span>
        </div>
      </button>

      {/* Modal chọn file + upload */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Upload attachment</DialogTitle>
            <DialogDescription>
              Select file or drag and drop below (max 20MB).
            </DialogDescription>
          </DialogHeader>

          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
            accept="*/*"
          />

          <div
            className="mt-4 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
            }}
            onDrop={(e) => {
              e.preventDefault();
              const f = e.dataTransfer.files?.[0] ?? null;
              pickFile(f);
            }}
          >
            <div className="flex flex-col items-center gap-2">
              <FiUpload className="w-6 h-6 text-gray-500" />
              <p className="text-sm text-gray-600">
                Drag and drop file here or click to select
              </p>
              <p className="text-xs text-gray-500">Max 20MB</p>
            </div>
          </div>

          {selectedFile && (
            <div className="mt-4 text-sm">
              <p className="font-semibold text-gray-800">Selected:</p>
              <p className="break-all text-gray-700">{selectedFile.name}</p>
            </div>
          )}

          <div className="mt-6 flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setOpen(false);
                reset();
              }}
              disabled={isUploading}
            >
              Cancel
            </Button>

            <Button
              onClick={handleUpload}
              disabled={isUploading || !selectedFile}
            >
              {isUploading ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}