import React from 'react'

function ActivitySelector({ activities, activity, setActivity, selectedMood, getMoodColor }) {
    return (
        <div className="bg-gradient-to-br from-purple-800 via-blue-700 to-indigo-500 bg-opacity-10 backdrop-blur-md rounded-2xl p-7">
            <h3 className="text-xl font-semibold mb-4">What are you doing!</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {activities.map((act) => {
                    return (
                        <button
                            key={act}
                            onClick={() => setActivity(activity === act ? '' : act)}
                            className={`p-3 rounded-xl text-sm font-medium hover:bg-gray-600 transition-all duration-200  ${activity === act
                                ? `bg-gradient-to-r ${getMoodColor(selectedMood)} text-white shadow-lg`
                                : 'bg-gray-500 bg-opacity-50 hover:bg-opacity-70'
                                }`}
                        >
                            {act}
                        </button>
                    );
                })}

            </div>
        </div>
    )
}

export default ActivitySelector