import { debug } from "console"
import Tippy from "@tippyjs/react"
import styleText from "data-text:style.css"
import emojis from "emojilib"
import type { PlasmoCSConfig, PlasmoGetStyle } from "plasmo"
import { ReactElement, useEffect, useState } from "react"

import "tippy.js/dist/tippy.css"

import { match } from "assert"

export const config: PlasmoCSConfig = {
  matches: ["http://0.0.0.0:8000/*"],
  all_frames: true
}

export const getStyle: PlasmoGetStyle = () => {
  const style = document.createElement("style")
  style.textContent = styleText
  return style
}

const emoji_bar = () => {
  const [emoji_divs, set_emoji_divs] = useState(get_emoji_divs)

  function get_emoji_divs(
    partial_emoji_name?: string,
    max_divs: number = 10
  ): Array<ReactElement> {
    if (!partial_emoji_name) {
      return []
    }
    const filtered_emoji_divs = []
    Object.keys(emojis).forEach((emoji) => {
      const emoji_names: Array<string> = emojis[emoji]
      emoji_names.some((emoji_name: string) => {
        if (emoji_name.includes(partial_emoji_name)) {
          filtered_emoji_divs.push(
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
    return filtered_emoji_divs.slice(0, max_divs)
  }

  function get_partial_emoji_name(
    input: string,
    cursor_position: number
  ): string {
    if (!input) {
      return ""
    }
    for (let i = cursor_position - 1; i >= 0; i--) {
      switch (input[i]) {
        case " ":
          return ""
        case ":": {
          if (i == 0 || (i - 1 > 0 && input[i - 1] == " ")) {
            for (let j = cursor_position - 1; j <= input.length; j++) {
              if (input[j] === " " || j === input.length) {
                const partial_emoji_name = input.slice(i + 1, j)
                return partial_emoji_name
              }
            }
          }
        }
      }
    }

    return ""
  }

  function debounce(callback, wait) {
    let timeout
    return (...args) => {
      clearTimeout(timeout)
      timeout = setTimeout(function () {
        callback.apply(this, args)
      }, wait)
    }
  }

  function handle_keyup(element: HTMLInputElement) {
    if (!element.selectionStart || element.value.length == 0) {
      set_emoji_divs(get_emoji_divs())
      return
    }
    const partial_name = get_partial_emoji_name(
      element.value,
      element.selectionStart
    )
    debug(`[handle_keyup] ${partial_name}`)
    set_emoji_divs(get_emoji_divs(partial_name))
  }
  useEffect(() => {
    window.addEventListener(
      "keyup",
      debounce((e: Event) => {
        handle_keyup(e.target as HTMLInputElement)
      }, 250)
    )
  }, [])

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
