export type PlaceHours = {
  [day: string]: string;
};

export type Place = {
  id: string;
  name: string;
  category: string;
  address: string | null;
  lat: number;
  lng: number;
  phone: string | null;
  website: string | null;
  hours: PlaceHours | null;
  languages: string[];
  tags: string[];
  photos: string[];
  is_verified: boolean;
  is_active: boolean;
  is_free: boolean;
  views_count: number;
  saves_count: number;
  description?: string | null;
  city?: string;
  google_maps_url?: string | null;
  rating?: number;
  review_count?: number;
  distance_label?: string;
};
