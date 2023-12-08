import "style.css"

function IndexOptions() {
  
    return (
    <div className="bg-slate-900 flex flex-col px-2 py-1  w-72 text-slate-300 gap-y-3 text-sm"> 
        <div className="font-bold">See options page to change identifier</div>
        <div className="flex flex-col">
            <span>Made with ❤️ by <a className="underline" href="https://github.com/p0lygun" target="_blank">gala_vs</a></span>
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
