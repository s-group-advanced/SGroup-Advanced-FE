import { Button } from "@/shared/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/ui/dropdown-menu";
import { Input } from "@/shared/ui/input";
import { useState } from "react";
import { FiSearch, FiGrid, FiList, FiFilter } from "react-icons/fi";
import { TbSortAscending, TbSortDescending, TbClock, TbCalendar } from "react-icons/tb";

type ViewType = 'grid' | 'list';

interface BoardFilterProps {
    onSearchChange?: (search: string) => void;
    onSortChange?: (sort: string) => void;
    onViewChange?: (view: ViewType) => void;
}

export function BoardFilter({ 
    onSearchChange, 
    onSortChange, 
    onViewChange 
}: BoardFilterProps) {
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('most-recent');
    const [view, setView] = useState<ViewType>('grid');

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearch(value);
        onSearchChange?.(value);
    };

    const handleSortChange = (value: string) => {
        setSort(value);
        onSortChange?.(value);
    };

    const handleViewChange = (newView: ViewType) => {
        setView(newView);
        onViewChange?.(newView);
    };

    return (
        <div className="flex items-center gap-4 px-8 py-4 justify-between">
            {/* Search Box */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm w-full">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                        type="text"
                        placeholder="Search boards..."
                        value={search}
                        style={{ width: '350px' }}
                        onChange={handleSearchChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                {/* Sort Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Button variant="outline" className="flex items-center gap-2">
                            <FiFilter className="w-4 h-4" />
                            <span>Sort by: {sort.charAt(0).toUpperCase() + sort.slice(1) || 'Most recent'}</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleSortChange('A-Z')}>
                            <TbSortAscending className="w-4 h-4" />
                            <span>A-Z</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSortChange('Z-A')}>
                            <TbSortDescending className="w-4 h-4" />
                            <span>Z-A</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSortChange('Most recent')}>
                            <TbClock className="w-4 h-4" />
                            <span>Most recent</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSortChange('Least Recent')}>
                            <TbCalendar className="w-4 h-4" />
                            <span>Least Recent</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-1 rounded-lg p-1">
                <button
                    onClick={() => handleViewChange('grid')}
                    className={`p-2 rounded-md transition-colors ${
                        view === 'grid' 
                            ? 'bg-gray-900 text-white' 
                            : 'bg-transparent text-gray-600 hover:bg-gray-100'
                    }`}
                    title="Grid view"
                >
                    <FiGrid className="w-4 h-4" />
                </button>
                <button
                    onClick={() => handleViewChange('list')}
                    className={`p-2 rounded-md transition-colors ${
                        view === 'list' 
                            ? 'bg-gray-900 text-white' 
                            : 'bg-transparent text-gray-600 hover:bg-gray-100'
                    }`}
                    title="List view"
                >
                    <FiList className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}