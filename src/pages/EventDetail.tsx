import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, MapPin, ArrowLeft, Ticket } from 'lucide-react';
import { supabase } from '../lib/supabase';
import PhotoGallery from '../components/PhotoGallery';

const EventDetail = () => {
  const { id } = useParams();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [photoCount, setPhotoCount] = useState(0);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;

      // Mock data fallback if DB is empty/not connected for demo
      if (id === '1') {
        setEvent({
          id: '1',
          name: "ATLAS",
          date: "2026-04-18T22:00:00",
          venue: "Arkea Arena",
          city: "Bordeaux",
          lineup: ["VORTEK'S", "FLKN", "AISHA"],
          status: "upcoming",
          description: "L'événement techno de l'année. Une production monumentale, un son immersif et une scénographie à couper le souffle.",
          shotgun_link: "https://shotgun.live"
        });
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();

      if (!error && data) {
        setEvent(data);
      }

      // Fetch photo count for this event
      const { count } = await supabase
        .from('media')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', id)
        .eq('type', 'photo');

      setPhotoCount(count || 0);
      setLoading(false);
    };

    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-munera-violet"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl font-bold text-white mb-4">Événement introuvable</h1>
        <Link to="/events" className="text-munera-violet hover:text-white transition-colors">
          Retour aux événements
        </Link>
      </div>
    );
  }

  const isPast = event.status === 'past' || new Date(event.date) < new Date();

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Banner */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-munera-dark z-10" />
        {event.flyer_url ? (
          <img src={event.flyer_url} alt={event.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-munera-violet/20 to-munera-blue/20" />
        )}

        <div className="absolute bottom-0 left-0 w-full p-8 z-20">
          <div className="max-w-7xl mx-auto">
            <Link to="/events" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
              <ArrowLeft size={20} /> Retour
            </Link>
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-4 text-glow">{event.name}</h1>
            <div className="flex flex-wrap items-center gap-6 text-xl text-gray-200">
              <span className="flex items-center gap-2">
                <Calendar className="text-munera-violet" />
                {new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="text-munera-blue" />
                {event.venue}, {event.city}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-3xl font-bold text-white mb-6">LINE UP</h2>
              <div className="flex flex-wrap gap-4">
                {Array.isArray(event.lineup) ? event.lineup.map((artist: string) => (
                  <span key={artist} className="px-6 py-3 bg-white/5 border border-white/10 rounded-full text-xl font-bold tracking-wider hover:border-munera-violet/50 transition-colors cursor-default">
                    {artist}
                  </span>
                )) : null}
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-white mb-6">À PROPOS</h2>
              <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">
                {event.description || "Aucune description disponible."}
              </p>
            </section>

            {photoCount > 0 && (
              <section>
                <h2 className="text-3xl font-bold text-white mb-6">GALERIE PHOTOS</h2>
                <PhotoGallery eventId={event.id} />
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-munera-darker p-8 rounded-xl border border-white/10 sticky top-24">
              <div className="text-center mb-8">
                <p className="text-gray-400 mb-2">Statut</p>
                <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold uppercase ${isPast ? 'bg-gray-700 text-gray-300' : 'bg-munera-violet text-white animate-pulse'
                  }`}>
                  {isPast ? 'Événement passé' : 'Billetterie ouverte'}
                </span>
              </div>

              {!isPast && event.shotgun_link && (
                <a
                  href={event.shotgun_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-4 bg-white text-black font-bold text-center rounded-lg hover:bg-gray-200 transition-colors mb-4 flex items-center justify-center gap-2"
                >
                  <Ticket size={20} />
                  ACHETER UN BILLET
                </a>
              )}

              <div className="space-y-4 text-sm text-gray-400 border-t border-white/10 pt-6">
                <div className="flex justify-between">
                  <span>Date</span>
                  <span className="text-white">{new Date(event.date).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Heure</span>
                  <span className="text-white">{new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="flex justify-between">
                  <span>Lieu</span>
                  <span className="text-white">{event.venue}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
