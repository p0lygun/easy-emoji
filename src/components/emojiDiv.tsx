import { ReactElement } from "react";

export function EmojiDiv({ emoji, name, is_selected }): ReactElement {
    return (
      <div
        data-emoji-name={name}
        className="flex flex-row transition duration-200 gap-x-2 align-middle aria-selected:bg-[#2b4278]"
        role="option"
        aria-selected={is_selected}>
        <div className="cursor-pointer">{emoji}</div>
        <div className="text-sky-400 font-mono font-medium text-sm leading-6">
          :{name}:
        </div>
      </div>
    )
  }