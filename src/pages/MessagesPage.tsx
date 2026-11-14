import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { User } from '../types';
import { CallModal } from '../components/messaging/CallModal';
import { realtimeMessaging, RealtimeEncryptedMessage } from '../services/realtimeMessaging';
import {
  Send,
  Phone,
  Video,
  ShieldCheck,
  Lock,
  Search,
  CheckCheck,
  MessageSquare,
  Users,
  Shield,
  EyeOff,
  Radio,
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { ReportUserModal } from '../components/common/ReportUserModal';

interface LocalMessage {
  id: string;
  senderId: string;
  senderName: string;
  cipherText: string;
  plainText: string;
  time: string;
  isMine: boolean;
}

export const MessagesPage: React.FC = () => {
  const { currentUser, isAdmin } = useAuth();
  const { addNotification } = useNotifications();
  const [searchParams] = useSearchParams();

  // If administrator, enforce strict privacy guardrail (zero chat backdoor)
  if (isAdmin) {
    return (
      <div className="min-h-[82vh] flex items-center justify-center p-6">
        <div className="max-w-md w-full p-8 rounded-3xl bg-[#111218] border border-red-500/30 text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 mx-auto flex items-center justify-center">
            <EyeOff className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-cinematic font-bold text-white uppercase tracking-wider">
            Admin Chat Access Restricted
          </h2>
          <p className="text-xs text-gray-300 leading-relaxed font-sans">
            In compliance with platform cryptographic governance, all private creator communications are client-side end-to-end encrypted (<code className="text-amber-400 font-mono">AES-GCM 256-bit</code>). Platform administrators have zero access or backdoor to private conversations.
          </p>
          <div className="pt-2">
            <Link
              to="/admin"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider bg-red-600 hover:bg-red-500 text-white transition-all shadow-md"
            >
              <Shield className="w-4 h-4" />
              <span>Return to Citadel Governance</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  // Real registered users (excluding administrators)
  const [conversations, setConversations] = useState<User[]>(() => {
    let pool: User[] = [];
    try {
      const saved = localStorage.getItem('cv_registered_users');
      if (saved) {
        pool = JSON.parse(saved);
      }
    } catch (e) {}

    const combined = [...pool];
    const unique = Array.from(new Map(combined.map(u => [u.id, u])).values());
    return unique.filter(u =>
      u.id !== currentUser?.id &&
      !u.isAdmin &&
      !u.roles.includes('SUPER_ADMIN') &&
      !u.roles.includes('PLATFORM_ADMIN') &&
      u.name?.toLowerCase().trim() !== 'kiran' &&
      u.email?.toLowerCase().trim() !== 'kirans3792@gmail.com'
    );
  });

  const [selectedUser, setSelectedUser] = useState<User | null>(() => {
    const targetId = searchParams.get('userId');
    const targetName = searchParams.get('userName');
    if (targetId) {
      const found = conversations.find(u => u.id === targetId);
      if (found) return found;
    }
    if (targetName) {
      const found = conversations.find(u => u.name.toLowerCase() === targetName.toLowerCase());
      if (found) return found;
      // Synthesize user for immediate reply
      const synthesized: User = {
        id: targetId || `user-${Date.now()}`,
        name: targetName,
        email: `${targetName.toLowerCase().replace(/\s+/g, '.')}@cinevantaara.com`,
        roles: ['DIRECTOR'],
        activeRole: 'DIRECTOR',
        skills: ['Film Collaborator'],
        isVerified: true,
        isAvailable: true
      };
      return synthesized;
    }
    return conversations.length > 0 ? conversations[0] : null;
  });
  const [messages, setMessages] = useState<RealtimeEncryptedMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isCalling, setIsCalling] = useState(false);
  const [isVideoCall, setIsVideoCall] = useState(false);
  const [isRealtimeActive, setIsRealtimeActive] = useState(true);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Helper for symmetric conversation ID
  const getConvoId = (id1: string, id2: string) => {
    return 'cv_chat_' + [id1, id2].sort().join('__');
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Real-time synchronization & history load
  useEffect(() => {
    if (!selectedUser) {
      setMessages([]);
      return;
    }

    const currentId = currentUser?.id || 'me';
    const convoId = getConvoId(currentId, selectedUser.id);

    // 1. Load message history from Backend REST API + Cache
    let isCancelled = false;
    realtimeMessaging.fetchHistory(convoId, currentId).then((history) => {
      if (!isCancelled) {
        setMessages(history);
        setTimeout(scrollToBottom, 100);
      }
    });

    // 2. Subscribe to Real-Time incoming messages (WebSocket + Cross-Tab Broadcast)
    const unsubscribe = realtimeMessaging.subscribe(convoId, (incoming) => {
      setMessages((prev) => {
        // Prevent duplicate appending
        if (prev.some(m => m.id === incoming.id)) return prev;
        const isMine = incoming.senderId === currentId;
        const calibrated: RealtimeEncryptedMessage = {
          ...incoming,
          isMine
        };
        return [...prev, calibrated];
      });
      setTimeout(scrollToBottom, 100);
    });

    return () => {
      isCancelled = true;
      unsubscribe();
    };
  }, [selectedUser, currentUser]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedUser) return;

    const currentId = currentUser?.id || 'me';
    const convoId = getConvoId(currentId, selectedUser.id);
    const textToSend = inputText.trim();
    setInputText('');

    // Encrypt client-side & dispatch across real-time WebSocket + BroadcastChannel + REST
    const sentMsg = await realtimeMessaging.sendMessage({
      conversationId: convoId,
      senderId: currentId,
      senderName: currentUser?.name || 'You',
      recipientId: selectedUser.id,
      plainText: textToSend
    });

    setMessages((prev) => {
      if (prev.some(m => m.id === sentMsg.id)) return prev;
      return [...prev, sentMsg];
    });
    setTimeout(scrollToBottom, 100);

    // Dispatched to recipient's notification queue
    addNotification({
      userId: selectedUser.id,
      title: `Encrypted Message from ${currentUser?.name || 'Collaborator'}`,
      message: `"${textToSend.slice(0, 65)}..."`,
      type: 'MESSAGE',
      linkUrl: `/messages?userId=${currentId}`
    });
  };

  const startCall = (video: boolean) => {
    if (!selectedUser) return;
    setIsVideoCall(video);
    setIsCalling(true);
  };

  return (
    <div className="h-[calc(100vh-5rem)] max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 flex gap-6">
      
      {/* Sidebar: Conversations List */}
      <div className="chat-sidebar w-80 md:w-96 flex flex-col rounded-3xl bg-[#111218] border border-white/10 overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-cinematic font-bold text-white">Backlot Dispatch</h2>
            <div className="flex items-center space-x-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <Lock className="w-3 h-3" />
              <span>AES-256 E2EE</span>
            </div>
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto divide-y divide-white/5">
          {conversations.length > 0 ? (
            conversations.map(u => {
              const isSelected = selectedUser?.id === u.id;
              return (
                <button
                  key={u.id}
                  onClick={() => setSelectedUser(u)}
                  className={`chat-contact-item w-full p-4 flex items-center space-x-3 text-left transition-colors ${
                    isSelected ? 'bg-amber-500/10 border-l-4 border-amber-500 active-contact' : 'hover:bg-white/5'
                  }`}
                >
                  <div className="relative">
                    <img
                      src={u.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                      alt={u.name}
                      className="w-12 h-12 rounded-full object-cover border border-amber-500/30"
                    />
                    {u.isAvailable && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#111218] rounded-full" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="chat-contact-name text-xs font-bold text-white truncate">{u.name}</span>
                    </div>
                    <div className="chat-contact-role text-[11px] text-amber-300/80 font-medium">{u.activeRole}</div>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="p-8 text-center text-xs text-gray-500 space-y-2">
              <Users className="w-8 h-8 text-gray-600 mx-auto" />
              <div>No Contacts Available</div>
              <p className="text-[11px] text-gray-600">Connect with artists in the Talent Directory to initiate conversations.</p>
              <Link to="/talent" className="inline-block mt-2 text-amber-400 hover:underline font-semibold">
                Go to Talent Directory →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Stage */}
      <div className="chat-main-stage flex-1 flex flex-col rounded-3xl bg-[#111218] border border-white/10 overflow-hidden shadow-2xl">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-black/20">
              <div className="flex items-center space-x-3">
                <img
                  src={selectedUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                  alt={selectedUser.name}
                  className="w-11 h-11 rounded-full object-cover border border-amber-500/40"
                />
                <div>
                  <div className="chat-header-title text-sm font-cinematic font-bold text-white flex items-center space-x-2">
                    <span>{selectedUser.name}</span>
                    <span className="text-[10px] text-amber-400 font-mono uppercase bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                      {selectedUser.activeRole}
                    </span>
                  </div>
                  <div className="text-xs text-emerald-400 flex items-center space-x-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>E2EE Ready • Client-Held Key</span>
                  </div>
                </div>
              </div>

              {/* Audio & Video Call Action Buttons */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => startCall(false)}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition-colors"
                  title="WebRTC Encrypted Audio Call"
                >
                  <Phone className="w-4 h-4 text-emerald-400" />
                </button>
                <button
                  onClick={() => startCall(true)}
                  className="p-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20 transition-colors"
                  title="WebRTC Director Video Conference"
                >
                  <Video className="w-4 h-4 text-amber-400" />
                </button>
                <button
                  onClick={() => setIsReportModalOpen(true)}
                  className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors"
                  title="Report User to Citadel Security"
                >
                  <ShieldAlert className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>

            {/* Security Notice Banner */}
            <div className="px-4 py-2 bg-black/40 border-b border-white/5 text-[11px] text-gray-400 flex items-center justify-center space-x-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Messages are encrypted client-side using AES-GCM 256-bit. No administrator or server backdoor exists.</span>
            </div>

            {/* Message Feed */}
            <div className="chat-message-feed flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
              {messages.length > 0 ? (
                messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.isMine ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-md p-4 rounded-2xl text-xs sm:text-sm font-sans space-y-1.5 ${
                        msg.isMine
                          ? 'chat-bubble-outgoing bg-amber-500 text-black shadow-glow-gold rounded-tr-none font-medium'
                          : 'chat-bubble-incoming bg-[#181920] text-gray-200 border border-white/10 rounded-tl-none'
                      }`}
                    >
                      <div className="chat-bubble-text">{msg.plainText}</div>
                      <div
                        className={`chat-bubble-time text-[9px] font-mono flex items-center justify-end space-x-1 ${
                          msg.isMine ? 'text-black/70' : 'text-gray-500'
                        }`}
                      >
                        <span>{msg.time}</span>
                        {msg.isMine && <CheckCheck className="w-3 h-3 inline" />}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-2 text-gray-500">
                  <MessageSquare className="w-10 h-10 text-gray-600" />
                  <div className="text-sm font-bold text-gray-300">Clean Dispatch Channel</div>
                  <p className="text-xs max-w-sm">
                    No messages in this thread yet. Type below to send a confidential, client-encrypted message.
                  </p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input Box */}
            <form onSubmit={handleSendMessage} className="chat-input-bar p-4 border-t border-white/10 bg-black/20 flex items-center space-x-3">
              <input
                type="text"
                placeholder="Type confidential message to talent / studio..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="chat-input-field flex-1 px-4 py-3 rounded-2xl bg-black/50 border border-white/10 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors"
              />
              <button
                type="submit"
                className="p-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black shadow-glow-gold transition-transform hover:scale-105"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3 text-gray-500">
            <MessageSquare className="w-12 h-12 text-gray-600" />
            <div className="text-base font-cinematic font-bold text-white">Backlot Communications</div>
            <p className="text-xs max-w-sm">
              Select or initiate a creative collaboration from the Talent Directory or Opportunities deck to start an encrypted channel.
            </p>
          </div>
        )}
      </div>

      {/* WebRTC Video / Audio Call Modal */}
      {selectedUser && (
        <>
          <CallModal
            isOpen={isCalling}
            isVideoCall={isVideoCall}
            participantName={selectedUser.name}
            participantAvatar={selectedUser.avatarUrl}
            onEndCall={() => setIsCalling(false)}
          />
          <ReportUserModal
            targetUser={selectedUser}
            isOpen={isReportModalOpen}
            onClose={() => setIsReportModalOpen(false)}
          />
        </>
      )}
    </div>
  );
};
