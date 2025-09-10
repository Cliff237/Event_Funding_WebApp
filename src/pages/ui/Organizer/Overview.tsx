import { motion, type Variants } from 'framer-motion';
import OverviewWallet from '../../components/OverviewWallet';
import OverviewRightSideBar from '../../components/Organizer/OverviewRightSideBar';
import OverviewStat from '../../components/Organizer/OverviewStat';
function OverviewPage() {

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {y: 0,opacity: 1,
      transition: { type: "spring", stiffness: 100
      }
    }
  }satisfies Variants;


  return (
    
    <div className="h-screen overflow-y-auto w-ful overflow-x-hidden">
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 py-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Section */}
        <motion.div 
          className="flex items-center justify-between mb-8 rounded-xl bg-gray-100 shadow-lg"
          variants={itemVariants}
        >
          <div className='p-3'>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-800 to-indigo-900 bg-clip-text text-transparent">
              Welcome Mr Bitom to Your Dashboard Overview
            </h1>
            <p className="text-gray-600 mt-2">Monitor your events and platform performance</p>
          </div>

        </motion.div>

        {/* Quick Stats  */}
        <OverviewStat/>

        {/* Event Wallet Section  */}
        <motion.div 
          className="flex flex-col  md:flex-row items-center justify-between mb-8 md:mb-0 rounded-xl bg-white px-3 shadow-lg"
          variants={itemVariants}
        >
          <div className="  border border-white/50 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Event Wallets</h2>
                <p className="text-gray-600">Track contributions across all events</p>
              </div>
            </div>

            <OverviewWallet/>
          </div>
        {/* right side bar  */}
        <OverviewRightSideBar/>
        </motion.div>
      </motion.div>
      
    </div>
  )
}

export default OverviewPage
