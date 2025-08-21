type FeatureCard={
    title: string
    description: string
    svg: string
}
export function FeatureCard({ title, description, svg }: FeatureCard) {
    
  return (
    <div className="flex flex-col items-center justify-center cursor-pointer transform hover:-translate-y-2 transition-time bg-white rounded-lg shadow-md w-full ">
      <div className="w-full h-[20vh] pt-4 sm:w-[30vh]">
        <img src={svg} alt={title} className="w-full h-full object-contain"  />
      </div>
      <h3 className="text-lg text-purple-800 font-bold text-center sm:text-left">{title}</h3>
      <p className="text-gray-600 p-5 px-7 text-start text-sm sm:text-base">{description}</p>
    </div>
  );
}