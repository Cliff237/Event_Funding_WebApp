import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";
import { FeatureCard } from "../../components/public/feature-card";
import { Title1 } from "../../components/public/Title1";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import HowItWorks from "../../components/public/HowItWorks";

 const features = [
  {
    title: "Create Events",
    description: "Easily create and customize your contribution event.",
    svg:"public/research-paper-animate.svg"
  },
  {
    title:"Share Contribution Links",
    description:"Generate unique links to easily share your event via WhatsApp, email, or SMS",
    svg:"public/Cloud sync-pana.svg"
  },
  {
    title: "Track Payments in Real Time",
    description: "Stay updated with live dashboards showing how much has been contributed, by whom, via which method and when.",
    svg:"public/payment-information-animate.svg"
  },
  {
    title:"Generate Reports & Proof",
    description: "Download PDF reports or share receipts with contributors for transparency and accountability",
    svg:"public/Data report-amico.svg"

  },
  {
    title: "Time-Locked Savings",
    description: "Optionally lock funds until a specific event date, giving you peace of mind before withdrawing",
    svg:"public/save time-amico.svg"
  },  
  {
    title: "Track Payments in Real Time",
    description: "Stay updated with live dashboards showing how much has been contributed, by whom, via which method and when.",
    svg:"public/payment-information-animate.svg"
  },
];

function getItemsPerPage() {
  if (typeof window !== 'undefined') {
    return window.innerWidth < 640 ? 1 : 3;
  }
  return 3;
}

function Home() {
  useEffect(() => {
    AOS.init({ duration: 2000 });
  }, []);
  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(getItemsPerPage());

  useEffect(() => {
    function handleResize() {
      setItemsPerPage(getItemsPerPage());
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalPages = Math.ceil(features.length / itemsPerPage);

  const handleNext = () => {
    setPage((prev) => (prev + 1) % totalPages);
  };

  const handlePrev = () => {
    setPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const currentItems = features.slice(
    page * itemsPerPage,
    page * itemsPerPage + itemsPerPage
  );

  return (
    <>
      {/* Hero Section with enhanced animations */}
      <motion.section 
        className="flex flex-col lg:flex-row w-full h-fit lg:h-[80vh] bg-gray-100 mt-10 mb-8 px-4 sm:pb-8 pt-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="flex flex-col justify-center w-full h-full gap-6"
          initial={{ x: -50 }}
          animate={{ x: 0 }}
          transition={{ type: "spring", stiffness: 60 }}
        >
          <Title1
            text={"Empowering Event Contributions in Cameroon"}
            subtext={
              "Easily create events, invite contributors, and manage funds securely and easily"
            }
          />
          <motion.div 
            className="h-fit w-full flex sm:flex-row justify-center sm:justify-around gap-8 md:gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Link to='/SignUp'
              className="w-fit text-lg text-purple-50 font-bold px-6 md:px-12 py-3 bg-purple-800 border-4 rounded-3xl border-purple-800 hover:shadow-2xl hover:px-14 transition-all">
              Get Started
            </Link>
            <Link to='/'
              className="w-fit text-lg text-purple-800 font-bold px-6 md:px-12 py-3 border-4 rounded-3xl border-purple-800 hover:shadow-2xl hover:px-14 transition-all">
              View Demo
            </Link>
          </motion.div>
        </motion.div>

        {/* Illustration with zoom effect */}
        <motion.div 
          className="w-full relative mt-10 lg:mt-0"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
        >
          <motion.div 
            className="clip h-full w-full bg-purple-200/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          />
          <motion.div 
            className="absolute w-full z-10 inset-0"
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", delay: 0.3 }}
          >
            <img
              className="w-full h-full object-contain"
              src="public/data-extraction-animate.svg"
              alt="Event contribution illustration"
            />
          </motion.div>
        </motion.div>
      </motion.section>
      
      {/* Features Section with enhanced carousel */}
      <motion.section 
        className="w-full h-fit mb-5 p-5"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <motion.h1 
          className="text-center font-bold text-2xl sm:text-5xl md:text-4xl text-purple-800"
          initial={{ y: 20 }}
          whileInView={{ y: 0 }}
          transition={{ type: "spring" }}
        >
          Key Features Designed for You
        </motion.h1>
        <motion.div 
          className="w-full flex justify-center font-semibold text-center mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span className="md:w-1/2 md:text-lg">Our platform is built to make event contributions simple, secure, and stress-free for everyone involved</span>
        </motion.div>
        
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-6"
            >
              {currentItems.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0.95 }}
                  whileInView={{ scale: 1 }}
                  transition={{ type: "spring", delay: index * 0.1 }}
                >
                  <FeatureCard
                    title={feature.title}
                    description={feature.description}
                    svg={feature.svg}
                  />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          <motion.div 
            className="flex justify-center mt-6 gap-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <motion.button
              onClick={handlePrev}
              className="px-4 py-2 bg-purple-700 rounded-full hover:bg-purple-800 flex items-center justify-center"
              aria-label="Previous"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaChevronLeft size={20} color="black" />
            </motion.button>
            
            {/* Pagination Dots */}
            <motion.div 
              className="flex gap-2 items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {Array.from({ length: totalPages }).map((_, idx) => (
                <motion.span
                  key={idx}
                  className={`w-3 h-3 rounded-full ${page === idx ? 'bg-purple-800' : 'bg-gray-300'} inline-block`}
                  whileHover={{ scale: 1.3 }}
                />
              ))}
            </motion.div>
            
            <motion.button
              onClick={handleNext}
              className="px-4 py-2 bg-purple-700 rounded-full hover:bg-purple-800 flex items-center justify-center"
              aria-label="Next"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaChevronRight size={20} color="black"/>
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section 
        className="w-full h-fit mt-8 mb-5"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <HowItWorks/>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="h-fit w-full px-5 mt-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ type: "spring" }}
      >
        <div className="bg-gray-500/20 h-fit w-full felx flex-col justify-center items-center rounded px-3 py-6">
          <motion.h2
            className="font-bold text-center text-purple-800 mb-8"
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
            transition={{ type: "spring" }}
          >
            Ready to simplify Your Event Contributions?
          </motion.h2>
          <motion.h3 
            className="text-center text-white mb-8 font-semibold"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Join thousands who trust us to manage their group funds for every occasion, from school 
            projects to family milestones.
          </motion.h3>
          <motion.div 
            className="flex w-full justify-center pb-12 pt-4"
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.3 }}
          >
            <Link to='/SignUp'
              className="w-fit h-fit bg-purple-800 text-gray-50 text-2xl rounded-xl px-12 py-5 hover:shadow-xl transition-all">
              Get Started Now
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </>
  );
}

export default Home;


