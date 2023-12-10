import { debug } from "console"
import { usePopper } from 'react-popper';
import styleText from "data-text:style.css"
import emojis from "emojilib"
import type { PlasmoCSConfig, PlasmoGetStyle } from "plasmo"
import { ReactElement, useEffect, useState } from "react"

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
  const [emoji_divs, set_emoji_divs] = useState(get_emoji_divs)
  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'auto',
    modifiers: [
      { name: 'offset', options: { offset: [8, 8] } },
    ],
  });

  function get_emoji_divs(
    partial_emoji_name?: string,
    max_divs: number = 10
  ): Array<ReactElement> {
    if (!partial_emoji_name || partial_emoji_name.length < 2) {
      return []
    }
    const filtered_emoji_divs = []
    Object.keys(emojis).forEach((emoji) => {
      const emoji_name = emojis[emoji][0]
      if (emoji_name.includes(partial_emoji_name)) {
        filtered_emoji_divs.push(
          <div key={emoji} className="flex flex-row transition duration-200 gap-x-2" data-emoji-selected="false">
            <div className="cursor-pointer">{emoji}</div>
            <div className="text-sky-400 font-mono font-medium text-sm leading-6">:{emoji_name}:</div>
          </div>
        )
      }      
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

  function get_shadow_root() {
    return document.getElementsByTagName("plasmo-csui")[0].shadowRoot
  }
  function set_selected_emoji(event?: KeyboardEvent) {
    const easy_emoji_visible_emoji_container = get_shadow_root().getElementById(
        "easy_emoji_visible_emoji_container"
      ),
      selected_emoji_css_class =
        " bg-gradient-to-r from-sky-400 -from-5% via-transparent "

    if (!easy_emoji_visible_emoji_container) {
      return
    }

    const selected_emoji = easy_emoji_visible_emoji_container.children[0]
    debug("[set_selected_emoji]", selected_emoji)
    if (selected_emoji.getAttribute("data-emoji-selected") == "false") {
      selected_emoji.className += selected_emoji_css_class
      selected_emoji.setAttribute("data-emoji-selected", "true")
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
    set_emoji_divs(get_emoji_divs(partial_name))
  }
  useEffect(() => {
    window.addEventListener(
      "keyup",
      debounce((e: KeyboardEvent) => {
        handle_typing(e)
      }, 250)
    )
  }, [])

  // useEffect(() => {
  //   set_selected_emoji()
  // }, [emoji_divs])
  if (!emoji_divs.length) {
    return
  }

  return (
    <div
      id="easy_emoji_main_container"
      className="h-fit flex flex-col items-center"
      ref={setPopperElement} style={styles.popper} {...attributes.popper}
      >
      <div
        className="
      max-w-fit 
      bg-[#0F172A]
      text-blue-600
      rounded-lg
      flex flex-col p-1 select-none">
        <div
          id="easy_emoji_visible_emoji_container"
          className="flex flex-col">
          {emoji_divs}
        </div>
      </div>
    </div>
  )
}

export default emoji_bar
