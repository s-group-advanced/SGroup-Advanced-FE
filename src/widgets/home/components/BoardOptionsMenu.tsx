import { Menu, Transition } from "@headlessui/react";
import { FiEdit2 } from "react-icons/fi";
import { FiTrash2 } from "react-icons/fi";
import { Fragment } from "react";
import { FaEllipsisH } from "react-icons/fa";
import { useBoardContext } from "@/features/providers/index";

interface BoardOptionsMenuProps {
    boardId: string;
}

export function BoardOptionsMenu({ boardId }: BoardOptionsMenuProps) {
    const { openEditDialog, deleteBoard } = useBoardContext();
    const handleEditBoard = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        openEditDialog(boardId);
    }

    const handleDeleteBoard = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            e.preventDefault();
            e.stopPropagation();
            await deleteBoard({ boardId });
          
        } catch (err) {
          console.error(`Failed to delete board: ${err}`);
        }
    }
    
  return (
    <Menu as="div" className="relative ml-auto">
      <Menu.Button
        className="hover:bg-gray-100 rounded-lg p-2 cursor-pointer transition-all duration-300 w-10 h-10 flex items-center justify-center opacity-0 group-hover:opacity-100"
        onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
        }}
      >
        <FaEllipsisH className="text-gray-500" />
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg border border-gray-200 focus:outline-none z-10">
          {/* Edit Board */}
          <div className="px-1 py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? "bg-gray-100" : ""
                  } group flex items-center w-full px-3 py-2 text-sm text-gray-700`}
                  onClick={handleEditBoard}
                >
                  <FiEdit2 className="w-4 h-4 mr-2 text-gray-500" />
                  Edit Board
                </button>
              )}
            </Menu.Item>
          </div>

          {/* Delete Board */}
          <div className="px-1 py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? "bg-gray-100" : ""
                  } group flex items-center w-full px-3 py-2 text-sm text-red-600`}
                  onClick={handleDeleteBoard}
                >
                  <FiTrash2 className="w-4 h-4 mr-2" />
                  Delete Board
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
