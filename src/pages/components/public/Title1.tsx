interface Title1{
    text?:String
    subtext?:String
}
export function Title1({text,subtext}:Title1){
    return (
    <div className="w-full h-full ">
        <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-orange-300 to-purple-700
         font-extrabold ms:text-6xl text-5xl leading-18">{text}</h1>
         <div className="w-[70%]">
            <span className="text-2xl font-bold text-gray-600 ">{subtext}</span>
         </div>
    </div>
    )
}