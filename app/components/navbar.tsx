"use client";

import React, { useEffect, useState } from 'react'
import Image from 'next/image'

function Navbar() {

  const [isScroll, setIsScroll] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    window.addEventListener('scroll', () => {
      setIsScroll(scrollY > 50)
    })
  }, [])

  return (
    <>
      {/* NAVBAR */}
      <nav className={`
        w-full fixed px-5 lg:px-8 xl:px-[8%] py-4 
        flex items-center justify-between z-50 transition-all duration-300
        ${isScroll
          ? "bg-gray-900/60 backdrop-blur-xl border-b border-gray-700/50"
          : "bg-transparent"
        }
      `}>

        {/* LOGO */}
        <a href="#top">
          <Image 
            src="/aq_u.png" 
            alt="Logo" 
            width={100} 
            height={50}
            className="
              w-20 sm:w-15 md:w-18 lg:w-25 
              h-auto cursor-pointer mr-6 md:mr-14
            " 
          />
        </a>

        {/* DESKTOP MENU */}
        <ul className="
          hidden md:flex items-center gap-6 lg:gap-8 rounded-full px-12 py-3
          bg-gray-800/60 backdrop-blur-xl border border-gray-700/50
          text-gray-200 shadow-lg
        ">
          <li><a className="hover:text-blue-400 transition" href="#top">Home</a></li>
          <li><a className="hover:text-blue-400 transition" href="#about">About me</a></li>
          <li><a className="hover:text-blue-400 transition" href="#services">Services</a></li>
          <li><a className="hover:text-blue-400 transition" href="#work">My Work</a></li>
          <li><a className="hover:text-blue-400 transition" href="#contact">Contact me</a></li>
        </ul>

        {/* MOBILE MENU BUTTON */}
        <button 
          className="block md:hidden ml-3 hover:bg-blue-500/30 p-2 rounded-lg transition"
          onClick={() => setIsMenuOpen(true)}
        >
          <Image 
            src="/menu-black.png" 
            alt=""
            width={40}
            height={40}
            className="w-5 sm:w-6 h-auto invert" 
          />
        </button>
      </nav>

      {/* MOBILE MENU PANEL */}
      <ul className={`
        fixed top-0 right-0 bottom-0 w-64 h-screen z-50
        bg-gray-900/90 backdrop-blur-xl border-l border-gray-700/50
        flex flex-col gap-6 py-20 px-10 text-gray-200
        transition-transform duration-500
        md:hidden
        ${isMenuOpen ? "translate-x-0" : "translate-x-full"}
      `}>

        {/* CLOSE BUTTON */}
        <div 
          className="absolute right-6 top-6 cursor-pointer"
          onClick={() => setIsMenuOpen(false)}
        >
          <Image 
            src="/close-black.png" 
            alt=""
            width={30}
            height={30}
            className="w-4 sm:w-5 h-auto invert" 
          />
        </div>

        <li><a onClick={() => setIsMenuOpen(false)} href="#top" className='hover:text-blue-400'>Home</a></li>
        <li><a onClick={() => setIsMenuOpen(false)} href="#about" className='hover:text-blue-400'>About me</a></li>
        <li><a onClick={() => setIsMenuOpen(false)} href="#services" className='hover:text-blue-400'>Services</a></li>
        <li><a onClick={() => setIsMenuOpen(false)} href="#work" className='hover:text-blue-400'>My Work</a></li>
        <li><a onClick={() => setIsMenuOpen(false)} href="#contact" className='hover:text-blue-400'>Contact me</a></li>

      </ul>
    </>
  )
}

export default Navbar
