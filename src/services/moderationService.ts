/**
 * CineVantaara Moderation & User Safety Service (Phase 7: Item 38)
 * Manages blocked users, user reports, and feeds into Citadel Admin Gateway.
 */

export interface UserReport {
  id: string;
  reporterId: string;
  reporterName: string;
  reportedUserId: string;
  reportedUserName: string;
  reason: 'SPAM' | 'HARASSMENT' | 'COPYRIGHT_INFRINGEMENT' | 'IMPERSONATION' | 'UNPROFESSIONAL_BEHAVIOR';
  details: string;
  timestamp: string;
  status: 'PENDING' | 'RESOLVED' | 'DISMISSED';
}

const BLOCKED_USERS_KEY = 'cv_blocked_users';
const REPORTS_KEY = 'cv_user_reports';

export function getBlockedUserIds(): string[] {
  try {
    const raw = localStorage.getItem(BLOCKED_USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function isUserBlocked(userId: string): boolean {
  const list = getBlockedUserIds();
  return list.includes(userId);
}

export function blockUser(userId: string): void {
  const list = getBlockedUserIds();
  if (!list.includes(userId)) {
    const updated = [...list, userId];
    localStorage.setItem(BLOCKED_USERS_KEY, JSON.stringify(updated));
  }
}

export function unblockUser(userId: string): void {
  const list = getBlockedUserIds();
  const updated = list.filter(id => id !== userId);
  localStorage.setItem(BLOCKED_USERS_KEY, JSON.stringify(updated));
}

export function getAllReports(): UserReport[] {
  try {
    const raw = localStorage.getItem(REPORTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function submitUserReport(reportData: Omit<UserReport, 'id' | 'timestamp' | 'status'>): UserReport {
  const newReport: UserReport = {
    ...reportData,
    id: `rep-${Date.now()}`,
    timestamp: new Date().toISOString(),
    status: 'PENDING'
  };

  const reports = getAllReports();
  const updated = [newReport, ...reports];
  localStorage.setItem(REPORTS_KEY, JSON.stringify(updated));
  return newReport;
}

export function updateReportStatus(reportId: string, status: 'RESOLVED' | 'DISMISSED'): void {
  const reports = getAllReports();
  const updated = reports.map(r => r.id === reportId ? { ...r, status } : r);
  localStorage.setItem(REPORTS_KEY, JSON.stringify(updated));
}
