import { useState } from "react";
import { motion } from "framer-motion";
import { ReligiousEvents, SchoolEvents, SocialEvents } from "../../components/Organizer/Events/EventsCategory";
import Modal from "../../components/Organizer/Modal";
import { useNavigate } from "react-router-dom";



function CreateEvent() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Card animation variants
  const cardVariants = {
    hover: { scale: 1.03 },
    tap: { scale: 0.98 }
  };

  // Form field animation
  const formItem = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        type: "spring",
        stiffness: 100
      }
    })
  };

  // Add this to your component
const [selectedSchool, setSelectedSchool] = useState('');

// School data (could also come from an API)
const schools = {
  iai: {
    name: "IAI - International Academy of Innovation",
    logo: "public/A1.jpg"
  },
  harvard: {
    name: "Harvard University",
    logo: "/path-to-harvard-logo.png"
  },
  mit: {
    name: "MIT",
    logo: "/path-to-mit-logo.png"
  },
  stanford: {
    name: "Stanford University",
    logo: "/path-to-stanford-logo.png"
  }
};

 // Form submission
 const navigate = useNavigate()
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/CustomEvent')
    // if (validateForm()) {
    //    Form is valid, proceed with submission
    //   console.log('Form submitted:', { ...formData, profileImage });
    //    Here you would typically send the data to your backend
    //   alert('Account created successfully!');
    // }
  };
const handleSchoolChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const schoolId = e.target.value;
  setSelectedSchool(schoolId);
  
  const logoElement = document.getElementById('school-logo') as HTMLImageElement;
  const nameElement = document.getElementById('school-name');
  
  if (schoolId && schools[schoolId as keyof typeof schools]) {
    const school = schools[schoolId as keyof typeof schools];
    logoElement.src = school.logo;
    if (nameElement) {
      nameElement.textContent = school.name;
    }
  } else {
    logoElement.src = '';
    if (nameElement) {
      nameElement.textContent = '';
    }
  }
};

  return (
    <div className="h-screen w-full overflow-y-auto px-5">
      {/* Hero Section */}
      <motion.section 
        className="w-full h-fit mt-5 md:mt-0"
      >
        <div className="md:flex mt-2 flex-col p-8 rounded-xl bg-gray-500/30">
          <h3 className="font-bold text-3xl sm:text-4xl text-purple-900 mb-8 tracking-widest">
            Create Your Event & Start Collecting Contributions
          </h3>
          <span className="text-gray-300 font-semibold text-2xl leading-10">
            "Create your custom event in just a few steps. Whether it's a wedding, school fundraiser, or community project — we've got you covered."
          </span>
        </div>
      </motion.section>

      {/* Events Sections */}
      <motion.section 
        className="flex flex-col mt-10 space-y-5"
      >
        {/* Social Events */}
        <div className="w-full h-fit py-5">
          <span className="w-full h-fit p-2 border-b-4 border-l-4 border-purple-700 rounded-2xl pr-10 text-3xl font-semibold">
            Social Event
          </span>
          <div className="grid gap-4 grid-cols-2 md:grid-cols-5 mt-8">
            {SocialEvents.map((event, id) => (
              <motion.div
                key={id}
                whileHover="hover"
                whileTap="tap"
                variants={cardVariants}
                className="flex flex-col justify-center items-center space-y-3 h-35 w-full rounded-xl bg-gray-300/20 p-4"
              >
                <div className="">
                  <event.icon className="text-5xl text-purple-800" />
                </div>
                <span className="text-center font-medium">{event.name}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Religious Events */}
        <div className="w-full h-fit py-5">
          <span className="w-fit h-fit p-2 border-b-4 border-l-4 border-purple-700 rounded-2xl pr-10 text-3xl font-semibold">
            Religious Events
          </span>
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-5 mt-8">
            {ReligiousEvents.map((event, id) => (
              <motion.div
                key={id}
                whileHover="hover"
                whileTap="tap"
                variants={cardVariants}
                className="flex flex-col justify-center items-center space-y-3 h-35 w-full rounded-xl bg-gray-300/20 p-4"
              >
                <div className="">
                  <event.icon className="text-5xl text-purple-800" />
                </div>
                <span className="text-center font-medium">{event.name}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* School Events */}
        <div className="w-full h-fit py-5">
          <span className="w-fit h-fit p-2 border-b-4 border-l-4 border-purple-700 rounded-2xl pr-10 text-3xl font-semibold">
            School Events
          </span>
          <div className="grid gap-4 grid-cols-2  sm:grid-cols-5 mt-8">
            {SchoolEvents.map((event, id) => (
              <motion.div
                key={id}
                whileHover="hover"
                whileTap="tap"
                variants={cardVariants}
                onClick={() => {
                  if (event.name === "School event") {
                    setIsModalOpen(true);
                  }
                }}
                className={`flex flex-col justify-center items-center space-y-3 h-35 w-full rounded-xl bg-gray-300/20 p-4 ${
                  event.name === "School event" ? "cursor-pointer" : ""
                }`}
              >
                <div className="">
                  <event.icon className="text-5xl text-purple-800" />
                </div>
                <span className="text-center font-medium">{event.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* School Event Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                
        {/* School Logo Preview */}
        <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="my-2 flex flex-col  w-full justify-center items-center "
        >
        <div className="w-18 h-18 bg-gray-100 rounded-full flex  items-center justify-center overflow-hidden mr-3">
            {/* Logo will appear here when school is selected */}
            <img 
            id="school-logo" 
            className="w-full h-full object-contain"
            />
        </div>
        <span id="school-name" className="font-medium text-gray-700"></span>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          className="space-y-6"   >
            <motion.form className="space-y-6" onSubmit={handleSubmit} >
                {/* School Selection */}
                <motion.div
                    custom={1}
                    variants={{formItem}}
                >
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Your School
                    </label>
                    <div className="relative">
                        <select
                        onChange={handleSchoolChange}
                        value={selectedSchool}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent appearance-none"
                        >
                        <option value="">Select a school</option>
                        {Object.entries(schools).map(([id, school]) => (
                        <option key={id} value={id}>{school.name}</option>
                        ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>

                </motion.div>

                {/* Email Field */}
                <motion.div
                    custom={2}
                    variants={{formItem}}
                >
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Customizer Name
                    </label>
                    <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    placeholder="Joe237"
                    />
                </motion.div>

                {/* Password Field */}
                <motion.div
                    custom={3}
                    variants={{formItem}}
                >
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                    </label>
                    <input
                    type="password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    placeholder="••••••••"
                    />
                </motion.div>

                {/* Buttons */}
                <motion.div
                    custom={4}
                    variants={{formItem}}
                    className="flex"
                >
                    <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex-1 bg-purple-700 text-white py-2 px-4 rounded-lg font-medium"
                    >
                    Get Started
                    </motion.button>
                </motion.div>
            </motion.form>
            </motion.div>
      </Modal>
    </div>
  );
}

export default CreateEvent;