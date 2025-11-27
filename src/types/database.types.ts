export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            events: {
                Row: {
                    id: string
                    name: string
                    date: string
                    venue: string
                    city: string
                    status: 'upcoming' | 'past'
                    lineup: string[]
                    description: string | null
                    flyer_url: string | null
                    shotgun_link: string | null
                    latitude: number | null
                    longitude: number | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    date: string
                    venue: string
                    city: string
                    status: 'upcoming' | 'past'
                    lineup: string[]
                    description?: string | null
                    flyer_url?: string | null
                    shotgun_link?: string | null
                    latitude?: number | null
                    longitude?: number | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    date?: string
                    venue?: string
                    city?: string
                    status?: 'upcoming' | 'past'
                    lineup?: string[]
                    description?: string | null
                    flyer_url?: string | null
                    shotgun_link?: string | null
                    latitude?: number | null
                    longitude?: number | null
                    created_at?: string
                }
            }
            artists: {
                Row: {
                    id: string
                    name: string
                    soundcloud_url: string | null
                    instagram_url: string | null
                    bio: string | null
                    photo_url: string | null
                }
                Insert: {
                    id?: string
                    name: string
                    soundcloud_url?: string | null
                    instagram_url?: string | null
                    bio?: string | null
                    photo_url?: string | null
                }
                Update: {
                    id?: string
                    name?: string
                    soundcloud_url?: string | null
                    instagram_url?: string | null
                    bio?: string | null
                    photo_url?: string | null
                }
            }
            media: {
                Row: {
                    id: string
                    event_id: string
                    url: string
                    type: 'photo' | 'video'
                    created_at: string
                }
                Insert: {
                    id?: string
                    event_id: string
                    url: string
                    type: 'photo' | 'video'
                    created_at?: string
                }
                Update: {
                    id?: string
                    event_id?: string
                    url?: string
                    type?: 'photo' | 'video'
                    created_at?: string
                }
            }
        }
    }
}
