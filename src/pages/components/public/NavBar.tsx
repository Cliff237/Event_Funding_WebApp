

import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaFacebook, FaInstagram, FaTwitter, FaWhatsapp } from 'react-icons/fa';
import Aos from 'aos';

export default function Navbar() {
    useEffect(() => {
      Aos.init({ duration: 2000 });
    }, []);
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const navLinks = [
    { name: 'AboutUs', path: '/AboutUs' },
    { name: 'Testimonial', path: '/Testimonial' },
    { name: 'How it Works', path: '/how-it-works' },
    { name: 'Contact Us', path: '/ContactUs' },
  ];

  return (
    <nav className="w-full bg-gray-50 shadow-md fixed top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center" data-aos="fade-in">
        <NavLink to="/"
          className='font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-orange-300 to-purple-700'>
          <span className=' text-3xl '>Shaderl</span>
          <i className='text-xl '>Pay</i>
        </NavLink>

        {/* Links - Desktop */}
        <div className="hidden md:flex space-x-6 items-center">
          {navLinks.map((link) => (
          <NavLink
            key={link.name}
            to={link.path} className={({isActive})=>` py-2 px-2 transition-time rounded-2xl
            nav-link ${isActive ? 'active-nav-link' : 'text-purple-900 font-bold'}`}>
            {link.name} 
            </NavLink> 
          ))}
        </div>
    
        {/* Hamburger - Mobile */}
        <div className=" md:flex  space-x-4 items-center ">
          <Link
            to="/logIn"
            className=" border-purple-800 border-3  text-purple-800 md:px-7 hover:px-10  px-4 py-2 rounded hover:bg-purple-700 font-bold hover:text-white transition-time"
          >
           LogIn
          </Link>
          <Link to="/SignUp" className=" bg-purple-800 text-white-800 md:px-7 hover:px-10 px-4 py-2 rounded hover:text-white font-bold transition-time">
            SigUp
          </Link>
          <button onClick={toggleMenu} className='text-gray-800 md:hidden '>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>


      {/* Mobile Menu + Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* clossed the  slide bar  */}
            <motion.div
              className="fixed inset-0 bg-black/10 z-40"
              onClick={closeMenu}
            />

            {/* Slide-in Menu */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 right-0 w-64 h-full bg-gray-900 shadow-lg z-50 p-6 space-y-10 md:hidden"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside menu
            >
              <div className="flex justify-end">
                <button onClick={closeMenu}>
                  <X size={30} />
                </button>
              </div>

              <div className="flex flex-col space-y-6 ">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className="text-lg"
                    onClick={closeMenu}
                  >
                    {link.name}
                  </Link>
                ))}
                <hr />
              <div className="flex justify-around items-center ">
                <FaFacebook size={30} color="blue"/>
                <FaWhatsapp size={30} color="greenyellow"/>
                <FaInstagram size={30} color="pink"/>
                <FaTwitter size={30} color="cyan"/>
              </div>
              </div>
            </motion.div>

          </>
        )}
      </AnimatePresence>
    </nav>
  );
}

