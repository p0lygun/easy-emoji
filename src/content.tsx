import Tippy from "@tippyjs/react"
import styleText from "data-text:style.css"
import emojis from "emojilib"
import type { PlasmoGetStyle } from "plasmo"
import { ReactElement } from "react"

import "tippy.js/dist/tippy.css"

export const getStyle: PlasmoGetStyle = () => {
  const style = document.createElement("style")
  style.textContent = styleText
  return style
}

function get_emoji_divs(partial_emoji_name: string): Array<ReactElement> {
  const emoji_divs = []
  Object.keys(emojis).forEach((emoji) => {
    const emoji_names: Array<string> = emojis[emoji]
    emoji_names.some((emoji_name: string) => {
      if (emoji_name.includes(partial_emoji_name)) {
        emoji_divs.push(
          <Tippy key={emojis[emoji][0]} content={emojis[emoji][0]}>
            <div className="cursor-pointer transition-transform hover:-translate-y-2">
              {emoji}
            </div>
          </Tippy>
        )
        return true
      }
    })
  })
  return emoji_divs
}

const emoji_bar = () => {
  return (
    <div className="fixed bottom-1 h-fit w-full flex flex-col items-center">
      <div
        className="w-fit bg-gray-600 bg-opacity-60 rounded-lg flex flex-row justify-center text-4xl flex-wrap p-1 select-none">
        {get_emoji_divs("smile")}
      </div>
    </div>
  )
}

export default emoji_bar
