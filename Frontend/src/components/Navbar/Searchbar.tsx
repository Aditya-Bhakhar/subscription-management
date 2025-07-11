import { Separator } from "@radix-ui/react-separator";
import { ChevronDown, Search, X } from "lucide-react";
import React from "react";

const Searchbar: React.FC = () => {
  return (
    <div>
      <div className="flex items-center px-2 py-1 border rounded bg-gray-100/60 justify-between w-68 transition-all duration-300 ease-in-out hover:w-80 hover:border-black">
        <div className="flex items-center">
          <div className="flex items-center hover:cursor-pointer">
            <Search color="gray" size={20} className="" />
            <ChevronDown color="gray" size={18} className="mr-2" />
          </div>
          <div className="flex items-center h-5">
            <Separator
              orientation="vertical"
              className="mr-1 w-px h-full bg-gray-300"
            />
          </div>
          <input
            type="text"
            id="searchbar"
            className="w-full rounded py-0.5 px-2 outline-0 text-[15px]"
            placeholder="Search in Customers ( / )"
          />
        </div>
        <div className="hover:cursor-pointer">
          <X color="gray" size={20} className="" />
        </div>
      </div>
    </div>
  );
};

export default Searchbar;
