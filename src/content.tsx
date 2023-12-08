import styleText from "data-text:style.css"
import emojis from "emojilib"
import type { PlasmoGetStyle } from "plasmo"
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';


export const getStyle: PlasmoGetStyle = () => {
  const style = document.createElement("style")
  style.textContent = styleText
  return style
}

const emoji_bar = () => {
  const emoji_divs = []

  Object.keys(emojis).forEach((emoji) => {
    emoji_divs.push(
        <Tippy content={emojis[emoji][0]}>
            <div className="cursor-pointer">{emoji}</div>
        </Tippy>
    )
  })
  return (
    <div className="fixed bottom-0 h-fit w-full bg-gray-600 flex flex-row text-4xl overflow-hidden p-1 select-none">
      {emoji_divs}
    </div>
    
  )
}
export default emoji_bar
