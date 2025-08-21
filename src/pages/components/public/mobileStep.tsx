import { motion } from "framer-motion";

const featureSteps = [
  {
    id: 1,
    title: "Create Your Event Page",
    description:
      "Start By defining your event, setting contribution goals, and personalizing your page with images and details.",
  },
  {
    id: 2,
    title: "Share Your Unique Link",
    description:"Once ready, easily share your event's unique contribution link via social media, email, or messaging apps.",
  },
  {
    id: 3,
    title: "Receive Contributions",
    description:"Contributors can securely make payments with just a few clicks. directly to your designated account.",
  },
  {
    id: 4,
    title: "Track Transactions",
    description:"Customizers can actively monitor all financial transaction With the posibility to generate reports ",
  },
];

export function MobileStep(){
    return(
        <div className="md:hidden flex flex-col bg-gray-900/50 pl-10 py-8 px-2 pb-15">
        {featureSteps.map((step,index) => (
            <motion.div
                className="mb-8"
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ 
                    opacity: 1,
                    y: 0,
                    transition: {
                        delay: index * 0.15 + 0.1
                    }
                }}
            >
                <div className="px-4 py-2 text-3xl bg-purple-800 text-white font-bold rounded-full"  >
                    {step.id}
                </div>

                {/* Content section with staggered children */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    variants={{
                        hidden: {},
                        visible: {
                            transition: {
                                staggerChildren: 0.1,
                                delayChildren: index * 0.2
                            }
                        }
                    }}
                    viewport={{ once: false }}
                >
                    <motion.div 
                        variants={{
                            hidden: { opacity: 0, y: 10 },
                            visible: { opacity: 1, y: 0 }
                        }}
                        className="w-full flex justify-start py-2 pl-8 relative h-fit border-l-4 border-purple-800"
                    >
                        <h2 className="font-bold text-purple-800">{step.title}</h2>
                    </motion.div>

                    <motion.div
                        variants={{
                            hidden: { opacity: 0, x: 10 },
                            visible: { opacity: 1, x: 0 }
                        }}
                        className="h-fit w-full border-l-4 border-purple-800 rounded-b-3xl px-4 py-6 font-semibold text-gray-400 text-2xl leading-relaxed"
                    >
                        {step.description}
                    </motion.div>
                </motion.div>
            </motion.div>
        ))}
        </div>
    )
}