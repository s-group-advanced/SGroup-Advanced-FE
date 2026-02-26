import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover/index";
import { FiFilePlus, FiX, FiFileText, FiCheckSquare, FiArrowLeft, FiPlus } from "react-icons/fi";
import { useCardDetailContext } from "@/features/providers/CardDetailProvider";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { CardMemberAvatars } from "../Card/CardMemberAvatars";
import type { Card, CreateNewCardTemplateRequest } from "@/features/cards/api/type";
import { Checkbox } from "@/shared/ui/checkbox";
import { Button } from "@/shared/ui/button";

interface AddCardFromTemplateProps {
    listId: string;
}

export function AddCardFromTemplate({ listId }: AddCardFromTemplateProps) {
    const { cards, handleCreateCardFromTemplate, handleCreateNewCardTemplate } = useCardDetailContext();
    const [isOpen, setIsOpen] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<Card | null>(null);
    const [view, setView] = useState<'list' | 'options'>('list');

    const [includeChecklists, setIncludeChecklists] = useState(true);
    const [includeLabels, setIncludeLabels] = useState(true);
    const [includeMembers, setIncludeMembers] = useState(true);

    const [isCreating, setIsCreating] = useState(false);
    const [newTemplateName, setNewTemplateName] = useState("");
    
    // Lấy tất cả cards là template
    const templateCards = useMemo(() => 
        cards.filter(card => card.is_template), 
        [cards]
    );

    const handleSelectTemplate = (template: Card) => {
        setSelectedTemplate(template);
        setView('options');
    };

    const handleBack = () => {
        setView('list');
        setSelectedTemplate(null);
    }

    const createCardFromTemplate = async () => {
        if (!selectedTemplate) return;
        try {
            const data = await handleCreateCardFromTemplate({
                templateCardId: selectedTemplate.id,
                list_id: listId,
                title: selectedTemplate.title,
                include_members: includeMembers,
                include_checklists: includeChecklists,
                include_labels: includeLabels,
            });
            if (!data) throw new Error("Failed to create card from template");
            setIsOpen(false);
            setSelectedTemplate(null);
        } catch (err) {
            console.error(`Failed to create card from template: ${err}`);
            toast.error("Failed to create card from template");
        }
    }

    const handleCreateNewCardTemplateFn = async (request: CreateNewCardTemplateRequest) => {
        try {
            // Chính là tạo card bình thường với is_template = true
            const data = await handleCreateNewCardTemplate(request);

            if (!data) throw new Error("Failed to create new card template");

            setIsCreating(false);
            setNewTemplateName("");
            setIsOpen(false);
            toast.success("New card template created successfully", {
                position: "top-center",
            });
        } catch (err) {
            console.error(`Failed to create new card template: ${err}`);
            toast.error("Failed to create new card template", {
                position: "top-center",
            });
        } finally {
            setIsCreating(false);
            setNewTemplateName("");
        }
    }

    // reset state when close popover
    useEffect(() => {
        return () => {
            setView('list');
            setSelectedTemplate(null);
            setIncludeChecklists(true);
            setIncludeLabels(true);
            setIncludeMembers(true);
        }
    }, [isOpen]);

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <button className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors font-semibold shadow-sm mb-3 cursor-pointer">
                    <FiFilePlus className="w-4 h-4" />
                </button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-80 p-0">
                {view === 'list' ? (
                    // ===== VIEW 1: LIST =====
                    <>
                        <div className="flex items-center justify-between p-3 border-b">
                    <h3 className="text-sm font-semibold text-gray-700">Template</h3>
                    <button 
                        className="text-gray-500 hover:text-gray-700"
                        onClick={() => setIsOpen(false)}
                    >
                        <FiX className="w-5 h-5" />
                    </button>
                </div>

                {/* Template List */}
                <div className="max-h-[400px] overflow-y-auto">
                    {templateCards.length === 0 ? (
                        <div className="p-4 text-center text-sm text-gray-500">
                            No templates available
                        </div>
                    ) : (
                        <div className="p-2 space-y-2">
                            {templateCards.map((template) => {
                                return (
                                    <button
                                        key={template.id}
                                        onClick={() => handleSelectTemplate(template)}
                                        className="w-full text-left bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow"
                                    >
                                        {/* Title */}
                                        <h4 className="text-sm font-medium text-gray-900 mb-2">
                                            {template.title}
                                        </h4>
                                        
                                        {/* Description */}
                                        {template.description && (
                                            <p className="text-xs text-gray-600 mb-2">
                                                {template.description}
                                            </p>
                                        )}
                                        
                                        {/* Members */}
                                        {((template.cardMembers && template.cardMembers.length > 0) || 
                                            (template.assigned_users && template.assigned_users.length > 0)) && (
                                                <div className="flex items-center gap-2 mb-2">
                                                    <CardMemberAvatars card={template} maxDisplay={2} />
                                                </div>
                                            )}
                                        
                                        {/* Metadata row */}
                                        <div className="flex items-center gap-3 text-xs">
                                            {/* Template indicator */}
                                            <div className="flex items-center gap-1 text-blue-600">
                                                <FiFileText className="w-3 h-3" />
                                                <span>Template</span>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-3 border-t bg-gray-50">
                    {isCreating ? (
                        <div className="space-y-2">
                            <input
                                type="text"
                                value={newTemplateName}
                                onChange={(e) => setNewTemplateName(e.target.value)}
                                placeholder="Enter template name..."
                                className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-0 shadow-sm"
                                autoFocus
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") handleCreateNewCardTemplateFn({
                                        title: newTemplateName.trim(),
                                        list_id: listId,
                                    });
                                    if (e.key === "Escape") {
                                        setIsCreating(false);
                                        setNewTemplateName("");
                                    }
                                }}
                            />
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleCreateNewCardTemplateFn({
                                        title: newTemplateName.trim(),
                                        list_id: listId,
                                    })}
                                    className="px-3 py-1.5 bg-black text-white text-sm rounded-md hover:bg-gray-800 transition-colors font-semibold"
                                    disabled={!newTemplateName.trim()}
                                >
                                    Create
                                </button>
                                <button
                                    onClick={() => {
                                        setIsCreating(false);
                                        setNewTemplateName("");
                                    }}
                                    className="px-3 py-1.5 text-black text-sm hover:bg-gray-200 rounded-md transition-colors font-semibold"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button 
                            className="w-full text-left text-sm text-gray-700 hover:text-gray-900 py-2 px-2 hover:bg-gray-100 flex items-center gap-2 cursor-pointer rounded-md"
                            onClick={() => setIsCreating(true)}
                        >
                            <FiPlus className="w-4 h-4" />
                            <span className="font-semibold">Create new template</span>
                        </button>
                    )}
                </div>
                    </>
                ) : (
                    // ===== VIEW 2: OPTIONS =====
                    <>
                        {/* Header with Back button */}
                        <div className="flex items-center gap-2 p-3 border-b">
                            <button 
                                className="text-gray-500 hover:text-gray-700"
                                onClick={handleBack}
                            >
                                <FiArrowLeft className="w-5 h-5" />
                            </button>
                            <h3 className="text-sm font-semibold text-gray-700 flex-1">Create card</h3>
                            <button 
                                className="text-gray-500 hover:text-gray-700"
                                onClick={() => setIsOpen(false)}
                            >
                                <FiX className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-3 border-b">
                            {/* Title */}
                            <h4 className="text-sm font-semibold text-gray-900 mb-2">
                                {selectedTemplate?.title}
                            </h4>

                            {/* Description */}
                            {selectedTemplate?.description && (
                                <p className="text-xs text-gray-600 mb-2">
                                    {selectedTemplate.description}
                                </p>
                            )}
                            
                            {/* Metadata */}
                            <div className="flex items-center gap-3 text-xs text-gray-600">
                                {/* Checklist count */}
                                {selectedTemplate?.checklists && selectedTemplate.checklists.length > 0 && (
                                    <div className="flex items-center gap-1">
                                        <FiCheckSquare className="w-3 h-3" />
                                        <span>{selectedTemplate.checklists.reduce((total, checklist) => total + (checklist.items?.length ?? 0), 0)}/{selectedTemplate.checklists.length}</span>
                                    </div>
                                )}
                                
                                {/* Members */}
                                {((selectedTemplate?.cardMembers && selectedTemplate.cardMembers.length > 0) || 
                                    (selectedTemplate?.assigned_users && selectedTemplate.assigned_users.length > 0)) && (
                                    <div className="flex items-center -space-x-2">
                                        <CardMemberAvatars card={selectedTemplate} maxDisplay={2} />
                                    </div>
                                )}
                            </div>
                        </div>
                
                        {/* Options */}
                        <div className="p-3 space-y-3">
                            <p className="text-xs text-gray-600 mb-3">Keep...</p>
                            
                            {/* Checklist option */}
                            {selectedTemplate?.checklists && selectedTemplate.checklists.length > 0 && (
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        checked={includeChecklists}
                                        onCheckedChange={(checked) => setIncludeChecklists(checked as boolean)}
                                    />
                                    <label className="text-sm text-gray-700">
                                        Checklists ({selectedTemplate.checklists.length})
                                    </label>
                                </div>
                            )}
                            
                            {/* Labels option */}
                            {selectedTemplate?.labels && selectedTemplate.labels.length > 0 && (
                                <div className="flex items-center gap-2">
                                    <Checkbox 
                                        checked={includeLabels}
                                        onCheckedChange={(checked) => setIncludeLabels(checked as boolean)}
                                    />
                                    <label className="text-sm text-gray-700">
                                        Labels ({selectedTemplate.labels.length})
                                    </label>
                                </div>
                            )}
                            
                            {/* Members option */}
                            {((selectedTemplate?.cardMembers && selectedTemplate.cardMembers.length > 0) || 
                                (selectedTemplate?.assigned_users && selectedTemplate.assigned_users.length > 0)) && (
                                <div className="flex items-center gap-2">
                                    <Checkbox 
                                        checked={includeMembers}
                                        onCheckedChange={(checked) => setIncludeMembers(checked as boolean)}
                                    />
                                    <label className="text-sm text-gray-700">
                                        Members {((selectedTemplate?.cardMembers && selectedTemplate.cardMembers.length > 0) ? `(${selectedTemplate.cardMembers.length})` : '')} {((selectedTemplate?.assigned_users && selectedTemplate.assigned_users.length > 0) ? `(${selectedTemplate.assigned_users.length})` : '')}
                                    </label>
                                </div>
                            )}
                        </div>
                
                        {/* Footer buttons */}
                        <div className="p-3 space-y-2 border-t">
                            <Button 
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                onClick={createCardFromTemplate}
                            >
                                Create card
                            </Button>
                        </div>
                    </>
                )}
            </PopoverContent>
        </Popover>
    )
}