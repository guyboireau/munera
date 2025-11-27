import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface EventLocation {
    id: string;
    name: string;
    venue: string;
    position: [number, number];
}

interface EventMapProps {
    events: EventLocation[];
}

const EventMap: React.FC<EventMapProps> = ({ events }) => {
    // Default center (Bordeaux)
    const center: [number, number] = [44.8378, -0.5792];

    return (
        <div className="h-[400px] w-full rounded-xl overflow-hidden border border-white/10 shadow-lg relative z-0">
            <MapContainer
                center={center}
                zoom={12}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />
                {events.map((event) => (
                    <Marker key={event.id} position={event.position}>
                        <Popup className="glass-popup">
                            <div className="text-munera-darker font-bold">
                                <h3 className="text-lg">{event.name}</h3>
                                <p className="text-sm">{event.venue}</p>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default EventMap;
