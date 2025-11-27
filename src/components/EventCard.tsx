import React from 'react';
import { Calendar, MapPin, Music, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

interface EventCardProps {
    id: string;
    name: string;
    date: string;
    start_time?: string | null;
    end_time?: string | null;
    venue: string;
    city: string;
    lineup: string[];
    status: 'upcoming' | 'past';
    flyerUrl?: string;
}

const EventCard: React.FC<EventCardProps> = ({
    id,
    name,
    date,
    start_time,
    end_time,
    venue,
    city,
    lineup,
    status,
    flyerUrl
}) => {
    const isUpcoming = status === 'upcoming';

    // Format time display
    const formatTime = (time: string | null | undefined) => {
        if (!time) return '';
        return time.substring(0, 5); // Get HH:MM from HH:MM:SS
    };

    const timeDisplay = start_time && end_time
        ? `${formatTime(start_time)} - ${formatTime(end_time)}`
        : start_time
            ? `À partir de ${formatTime(start_time)}`
            : '';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card group relative overflow-hidden"
        >
            {/* Background Image/Gradient */}
            <div className="absolute inset-0 z-0 transition-transform duration-500 group-hover:scale-110">
                {flyerUrl ? (
                    <img src={flyerUrl} alt={name} className="w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity" />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-munera-violet/20 to-munera-blue/20" />
                )}
            </div>

            <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                    <span className={clsx(
                        "px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase",
                        isUpcoming ? "bg-munera-violet text-white" : "bg-gray-700 text-gray-300"
                    )}>
                        {isUpcoming ? "À venir" : "Passé"}
                    </span>
                    <span className="text-gray-400 text-sm flex items-center gap-1">
                        <MapPin size={14} /> {city}
                    </span>
                </div>

                <h3 className="text-3xl font-bold mb-2 text-white group-hover:text-munera-violet transition-colors text-glow">
                    {name}
                </h3>

                <div className="flex items-center gap-2 text-gray-300 mb-2">
                    <Calendar size={16} className="text-munera-blue" />
                    <span className="text-sm tracking-wider">{date}</span>
                    <span className="mx-2">•</span>
                    <span className="text-sm">{venue}</span>
                </div>

                {timeDisplay && (
                    <div className="text-munera-violet text-sm font-semibold mb-4">
                        {timeDisplay}
                    </div>
                )}

                <div className="mt-auto">
                    <div className="flex items-center gap-2 mb-4 text-gray-400 text-sm">
                        <Music size={14} />
                        <span className="truncate">{lineup.join(' • ')}</span>
                    </div>

                    <Link
                        to={`/events/${id}`}
                        className="inline-flex items-center gap-2 text-white font-bold hover:text-munera-violet transition-colors group-hover:translate-x-2 duration-300"
                    >
                        VOIR L'EVENT <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};

export default EventCard;
