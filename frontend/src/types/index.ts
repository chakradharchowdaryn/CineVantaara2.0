export type ProfessionalRole =
  | 'DIRECTOR'
  | 'PRODUCER'
  | 'WRITER'
  | 'ACTOR'
  | 'CINEMATOGRAPHER'
  | 'EDITOR'
  | 'MUSIC_DIRECTOR'
  | 'VFX_ARTIST'
  | 'ANIMATOR'
  | 'COLORIST'
  | 'STUNT_COORDINATOR'
  | 'GAFFER'
  | 'LINE_PRODUCER'
  | 'CASTING_DIRECTOR'
  | 'SCRIPT_SUPERVISOR'
  | 'DRONE_OPERATOR'
  | 'BOOM_OPERATOR'
  | 'MAKEUP_ARTIST'
  | 'COSTUME_DESIGNER'
  | 'ART_DIRECTOR'
  | 'SOUND_DESIGNER'
  | 'TECHNICIAN'
  | 'ASSISTANT_DIRECTOR'
  | 'PRODUCTION_DESIGNER'
  | 'CHOREOGRAPHER'
  | 'FOLEY_ARTIST'
  | 'LOCATION_MANAGER'
  | 'PRODUCTION_COORDINATOR'
  | 'STORYBOARD_ARTIST'
  | 'DUBBING_ARTIST'
  | 'SUPER_ADMIN'
  | 'PLATFORM_ADMIN'
  | 'MODERATOR'
  | 'GUEST';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  headline?: string;
  bio?: string;
  roles: ProfessionalRole[];
  activeRole: ProfessionalRole;
  location?: string;
  languages?: string[];
  experienceYears?: number;
  skills: string[];
  imdbUrl?: string;
  websiteUrl?: string;
  isVerified?: boolean;
  isAvailable?: boolean;
  rating?: number;
  reviewCount?: number;
  isAdmin?: boolean;
  isGuest?: boolean;
  accountStatus?: 'ACTIVE' | 'SUSPENDED' | 'BANNED';
}

export interface GuestLoginRecord {
  id: string;
  userId: string;
  name: string;
  email: string;
  timestamp: string;
  role: 'GUEST';
}

export interface PortfolioMedia {
  id: string;
  title: string;
  type: 'IMAGE' | 'VIDEO' | 'AUDIO' | 'SCRIPT';
  url: string;
  thumbnailUrl?: string;
  projectRole: string;
  projectYear?: number;
  description?: string;
}

export interface Portfolio {
  userId: string;
  bio: string;
  showreelUrl?: string;
  headshots: string[];
  media: PortfolioMedia[];
  credits: {
    projectTitle: string;
    role: string;
    year: number;
    productionHouse?: string;
    genre?: string;
  }[];
  awards?: string[];
  equipmentList?: string[];
}

export type ApplicationStatus = 'PENDING' | 'UNDER_REVIEW' | 'SHORTLISTED' | 'ACCEPTED' | 'REJECTED';

export interface Opportunity {
  id: string;
  producerId: string;
  producerName: string;
  producerEmail?: string;
  producerCompany?: string;
  title: string;
  filmCategory: 'FEATURE_FILM' | 'SHORT_FILM' | 'DOCUMENTARY' | 'OTT_SERIES' | 'AD_COMMERCIAL' | 'MUSIC_VIDEO';
  description: string;
  requiredRole: ProfessionalRole;
  requiredSkills: string[];
  minExperienceYears: number;
  location: string;
  isRemoteAllowed: boolean;
  languages: string[];
  compensationType: 'PAID' | 'PROFIT_SHARE' | 'UNION_SCALE' | 'NEGOTIABLE';
  compensationDetails?: string;
  deadline: string;
  projectDuration: string;
  createdAt: string;
  status: 'OPEN' | 'IN_SELECTION' | 'CLOSED';
  applicantsCount?: number;
}

export interface Application {
  id: string;
  opportunityId: string;
  opportunityTitle: string;
  applicantId: string;
  applicantName: string;
  applicantRole: ProfessionalRole;
  applicantAvatar?: string;
  applicantExperience: number;
  pitchNote: string;
  showreelUrl?: string;
  status: ApplicationStatus;
  appliedAt: string;
}

export interface CollaborationRequest {
  id: string;
  senderId: string;
  senderName: string;
  senderEmail?: string;
  senderRole: ProfessionalRole;
  senderAvatar?: string;
  receiverId: string;
  receiverName: string;
  receiverEmail?: string;
  projectTitle: string;
  roleProposed: string;
  message: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  cipherText: string; // End-to-end encrypted payload
  plainTextPreview?: string; // Decrypted on client
  timestamp: string;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantRole: ProfessionalRole;
  participantAvatar?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
  isOnline?: boolean;
}

export interface NotificationItem {
  id: string;
  userId: string;
  creatorId?: string;
  creatorEmail?: string;
  creatorName?: string;
  title: string;
  message: string;
  type: 'COLLAB_REQUEST' | 'APPLICATION_UPDATE' | 'MESSAGE' | 'OPPORTUNITY_MATCH' | 'SYSTEM';
  timestamp: string;
  isRead: boolean;
  linkUrl?: string;
}

export interface Review {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: ProfessionalRole;
  authorAvatar?: string;
  targetUserId: string;
  projectTitle: string;
  rating: number; // 1 to 5
  feedback: string;
  createdAt: string;
}

export interface AdminAuditLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  targetType: string;
  targetId: string;
  timestamp: string;
  ipAddress?: string;
  details: string;
}
