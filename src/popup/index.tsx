import emojis from "emojilib"
import "style.css"


function IndexOptions() {
  
    const emoji_keys = Object.keys(emojis),
        random_emoji = emoji_keys[emoji_keys.length*Math.random() << 0];
    return (
    <div className="bg-slate-900 flex flex-col items-center w-72 text-slate-300 mt-2 gap-y-1 text-sm"> 
        {/* <div className="font-bold px-2">See options page to change identifier</div> */}
        <div className="flex flex-col bg-slate-800 items-center text-xs w-full pt-2">
            <span>Made with ❤️ by <a className="underline" href="https://github.com/p0lygun" target="_blank">gala_vs</a></span>
            <div className="text-[0.6]">{emoji_keys.length} emojis available. {random_emoji}</div>
            
            <span className="text-[0.5rem] flex flex-row gap-x-1">
                    <span>Support the project at</span>
                    <a href="https://github.com/p0lygun/easy-emoji" target="_blank" className="text-pink-500 font-bold">Github</a>
                    |
                    <a href="https://ko-fi.com/gala_vs" target="_blank" className="text-pink-500 font-bold">Kofi</a>
            </span>
        </div>
    </div>
  )
}

export default IndexOptions
