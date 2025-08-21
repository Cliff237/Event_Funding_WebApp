import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { Title1 } from "../../components/public/Title1"
import { FaCheckCircle, FaRegLightbulb, FaStarOfDavid } from "react-icons/fa"
import type { ReactElement } from "react"
import { FaHeartCircleBolt, FaUserGroup } from "react-icons/fa6"

type listProps = {
  text: string,
}

export function ListProps({ text }: listProps) {
  return (
    <motion.div 
      className="flex space-x-3 text-xl p-4 rounded bg-gray-800"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className="flex justify-center items-center"><FaCheckCircle size={30} color="purple" /></div>
      <span>{text}</span>
    </motion.div>
  )
}

type cardprops = {
  icon: ReactElement,
  title: string,
  text: string
}

export function Cardprops({ icon, title, text }: cardprops) {
  return (
    <motion.div 
      className="flex flex-col space-y-3 p-8 shadow-xl shadow-gray-300/40 bg-gray-100 rounded"
      initial={{ scale: 0.95 }}
      whileInView={{ scale: 1 }}
      transition={{ duration: 0.3 }}
      viewport={{ once: true }}
    >
      <div className="flex space-x-3">
        <div className="text-purple-900 text-4xl">{icon}</div>
        <div className="text-gray-900 flex text-2xl items-center font-bold">{title}</div>
      </div>
      <div className="text-gray-700">{text}</div>
    </motion.div>
  )
}

type teamCardProps = {
  profile: string,
  name: string,
  text: string,
}

export function TeamCard({ profile, name, text }: teamCardProps) {
  return (
    <motion.div 
      className="flex items-center w-full flex-col text-gray-800 space-y-3 px-2 py-8 rounded-xl shadow-sky-50/60 shadow-lg bg-gray-300"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
    >
      <div className="h-[25vh] w-[60vw] md:h-[30vh] md:w-[15vw] sm:w-[20vw]">
        <img className="h-full rounded-full w-full" src={`public/${profile}.jpg`} alt="" />
      </div>
      <h3 className="font-bold tracking-widest">{name}</h3>
      <center className="text-xl px-2">
        {text}
      </center>
    </motion.div>
  )
}

function About() {
  return (
    <div>
      <motion.section 
        className="flex flex-col lg:flex-row w-full h-fit bg-gray-100 mt-10 mb-8 px-4 sm:pb-8 pt-5"
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
            text={"Empowering Innovation for a Brighter Future In Cameroon"}
            subtext={
              "Our Mission is to build inyuitive,robust and scalable solutions that drive progresses"
            }
          />
          <motion.div 
            className="h-fit w-full flex sm:flex-row justify-center sm:justify-around gap-8 md:gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Link to='/SignUp'
              className="w-fit text-lg text-purple-50 font-bold px-12 py-3 bg-purple-800 border-4 rounded-3xl border-purple-800 hover:shadow-2xl hover:px-14 transition-all">
              Get Started
            </Link>
          </motion.div>
        </motion.div>

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
              src="public/people.png"
              alt=""
            />
          </motion.div>
        </motion.div>
      </motion.section>   

      <section className="w-full h-fit flex items-center flex-col mb-5 py-5 px-2">
        <motion.h2
          className="text-center text-purple-800 font-bold mb-8"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          Our Vision: Shaping Tomorrow's Digital Landscape
        </motion.h2>
        <motion.p 
          className="px-5 py-8 md:w-2/3 text-3xl bg-gray-200 rounded-xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          "The future belongs to those who innovate today, We are committed to building
          not just products, but pathways to a more connected and efficient world."
        </motion.p>
        <motion.div 
          className="flex flex-col md:grid md:grid-cols-2 gap-4 p-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
          viewport={{ once: true }}
        >
          <ListProps text="To be a global leader in transformative digital solutions."/>
          <ListProps text="To empower businesses with intelligent, scalable, and secure technologies."/>
          <ListProps text="To foster a culture of continuos learning and groundbreaking research."/>
          <ListProps text="To Create a positive impact on society through ethical and sustainable innovation."/>
        </motion.div>
      </section>   

      <section className="mb-8">
        <motion.h2
          className="text-center text-purple-800 font-bold mb-8"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          Our Core Values: The Pillars of Our Success
        </motion.h2>       
        <motion.div 
          className="md:grid md:grid-cols-2 md:gap-8 bg-gray-400/20 md:overflow-hidden p-6 flex overflow-x-scroll gap-4 px-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
          viewport={{ once: true }}
        >
          <Cardprops icon={<FaStarOfDavid/>} title={'Innovation'} 
            text="We continuosly explore new ideas and technologies to deliver groundbreaking solutions that redefine industry standards."/>
          <Cardprops icon={<FaRegLightbulb/>} title={'Creativity'} 
            text="We foster an environment where imagination thrives, encouraging unique perspectives to solve complex challenges with original thought."/>
          <Cardprops icon={<FaHeartCircleBolt/>} title={'Integrity'} 
            text="We uphold the highest ethical standards, ensuring transperency, honesty, and accountability in all our interactions."/>
          <Cardprops icon={<FaUserGroup/>} title={'Collaboration'} 
            text="We believe in the power of teamwork, fostering a supportive and inclusive environment where diverse talents unite to achieve shared goals."/>
        </motion.div> 
      </section>

      <section>
        <motion.h2
          className="text-center text-purple-800 font-bold mb-8"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          Meet Our Dynamic Team
        </motion.h2>  
        <motion.div 
          className="flex sm:grid sm:grid-cols-2 md:grid-cols-3 px-6 gap-6 bg-gray-800 sm:gap-y-10 py-12 overflow-x-scroll sm:overflow-hidden"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
          viewport={{ once: true }}
        >
          <TeamCard profile="I1" name="Cliff Momo" text="Mr Cliff Leads Our engineering efforts,specializing in scalable architectures and cutting-edge software development." />
          <TeamCard profile="A1 (1)" name="Mr Bitom Sup" text="With Over 10 years in tech leadership, Mr Bitom Sup our strategic vision and fosters a culture of innovation and excellence."/>
          <TeamCard profile="A1" name="Mrs Daina Chen" text="Chen is passionate about user-centric design, driving the development of intuitive and impactful products."/>
          <TeamCard profile="G1" name="Mr Derick Asane" text="Mr derick, our brand strategy, ensuring our message resonates effectively with our global audience. "/>
          <TeamCard profile="A1 (2)" name="Dame Noona" text="Lorem ipsum dolor sit amet consectetur adipisicing elit.Culpa ratione non, sit fugiat ducimus architecto repellat odit provid"/>
          <TeamCard profile="F1 (1)" name="Dame Albedo" text="Lorem ipsum dolor sit amet consectetur adipisicing elit.Culpa ratione non, sit fugiat ducimus architecto repellat odit provid"/>
        </motion.div>
      </section>
    </div>
  )
}

export default About