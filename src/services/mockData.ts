import { User, Opportunity, Application, CollaborationRequest, Review, AdminAuditLog, ProfessionalRole } from '../types';

// Zero fake data: Empty initial arrays
export const INITIAL_USERS: User[] = [];
export const INITIAL_OPPORTUNITIES: Opportunity[] = [];
export const INITIAL_APPLICATIONS: Application[] = [];
export const INITIAL_COLLAB_REQUESTS: CollaborationRequest[] = [];
export const INITIAL_REVIEWS: Review[] = [];
export const INITIAL_AUDIT_LOGS: AdminAuditLog[] = [];

/**
 * Real dynamic statistics calculator:
 * Computes live metrics from actual application, opportunity, collaboration, and talent counts.
 * Absolutely NO fabricated or hardcoded numbers!
 */
export function calculateRealRoleMetrics(
  role: ProfessionalRole,
  user: User | null,
  opportunities: Opportunity[],
  applications: Application[],
  collabRequests: CollaborationRequest[],
  reviews: Review[]
): { label: string; value: string }[] {
  const currentUserId = user?.id || '';

  // Real count of open opportunities matching user's profession
  const matchingOpps = opportunities.filter(o => o.requiredRole === role && o.status === 'OPEN').length;
  
  // Real count of opportunities created by this user (for Producer/Director)
  const createdOpps = opportunities.filter(o => o.producerId === currentUserId).length;

  // Real count of applications sent or received
  const myApplications = applications.filter(a => a.applicantId === currentUserId).length;
  const applicationsReceived = applications.filter(a => opportunities.some(o => o.id === a.opportunityId && o.producerId === currentUserId)).length;

  // Real count of collaboration requests
  const pendingCollabs = collabRequests.filter(c => c.receiverId === currentUserId && c.status === 'PENDING').length;
  const activeCollabs = collabRequests.filter(c => (c.receiverId === currentUserId || c.senderId === currentUserId) && c.status === 'ACCEPTED').length;

  // Real verified reviews & rating
  const userReviews = reviews.filter(r => r.targetUserId === currentUserId);
  const avgRating = user?.rating && userReviews.length > 0 ? `${user.rating.toFixed(1)} ★` : '—';

  switch (role) {
    case 'PRODUCER':
      return [
        { label: 'Published Casting Calls', value: `${createdOpps}` },
        { label: 'Applications Received', value: `${applicationsReceived}` },
        { label: 'Active Collaborations', value: `${activeCollabs}` },
        { label: 'Verified Reviews', value: `${userReviews.length}` }
      ];
    case 'DIRECTOR':
      return [
        { label: 'Active Production Slates', value: `${createdOpps}` },
        { label: 'Crew Collaborations', value: `${activeCollabs}` },
        { label: 'Inbound Proposals', value: `${pendingCollabs}` },
        { label: 'Verified Reviews', value: `${userReviews.length}` }
      ];
    case 'WRITER':
      return [
        { label: 'Matching Opportunities', value: `${matchingOpps}` },
        { label: 'Active Collaborations', value: `${activeCollabs}` },
        { label: 'Studio Invitations', value: `${pendingCollabs}` },
        { label: 'Verified Reviews', value: `${userReviews.length}` }
      ];
    case 'ACTOR':
      return [
        { label: 'Matching Casting Calls', value: `${matchingOpps}` },
        { label: 'Applications Submitted', value: `${myApplications}` },
        { label: 'Direct Invitations', value: `${pendingCollabs}` },
        { label: 'Verified Reviews', value: `${userReviews.length}` }
      ];
    default:
      return [
        { label: 'Matching Opportunities', value: `${matchingOpps}` },
        { label: 'Active Collaborations', value: `${activeCollabs}` },
        { label: 'Inbound Requests', value: `${pendingCollabs}` },
        { label: 'Verified Reviews', value: `${userReviews.length}` }
      ];
  }
}
