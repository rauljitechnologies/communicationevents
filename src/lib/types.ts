/** Shapes returned by the content layer. Mirrors the Supabase tables in supabase/schema.sql. */

export type Service = {
  slug: string;
  title: string;
  copy: string;
  image: string;
  icon: string;
  points: string[];
  sort_order: number;
};

export type Client = {
  name: string;
  logo: string;
  website: string | null;
  sort_order: number;
};

export type GalleryImage = {
  url: string;
  caption: string;
  sort_order: number;
};

export type GalleryCategory = {
  slug: string;
  title: string;
  copy: string;
  sort_order: number;
  images: GalleryImage[];
};

export type Testimonial = {
  quote: string;
  name: string;
  org: string;
  sort_order: number;
};

export type Stat = { value: number; suffix: string; label: string };

export type SiteSettings = {
  phone: string;
  email: string;
  address: string;
  hero_video: string;
  hero_poster: string;
  founder_image: string;
  founder_name: string;
  about_body: string[];
  stats: Stat[];
};

export type Enquiry = {
  name: string;
  phone: string;
  email: string;
  message: string;
  source?: string;
};
