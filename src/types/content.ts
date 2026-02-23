export type SectionId =
  | "home"
  | "bio"
  | "milk"
  | "discografie"
  | "dvd"
  | "gigs"
  | "optredens"
  | "lessen"
  | "contact";

export type SectionHeader = {
  title: string;
  intro: string;
};

export type HeroMedia = {
  imageSrc: string;
  imageAlt: string;
  posterSrc: string;
  videoSrc?: string;
  caption?: string;
};

export type RichTextBlock = {
  id: string;
  sectionId: SectionId;
  heading: string;
  body: string[];
};

export type HighlightItem = {
  id: string;
  label: string;
  description: string;
  period: string;
};

export type MediaItem = {
  id: string;
  title: string;
  videoUrl: string;
};

export type DiscographyItem = {
  id: string;
  artist: string;
  title: string;
  releaseType: "Single" | "EP" | "Album" | "LP" | "DVD";
  year: number;
  label?: string;
  platformUrl?: string;
  coverAlt: string;
};

export type LessonBlock = {
  id: string;
  lessonType: "drum" | "cajon" | "workshop";
  duration: string;
  rate: string;
  location: string;
  availability: string;
  externalLink?: string;
};

export type ProjectCard = {
  id: string;
  projectName: string;
  shortDescription: string;
  lineup: string[];
  link?: string;
};

export type ProductInfo = {
  summary: string;
  contentPoints: string[];
  orderSteps: string[];
  price: string;
  paymentDetails: string;
  contactEmail: string;
};

export type ContactInfo = {
  phone: string;
  email: string;
  formRecipient: string;
  practicalInfo: string;
};

export type PartnerLogo = {
  id: string;
  name: string;
  logoAlt: string;
  url: string;
};

export type ShowItem = {
  id: string;
  title: string;
  context: string;
  period: string;
  location?: string;
};

export type ExpandableList = {
  id: string;
  title: string;
  sectionId: SectionId;
  items: string[];
  defaultVisibleCount: number;
  expandLabel: string;
};

export type ContentModel = {
  heroMedia: HeroMedia;
  sectionHeaders: Record<SectionId, SectionHeader>;
  richTextBlocks: RichTextBlock[];
  highlightItems: HighlightItem[];
  mediaItems: MediaItem[];
  discographyItems: DiscographyItem[];
  lessonBlocks: LessonBlock[];
  projectCards: ProjectCard[];
  productInfo: ProductInfo;
  contactInfo: ContactInfo;
  partnerLogos: PartnerLogo[];
  upcomingShows: ShowItem[];
  archiveShows: ShowItem[];
  expandableLists: ExpandableList[];
};
