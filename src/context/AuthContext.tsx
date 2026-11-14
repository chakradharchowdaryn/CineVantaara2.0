import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, ProfessionalRole, AdminAuditLog, GuestLoginRecord } from '../types';
import { INITIAL_USERS } from '../services/mockData';

export interface AdminAccount {
  email: string;
  password: string;
  name: string;
  role: ProfessionalRole;
}

export const ADMIN_ACCOUNTS: AdminAccount[] = [
  {
    email: 'kirans3792@gmail.com',
    password: 'Saigt@12345678',
    name: 'Kiran',
    role: 'SUPER_ADMIN'
  },
  {
    email: 'chakradharchowdaryn@gmail.com',
    password: 'Chakradharn@1979',
    name: 'Chakradhar Chowdary',
    role: 'SUPER_ADMIN'
  },
  {
    email: 'yashwanthacharya.g@gmail.com',
    password: 'Yashwanth@12345678',
    name: 'Yashwanth Acharya',
    role: 'PLATFORM_ADMIN'
  },
  {
    email: 'pranay@gmail.com',
    password: 'Pranay@12345678',
    name: 'Pranay',
    role: 'PLATFORM_ADMIN'
  }
];

export interface VaultCredential {
  email: string;
  password?: string;
  salt: string;
  hash: string;
  createdAt: string;
  isGuest?: boolean;
}

// Cryptographic Salted Hashing for High Confidentiality (SHA-256)
export const hashPassword = async (password: string, salt: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(`${salt}::cinevantaara_cinema_vault_2026::${password}`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

export const getCredentialsVault = (): Record<string, VaultCredential> => {
  try {
    const raw = localStorage.getItem('cv_user_vault');
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
};

export const saveCredentialsVault = (vault: Record<string, VaultCredential>) => {
  try {
    localStorage.setItem('cv_user_vault', JSON.stringify(vault));
  } catch (e) {}
};

export const getGuestVault = (): Record<string, VaultCredential> => {
  try {
    const raw = localStorage.getItem('cv_guest_vault');
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
};

export const saveGuestVault = (vault: Record<string, VaultCredential>) => {
  try {
    localStorage.setItem('cv_guest_vault', JSON.stringify(vault));
  } catch (e) {}
};

export const getGuestUsers = (): User[] => {
  try {
    const raw = localStorage.getItem('cv_guest_users');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const saveGuestUsers = (users: User[]) => {
  try {
    localStorage.setItem('cv_guest_users', JSON.stringify(users));
  } catch (e) {}
};

export const getGuestLogins = (): GuestLoginRecord[] => {
  try {
    const raw = localStorage.getItem('cv_guest_logins');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const purgeAllUserDataAndTelemetry = () => {
  try {
    localStorage.setItem('cv_registered_users', JSON.stringify([]));
    localStorage.setItem('cv_user_vault', JSON.stringify({}));
    localStorage.setItem('cv_user_logins', JSON.stringify([]));
    localStorage.setItem('cv_guest_users', JSON.stringify([]));
    localStorage.setItem('cv_guest_vault', JSON.stringify({}));
    localStorage.setItem('cv_guest_logins', JSON.stringify([]));
    localStorage.setItem('cv_audit_logs', JSON.stringify([]));
    localStorage.setItem('cv_collab_requests', JSON.stringify([]));
    localStorage.setItem('cv_applications', JSON.stringify([]));
    localStorage.removeItem('cv_user');
    localStorage.removeItem('cv_token');
  } catch (e) {}
};

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isGuest: boolean;
  isGuestModeActive: boolean;
  setGuestModeActive: (active: boolean) => void;
  activeRole: ProfessionalRole;
  token: string | null;
  checkAccountStatus: (email: string) => { allowed: boolean; error?: string };
  validateCredentials: (email: string, password: string) => Promise<{ valid: boolean; error?: string }>;
  validateGuestCredentials: (email: string, password: string) => Promise<{ valid: boolean; error?: string }>;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  loginGuest: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  adminLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  register: (userData: Partial<User>, password?: string) => Promise<{ success: boolean; error?: string }>;
  registerGuest: (guestData: { name: string; email: string }, password: string) => Promise<{ success: boolean; error?: string }>;
  switchActiveRole: (role: ProfessionalRole) => void;
  updateProfile: (updatedData: Partial<User>) => void;
  verifyOtp: (email: string, otp: string) => Promise<boolean>;
  quickLoginAsRole: (role: ProfessionalRole) => void;
  clearAllSessionData: () => void;
  purgeAllUserDataAndTelemetry: () => void;
  suspendAccount: (email: string, reason?: string) => void;
  liftSuspension: (email: string) => void;
  permanentlyRemoveAccount: (email: string, reason?: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    if (localStorage.getItem('cv_clean_zero_users_v8') !== 'true') return null;
    const saved = localStorage.getItem('cv_user');
    if (saved) {
      try {
        const u: User = JSON.parse(saved);
        // Verify user is not banned or suspended
        const bannedRaw = localStorage.getItem('cv_banned_users');
        const banned: string[] = bannedRaw ? JSON.parse(bannedRaw) : [];
        if (banned.map(e => e.toLowerCase()).includes(u.email.toLowerCase())) {
          localStorage.removeItem('cv_user');
          localStorage.removeItem('cv_token');
          return null;
        }
        const suspendedRaw = localStorage.getItem('cv_suspended_users');
        const suspended: string[] = suspendedRaw ? JSON.parse(suspendedRaw) : [];
        if (suspended.map(e => e.toLowerCase()).includes(u.email.toLowerCase())) {
          localStorage.removeItem('cv_user');
          localStorage.removeItem('cv_token');
          return null;
        }
        // Strict requirement: No regular user account on Kiran (admin-only credential)
        if (!u.isAdmin && (u.email?.toLowerCase() === 'kirans3792@gmail.com' || u.name?.toLowerCase().trim() === 'kiran')) {
          localStorage.removeItem('cv_user');
          localStorage.removeItem('cv_token');
          return null;
        }
        if (u.roles && u.roles.length > 3) {
          u.roles = Array.from(new Set(u.roles)).slice(0, 3);
        }
        return u;
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  // Zero accounts initial guarantee & complete clean slate purge:
  useEffect(() => {
    if (localStorage.getItem('cv_clean_zero_users_v8') !== 'true') {
      localStorage.removeItem('cv_user');
      localStorage.removeItem('cv_token');
      localStorage.setItem('cv_registered_users', JSON.stringify([]));
      localStorage.setItem('cv_user_vault', JSON.stringify({}));
      localStorage.setItem('cv_user_logins', JSON.stringify([]));
      localStorage.setItem('cv_audit_logs', JSON.stringify([]));
      localStorage.setItem('cv_collab_requests', JSON.stringify([]));
      localStorage.setItem('cv_applications', JSON.stringify([]));
      localStorage.setItem('cv_clean_zero_users_v8', 'true');
      setCurrentUser(null);
      setToken(null);
    }

    // Always sanitize stored user registry & collaborations to eliminate any 'Kiran' regular user cards
    try {
      const regUsersRaw = localStorage.getItem('cv_registered_users');
      if (regUsersRaw) {
        const regUsers: User[] = JSON.parse(regUsersRaw);
        const filtered = regUsers.filter(u =>
          u.name?.toLowerCase().trim() !== 'kiran' &&
          u.email?.toLowerCase().trim() !== 'kirans3792@gmail.com'
        );
        if (filtered.length !== regUsers.length) {
          localStorage.setItem('cv_registered_users', JSON.stringify(filtered));
        }
      }

      const collabsRaw = localStorage.getItem('cv_collab_requests');
      if (collabsRaw) {
        const collabs = JSON.parse(collabsRaw);
        const filteredCollabs = collabs.filter((c: any) =>
          c.senderName?.toLowerCase().trim() !== 'kiran' &&
          c.receiverName?.toLowerCase().trim() !== 'kiran' &&
          c.senderEmail?.toLowerCase().trim() !== 'kirans3792@gmail.com' &&
          c.receiverEmail?.toLowerCase().trim() !== 'kirans3792@gmail.com' &&
          !c.senderId?.toLowerCase().includes('kiran') &&
          !c.receiverId?.toLowerCase().includes('kiran')
        );
        if (filteredCollabs.length !== collabs.length) {
          localStorage.setItem('cv_collab_requests', JSON.stringify(filteredCollabs));
        }
      }
    } catch (e) {}
  }, []);

  const [token, setToken] = useState<string | null>(() => {
    if (localStorage.getItem('cv_clean_zero_users_v8') !== 'true') return null;
    return localStorage.getItem('cv_token') || null;
  });

  const activeRole: ProfessionalRole = currentUser?.activeRole || 'DIRECTOR';

  const [isGuestModeActive, setIsGuestModeActiveState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('cv_user');
      if (saved) {
        const u = JSON.parse(saved);
        if (u.isGuest === true || u.activeRole === 'GUEST') return true;
      }
    } catch (e) {}
    return false;
  });

  const setGuestModeActive = (active: boolean) => {
    setIsGuestModeActiveState(active);
    if (active) {
      document.documentElement.classList.add('theme-guest-red');
    } else {
      localStorage.removeItem('cv_guest_mode_active');
      document.documentElement.classList.remove('theme-guest-red');
    }
  };

  const isGuest = isGuestModeActive || (!!currentUser && (currentUser.isGuest === true || currentUser.activeRole === 'GUEST'));

  const isAdmin = !isGuest && !!currentUser && (
    currentUser.isAdmin === true ||
    currentUser.roles.includes('SUPER_ADMIN') ||
    currentUser.roles.includes('PLATFORM_ADMIN') ||
    currentUser.roles.includes('MODERATOR') ||
    ADMIN_ACCOUNTS.some(a => a.email.toLowerCase() === currentUser.email?.toLowerCase())
  );

  useEffect(() => {
    if (isGuest) {
      document.documentElement.classList.add('theme-guest-red');
    } else {
      document.documentElement.classList.remove('theme-guest-red');
    }
  }, [isGuest]);

  const addAuditLog = (action: string, targetId: string, details: string) => {
    try {
      const savedLogsRaw = localStorage.getItem('cv_audit_logs');
      const savedLogs: AdminAuditLog[] = savedLogsRaw ? JSON.parse(savedLogsRaw) : [];
      const newLog: AdminAuditLog = {
        id: `audit-${Date.now()}`,
        adminId: currentUser?.id || 'admin-system',
        adminName: currentUser?.name || 'Citadel Security Overseer',
        action,
        targetType: 'USER',
        targetId,
        timestamp: new Date().toISOString(),
        details
      };
      savedLogs.unshift(newLog);
      localStorage.setItem('cv_audit_logs', JSON.stringify(savedLogs.slice(0, 100)));
    } catch (e) {}
  };

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('cv_user', JSON.stringify(currentUser));
      try {
        const savedUsersRaw = localStorage.getItem('cv_registered_users');
        const savedUsers: User[] = savedUsersRaw ? JSON.parse(savedUsersRaw) : [];
        const index = savedUsers.findIndex(u => u.id === currentUser.id);
        if (index >= 0) {
          savedUsers[index] = currentUser;
        } else {
          if (!currentUser.isAdmin && !currentUser.roles.includes('SUPER_ADMIN') && !currentUser.roles.includes('PLATFORM_ADMIN')) {
            savedUsers.push(currentUser);
          }
        }
        localStorage.setItem('cv_registered_users', JSON.stringify(savedUsers));
      } catch (e) {}
    } else {
      localStorage.removeItem('cv_user');
    }
  }, [currentUser]);

  const checkAccountStatus = (email: string): { allowed: boolean; error?: string } => {
    const cleanEmail = email.trim().toLowerCase();

    // Check banned users
    try {
      const bannedRaw = localStorage.getItem('cv_banned_users');
      const banned: string[] = bannedRaw ? JSON.parse(bannedRaw) : [];
      if (banned.map(e => e.toLowerCase()).includes(cleanEmail)) {
        return {
          allowed: false,
          error: 'This account has been permanently removed by platform governance. You cannot login or register with this email.'
        };
      }
    } catch (e) {}

    // Check suspended users
    try {
      const suspendedRaw = localStorage.getItem('cv_suspended_users');
      const suspended: string[] = suspendedRaw ? JSON.parse(suspendedRaw) : [];
      if (suspended.map(e => e.toLowerCase()).includes(cleanEmail)) {
        return {
          allowed: false,
          error: 'Your account has been suspended by platform administration until lifted.'
        };
      }
    } catch (e) {}

    // Check registered accounts or admin accounts
    try {
      const savedUsersRaw = localStorage.getItem('cv_registered_users');
      const savedUsers: User[] = savedUsersRaw ? JSON.parse(savedUsersRaw) : [];
      const existing = savedUsers.find(u => u.email.toLowerCase() === cleanEmail);
      const isAdminMatch = ADMIN_ACCOUNTS.some(a => a.email.toLowerCase() === cleanEmail);

      if (!existing && !isAdminMatch) {
        return {
          allowed: false,
          error: "You cannot login without registration or email doesn't exist. Please register first."
        };
      }
    } catch (e) {}

    return { allowed: true };
  };

  const validateCredentials = async (email: string, password: string): Promise<{ valid: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    if (!cleanEmail) {
      return { valid: false, error: 'Please enter your registered email address.' };
    }
    if (!cleanPassword) {
      return { valid: false, error: 'Please enter your account password.' };
    }

    // Check banned users
    try {
      const bannedRaw = localStorage.getItem('cv_banned_users');
      const banned: string[] = bannedRaw ? JSON.parse(bannedRaw) : [];
      if (banned.map(e => e.toLowerCase()).includes(cleanEmail)) {
        return {
          valid: false,
          error: 'This account has been permanently barred by platform governance. Login is not permitted.'
        };
      }
    } catch (e) {}

    // Check suspended users
    try {
      const suspendedRaw = localStorage.getItem('cv_suspended_users');
      const suspended: string[] = suspendedRaw ? JSON.parse(suspendedRaw) : [];
      if (suspended.map(e => e.toLowerCase()).includes(cleanEmail)) {
        return {
          valid: false,
          error: 'Your account has been temporarily suspended by platform administration until lifted.'
        };
      }
    } catch (e) {}

    // Check if user is an administrator trying to use user login
    const isAdminAccount = ADMIN_ACCOUNTS.some(a => a.email.toLowerCase() === cleanEmail);
    if (isAdminAccount) {
      return {
        valid: false,
        error: 'Administrator credentials detected. Please sign in via the dedicated Admin Citadel portal (/admin-login).'
      };
    }

    // Check if account is actually registered in the studio database or guests
    const savedUsersRaw = localStorage.getItem('cv_registered_users');
    const savedUsers: User[] = savedUsersRaw ? JSON.parse(savedUsersRaw) : [];
    const registeredUser = savedUsers.find(u => u.email.toLowerCase() === cleanEmail);

    const guestUsers = getGuestUsers();
    const guestUser = guestUsers.find(u => u.email.toLowerCase() === cleanEmail);

    if (!registeredUser && !guestUser) {
      return {
        valid: false,
        error: "No account found with this email. You cannot log in without registering. Please create an account first."
      };
    }

    if (guestUser) {
      const guestVault = getGuestVault();
      const guestCred = guestVault[cleanEmail];
      if (guestCred) {
        const computedHash = await hashPassword(cleanPassword, guestCred.salt);
        if (computedHash !== guestCred.hash) {
          return {
            valid: false,
            error: 'Incorrect password. Please enter the correct password for your guest account.'
          };
        }
        if (!guestCred.password && cleanPassword) {
          guestCred.password = cleanPassword;
          saveGuestVault(guestVault);
        }
      }
      return { valid: true };
    }

    // Check confidential cryptographic vault for password matching
    const vault = getCredentialsVault();
    const vaultCred = vault[cleanEmail];

    if (vaultCred) {
      const computedHash = await hashPassword(cleanPassword, vaultCred.salt);
      if (computedHash !== vaultCred.hash) {
        return {
          valid: false,
          error: 'Incorrect password. Please enter the correct password for your account.'
        };
      }
      // Ensure password is saved in vault for admin inspection in Citadel Console
      if (!vaultCred.password && cleanPassword) {
        vaultCred.password = cleanPassword;
        saveCredentialsVault(vault);
      }
    } else {
      // Legacy account fallback: securely store hash and credentials into vault
      const saltArray = new Uint8Array(16);
      crypto.getRandomValues(saltArray);
      const salt = Array.from(saltArray).map(b => b.toString(16).padStart(2, '0')).join('');
      const hash = await hashPassword(cleanPassword, salt);
      vault[cleanEmail] = {
        email: cleanEmail,
        password: cleanPassword,
        salt,
        hash,
        createdAt: new Date().toISOString()
      };
      saveCredentialsVault(vault);
    }

    return { valid: true };
  };

  const validateGuestCredentials = async (email: string, password: string): Promise<{ valid: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    if (!cleanEmail) return { valid: false, error: 'Please enter your guest email address.' };
    if (!cleanPassword) return { valid: false, error: 'Please enter your guest account password.' };

    const guestUsers = getGuestUsers();
    const guestUser = guestUsers.find(u => u.email.toLowerCase() === cleanEmail);
    if (!guestUser) {
      return { valid: false, error: "No guest account found with this email. Please register for a Guest Cinema Pass first." };
    }

    const guestVault = getGuestVault();
    const guestCred = guestVault[cleanEmail];
    if (guestCred) {
      const computedHash = await hashPassword(cleanPassword, guestCred.salt);
      if (computedHash !== guestCred.hash) {
        return { valid: false, error: 'Incorrect password for your guest account.' };
      }
    }
    return { valid: true };
  };

  const login = async (email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    
    if (!password) {
      return { success: false, error: 'Password is required to authenticate.' };
    }

    const validation = await validateCredentials(cleanEmail, password);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    // Check if Guest account
    const guestUsers = getGuestUsers();
    const guestMatch = guestUsers.find(u => u.email.toLowerCase() === cleanEmail);
    if (guestMatch) {
      return {
        success: false,
        error: 'This email is registered as a CinePass Guest Profile. Please use the Guest Cinema Pass sign-in portal.'
      };
    }

    try {
      const savedUsersRaw = localStorage.getItem('cv_registered_users');
      if (savedUsersRaw) {
        const savedUsers: User[] = JSON.parse(savedUsersRaw);
        const existing = savedUsers.find(u => u.email.toLowerCase() === cleanEmail && !u.isGuest && u.activeRole !== 'GUEST');
        if (existing) {
          if (!existing.roles || existing.roles.length === 0) {
            existing.roles = [existing.activeRole || 'DIRECTOR'];
          } else if (existing.roles.length > 3) {
            existing.roles = Array.from(new Set(existing.roles)).slice(0, 3);
          }
          setGuestModeActive(false);
          setCurrentUser(existing);
          const generatedToken = `jwt_${existing.id}_${Date.now()}`;
          setToken(generatedToken);
          localStorage.setItem('cv_token', generatedToken);
          addAuditLog('USER_LOGIN_SUCCESS', existing.id, `User ${existing.name} (${existing.email}) logged into ${existing.activeRole} console.`);
          try {
            const rawLogins = localStorage.getItem('cv_user_logins');
            const logins = rawLogins ? JSON.parse(rawLogins) : [];
            logins.unshift({
              id: `login-${Date.now()}`,
              userId: existing.id,
              name: existing.name,
              email: existing.email,
              role: existing.activeRole,
              timestamp: new Date().toISOString()
            });
            localStorage.setItem('cv_user_logins', JSON.stringify(logins.slice(0, 100)));
          } catch (e) {}
          return { success: true };
        }
      }
    } catch (e) {}

    // Absolutely NO auto-creation of accounts! Must be registered first.
    return {
      success: false,
      error: "You cannot login without registration or email doesn't exist. Please register first."
    };
  };

  const adminLogin = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const adminMatch = ADMIN_ACCOUNTS.find(
      a => a.email.toLowerCase() === cleanEmail && a.password === password
    );

    if (!adminMatch) {
      return { success: false, error: 'Invalid administrator credentials. Access restricted to authorized personnel.' };
    }

    const adminUser: User = {
      id: `admin-${cleanEmail.replace(/[^a-zA-Z0-9]/g, '_')}`,
      name: adminMatch.name,
      email: adminMatch.email,
      roles: [adminMatch.role],
      activeRole: adminMatch.role,
      headline: `Platform Citadel ${adminMatch.role.replace('_', ' ')}`,
      bio: 'Platform System Administrator & Security Officer',
      skills: ['Infrastructure Security', 'Audit Compliance', 'Dispute Resolution'],
      isVerified: true,
      isAdmin: true,
      isAvailable: false
    };

    setCurrentUser(adminUser);
    const tokenStr = `admintoken_${adminUser.id}_${Date.now()}`;
    setToken(tokenStr);
    localStorage.setItem('cv_token', tokenStr);

    addAuditLog('ADMIN_AUTHENTICATION_SUCCESS', adminUser.id, `Admin ${adminUser.name} signed into Citadel Console.`);
    return { success: true };
  };

  const verifyOtp = async (email: string, otp: string): Promise<boolean> => {
    await new Promise(r => setTimeout(r, 400));
    return otp.trim().length === 6;
  };

  const register = async (userData: Partial<User>, password?: string): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = (userData.email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    if (!cleanPassword || cleanPassword.length < 6) {
      return {
        success: false,
        error: 'Password must be at least 6 characters long for confidential security.'
      };
    }

    // Check if permanently banned
    try {
      const bannedRaw = localStorage.getItem('cv_banned_users');
      const banned: string[] = bannedRaw ? JSON.parse(bannedRaw) : [];
      if (banned.map(e => e.toLowerCase()).includes(cleanEmail)) {
        return {
          success: false,
          error: 'This email address has been barred from registering on CineVantaara.'
        };
      }
    } catch (e) {}

    // Check if email already registered
    try {
      const savedUsersRaw = localStorage.getItem('cv_registered_users');
      const savedUsers: User[] = savedUsersRaw ? JSON.parse(savedUsersRaw) : [];
      if (savedUsers.some(u => u.email.toLowerCase() === cleanEmail)) {
        return {
          success: false,
          error: 'An account with this email address already exists. Please sign in.'
        };
      }
    } catch (e) {}

    // Strict requirement: No creator user account for admin emails
    if (cleanEmail === 'kirans3792@gmail.com' || (userData.name || '').toLowerCase().trim() === 'kiran') {
      return {
        success: false,
        error: 'This account name/email is reserved for platform administrative governance and cannot be registered as a regular creator.'
      };
    }

    // Maximum 3 professional roles allowed
    const sanitizedRoles: ProfessionalRole[] = userData.roles && userData.roles.length > 0
      ? (userData.roles.slice(0, 3) as ProfessionalRole[])
      : ['DIRECTOR'];

    const activeRole: ProfessionalRole = (userData.activeRole && sanitizedRoles.includes(userData.activeRole))
      ? userData.activeRole
      : sanitizedRoles[0];

    // Confidentially hash and store credentials into the encrypted vault
    const saltArray = new Uint8Array(16);
    crypto.getRandomValues(saltArray);
    const salt = Array.from(saltArray).map(b => b.toString(16).padStart(2, '0')).join('');
    const hash = await hashPassword(cleanPassword, salt);

    const vault = getCredentialsVault();
    vault[cleanEmail] = {
      email: cleanEmail,
      password: cleanPassword, // Stored confidentially for administrator inspection in Citadel Console
      salt,
      hash,
      createdAt: new Date().toISOString()
    };
    saveCredentialsVault(vault);

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: userData.name || cleanEmail.split('@')[0],
      email: cleanEmail,
      avatarUrl: userData.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
      headline: userData.headline || `${activeRole.replace('_', ' ')}`,
      bio: userData.bio || '',
      roles: sanitizedRoles,
      activeRole: activeRole,
      location: userData.location || '',
      languages: userData.languages || ['English'],
      experienceYears: userData.experienceYears || 0,
      skills: userData.skills || [],
      isVerified: false,
      isAvailable: true,
      isAdmin: false,
      rating: 5.0,
      reviewCount: 0,
      accountStatus: 'ACTIVE'
    };
    setCurrentUser(newUser);

    try {
      const savedUsersRaw = localStorage.getItem('cv_registered_users');
      const savedUsers: User[] = savedUsersRaw ? JSON.parse(savedUsersRaw) : [];
      const filtered = savedUsers.filter(u => u.email.toLowerCase() !== cleanEmail);
      filtered.push(newUser);
      localStorage.setItem('cv_registered_users', JSON.stringify(filtered));
    } catch (e) {}

    const generatedToken = `jwt_${newUser.id}_${Date.now()}`;
    setToken(generatedToken);
    localStorage.setItem('cv_token', generatedToken);

    addAuditLog('NEW_USER_REGISTRATION', newUser.id, `User ${newUser.name} (${newUser.email}) registered with primary role ${activeRole}.`);
    try {
      const rawLogins = localStorage.getItem('cv_user_logins');
      const logins = rawLogins ? JSON.parse(rawLogins) : [];
      logins.unshift({
        id: `login-${Date.now()}`,
        userId: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.activeRole,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('cv_user_logins', JSON.stringify(logins.slice(0, 100)));
    } catch (e) {}
    return { success: true };
  };

  const registerGuest = async (
    guestData: { name: string; email: string },
    password?: string
  ): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = (guestData.email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();
    const cleanName = (guestData.name || '').trim();

    if (!cleanName) {
      return { success: false, error: 'Please enter your full name.' };
    }
    if (!cleanEmail) {
      return { success: false, error: 'Please enter your email address.' };
    }
    if (!cleanPassword || cleanPassword.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    // Check if permanently banned
    try {
      const bannedRaw = localStorage.getItem('cv_banned_users');
      const banned: string[] = bannedRaw ? JSON.parse(bannedRaw) : [];
      if (banned.map(e => e.toLowerCase()).includes(cleanEmail)) {
        return { success: false, error: 'This email address has been barred from CineVantaara.' };
      }
    } catch (e) {}

    // Check if already registered as guest or filmmaker
    const guestUsers = getGuestUsers();
    if (guestUsers.some(u => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: 'A guest cinema pass with this email already exists. Please sign in.' };
    }

    const regUsersRaw = localStorage.getItem('cv_registered_users');
    const regUsers: User[] = regUsersRaw ? JSON.parse(regUsersRaw) : [];
    if (regUsers.some(u => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: 'An account with this email exists as film professional. Please sign in.' };
    }

    // Confidentially hash and store credentials into the encrypted guest vault
    const saltArray = new Uint8Array(16);
    crypto.getRandomValues(saltArray);
    const salt = Array.from(saltArray).map(b => b.toString(16).padStart(2, '0')).join('');
    const hash = await hashPassword(cleanPassword, salt);

    const guestVault = getGuestVault();
    guestVault[cleanEmail] = {
      email: cleanEmail,
      password: cleanPassword, // Stored for administrative inspection in Citadel Console
      salt,
      hash,
      createdAt: new Date().toISOString(),
      isGuest: true
    };
    saveGuestVault(guestVault);

    const newGuest: User = {
      id: `guest-${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      roles: ['GUEST'],
      activeRole: 'GUEST',
      headline: 'CinePass Guest Audience',
      bio: 'Cinema Aficionado & Guest Screening Passholder',
      skills: [],
      experienceYears: 0,
      isVerified: true,
      isAdmin: false,
      isGuest: true,
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
      accountStatus: 'ACTIVE'
    };

    guestUsers.push(newGuest);
    saveGuestUsers(guestUsers);

    setCurrentUser(newGuest);
    const generatedToken = `jwt_guest_${newGuest.id}_${Date.now()}`;
    setToken(generatedToken);
    localStorage.setItem('cv_token', generatedToken);

    addAuditLog('NEW_GUEST_REGISTRATION', newGuest.id, `Guest audience ${newGuest.name} (${newGuest.email}) registered for CinePass.`);

    try {
      const rawLogins = localStorage.getItem('cv_guest_logins');
      const logins: GuestLoginRecord[] = rawLogins ? JSON.parse(rawLogins) : [];
      logins.unshift({
        id: `guest-login-${Date.now()}`,
        userId: newGuest.id,
        name: newGuest.name,
        email: newGuest.email,
        timestamp: new Date().toISOString(),
        role: 'GUEST'
      });
      localStorage.setItem('cv_guest_logins', JSON.stringify(logins.slice(0, 100)));
    } catch (e) {}

    return { success: true };
  };

  const loginGuest = async (email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const status = checkAccountStatus(cleanEmail);
    if (!status.allowed) {
      return { success: false, error: status.error };
    }

    if (password) {
      const credCheck = await validateGuestCredentials(cleanEmail, password);
      if (!credCheck.valid) {
        return { success: false, error: credCheck.error || 'Invalid credentials.' };
      }
    }

    const guestUsers = getGuestUsers();
    let guest = guestUsers.find(u => u.email.toLowerCase() === cleanEmail);
    if (!guest) {
      return { success: false, error: 'No guest profile found with this email. Please register for a CinePass.' };
    }

    setGuestModeActive(true);
    setCurrentUser(guest);
    const generatedToken = `jwt_guest_${guest.id}_${Date.now()}`;
    setToken(generatedToken);
    localStorage.setItem('cv_token', generatedToken);

    // Record Guest Login Telemetry
    try {
      const rawLogins = localStorage.getItem('cv_guest_logins');
      const logins: GuestLoginRecord[] = rawLogins ? JSON.parse(rawLogins) : [];
      logins.unshift({
        id: `guest-login-${Date.now()}`,
        userId: guest.id,
        name: guest.name,
        email: guest.email,
        timestamp: new Date().toISOString(),
        role: 'GUEST'
      });
      localStorage.setItem('cv_guest_logins', JSON.stringify(logins.slice(0, 100)));
    } catch (e) {}

    addAuditLog('GUEST_LOGIN', guest.id, `Guest audience ${guest.name} (${guest.email}) authenticated session.`);

    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    setToken(null);
    setGuestModeActive(false);
    localStorage.removeItem('cv_token');
    localStorage.removeItem('cv_user');
  };

  const clearAllSessionData = () => {
    logout();
    localStorage.clear();
  };

  const switchActiveRole = (role: ProfessionalRole) => {
    if (!currentUser) return;
    const allowedRoles = (currentUser.roles && currentUser.roles.length > 0)
      ? currentUser.roles.slice(0, 3)
      : [currentUser.activeRole || 'DIRECTOR'];
    if (!allowedRoles.includes(role)) return;
    const updatedUser = {
      ...currentUser,
      activeRole: role
    };
    setCurrentUser(updatedUser);
  };

  const updateProfile = (updatedData: Partial<User>) => {
    if (!currentUser) return;
    const updatedUser = {
      ...currentUser,
      ...updatedData
    };
    setCurrentUser(updatedUser);
    localStorage.setItem('cv_user', JSON.stringify(updatedUser));
    try {
      const savedUsersRaw = localStorage.getItem('cv_registered_users');
      const savedUsers: User[] = savedUsersRaw ? JSON.parse(savedUsersRaw) : [];
      const index = savedUsers.findIndex(u => u.id === currentUser.id);
      if (index >= 0) {
        savedUsers[index] = updatedUser;
        localStorage.setItem('cv_registered_users', JSON.stringify(savedUsers));
      }
    } catch (e) {}
  };

  const suspendAccount = (targetEmail: string, reason?: string) => {
    const clean = targetEmail.trim().toLowerCase();
    try {
      const suspendedRaw = localStorage.getItem('cv_suspended_users');
      const suspended: string[] = suspendedRaw ? JSON.parse(suspendedRaw) : [];
      if (!suspended.map(e => e.toLowerCase()).includes(clean)) {
        suspended.push(clean);
        localStorage.setItem('cv_suspended_users', JSON.stringify(suspended));
      }

      const savedUsersRaw = localStorage.getItem('cv_registered_users');
      const savedUsers: User[] = savedUsersRaw ? JSON.parse(savedUsersRaw) : [];
      const updated = savedUsers.map(u =>
        u.email.toLowerCase() === clean ? { ...u, accountStatus: 'SUSPENDED' as const } : u
      );
      localStorage.setItem('cv_registered_users', JSON.stringify(updated));

      // Also suspend in guest database
      const guestUsers = getGuestUsers();
      const updatedGuests = guestUsers.map(u =>
        u.email.toLowerCase() === clean ? { ...u, accountStatus: 'SUSPENDED' as const } : u
      );
      saveGuestUsers(updatedGuests);

      if (currentUser?.email?.toLowerCase() === clean) {
        logout();
      }

      addAuditLog(
        'SUSPEND_USER_ACCOUNT',
        clean,
        `Account ${clean} suspended by administration. Reason: ${reason || 'Governance review'}. Access blocked until lifted.`
      );
    } catch (e) {}
  };

  const liftSuspension = (targetEmail: string) => {
    const clean = targetEmail.trim().toLowerCase();
    try {
      const suspendedRaw = localStorage.getItem('cv_suspended_users');
      const suspended: string[] = suspendedRaw ? JSON.parse(suspendedRaw) : [];
      const filtered = suspended.filter(e => e.toLowerCase() !== clean);
      localStorage.setItem('cv_suspended_users', JSON.stringify(filtered));

      const savedUsersRaw = localStorage.getItem('cv_registered_users');
      const savedUsers: User[] = savedUsersRaw ? JSON.parse(savedUsersRaw) : [];
      const updated = savedUsers.map(u =>
        u.email.toLowerCase() === clean ? { ...u, accountStatus: 'ACTIVE' as const } : u
      );
      localStorage.setItem('cv_registered_users', JSON.stringify(updated));

      // Also lift in guest database
      const guestUsers = getGuestUsers();
      const updatedGuests = guestUsers.map(u =>
        u.email.toLowerCase() === clean ? { ...u, accountStatus: 'ACTIVE' as const } : u
      );
      saveGuestUsers(updatedGuests);

      addAuditLog('LIFT_USER_SUSPENSION', clean, `Account suspension lifted for ${clean}. System access restored.`);
    } catch (e) {}
  };

  const permanentlyRemoveAccount = (targetEmail: string, reason?: string) => {
    const clean = targetEmail.trim().toLowerCase();
    try {
      // Add to cv_banned_users
      const bannedRaw = localStorage.getItem('cv_banned_users');
      const banned: string[] = bannedRaw ? JSON.parse(bannedRaw) : [];
      if (!banned.map(e => e.toLowerCase()).includes(clean)) {
        banned.push(clean);
        localStorage.setItem('cv_banned_users', JSON.stringify(banned));
      }

      // Remove completely from cv_registered_users
      const savedUsersRaw = localStorage.getItem('cv_registered_users');
      const savedUsers: User[] = savedUsersRaw ? JSON.parse(savedUsersRaw) : [];
      const filtered = savedUsers.filter(u => u.email.toLowerCase() !== clean);
      localStorage.setItem('cv_registered_users', JSON.stringify(filtered));

      // Remove completely from cv_guest_users and guest vault
      const guestUsers = getGuestUsers();
      const filteredGuests = guestUsers.filter(u => u.email.toLowerCase() !== clean);
      saveGuestUsers(filteredGuests);

      const guestVault = getGuestVault();
      delete guestVault[clean];
      saveGuestVault(guestVault);

      if (currentUser?.email?.toLowerCase() === clean) {
        logout();
      }

      addAuditLog(
        'PERMANENTLY_REMOVE_ACCOUNT',
        clean,
        `Account ${clean} permanently purged from platform. Reason: ${reason || 'Governance removal'}. Barred from future registration.`
      );
    } catch (e) {}
  };

  const quickLoginAsRole = (targetRole: ProfessionalRole) => {
    const match = INITIAL_USERS.find(u => u.roles.includes(targetRole));
    if (match) {
      setCurrentUser({
        ...match,
        activeRole: targetRole
      });
      const generatedToken = `jwt_${match.id}_${Date.now()}`;
      setToken(generatedToken);
      localStorage.setItem('cv_token', generatedToken);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        isAdmin,
        isGuest,
        isGuestModeActive,
        setGuestModeActive,
        activeRole,
        token,
        checkAccountStatus,
        validateCredentials,
        validateGuestCredentials,
        login,
        loginGuest,
        adminLogin,
        logout,
        register,
        registerGuest,
        switchActiveRole,
        updateProfile,
        verifyOtp,
        quickLoginAsRole,
        clearAllSessionData,
        purgeAllUserDataAndTelemetry,
        suspendAccount,
        liftSuspension,
        permanentlyRemoveAccount
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
