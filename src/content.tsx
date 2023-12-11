import { debug } from "console"
import styleText from "data-text:style.css"
import emojis from "emojilib"
import type { PlasmoCSConfig, PlasmoGetStyle } from "plasmo"
import React, { ReactElement, useEffect, useState } from "react"
import { usePopper } from "react-popper"

import "tippy.js/dist/tippy.css"

// export const config: PlasmoCSConfig = {
//   matches: ["http://0.0.0.0:8000/*"],
//   all_frames: true
// }

export const getStyle: PlasmoGetStyle = () => {
  const style = document.createElement("style")
  style.textContent = styleText
  return style
}

export function EmojiDiv({ emoji, name, is_selected }): ReactElement {

  return (
    <div
      data-emoji-name={name}
      className="flex flex-row transition duration-200 gap-x-2 align-middle aria-selected:bg-[#2b4278]"
      aria-selected={is_selected}>
      <div className="cursor-pointer">{emoji}</div>
      <div className="text-sky-400 font-mono font-medium text-sm leading-6">
        :{name}:
      </div>
    </div>
  )
}

const emoji_bar = () => {
  const [emoji_divs, set_emoji_divs] = useState([])
  const [filtered_emojis, set_filtered_emojis] = useState([])
  const [referenceElement, setReferenceElement] = useState(null)
  const [popperElement, setPopperElement] = useState(null)
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: "auto",
    modifiers: [{ name: "offset", options: { offset: [8, 8] } }]
  })
  const [selected_emoji, set_selected_emoji] = useState("")

  function get_filtered_emojis(
    partial_emoji_name?: string,
    max_divs: number = 15
  ): Array<String> {
    if (!partial_emoji_name || partial_emoji_name.length < 2) {
      return []
    }
    partial_emoji_name = partial_emoji_name.toLowerCase()

    const temp_list = []
    Object.entries(emojis).forEach(([emoji, names]) => {
      names.some((name) => {
        if (name.includes(partial_emoji_name)) {
          temp_list.push(emoji)
          return true
        }
      })
    })

    return temp_list.slice(0, max_divs)
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

  function get_shadow_root() {
    return document.getElementsByTagName("plasmo-csui")[0].shadowRoot
  }
  function handel_navigation(event: KeyboardEvent) {
    switch (event.key) {
      case "ArrowDown": {
      }
      case "ArrowUp": {
      }
    }
  }

  function handle_typing(event: KeyboardEvent) {
    const element = event.target as HTMLInputElement
    setReferenceElement(element)
    if (!element.selectionStart || element.value.length == 0) {
      set_emoji_divs([])
      return
    }
    const partial_name = get_partial_emoji_name(
      element.value,
      element.selectionStart
    )
    debug(`[handle_keyup] ${partial_name}`)
    set_filtered_emojis(get_filtered_emojis(partial_name))
  }

  function set_filtered_emoji_divs() {
    const filtered_emoji_divs = []
    filtered_emojis.map((emoji) => {
      filtered_emoji_divs.push(
        <EmojiDiv
          key={emoji}
          emoji={emoji}
          name={emojis[emoji][0]}
          is_selected={selected_emoji === emoji}
        />
      )
    })  
    set_emoji_divs(filtered_emoji_divs)        
  }

  useEffect(() => {
    window.addEventListener(
      "keyup",
      debounce((e: KeyboardEvent) => {
        handle_typing(e)
      }, 250)
    ),
      window.addEventListener("keyup", (e: KeyboardEvent) => {
        handel_navigation(e)
      })
  }, [])

  useEffect(() => {
    set_selected_emoji(filtered_emojis[0])
  }, [filtered_emojis])

  useEffect(() => {
    set_filtered_emoji_divs()
  }, [selected_emoji])

  if (!emoji_divs.length) {
    return
  }

  return (
    <div
      id="easy_emoji_main_container"
      className="h-fit flex flex-col items-center"
      ref={setPopperElement}
      style={styles.popper}
      {...attributes.popper}>
      <div
        className="
      max-w-fit 
      bg-[#0F172A]
      text-blue-600
      rounded-lg
      flex flex-col p-1 select-none">
        <div
          id="easy_emoji_visible_emoji_container"
          className="grid grid-flow-row gap-y-2">
          {emoji_divs}
        </div>
      </div>
    </div>
  )
}

export default emoji_bar
