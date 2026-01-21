// import React, { useRef, useEffect } from 'react'
// import { Music, Play, Pause, ExternalLink } from 'lucide-react'

// function SongCard({
//   song,
//   getMoodMatchPercentage,
//   getMoodColor,
//   selectedMood,
//   currentAudio,
//   setCurrentAudio,
//   currentSongId,
//   setCurrentSongId
// }) {
//   const audioRef = useRef(null);
//   const isPlaying = currentSongId === song.id;

//   const handlePlayPause = () => {
//     if (!song.preview_url) {
//       // If no preview, open Spotify link
//       window.open(song.external_url, '_blank');
//       return;
//     }

//     if (isPlaying) {
//       audioRef.current.pause();
//       setCurrentSongId(null);
//       return;
//     }

//     // Pause any other song
//     if (currentAudio) {
//       currentAudio.pause();
//       setCurrentAudio(null);
//     }

//     // Play this song
//     audioRef.current.play().catch(error => {
//       console.error('Error playing audio:', error);
//     });
//     setCurrentAudio(audioRef.current);
//     setCurrentSongId(song.id);
//   };

//   // Handle audio ended event
//   useEffect(() => {
//     const audio = audioRef.current;
//     if (!audio) return;

//     const handleEnded = () => {
//       setCurrentSongId(null);
//       setCurrentAudio(null);
//     };

//     const handleError = () => {
//       console.error('Audio playback error for song:', song.title);
//       setCurrentSongId(null);
//       setCurrentAudio(null);
//     };

//     audio.addEventListener('ended', handleEnded);
//     audio.addEventListener('error', handleError);

//     return () => {
//       audio.removeEventListener('ended', handleEnded);
//       audio.removeEventListener('error', handleError);
//     };
//   }, [song.title, setCurrentSongId, setCurrentAudio]);

//   // Pause audio when component unmounts or song changes
//   useEffect(() => {
//     const audio = audioRef.current;
//     return () => {
//       if (audio) {
//         audio.pause();
//       }
//     };
//   }, []);

//   return (
//     <div className="w-full bg-black bg-opacity-10 backdrop-blur-md rounded-xl p-4 hover:bg-opacity-20 transition-all duration-300 group">
//       <div className="flex items-center justify-between">
//         <div className="flex items-center space-x-4">
//           <div className="relative w-12 h-12 rounded-lg overflow-hidden">
//             {song.image ? (
//               <img
//                 src={song.image}
//                 alt={song.album}
//                 className="w-full h-full object-cover"
//               />
//             ) : (
//               <div className="w-full h-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center">
//                 <Music className="w-6 h-6" />
//               </div>
//             )}
//           </div>
//           <div className="flex-1 min-w-0">
//             <h3 className="font-semibold text-lg truncate">{song.title}</h3>
//             <p className="text-gray-300 truncate md:text-wrap">{song.artist}</p>
//             <p className="text-sm text-gray-400 truncate">{song.album} • {song.duration}</p>
//             {!song.preview_url && (
//               <p className="text-xs text-amber-400 mt-1 flex items-center gap-1">
//                 <ExternalLink className="w-3 h-3" />
//                 Click to open in Spotify
//               </p>
//             )}
//           </div>
//         </div>

//         <div className="flex items-center space-x-6 flex-shrink-0">
//           <div className="text-right">
//             <p className="text-sm font-medium">
//               {getMoodMatchPercentage(song)}% match
//             </p>
//             <div className="w-20 bg-gray-600 rounded-full h-2 mt-1">
//               <div
//                 className={`h-2 bg-gradient-to-r ${getMoodColor(selectedMood)} rounded-full transition-all duration-300`}
//                 style={{ width: `${getMoodMatchPercentage(song)}%` }}
//               />
//             </div>
//           </div>

//           <button
//             onClick={handlePlayPause}
//             className={`w-10 h-10 bg-blue-900 bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all duration-200 group-hover:scale-110 ${!song.preview_url ? 'bg-green-600 bg-opacity-30 hover:bg-opacity-50' : ''}`}
//             title={song.preview_url ? (isPlaying ? 'Pause preview' : 'Play preview') : 'Open in Spotify'}
//           >
//             {song.preview_url ? (
//               isPlaying ? (
//                 <Pause className="w-5 h-5" />
//               ) : (
//                 <Play className="w-5 h-5 ml-0.5" />
//               )
//             ) : (
//               <ExternalLink className="w-4 h-4" />
//             )}
//           </button>

//           {song.preview_url && (
//             <audio
//               ref={audioRef}
//               src={song.preview_url}
//               preload="none"
//             />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default SongCard;

// ===================================================================

// ============ ENHANCED AUDIO PREVIEW SYSTEM ============
// import React, { useRef, useEffect, useState } from 'react';
// import { Music, Play, Pause } from 'lucide-react';

// function SongCard({
//   song,
//   getMoodMatchPercentage,
//   getMoodColor,
//   selectedMood,
//   currentAudio,
//   setCurrentAudio,
//   currentSongId,
//   setCurrentSongId
// }) {
//   const audioRef = useRef(null);
//   const youtubeIframeRef = useRef(null);
//   const youtubePlayer = useRef(null);
//   const [isYouTubeReady, setIsYouTubeReady] = useState(false);
//   const [videoSearched, setVideoSearched] = useState(false);
//   const [youtubeError, setYoutubeError] = useState(false);
//   const [isSearching, setIsSearching] = useState(false);

//   const isPlaying = currentSongId === song.id;
//   const isSpotify = !!song.preview_url;
//   const isYouTube = !song.preview_url && !!song.youtubeVideoId && !youtubeError;

//   const handlePlayPause = () => {
//     if (isSpotify) {
//       if (isPlaying) {
//         audioRef.current.pause();
//         setCurrentSongId(null);
//         return;
//       }
//       if (currentAudio) {
//         currentAudio.pause();
//         setCurrentAudio(null);
//       }
//       audioRef.current.play().catch(error => console.error('Error playing audio:', error));
//       setCurrentAudio(audioRef.current);
//       setCurrentSongId(song.id);
//     } else if (isYouTube) {
//       if (!youtubePlayer.current || typeof youtubePlayer.current.playVideo !== 'function') {
//         console.warn("YouTube player not ready yet");
//         return;
//       }

//       if (isPlaying) {
//         youtubePlayer.current.pauseVideo();
//         setCurrentSongId(null);
//       } else {
//         if (currentAudio) {
//           currentAudio.pause();
//           setCurrentAudio(null);
//         }
//         setCurrentSongId(song.id);
//         youtubePlayer.current.playVideo();
//       }
//     } else {
//       console.warn('No preview available for this song.');
//     }
//   };

//   // Fixed YouTube video fetching with proper backend proxy
//   useEffect(() => {
//     const fetchYouTubeVideo = async () => {
//       if (isSearching) return;

//       setIsSearching(true);
//       try {
//         const query = encodeURIComponent(`${song.title} ${song.artist}`);
//         console.log('Searching YouTube for:', `${song.title} ${song.artist}`);

//         // Option 1: Use your backend proxy (RECOMMENDED)
//         const response = await fetch(`/api/youtube/search?q=${query}&maxResults=1`, {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         });

//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const data = await response.json();
//         const videoId = data.items?.[0]?.id?.videoId;

//         if (videoId) {
//           song.youtubeVideoId = videoId;
//           console.log('YouTube video found:', videoId);
//           setYoutubeError(false);
//         } else {
//           console.warn('No YouTube video found for:', `${song.title} ${song.artist}`);
//           setYoutubeError(true);
//         }
//       } catch (error) {
//         console.error('YouTube video fetch failed:', error.message);
//         setYoutubeError(true);

//         // Fallback: Try alternative method or show user-friendly message
//         console.log('Falling back to manual search option');
//       } finally {
//         setVideoSearched(true);
//         setIsSearching(false);
//       }
//     };

//     if (!song.preview_url && !song.youtubeVideoId && !videoSearched && !isSearching) {
//       fetchYouTubeVideo();
//     }
//   }, [song, videoSearched, isSearching]);

//   // Fixed YouTube player initialization
//   useEffect(() => {
//     if (!isYouTube || isYouTubeReady || !song.youtubeVideoId) return;

//     const initializeYouTubePlayer = () => {
//       try {
//         if (youtubePlayer.current) {
//           youtubePlayer.current.destroy();
//         }

//         youtubePlayer.current = new window.YT.Player(`youtube-${song.id}`, {
//           height: '1',
//           width: '1',
//           videoId: song.youtubeVideoId,
//           playerVars: {
//             autoplay: 0,
//             controls: 0,
//             disablekb: 1,
//             enablejsapi: 1,
//             modestbranding: 1,
//             playsinline: 1,
//             rel: 0,
//             showinfo: 0,
//             origin: window.location.origin, // Fix CORS origin issue
//           },
//           events: {
//             onReady: (event) => {
//               console.log("YouTube player ready for:", song.title);
//               setIsYouTubeReady(true);
//             },
//             onStateChange: (event) => {
//               if (event.data === window.YT.PlayerState.ENDED) {
//                 setCurrentSongId(null);
//               }
//               if (event.data === window.YT.PlayerState.PAUSED) {
//                 if (isPlaying) {
//                   setCurrentSongId(null);
//                 }
//               }
//             },
//             onError: (event) => {
//               console.error('YouTube player error:', event.data);
//               setYoutubeError(true);
//               setCurrentSongId(null);
//             }
//           }
//         });
//       } catch (error) {
//         console.error('Error initializing YouTube player:', error);
//         setYoutubeError(true);
//       }
//     };

//     const loadYouTubeAPI = () => {
//       if (window.YT && window.YT.Player) {
//         initializeYouTubePlayer();
//       } else {
//         // Load YouTube API script
//         const tag = document.createElement('script');
//         tag.src = 'https://www.youtube.com/iframe_api';
//         tag.async = true;

//         const firstScriptTag = document.getElementsByTagName('script')[0];
//         firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

//         // Set global callback
//         window.onYouTubeIframeAPIReady = () => {
//           initializeYouTubePlayer();
//         };
//       }
//     };

//     const timeoutId = setTimeout(loadYouTubeAPI, 100);
//     return () => clearTimeout(timeoutId);
//   }, [isYouTube, song.id, song.youtubeVideoId, song.title, isPlaying]);

//   // Cleanup audio events
//   useEffect(() => {
//     const audio = audioRef.current;
//     if (!audio) return;

//     const handleEnded = () => {
//       setCurrentSongId(null);
//       setCurrentAudio(null);
//     };

//     const handleError = (e) => {
//       console.error('Audio playback error for song:', song.title, e);
//       setCurrentSongId(null);
//       setCurrentAudio(null);
//     };

//     const handleCanPlay = () => {
//       console.log('Audio ready to play:', song.title);
//     };

//     audio.addEventListener('ended', handleEnded);
//     audio.addEventListener('error', handleError);
//     audio.addEventListener('canplay', handleCanPlay);

//     return () => {
//       audio.removeEventListener('ended', handleEnded);
//       audio.removeEventListener('error', handleError);
//       audio.removeEventListener('canplay', handleCanPlay);
//     };
//   }, [song.title, setCurrentSongId, setCurrentAudio]);

//   // Component cleanup
//   useEffect(() => {
//     return () => {
//       try {
//         if (audioRef.current) {
//           audioRef.current.pause();
//           audioRef.current.currentTime = 0;
//         }
//         if (youtubePlayer.current && typeof youtubePlayer.current.stopVideo === 'function') {
//           youtubePlayer.current.stopVideo();
//           youtubePlayer.current.destroy();
//         }
//       } catch (error) {
//         console.warn('Cleanup error:', error);
//       }
//     };
//   }, []);

//   // Stop current song when component unmounts or song changes
//   useEffect(() => {
//     if (!isPlaying) {
//       try {
//         if (audioRef.current) {
//           audioRef.current.pause();
//         }
//         if (youtubePlayer.current && typeof youtubePlayer.current.pauseVideo === 'function') {
//           youtubePlayer.current.pauseVideo();
//         }
//       } catch (error) {
//         console.warn('Error stopping playback:', error);
//       }
//     }
//   }, [isPlaying]);

//   const getPlayButtonState = () => {
//     if (isSpotify) return { canPlay: true, status: 'spotify' };
//     if (isYouTube) return { canPlay: true, status: 'youtube' };
//     if (isSearching) return { canPlay: false, status: 'searching' };
//     if (youtubeError) return { canPlay: false, status: 'error' };
//     return { canPlay: false, status: 'none' };
//   };

//   const playButtonState = getPlayButtonState();

//   return (
//     <div className="w-full bg-black bg-opacity-10 backdrop-blur-md rounded-xl p-4 hover:bg-opacity-20 transition-all duration-300 group">
//       <div className="flex items-center justify-between">
//         <div className="flex items-center space-x-4">
//           <div className="relative w-12 h-12 rounded-lg overflow-hidden">
//             {song.image ? (
//               <img
//                 src={song.image}
//                 alt={song.album}
//                 className="w-full h-full object-cover"
//                 onError={(e) => {
//                   e.target.style.display = 'none';
//                   e.target.nextSibling.style.display = 'flex';
//                 }}
//               />
//             ) : null}
//             <div
//               className={`w-full h-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center ${song.image ? 'hidden' : 'flex'}`}
//             >
//               <Music className="w-6 h-6" />
//             </div>
//           </div>
//           <div className="flex-1 min-w-0">
//             <h3 className="font-semibold text-lg truncate">{song.title}</h3>
//             <p className="text-gray-300 truncate md:text-wrap">{song.artist}</p>
//             <p className="text-sm text-gray-400 truncate">{song.album} • {song.duration}</p>
//             {!playButtonState.canPlay && (
//               <p className="text-xs text-red-400 mt-1">
//                 {playButtonState.status === 'searching' ? 'Searching for preview...' :
//                   playButtonState.status === 'error' ? 'Preview unavailable' :
//                     'No preview available'}
//               </p>
//             )}
//           </div>
//         </div>

//         <div className="flex items-center space-x-6 flex-shrink-0">
//           <div className="text-right">
//             <p className="text-sm font-medium">{getMoodMatchPercentage(song)}% match</p>
//             <div className="w-20 bg-gray-600 rounded-full h-2 mt-1">
//               <div
//                 className={`h-2 bg-gradient-to-r ${getMoodColor(selectedMood)} rounded-full transition-all duration-300`}
//                 style={{ width: `${getMoodMatchPercentage(song)}%` }}
//               />
//             </div>
//           </div>

//           <button
//             onClick={handlePlayPause}
//             disabled={!playButtonState.canPlay}
//             className={`w-10 h-10 ${!playButtonState.canPlay
//                 ? 'opacity-30 cursor-not-allowed'
//                 : 'bg-blue-900 bg-opacity-20 hover:bg-opacity-30 group-hover:scale-110'
//               } rounded-full flex items-center justify-center transition-all duration-200`}
//             title={
//               playButtonState.canPlay
//                 ? (isPlaying ? 'Pause preview' : 'Play preview')
//                 : playButtonState.status === 'searching'
//                   ? 'Searching for preview...'
//                   : 'Preview not available'
//             }
//           >
//             {playButtonState.canPlay ? (
//               isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />
//             ) : (
//               <Play className="w-5 h-5" />
//             )}
//           </button>

//           {/* Spotify Audio Element */}
//           {isSpotify && (
//             <audio
//               ref={audioRef}
//               src={song.preview_url}
//               preload="none"
//               crossOrigin="anonymous"
//             />
//           )}

//           {/* YouTube Player Container */}
//           {isYouTube && song.youtubeVideoId && (
//             <div className="hidden">
//               <div
//                 id={`youtube-${song.id}`}
//                 ref={youtubeIframeRef}
//                 style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px' }}
//               />
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default SongCard;




// ============ ENHANCED AUDIO PREVIEW SYSTEM ============

import React, { useRef, useEffect } from 'react';
import { Music, Play, Pause } from 'lucide-react';

function SongCard({
  song,
  getMoodMatchPercentage,
  getMoodColor,
  selectedMood,
  currentAudio,
  setCurrentAudio,
  currentSongId,
  setCurrentSongId
}) {
  const audioRef = useRef(null);
  const isPlaying = currentSongId === song.id;

  const handlePlayPause = () => {
    if (!song.preview_url) return;

    if (isPlaying) {
      audioRef.current.pause();
      setCurrentSongId(null);
    } else {
      if (currentAudio) {
        currentAudio.pause();
        setCurrentAudio(null);
      }
      audioRef.current.play().catch(error => console.error('Error playing audio:', error));
      setCurrentAudio(audioRef.current);
      setCurrentSongId(song.id);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      setCurrentSongId(null);
      setCurrentAudio(null);
    };

    const handleError = (e) => {
      console.error('Audio error:', song.title, e);
      setCurrentSongId(null);
      setCurrentAudio(null);
    };

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [song.title]);

  useEffect(() => {
    if (!isPlaying && audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  return (
    <div className="w-full bg-black bg-opacity-10 backdrop-blur-md rounded-xl p-4 hover:bg-opacity-20 transition-all duration-300 group">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative w-12 h-12 rounded-lg overflow-hidden">
            {song.image ? (
              <img
                src={song.image}
                alt={song.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div
              className={`w-full h-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center ${song.image ? 'hidden' : 'flex'}`}
            >
              <Music className="w-6 h-6" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate">{song.title}</h3>
            <p className="text-gray-300 truncate">{song.artist}</p>
            <p className="text-sm text-gray-400 truncate">{song.duration}</p>
          </div>
        </div>

        <div className="flex items-center space-x-6 flex-shrink-0">
          <div className="text-right">
            <p className="text-sm font-medium">{getMoodMatchPercentage(song)}% match</p>
            <div className="w-20 bg-gray-600 rounded-full h-2 mt-1">
              <div
                className={`h-2 bg-gradient-to-r ${getMoodColor(selectedMood)} rounded-full transition-all duration-300`}
                style={{ width: `${getMoodMatchPercentage(song)}%` }}
              />
            </div>
          </div>

          <button
            onClick={handlePlayPause}
            disabled={!song.preview_url}
            className={`w-10 h-10 ${!song.preview_url
              ? 'opacity-30 cursor-not-allowed'
              : 'bg-blue-900 bg-opacity-20 hover:bg-opacity-30 group-hover:scale-110'
              } rounded-full flex items-center justify-center transition-all duration-200`}
            title={song.preview_url ? (isPlaying ? 'Pause preview' : 'Play preview') : 'Preview not available'}
          >
            {song.preview_url ? (
              isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />
            ) : (
              <Play className="w-5 h-5" />
            )}
          </button>

          {/* Pixabay Audio Element */}
          {song.preview_url && (
            <audio
              ref={audioRef}
              src={song.preview_url}
              preload="none"
              crossOrigin="anonymous"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default SongCard;






