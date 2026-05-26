export interface MapItem {
  id: number;
  place: string;
  meta: string;
}

export interface MapSection {
  title: string;
  mapImage: string;
  items: MapItem[];
}

export interface PillarItem {
  heading: string;
  description: string;
}

export interface RenderItem {
  label: string;
  image: string;
}

export interface RenderCategory {
  name: string;
  items: RenderItem[];
}

export interface ProjectInfo {
  title: string;
  highlights: {
    title: string;
    items: string[];
  };
  clubhouse: {
    title: string;
    description: string;
    pillars: PillarItem[];
  };
  renders: {
    title: string;
    categories: RenderCategory[];
  };
}

export interface TestimonialItem {
  id: number;
  quote: string;
  author: string;
  designation: string;
  date: string;
}

export interface TestimonialsSection {
  title: string;
  isVisible: boolean;
  items: TestimonialItem[];
}

export interface PressItem {
  id: number;
  publication: string;
  headline: string;
  link: string;
  date: string;
}

export interface PressSection {
  title: string;
  isVisible: boolean;
  items: PressItem[];
}

export interface OfficeItem {
  city: string;
  address: string;
}

export interface FooterSection {
  title: string;
  copyright: string;
  offices: OfficeItem[];
}

export interface LandingContent {
  site: {
    logo: string;
    logoAlt: string;
  };
  header: {
    ctaText: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    tag: string;
    location: string;
    videoSrc: string;
    posterSrc: string;
    bgImg: string;
    form: {
      title: string;
      buttonText: string;
    };
  };
  about: {
    title: string;
    paragraphs: string[];
  };
  loliem: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
  };
  mapSection: MapSection;
  projectInfo: ProjectInfo;
  testimonials: TestimonialsSection;
  press: PressSection;
  footer: FooterSection;
}
