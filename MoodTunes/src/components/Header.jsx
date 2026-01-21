import React from 'react'

function Header() {
    return (
        <header className=" bg-gradient-to-r from-purple-900 via blue-900 to-indigo-900 bg-opacity-50 backdrop-blur-xl backdrop-saturate-150 p-6 sticky top-0 z-50  border-opacity-10 ">
            <div className='max-w-6xl mx-auto'>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">MoodTunes</h1>
                <p className="text-gray-300 mt-2">Discover music that matches your vibe</p>
            </div>
        </header>

    )
}

export default Header