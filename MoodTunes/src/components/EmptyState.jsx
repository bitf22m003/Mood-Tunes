import { Music } from 'lucide-react';

const EmptyState = () => (
    <div className="text-center py-16 mx-auto">
        <div className="w-24 h-24 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Music className="w-12 h-12" />
        </div>
        <p className="text-2xl text-gray-300">No songs found for this mood combination</p>
        <p className="text-gray-400 text-xl">Try adjusting your intensity level or activity</p>


    </div>
);

export default EmptyState;
