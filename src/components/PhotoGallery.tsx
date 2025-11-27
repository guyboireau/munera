import React, { useState, useEffect } from 'react';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { supabase } from '../lib/supabase';

interface PhotoGalleryProps {
    eventId: string;
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ eventId }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [photos, setPhotos] = useState<any[]>([]);
    const [index, setIndex] = useState(-1);

    useEffect(() => {
        const fetchPhotos = async () => {
            const { data } = await supabase
                .from('media')
                .select('*')
                .eq('event_id', eventId)
                .eq('type', 'photo');
            setPhotos(data || []);
        };

        fetchPhotos();
    }, [eventId]);

    if (photos.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500">
                Aucune photo disponible pour cet événement.
            </div>
        );
    }

    return (
        <>
            <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
                {photos.map((photo, i) => (
                    <div
                        key={photo.id}
                        className="break-inside-avoid cursor-pointer group relative overflow-hidden rounded-lg"
                        onClick={() => setIndex(i)}
                    >
                        <img
                            src={photo.url}
                            alt="Event souvenir"
                            className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110"
                            loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                    </div>
                ))}
            </div>

            <Lightbox
                open={index >= 0}
                index={index}
                close={() => setIndex(-1)}
                slides={photos.map(p => ({ src: p.url }))}
            />
        </>
    );
};

export default PhotoGallery;
