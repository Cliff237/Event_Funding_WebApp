import { PcStep } from "./pcStep";
import { MobileStep } from "./mobileStep";

function HowItWorks() {
    
  return (
    <div className="flex flex-col h-fit w-full px-4">
        <h2
        className="font-bold text-center text-purple-800 mb-4"
        >How It Works: Simple Steps
        </h2>
        <h3 className="text-center text-white mb-2 font-semibold">
            Getting Started with our event contribution link is quick and intuitive. Follow These Easy Steps to success.
        </h3>

        {/* mobile only */}
        <MobileStep/>
        {/* pc-only */}
        <PcStep/>
  
    </div>
  )
}

export default HowItWorks


 