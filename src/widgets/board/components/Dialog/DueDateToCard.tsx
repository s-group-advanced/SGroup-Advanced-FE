import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { FiCalendar } from "react-icons/fi";
import { Button } from "@/shared/ui/button";
import { Calendar } from "@/shared/ui/datetime-picker/index";

interface DueDateToCardProps {
    value?: Date;
    onChange: (value?: Date) => void;
}

export function DueDateToCard({ value, onChange }: DueDateToCardProps) {

    
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" className="shadow-md">
                    <FiCalendar className="w-4 h-4" />
                    Due date
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[255px] p-0" align="start" side="bottom">
                <Calendar 
                    mode="single"
                    selected={value}
                    onSelect={onChange}
                    defaultMonth={value}
                />
            </PopoverContent>
        </Popover>
    )
}