import Tippy from "@tippyjs/react"
import styleText from "data-text:style.css"
import emojis from "emojilib"
import type { PlasmoCSConfig, PlasmoGetStyle } from "plasmo"
import { ReactElement, useEffect, useState } from "react"

import "tippy.js/dist/tippy.css"

export const config: PlasmoCSConfig = {
  matches: ["http://0.0.0.0:8000/*"],
  all_frames: true
}

export const getStyle: PlasmoGetStyle = () => {
  const style = document.createElement("style")
  style.textContent = styleText
  return style
}

export function get_emoji_divs(
  partial_emoji_name?: string,
  max_divs: number = 10
): Array<ReactElement> {
  if (!partial_emoji_name) {
    partial_emoji_name = "smile"
  }
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
  return emoji_divs.slice(0, max_divs)
}

const emoji_bar = () => {
  const [emoji_divs, set_emoji_divs] = useState(get_emoji_divs)

  useEffect(() => {
    document.addEventListener(
      "keyup",
      (e) => {
        const element = e.target as HTMLInputElement
        if (element.value.length == 0) {
          set_emoji_divs(get_emoji_divs())
          return
        }
        set_emoji_divs(get_emoji_divs(element.value))
      },
      true
    )
  }, [])
  if (emoji_divs.length === 0) {
    return <div></div>
  }
  return (
    <div className="fixed bottom-1 h-fit w-full flex flex-col items-center">
      <div
        className="
      max-w-fit 
      bg-gray-600 
      bg-opacity-60 
      rounded-lg 
      flex flex-row divide-x-2 p-2
      text-4xl  select-none">
        <div className="flex flex-row pr-2">{emoji_divs}</div>
        <div className="pl-2">😀</div>
      </div>
    </div>
  )
}

export default emoji_bar
