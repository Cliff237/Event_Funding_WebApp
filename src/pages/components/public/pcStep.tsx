import { motion } from "framer-motion";

const featureSteps = [
  {
    id: 1,
    title: "Create Your Event Page",
    description:
      "Start By defining your event, setting contribution goals, and personalizing your page with images and details.",
    image: "public/Landing page-amico.svg",
  },
  {
    id: 2,
    title: "Share Your Unique Link",
    description:"Once ready, easily share your event's unique contribution link via social media, email, or messaging apps.",
    image: "public/Cloud sync-pana.svg",
  },
  {
    id: 3,
    title: "Receive Contributions",
    description:"Contributors can securely make payments with just a few clicks. directly to your designated account.",
    image: "public/e-wallet-animate.svg",
  },
  {
    id: 4,
    title: "Track Transactions",
    description:"Customizers can actively monitor all financial transaction With the posibility to generate reports ",
    image: "public/QA engineers-amico.svg",
  },
];


export function PcStep(){
    return (
        <div className="hidden md:flex flex-col bg-gray-900/50 px-4 py-8 pb-15">
            {featureSteps.map((step,index) => (
                <motion.div
                    key={index}
                    className={`h-[50vh] w-full mb-15 pl-8 flex ${
                        index % 2 === 1 ? 'flex-row-reverse' : ''
                    }`}
                    initial={{ opacity: 0 }}
                    whileInView={{ 
                        opacity: 1,
                        transition: {
                            duration: 0.8,
                            delay: index * 0.15
                        }
                    }}
                    viewport={{ once: true, margin: "-100px" }}
                >
                    {/* Image container */}
                    <motion.div 
                        className="w-1/2 relative"
                        initial={{ scale: 0.9, x: index % 2 === 0 ? -50 : 50 }}
                        whileInView={{ 
                            scale: 1,
                            x: 0,
                            transition: {
                                type: "spring",
                                stiffness: 60,
                                delay: index * 0.15 + 0.2
                            }
                        }}
                        viewport={{ once: true }}
                    >
                        <motion.div 
                            className="clip2 h-full w-full bg-purple-400/60"
                            initial={{ opacity: 0 }}
                            whileInView={{ 
                                opacity: 1,
                                transition: { delay: index * 0.15 + 0.4 }
                            }}
                        />
                        <motion.img 
                            src={step.image} 
                            alt="" 
                            className="h-full w-full object-contain absolute z-10 inset-0"
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ 
                                opacity: 1,
                                scale: 1,
                                transition: { 
                                    type: "spring",
                                    delay: index * 0.15 + 0.3
                                }
                            }}
                        />
                    </motion.div>

                    {/* Content container */}
                    <motion.div 
                        className="w-1/2 h-full px-6 relative pb-8 border-l-6 border-purple-800 rounded-b-2xl"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ 
                            opacity: 1,
                            y: 0,
                            transition: {
                                delay: index * 0.15 + 0.1
                            }
                        }}
                    >
                        {/* Number badge - now remains visible permanently after animating */}
                        <motion.div
                            className="absolute top-0 left-[-5.3%] px-4 py-2 text-3xl bg-purple-800 text-white font-bold rounded-full"
                            initial={{ scale: 0 }}
                            animate={{ 
                                scale: 1,
                                transition: {
                                    type: "spring",
                                    stiffness: 200,
                                    delay: index * 0.15 + 0.4
                                }
                            }}
                        >
                            {step.id}
                        </motion.div>

                        {/* Rest of your content remains the same */}
                        <motion.div className="flex">
                            <h2 className="text-purple-800 font-bold">
                                {step.title}
                            </h2>
                        </motion.div>

                        <motion.div 
                            className="w-full h-[40vh] pb-4 relative"
                            initial={{ opacity: 0 }}
                            whileInView={{ 
                                opacity: 1,
                                transition: { delay: index * 0.15 + 0.3 }
                            }}
                        >
                            <motion.div 
                                className="clip h-full w-full bg-purple-800/50"
                                initial={{ scaleY: 0 }}
                                whileInView={{ 
                                    scaleY: 1,
                                    transition: { 
                                        type: "spring",
                                        delay: index * 0.15 + 0.2,
                                        stiffness: 50
                                    }
                                }}
                            />
                            <motion.div 
                                className="absolute w-full z-10 inset-0 text-xl text-gray-300 font-semibold py-6 leading-8 md:leading-loose"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ 
                                    opacity: 1,
                                    y: 0,
                                    transition: { delay: index * 0.15 + 0.5 }
                                }}
                            >
                                {step.description}
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </motion.div>
            ))}
        </div>
    )
}