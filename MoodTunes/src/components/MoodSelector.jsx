function MoodSelector({ moods, selectedMood, setSelectedMood }) {

    //const allMoods = Object.values(moods).flat();
    return (   // ✅ THIS IS THE MISSING PIECE!
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {moods.map((mood) => {
                const Icon = mood.icon;
                return (
                    <button
                        key={mood.name}
                        onClick={() => setSelectedMood(mood.name)}
                        className={`relative p-6 gap-3 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${selectedMood === mood.name
                            ? `z-10 border-white bg-gradient-to-r ${mood.color} shadow-2xl`
                            : 'border-gray-600 bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-500 bg-opacity-10 backdrop-blur-sm hover:border-gray-400'
                            }`}
                    >
                        <Icon className="w-8 h-8 mb-3 mx-auto" />
                        <p className="font-semibold capitalize">{mood.name}</p>
                    </button>
                );
            })}
        </div>
    );
}
export default MoodSelector
