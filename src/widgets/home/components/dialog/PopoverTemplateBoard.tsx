import { useCallback, useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { Button } from "@/shared/ui/button";
import { FiChevronLeft, FiPlus, FiX } from "react-icons/fi";
import { useBoardTemplates, type BoardTemplate, type CreateBoardFromTemplateRequest } from "@/features/board-templates/index";
import { useBoardContext } from "@/features/providers/BoardProvider";

interface PopoverTemplateBoardProps {
    trigger: React.ReactNode;
    onSelectTemplate?: (templateId: string) => void;
    workspaceId: string;
}

export function PopoverTemplateBoard({ trigger, onSelectTemplate, workspaceId }: PopoverTemplateBoardProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { getAllBoardTemplates } = useBoardTemplates();
    const { handleCreateBoardFromTemplate } = useBoardContext();
    const [templates, setTemplates] = useState<BoardTemplate[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState<BoardTemplate | null>(null);

    useEffect(() => {
        if (isOpen) {
            fetchTemplates();
        } else {
            setSelectedTemplate(null);
        }
    }, [isOpen]);

    const fetchTemplates = async () => {
        setIsLoading(true);
        try {
            const data = await getAllBoardTemplates();
            setTemplates(data?.boards || []);
        } catch (error) {
            console.error(error);
            setTemplates([]);
        } finally {
            setIsLoading(false);
        }
    }

    const handleSelectTemplate = useCallback(
        (template: BoardTemplate) => {
            setSelectedTemplate(template);
        },
        []
    );

    const handleCreateBoard = async () => {
        if (!selectedTemplate) return;

        setIsLoading(true);
        try {
            const request: CreateBoardFromTemplateRequest = {
                workspaceId: workspaceId,
                templateId: selectedTemplate.id,
            };
            
            const newBoard = await handleCreateBoardFromTemplate(request);
            
            onSelectTemplate?.(newBoard.board?.id ?? "");
            setIsOpen(false);
            setSelectedTemplate(null);
        } catch (err) {
            console.error("Error creating board:", err);
            alert("Failed to create board from template");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                {trigger}
            </PopoverTrigger>
            <PopoverContent
                side="right"
                align="end"
                className="w-80 p-4 space-y-4"
            >
                {/* Header */}
                <div className="flex items-center justify-between gap-2">
                    <button
                        className="text-sm items-center justify-center flex gap-2 cursor-pointer hover:text-gray-700"
                        onClick={() => setIsOpen(false)}
                    >
                        <FiChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-semibold">Choose a template</span>
                    <button
                        className="cursor-pointer hover:text-gray-700"
                        onClick={() => setIsOpen(false)}
                    >
                        <FiX className="w-4 h-4" />
                    </button>
                </div>

                {/* Danh sách templates  */}
                <div className="space-y-2">
                    {isLoading ? (
                        <p className="text-sm text-gray-500 text-center py-4">Loading templates...</p>
                    ) : templates.length === 0 ? (
                        <p className="text-sm text-gray-500 text-center py-4">No templates available</p>
                    ) : (
                        templates.map((template) => {
                            const isSelected = selectedTemplate?.id === template.id;
                            return (
                                <button
                                    key={template.id}
                                    onClick={() => handleSelectTemplate(template)}
                                    className={`w-full text-left p-3 border rounded-lg transition-colors ${
                                        isSelected
                                            ? "border-blue-500 bg-blue-50 hover:bg-blue-100"
                                            : "border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                                    }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <img 
                                            src={template.cover_url} 
                                            alt={template.name} 
                                            className="w-10 h-10 object-cover rounded-md" 
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-semibold truncate">
                                                {template.name}
                                            </h3>
                                        </div>
                                        {isSelected && (
                                            <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                </button>
                            );
                        })
                    )}
                </div>

                {/* Button create board */}
                <Button
                    variant="default"
                    className="w-full"
                    onClick={handleCreateBoard}
                    disabled={!selectedTemplate || isLoading}
                >
                    <FiPlus className="w-4 h-4" />
                    {isLoading ? "Creating..." : "Create board with template"}
                </Button>
            </PopoverContent>
        </Popover>
    );
}