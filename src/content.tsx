import { debug } from "console"
import styleText from "data-text:style.css"
import emojis from "emojilib"
import type { PlasmoCSConfig, PlasmoGetStyle } from "plasmo"
import React, { useEffect, useState } from "react"
import { usePopper } from "react-popper"
import { EmojiDiv } from "@Components/emojiDiv"

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
  let curr_typed_emoji_name = "",
    user_stops_typing_timeout = null

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
    cursor_position: number,
    debug_mode: boolean = false
  ): string {
    if (!input) {
      return ""
    }
    if (debug_mode) {
     debug(`[get_partial_emoji_name] ${input} ${cursor_position}`) 
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

  function handle_navigation(event: KeyboardEvent) {
    if (!filtered_emojis.length || !selected_emoji) {
      return
    }
    const index = filtered_emojis.indexOf(selected_emoji)

    if (event.key === "ArrowDown") {
    
      event.preventDefault()
      event.stopPropagation()
      set_selected_emoji(filtered_emojis[(index+1) % filtered_emojis.length])      
    
    } else if (event.key === "ArrowUp") {
      
      event.preventDefault()
      event.stopPropagation()
      set_selected_emoji(filtered_emojis[index - 1 < 0 ? filtered_emojis.length - 1 : index -1])
    } else if (event.key === "Escape") {
      event.stopPropagation()
      event.preventDefault()
      set_filtered_emojis([])
      set_selected_emoji("")
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
    if (partial_name === curr_typed_emoji_name) {
      return
    }
    curr_typed_emoji_name = partial_name
    // debug(`[handle_typing] ${partial_name}`)
    set_filtered_emojis(get_filtered_emojis(partial_name))
  }

  function handle_keyup(event: KeyboardEvent) {
    debug(`[handle_keyup] ${event.key}`)
    
    clearTimeout(user_stops_typing_timeout)
    user_stops_typing_timeout = setTimeout(() => {
      handle_typing(event)
    }, 250)
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
    window.addEventListener("keyup", handle_keyup)
  }, [])

  useEffect(() => {
    const hook_event = "keydown"
    window.addEventListener(hook_event, handle_navigation, { capture: true })
    return () => {
      window.removeEventListener(hook_event, handle_navigation, { capture: true })
    }
  })

  useEffect(() => {
    set_selected_emoji(filtered_emojis[0])
  }, [filtered_emojis])

  useEffect(() => {
    debug(`[useEffect] New Emoji set ${selected_emoji}`)
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
