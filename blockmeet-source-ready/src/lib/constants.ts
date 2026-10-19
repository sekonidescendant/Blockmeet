export const EVENT_TYPES = [
  { value: "CONFERENCE", label: "Conference" },
  { value: "MEETUP", label: "Meetup" },
  { value: "HACKATHON", label: "Hackathon" },
  { value: "WORKSHOP", label: "Workshop" },
  { value: "NETWORKING", label: "Networking" },
  { value: "COMMUNITY", label: "Community" },
  { value: "WEBINAR", label: "Webinar" },
  { value: "LAUNCH", label: "Launch" },
  { value: "OTHER", label: "Other" },
] as const;

export const LOCATION_TYPES = [
  { value: "IN_PERSON", label: "In person" },
  { value: "ONLINE", label: "Online" },
  { value: "HYBRID", label: "Hybrid" },
] as const;

export const CATEGORIES = [
  "Blockchain", "DeFi", "NFT", "AI x Web3", "Gaming", "DAOs",
  "Developer", "Security", "Infrastructure", "Community", "General Web3",
] as const;

export const HOST_EVENT_TYPES = [
  "Meetups", "Workshops", "Conferences", "Campus events", "Hackathons", "Community events",
] as const;

export const COMMUNITY_SIZES = ["Under 50", "50-250", "250-1,000", "1,000+"] as const;
