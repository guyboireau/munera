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
                    start_time: string | null
                    end_time: string | null
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
                    start_time?: string | null
                    end_time?: string | null
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
                    start_time?: string | null
                    end_time?: string | null
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
            },
            contest_editions: {
                Row: {
                    id: string
                    name: string
                    start_date: string
                    end_date: string
                    status: 'active' | 'finished' | 'upcoming'
                    winner_id: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    start_date: string
                    end_date: string
                    status?: 'active' | 'finished' | 'upcoming'
                    winner_id?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    start_date?: string
                    end_date?: string
                    status?: 'active' | 'finished' | 'upcoming'
                    winner_id?: string | null
                    created_at?: string
                }
            },
            contestants: {
                Row: {
                    id: string
                    contest_id: string
                    name: string
                    bio: string | null
                    soundcloud_url: string | null
                    instagram_url: string | null
                    photo_url: string | null
                    total_votes: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    contest_id: string
                    name: string
                    bio?: string | null
                    soundcloud_url?: string | null
                    instagram_url?: string | null
                    photo_url?: string | null
                    total_votes?: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    contest_id?: string
                    name?: string
                    bio?: string | null
                    soundcloud_url?: string | null
                    instagram_url?: string | null
                    photo_url?: string | null
                    total_votes?: number
                    created_at?: string
                }
            },
            vote_codes: {
                Row: {
                    id: string
                    code: string
                    contest_id: string
                    used: boolean
                    used_at: string | null
                    voted_for: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    code: string
                    contest_id: string
                    used?: boolean
                    used_at?: string | null
                    voted_for?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    code?: string
                    contest_id?: string
                    used?: boolean
                    used_at?: string | null
                    voted_for?: string | null
                    created_at?: string
                }
            },
            votes: {
                Row: {
                    id: string
                    vote_code_id: string | null
                    contestant_id: string | null
                    user_id: string | null
                    contest_id: string | null
                    voted_at: string
                    ip_address: string | null
                }
                Insert: {
                    id?: string
                    vote_code_id?: string | null
                    contestant_id?: string | null
                    user_id?: string | null
                    contest_id?: string | null
                    voted_at?: string
                    ip_address?: string | null
                }
                Update: {
                    id?: string
                    vote_code_id?: string | null
                    contestant_id?: string | null
                    user_id?: string | null
                    contest_id?: string | null
                    voted_at?: string
                    ip_address?: string | null
                }
            },
            products: {
                Row: {
                    id: string
                    name: string
                    description: string | null
                    price: number
                    images: string[] | null
                    category: string | null
                    stock: number
                    sizes: string[] | null
                    active: boolean
                    stripe_product_id: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    description?: string | null
                    price: number
                    images?: string[] | null
                    category?: string | null
                    stock?: number
                    sizes?: string[] | null
                    active?: boolean
                    stripe_product_id?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    description?: string | null
                    price?: number
                    images?: string[] | null
                    category?: string | null
                    stock?: number
                    sizes?: string[] | null
                    active?: boolean
                    stripe_product_id?: string | null
                    created_at?: string
                }
            },
            orders: {
                Row: {
                    id: string
                    order_number: string
                    customer_email: string
                    customer_name: string
                    customer_phone: string | null
                    shipping_address: Json | null
                    items: Json
                    total: number
                    status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'
                    stripe_session_id: string | null
                    stripe_payment_intent_id: string | null
                    delivery_method: 'shipping' | 'pickup' | null
                    pickup_event_id: string | null
                    created_at: string
                    paid_at: string | null
                    shipped_at: string | null
                }
                Insert: {
                    id?: string
                    order_number: string
                    customer_email: string
                    customer_name: string
                    customer_phone?: string | null
                    shipping_address?: Json | null
                    items: Json
                    total: number
                    status?: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'
                    stripe_session_id?: string | null
                    stripe_payment_intent_id?: string | null
                    delivery_method?: 'shipping' | 'pickup' | null
                    pickup_event_id?: string | null
                    created_at?: string
                    paid_at?: string | null
                    shipped_at?: string | null
                }
                Update: {
                    id?: string
                    order_number?: string
                    customer_email?: string
                    customer_name?: string
                    customer_phone?: string | null
                    shipping_address?: Json | null
                    items?: Json
                    total?: number
                    status?: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'
                    stripe_session_id?: string | null
                    stripe_payment_intent_id?: string | null
                    delivery_method?: 'shipping' | 'pickup' | null
                    pickup_event_id?: string | null
                    created_at?: string
                    paid_at?: string | null
                    shipped_at?: string | null
                }
            }
        },
        Functions: {
            increment_vote: {
                Args: {
                    row_id: string
                }
                Returns: void
            }
        }
    }
}
