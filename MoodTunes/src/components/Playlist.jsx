// import React from 'react'
// import Loader from './Loader'
// import EmptyState from './EmptyState'
// import SongCard from './SongCard'
// import { useRef } from 'react'

// function Playlist({ playlist, isGenerating, getMoodColor, selectedMood, getMoodMatchPercentage, currentAudio,
//     setCurrentAudio,
//     currentSongId,
//     setCurrentSongId }) {


//     return (
//         <div className="flex-col  m-8">
//             <h2 className="text-3xl font-bold m-8">Your Playlist</h2>
//             {isGenerating && <Loader />}

//             {!isGenerating && playlist.length > 0 && (
//                 <div className="grid gap-4">
//                     {playlist.map((song) => (
//                         <SongCard
//                             key={song.id}
//                             song={song}
//                             getMoodMatchPercentage={getMoodMatchPercentage}
//                             getMoodColor={getMoodColor}
//                             selectedMood={selectedMood}
//                             currentAudio={currentAudio}
//                             setCurrentAudio={setCurrentAudio}
//                             currentSongId={currentSongId}
//                             setCurrentSongId={setCurrentSongId}
//                         />
//                     ))}
//                 </div>
//             )}

//             {!isGenerating && playlist.length === 0 && <EmptyState />}
//         </div>
//     )
// }

// export default Playlist

//================================================

import React from 'react';
import Loader from './Loader';
import EmptyState from './EmptyState';
import SongCard from './SongCard';

function Playlist({
    playlist,
    isGenerating,
    getMoodColor,
    selectedMood,
    getMoodMatchPercentage,
    currentAudio,
    setCurrentAudio,
    currentSongId,
    setCurrentSongId,
}) {
    return (
        <div className="flex flex-col m-4 sm:m-8">
            <h2 className="text-3xl font-bold mb-6 text-white">Your Playlist</h2>

            {isGenerating && <Loader />}

            {!isGenerating && playlist.length > 0 && (
                <div className="space-y-4">
                    {playlist.map((song) => (
                        <SongCard
                            key={song.id}
                            song={song}
                            getMoodMatchPercentage={getMoodMatchPercentage}
                            getMoodColor={getMoodColor}
                            selectedMood={selectedMood}
                            currentAudio={currentAudio}
                            setCurrentAudio={setCurrentAudio}
                            currentSongId={currentSongId}
                            setCurrentSongId={setCurrentSongId}
                        />
                    ))}
                </div>
            )}

            {!isGenerating && playlist.length === 0 && <EmptyState />}
        </div>
    );
}

export default Playlist;
