import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogClose,
} from "@/shared/ui/dialog/index";
import { Button } from "@/shared/ui/button/button";
import { FaPlus } from "react-icons/fa";
import { Label } from "@/shared/ui/label/label";
import { Input } from "@/shared/ui/input/input";
import { useEffect, useState } from "react";
import { useWorkspaceContext } from "@/features/providers/WorkspaceProvider";
import type { ApiError } from "@/shared/api/fetchFactory";
import { toast } from "sonner";

interface DialogNewWorkspaceProps {
  headerTitle: string;
  headerDescription: string;
  mode?: "create" | "edit";
  triggerButton?: React.ReactNode;
  onWorkspaceCreated?: () => void;  // Callback để refresh danh sách
}

export function DialogNewWorkspace({ 
    mode = "create",
    headerTitle,
    headerDescription,
    triggerButton,
  onWorkspaceCreated 
}: DialogNewWorkspaceProps) {
  const [workspaceName, setWorkspaceName] = useState("");
  const [description, setDescription] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { createWorkspace, isEditDialogOpen, selectedWorkspace, closeEditDialog, updateWorkspace } = useWorkspaceContext();

  const isEdit = mode === "edit";
  const title = headerTitle || (isEdit ? "Edit Workspace" : "Create New Workspace");
  const desc = headerDescription || (isEdit 
    ? "Update your workspace information"
    : "Create a new workspace to organize your boards and collaborate with your team."
  );

  useEffect(() => {
    if (isEdit && isEditDialogOpen && selectedWorkspace) {
      setWorkspaceName(selectedWorkspace.name);
      setDescription(selectedWorkspace.description || "");
    }
  }, [isEdit, isEditDialogOpen, selectedWorkspace]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!workspaceName.trim()) {
      alert("Workspace name is required");
      return;
    }

    setIsLoading(true);

    try {
      if (isEdit && selectedWorkspace) {
        // edit workspace
        await updateWorkspace({
          workspaceId: selectedWorkspace.id,
          name: workspaceName.trim(),
          description: description.trim() || undefined,
        });

        setWorkspaceName("");
        setDescription("");
      } else {
        // create workspace
        const newWorkspace = await createWorkspace({
          name: workspaceName.trim(),
          description: description.trim() || undefined,
        });
  
        console.log("Workspace created:", newWorkspace);
        
        // Reset form
        setWorkspaceName("");
        setDescription("");
        setIsOpen(false);
  
        // Hiển thị thông báo thành công
        toast.success(`Workspace "${newWorkspace.name}" created successfully!`, {
          position: "top-center",
        });
        
        // Gọi callback để refresh danh sách
        if (onWorkspaceCreated) {
          onWorkspaceCreated();
        }
      }
      
    } catch (error) {
      const apiError = error as ApiError;
      // handle error permission denied
      if (apiError.statusCode === 403) {
        toast.error("Permission denied", {
          description: "You are not authorized to create a workspace",
          className: "bg-white border-gray-200",
          descriptionClassName: "text-black",
        });
        return;
      }
      toast.error(apiError.message || "Failed to create workspace", {
        position: "top-center",
      });
      console.error("Error creating workspace:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      if (isEdit) {
        closeEditDialog();
      }
      // Reset form khi đóng
      setWorkspaceName("");
      setDescription("");
    }
  }
  return (
    <Dialog open={isEdit ? isEditDialogOpen : isOpen} onOpenChange={handleClose}>
      {/*  Nút bấm để mở Dialog */}
      {!isEdit && (
      <DialogTrigger asChild>
        {triggerButton || (
          <Button>
            <FaPlus className="text-gray-400 mr-2 w-3 h-3" />
            {title}
          </Button>
        )}
      </DialogTrigger>
    )}

      {/* Nội dung popup */}
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>
              {desc}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Input 1: Workspace Name */}
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="name">Workspace Name</Label>
              <Input
                id="name"
                placeholder="Enter workspace name"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                required
                disabled={isLoading}
                maxLength={255}
              />
            </div>
            {/* Input 2: Description */}
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="description">Description (optional)</Label>
              <Input
                id="description"
                placeholder="Enter workspace description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button" disabled={isLoading}>
                Cancel
              </Button>
            </DialogClose>
            {/* Nút Create */}
            <Button 
              disabled={!workspaceName.trim() || isLoading} 
              type="submit"
            >
              {isLoading ? (isEdit ? "Updating..." : "Creating...") : (isEdit ? "Update Workspace" : "Create Workspace")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}