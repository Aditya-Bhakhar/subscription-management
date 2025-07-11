import { Tags, X } from "lucide-react";
import React, { useEffect, useState } from "react";

interface CustomTagsInputFieldProps {
  preTags?: string[];
  maxTags?: number;
  maxLengthTag?: number;
  onChange?: (tags: string[]) => void; 
  customCSS?: {
    main?: string;
    maxHeightOfTagDiv?: string;
  };
}

const CustomTagsInputField: React.FC<CustomTagsInputFieldProps> = ({
  preTags = [],
  maxTags = 5,
  maxLengthTag = 8,
  onChange,
  customCSS={},
}) => {
  const [inputBoxActive, setInputBoxActive] = useState(false);
  const [tags, setTags] = useState<string[]>(preTags);
  const [input, setInput] = useState<string>("");

  const handleRemoveTag = (tag: string) => {
    const updatedTags = tags.filter((tagName) => tagName !== tag);
    setTags(updatedTags);
    onChange?.(updatedTags);
  };

  const handleEnterSpaceTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter") && input.trim()) {
      if (!tags.includes(input.trim()) && tags.length < maxTags) {
        const updatedTags = [...tags, input.trim().toLowerCase()];
        setTags(updatedTags);
        onChange?.(updatedTags); 
        setInput("");
      }
    }
  };

  useEffect(() => {
    const tagInput = document.getElementById("tagInput") as HTMLInputElement;
    const keydownHandler = (e: Event) => handleEnterSpaceTag(e as unknown as React.KeyboardEvent<HTMLInputElement>);

    if (tagInput) {
      tagInput.addEventListener("keydown", keydownHandler);
    }

    return () => {
      if (tagInput) {
        tagInput.removeEventListener("keydown", keydownHandler);
      }
    };
  }, [tags, input]);

  return (
    <div className={`${customCSS.main || ""} p-4 rounded`}>
      <div className="text-slate-500 mb-2">Press enter or space to add tags...</div>
      <div
        className={`flex items-center gap-2 border-2 p-1 rounded border-gray-400 mb-2 hover:border-slate-800 ${
          inputBoxActive ? "border-slate-800" : ""
        }`}
      >
        <div className={`my-4 ${customCSS.maxHeightOfTagDiv || ""} overflow-auto flex`}>
          <div className="mx-2 py-1">
            <Tags color="gray" />
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <div
                    key={index}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" || e.key === "Delete") {
                        handleRemoveTag(tag);
                      }
                    }}
                    className="w-fit bg-slate-100 py-1 px-2 rounded-md flex items-center gap-2 font-bold"
                  >
                    <span>{tag}</span>
                    <span
                      className="cursor-pointer bg-slate-400 text-white rounded-full p-[1px] hover:bg-red-400 hover:text-white"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      <X size={14} />
                    </span>
                  </div>
                ))}
              </div>
            )}
            <input
              type="text"
              id="tagInput"
              className="outline-0 w-full bg-white"
              placeholder={tags.length >= maxTags ? "Max number of tags reached!" : "Add a tag..."}
              value={input}
              onKeyDown={handleEnterSpaceTag}
              disabled={tags.length >= maxTags}
              onFocus={() => setInputBoxActive(true)}
              onBlur={() => setInputBoxActive(false)}
            />
          </div>
        </div>
      </div>

      <div className="text-slate-500 flex justify-between items-center">
        <div>Add up to {maxTags} tags for your post</div>
        <div className={tags.length === maxTags ? "text-red-500" : ""}>
          <span>{tags.length}</span>/<span>{maxTags}</span>
        </div>
      </div>
    </div>
  );
};

export default CustomTagsInputField;
