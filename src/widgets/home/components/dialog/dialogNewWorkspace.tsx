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
import { useState } from "react";
import { useProject } from "@/features/projects";
import type { ApiError } from "@/shared/api/fetchFactory";

interface DialogNewWorkspaceProps {
  onWorkspaceCreated?: () => void;  // Callback để refresh danh sách
}

export function DialogNewWorkspace({ onWorkspaceCreated }: DialogNewWorkspaceProps) {
  const [workspaceName, setWorkspaceName] = useState("");
  const [description, setDescription] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { createWorkspace } = useProject();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!workspaceName.trim()) {
      alert("Workspace name is required");
      return;
    }

    setIsLoading(true);

    try {
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
      alert(`Workspace "${newWorkspace.name}" created successfully!`);

      // Gọi callback để refresh danh sách
      if (onWorkspaceCreated) {
        onWorkspaceCreated();
      }
    } catch (error) {
      const apiError = error as ApiError;
      alert(apiError.message || "Failed to create workspace");
      console.error("Error creating workspace:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/*  Nút bấm để mở Dialog */}
      <DialogTrigger asChild>
        <Button>
          <FaPlus className="text-gray-400 mr-2 w-3 h-3" />
          New Workspace
        </Button>
      </DialogTrigger>

      {/* Nội dung popup */}
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Workspace</DialogTitle>
            <DialogDescription>
              Create a new workspace to organize your boards and collaborate
              with your team.
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
              {isLoading ? "Creating..." : "Create Workspace"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}