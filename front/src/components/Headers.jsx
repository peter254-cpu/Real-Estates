import { FaSearch } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import React from "react";


const Headers = () => {
    const [isOpen, setIsOpen] = useState(false)
    const toggleMenu = () => setIsOpen(prevIsOpen => !prevIsOpen)
    const { currentUser } = useSelector((state) => state.user)
    const [searchTerm, setSearchTerm] = useState('')
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('searchTerm', searchTerm);
        const searchQuery = urlParams.toString()
        navigate(`/search?${searchQuery}`);
    }
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)
        const searchTermFromUrl = urlParams.get('searchTerm');
        if(searchTermFromUrl){
            setSearchTerm(searchTermFromUrl)
        }
    }, [location.search])

  return (
   <header className="bg-slate-300 shadow-md fixed w-full top-0 z-10">
    <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <h1 className="font-bold  text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-800">Realest</span>
            <span className="text-slate-800">Estate</span>
        </h1>
        <form onSubmit = {handleSubmit} className="bg-slate-100 p-3 rounded-lg flex items-center">
            <input 
                type="text" 
                placeholder="Search..." 
                className="bg-transparent focus:outline-none w-24 sm:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button>
                <FaSearch  className='text-slate-400' />
            </button>
        </form>
        <div className='hidden xl:block'>
            <ul className='flex gap-4'>
                <Link to='/' >
                    <li className='hidden sm:inline text-slate-700 hover:underline'>Home</li>
                </Link>
                <Link to="/about">
                    <li className='hidden sm:inline text-slate-700 hover:underline'>About</li>
                </Link>
                <Link to={"/rent"}>
                    <li className='hidden sm:inline text-slate-700 hover:underline'>Rent</li>
                </Link>
                <Link to={"/sales"}>
                    <li className='hidden sm:inline text-slate-700 hover:underline'>Sales</li>
                </Link>
                {currentUser ? (
                    <>
                    <Link to={"/create-listing"}>
                        <li className='hidden sm:inline text-slate-700 hover:underline'>Create Listing</li>
                    </Link>
                    <Link to="/profile">
                        <img className='rounded-full h-7 w-7 object-cover' src={currentUser.avatar} alt='profile' />
                    </Link>
                </>
                )  :  (
                <Link to="/sign-in">
                    <li className='sm:inline text-slate-700 hover:underline'>Sign in</li>
                </Link>
                )}
            </ul>
        </div>
        <button onClick={toggleMenu} className="text-neutral-400 hover:text-white focus:outline-none sm:hidden flex" aria-label="Toggle Menu">
              <img alt="toggle" className="w-6 h-6" src={isOpen ? "assets/close.svg" : "assets/menu.svg"} />
         </button>
    </div>
   </header>
  )
}

export default Headers
