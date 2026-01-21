import React from 'react'

function IntensitySlider({ selectedMood, intensity, setIntensity, getMoodColor }) {
    return (
        <div className="bg-gradient-to-br from-purple-800 via-blue-500 to-indigo-500 bg-opacity-10 backdrop-blur-md rounded-2xl p-7 mb-6 ">
            <h3 className="text-2xl font-semibold mb-4">Intensity Level</h3>
            <div className="flex items-center space-x-4">
                <span className="text-sm text-white">Mellow</span>

                <div className="flex-1 relative">
                    {/* Track background */}
                    <div className="absolute top-1/2 transform -translate-y-1/2 w-full h-2 bg-gray-700 rounded-lg"></div>

                    {/* Gradient fill */}
                    <div
                        className={`absolute top-1/2 transform -translate-y-1/2 h-2 rounded-lg bg-gradient-to-r ${getMoodColor(selectedMood)}`}
                        style={{ width: `${(intensity / 10) * 100}%` }}


                    ></div>

                    {/* Slider input */}
                    <input
                        type="range"
                        min={1}
                        max={10}
                        value={intensity}
                        onChange={(e) => setIntensity(parseInt(e.target.value))}
                        className="w-full appearance-none bg-transparent relative z-10"
                    />
                </div>

                <span className="text-sm text-white">Intense</span>
            </div>

            <p className="text-center mt-2 text-sm text-white">Level: {intensity}/10</p>
        </div>
    )
}

export default IntensitySlider
