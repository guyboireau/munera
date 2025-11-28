import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface GalleryImage {
    id: string;
    url: string;
    active: boolean;
}

const Home = () => {
    const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);

    useEffect(() => {
        fetchGalleryContent();
    }, []);

    const fetchGalleryContent = async () => {
        // Fetch settings first
        const { data: settings } = await (supabase.from('app_settings') as any)
            .select('*')
            .eq('key', 'home_gallery_random_mode')
            .single();

        const isRandomMode = settings?.value?.enabled || false;

        // Fetch images
        const { data: images } = await (supabase.from('home_images') as any)
            .select('*');

        if (!images) return;

        let displayedImages: GalleryImage[] = [];

        if (isRandomMode) {
            // Pick 12 random images from ALL images (or active ones? Let's say all for variety if random mode is on)
            // Actually, usually random mode picks from a pool. Let's pick from all uploaded images.
            const shuffled = [...images].sort(() => 0.5 - Math.random());
            displayedImages = shuffled.slice(0, 12);
        } else {
            // Pick only active images
            displayedImages = images.filter((img: any) => img.active);
        }

        // If no images from DB, fallback to hardcoded (optional, but good for dev)
        if (displayedImages.length === 0) {
            // Fallback logic could go here, but for now let's just leave it empty or show nothing
            // Or we can map the old hardcoded ones to the interface if needed.
            // For now, let's assume the user will upload images.
        }

        setGalleryImages(displayedImages);
    };

    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
                {/* Background Animation */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-munera-darker/50 to-munera-dark z-10" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-munera-violet/20 rounded-full blur-[100px] animate-pulse" />
                    <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-munera-blue/20 rounded-full blur-[80px]" />
                </div>

                <div className="relative z-10 text-center px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="mb-8 flex justify-center"
                    >
                        <img
                            src="/images/FULL_LOGO_BLANC.png"
                            alt="MUNERA"
                            className="h-32 md:h-48 w-auto"
                        />
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="text-xl md:text-2xl text-gray-300 tracking-[0.5em] font-light mb-12"
                    >
                        COLLECTIF TECHNO BORDEAUX
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1, duration: 0.5 }}
                    >
                        <Link
                            to="/events"
                            className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-munera-violet/50 rounded-full text-white font-bold tracking-widest transition-all duration-300 hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] hover:scale-105"
                        >
                            NOS ÉVÉNEMENTS
                        </Link>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2, duration: 1 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce"
                >
                    <ChevronDown size={32} className="text-gray-500" />
                </motion.div>
            </section>

            {/* Photo Gallery Section */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 bg-munera-dark relative overflow-hidden">
                <div className="max-w-7xl mx-auto relative z-10">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-bold mb-16 text-white text-glow text-center"
                    >
                        NOS ÉVÉNEMENTS EN IMAGES
                    </motion.h2>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {galleryImages.map((img, index) => (
                            <motion.div
                                key={img.id || index}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05, duration: 0.5 }}
                                className="relative aspect-square overflow-hidden rounded-lg group cursor-pointer"
                            >
                                <img
                                    src={img.url}
                                    alt={`MUNERA Event ${index + 1}`}
                                    loading="lazy"
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-munera-violet/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-1/2 left-0 w-1/2 h-1/2 bg-gradient-to-r from-munera-violet/5 to-transparent pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-l from-munera-blue/5 to-transparent pointer-events-none" />
            </section>

            {/* About Section */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 bg-munera-darker relative overflow-hidden">
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-bold mb-12 text-white text-glow"
                    >
                        L'EXPÉRIENCE MUNERA
                    </motion.h2>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="space-y-8 text-lg text-gray-300 leading-relaxed"
                    >
                        <p>
                            Né dans les entrailles de Bordeaux, <span className="text-munera-violet font-bold">MUNERA</span> n'est pas seulement un collectif, c'est une mission. Celle de redéfinir la scène techno locale à travers des événements immersifs et monumentaux.
                        </p>
                        <p>
                            Nous fusionnons architecture sonore brutale et arts visuels futuristes pour créer des espaces hors du temps. De la Hard Techno à l'Acid, en passant par l'Indus, nos line-ups sont taillés pour l'intensité.
                        </p>
                        <p className="text-xl font-bold text-white pt-8">
                            REJOIGNEZ LE MOUVEMENT.
                        </p>
                    </motion.div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-munera-violet/5 to-transparent pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-1/3 h-full bg-gradient-to-r from-munera-blue/5 to-transparent pointer-events-none" />
            </section>
        </div>
    );
};

export default Home;
