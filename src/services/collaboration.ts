/**
 * Real-time Collaboration Service
 * WebRTC and Supabase Realtime integration for collaborative coding
 */

import { log } from '@/utils/logger';
import { generateId } from '@/utils/api';
import { supabase } from '@/integrations/supabase/client';

// Types
export interface CollaborationSession {
  id: string;
  projectId: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  participants: Collaborator[];
  settings: CollaborationSettings;
}

export interface Collaborator {
  id: string;
  userId: string;
  username: string;
  avatarUrl?: string;
  role: 'owner' | 'editor' | 'viewer';
  joinedAt: Date;
  lastSeen: Date;
  cursor?: CursorPosition;
  selection?: SelectionRange;
  isOnline: boolean;
  color: string;
}

export interface CursorPosition {
  line: number;
  column: number;
  fileId: string;
}

export interface SelectionRange {
  startLine: number;
  startColumn: number;
  endLine: number;
  endColumn: number;
  fileId: string;
}

export interface CollaborationSettings {
  allowAnonymous: boolean;
  requireApproval: boolean;
  maxParticipants: number;
  allowFileCreation: boolean;
  allowFileDeletion: boolean;
  allowFileRename: boolean;
  allowProjectSettings: boolean;
  autoSave: boolean;
  autoSaveInterval: number; // seconds
  conflictResolution: 'manual' | 'automatic' | 'last-writer-wins';
}

export interface CollaborationEvent {
  id: string;
  sessionId: string;
  type: 'join' | 'leave' | 'cursor-move' | 'selection-change' | 'file-change' | 'file-open' | 'file-close' | 'comment' | 'typing';
  userId: string;
  timestamp: Date;
  data: any;
}

export interface CollaborationComment {
  id: string;
  sessionId: string;
  fileId: string;
  userId: string;
  username: string;
  content: string;
  position: CursorPosition;
  createdAt: Date;
  updatedAt: Date;
  replies: CollaborationComment[];
  resolved: boolean;
}

export interface TypingIndicator {
  userId: string;
  username: string;
  fileId: string;
  isTyping: boolean;
  timestamp: Date;
}

export interface ConflictResolution {
  id: string;
  sessionId: string;
  fileId: string;
  conflictType: 'simultaneous-edit' | 'file-delete' | 'file-rename';
  participants: string[];
  resolution: 'manual' | 'automatic' | 'resolved';
  createdAt: Date;
  resolvedAt?: Date;
  resolvedBy?: string;
}

// Default settings
const DEFAULT_SETTINGS: CollaborationSettings = {
  allowAnonymous: false,
  requireApproval: false,
  maxParticipants: 10,
  allowFileCreation: true,
  allowFileDeletion: false,
  allowFileRename: true,
  allowProjectSettings: false,
  autoSave: true,
  autoSaveInterval: 30,
  conflictResolution: 'last-writer-wins',
};

// Color palette for collaborators
const COLLABORATOR_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
];

class CollaborationService {
  private sessions: Map<string, CollaborationSession> = new Map();
  private participants: Map<string, Collaborator> = new Map();
  private eventListeners: Map<string, Function[]> = new Map();
  private typingIndicators: Map<string, TypingIndicator> = new Map();
  private conflicts: Map<string, ConflictResolution> = new Map();
  private comments: Map<string, CollaborationComment[]> = new Map();
  private isConnected = false;
  private currentSession: CollaborationSession | null = null;
  private currentUser: Collaborator | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  constructor() {
    this.initializeService();
    log.info('Collaboration Service initialized', {}, 'COLLABORATION');
  }

  /**
   * Initialize the collaboration service
   */
  private async initializeService(): Promise<void> {
    try {
      // Set up Supabase realtime subscription
      await this.setupRealtimeSubscription();
      
      // Set up WebRTC for peer-to-peer communication
      await this.setupWebRTC();
      
      this.isConnected = true;
      log.info('Collaboration service connected', {}, 'COLLABORATION');
      
    } catch (error) {
      log.error('Failed to initialize collaboration service', error as Error, 'COLLABORATION');
      this.scheduleReconnect();
    }
  }

  /**
   * Create a new collaboration session
   */
  async createSession(projectId: string, name: string, description?: string, settings?: Partial<CollaborationSettings>): Promise<CollaborationSession> {
    try {
      const sessionId = generateId('session');
      const session: CollaborationSession = {
        id: sessionId,
        projectId,
        name,
        description,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'current-user-id', // This would come from auth
        participants: [],
        settings: { ...DEFAULT_SETTINGS, ...settings },
      };

      // Save to Supabase
      const { error } = await supabase
        .from('collaboration_sessions')
        .insert([{
          id: sessionId,
          project_id: projectId,
          name,
          description,
          is_active: true,
          created_by: session.createdBy,
          settings: session.settings,
          created_at: session.createdAt.toISOString(),
          updated_at: session.updatedAt.toISOString(),
        }]);

      if (error) {
        throw new Error(`Failed to create session: ${error.message}`);
      }

      this.sessions.set(sessionId, session);
      this.emit('session-created', session);

      log.user('Collaboration session created', { sessionId, projectId, name }, 'COLLABORATION');
      return session;

    } catch (error) {
      log.error('Failed to create collaboration session', error as Error, 'COLLABORATION');
      throw error;
    }
  }

  /**
   * Join a collaboration session
   */
  async joinSession(sessionId: string, userId: string, username: string, role: 'owner' | 'editor' | 'viewer' = 'editor'): Promise<Collaborator> {
    try {
      const session = this.sessions.get(sessionId);
      if (!session) {
        throw new Error('Session not found');
      }

      if (session.participants.length >= session.settings.maxParticipants) {
        throw new Error('Session is full');
      }

      // Check if user is already in session
      const existingParticipant = session.participants.find(p => p.userId === userId);
      if (existingParticipant) {
        existingParticipant.isOnline = true;
        existingParticipant.lastSeen = new Date();
        this.currentUser = existingParticipant;
        this.emit('participant-rejoined', existingParticipant);
        return existingParticipant;
      }

      // Create new participant
      const participant: Collaborator = {
        id: generateId('participant'),
        userId,
        username,
        role,
        joinedAt: new Date(),
        lastSeen: new Date(),
        isOnline: true,
        color: this.getNextAvailableColor(session.participants),
      };

      session.participants.push(participant);
      session.updatedAt = new Date();

      // Save to Supabase
      const { error } = await supabase
        .from('collaboration_participants')
        .insert([{
          id: participant.id,
          session_id: sessionId,
          user_id: userId,
          username,
          role,
          color: participant.color,
          joined_at: participant.joinedAt.toISOString(),
          last_seen: participant.lastSeen.toISOString(),
          is_online: true,
        }]);

      if (error) {
        throw new Error(`Failed to join session: ${error.message}`);
      }

      this.participants.set(participant.id, participant);
      this.currentUser = participant;
      this.currentSession = session;

      // Emit events
      this.emit('participant-joined', participant);
      this.emit('session-updated', session);

      log.user('Joined collaboration session', { sessionId, userId, username, role }, 'COLLABORATION');
      return participant;

    } catch (error) {
      log.error('Failed to join collaboration session', error as Error, 'COLLABORATION');
      throw error;
    }
  }

  /**
   * Leave a collaboration session
   */
  async leaveSession(sessionId: string, userId: string): Promise<void> {
    try {
      const session = this.sessions.get(sessionId);
      if (!session) return;

      const participant = session.participants.find(p => p.userId === userId);
      if (!participant) return;

      participant.isOnline = false;
      participant.lastSeen = new Date();

      // Update in Supabase
      await supabase
        .from('collaboration_participants')
        .update({
          is_online: false,
          last_seen: participant.lastSeen.toISOString(),
        })
        .eq('id', participant.id);

      // Remove from local state
      this.participants.delete(participant.id);
      if (this.currentUser?.id === participant.id) {
        this.currentUser = null;
        this.currentSession = null;
      }

      // Emit events
      this.emit('participant-left', participant);
      this.emit('session-updated', session);

      log.user('Left collaboration session', { sessionId, userId }, 'COLLABORATION');

    } catch (error) {
      log.error('Failed to leave collaboration session', error as Error, 'COLLABORATION');
    }
  }

  /**
   * Update cursor position
   */
  updateCursor(fileId: string, line: number, column: number): void {
    if (!this.currentUser || !this.currentSession) return;

    const cursor: CursorPosition = { fileId, line, column };
    this.currentUser.cursor = cursor;

    // Emit cursor update
    this.emit('cursor-updated', {
      userId: this.currentUser.userId,
      username: this.currentUser.username,
      cursor,
      timestamp: new Date(),
    });

    // Broadcast to other participants via WebRTC
    this.broadcastToPeers('cursor-update', {
      userId: this.currentUser.userId,
      cursor,
    });
  }

  /**
   * Update selection range
   */
  updateSelection(fileId: string, startLine: number, startColumn: number, endLine: number, endColumn: number): void {
    if (!this.currentUser || !this.currentSession) return;

    const selection: SelectionRange = { fileId, startLine, startColumn, endLine, endColumn };
    this.currentUser.selection = selection;

    // Emit selection update
    this.emit('selection-updated', {
      userId: this.currentUser.userId,
      username: this.currentUser.username,
      selection,
      timestamp: new Date(),
    });

    // Broadcast to other participants
    this.broadcastToPeers('selection-update', {
      userId: this.currentUser.userId,
      selection,
    });
  }

  /**
   * Send typing indicator
   */
  sendTypingIndicator(fileId: string, isTyping: boolean): void {
    if (!this.currentUser) return;

    const indicator: TypingIndicator = {
      userId: this.currentUser.userId,
      username: this.currentUser.username,
      fileId,
      isTyping,
      timestamp: new Date(),
    };

    this.typingIndicators.set(this.currentUser.userId, indicator);

    // Emit typing indicator
    this.emit('typing-indicator', indicator);

    // Broadcast to other participants
    this.broadcastToPeers('typing-indicator', indicator);

    // Auto-clear typing indicator after 3 seconds
    if (isTyping) {
      setTimeout(() => {
        this.sendTypingIndicator(fileId, false);
      }, 3000);
    }
  }

  /**
   * Add a comment
   */
  async addComment(fileId: string, content: string, position: CursorPosition): Promise<CollaborationComment> {
    if (!this.currentUser || !this.currentSession) {
      throw new Error('Not in a collaboration session');
    }

    try {
      const comment: CollaborationComment = {
        id: generateId('comment'),
        sessionId: this.currentSession.id,
        fileId,
        userId: this.currentUser.userId,
        username: this.currentUser.username,
        content,
        position,
        createdAt: new Date(),
        updatedAt: new Date(),
        replies: [],
        resolved: false,
      };

      // Save to Supabase
      const { error } = await supabase
        .from('collaboration_comments')
        .insert([{
          id: comment.id,
          session_id: comment.sessionId,
          file_id: fileId,
          user_id: comment.userId,
          username: comment.username,
          content,
          position: comment.position,
          created_at: comment.createdAt.toISOString(),
          updated_at: comment.updatedAt.toISOString(),
          resolved: false,
        }]);

      if (error) {
        throw new Error(`Failed to add comment: ${error.message}`);
      }

      // Add to local state
      const fileComments = this.comments.get(fileId) || [];
      fileComments.push(comment);
      this.comments.set(fileId, fileComments);

      // Emit comment added event
      this.emit('comment-added', comment);

      // Broadcast to other participants
      this.broadcastToPeers('comment-added', comment);

      log.user('Comment added', { commentId: comment.id, fileId, userId: this.currentUser.userId }, 'COLLABORATION');
      return comment;

    } catch (error) {
      log.error('Failed to add comment', error as Error, 'COLLABORATION');
      throw error;
    }
  }

  /**
   * Resolve a comment
   */
  async resolveComment(commentId: string): Promise<void> {
    try {
      // Update in Supabase
      const { error } = await supabase
        .from('collaboration_comments')
        .update({ resolved: true })
        .eq('id', commentId);

      if (error) {
        throw new Error(`Failed to resolve comment: ${error.message}`);
      }

      // Update local state
      for (const [fileId, comments] of this.comments.entries()) {
        const comment = comments.find(c => c.id === commentId);
        if (comment) {
          comment.resolved = true;
          comment.updatedAt = new Date();
          break;
        }
      }

      // Emit comment resolved event
      this.emit('comment-resolved', { commentId });

      // Broadcast to other participants
      this.broadcastToPeers('comment-resolved', { commentId });

      log.user('Comment resolved', { commentId }, 'COLLABORATION');

    } catch (error) {
      log.error('Failed to resolve comment', error as Error, 'COLLABORATION');
      throw error;
    }
  }

  /**
   * Get comments for a file
   */
  getComments(fileId: string): CollaborationComment[] {
    return this.comments.get(fileId) || [];
  }

  /**
   * Get all participants in current session
   */
  getParticipants(): Collaborator[] {
    return this.currentSession?.participants || [];
  }

  /**
   * Get online participants
   */
  getOnlineParticipants(): Collaborator[] {
    return this.getParticipants().filter(p => p.isOnline);
  }

  /**
   * Get typing indicators
   */
  getTypingIndicators(): TypingIndicator[] {
    return Array.from(this.typingIndicators.values()).filter(i => i.isTyping);
  }

  /**
   * Event system
   */
  on(event: string, callback: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  off(event: string, callback: Function): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, data: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          log.error('Event listener error', error as Error, 'COLLABORATION');
        }
      });
    }
  }

  /**
   * WebRTC setup
   */
  private async setupWebRTC(): Promise<void> {
    // WebRTC implementation would go here
    // This is a placeholder for the actual WebRTC setup
    log.info('WebRTC setup placeholder', {}, 'COLLABORATION');
  }

  /**
   * Supabase realtime subscription
   */
  private async setupRealtimeSubscription(): Promise<void> {
    try {
      // Subscribe to collaboration events
      const channel = supabase
        .channel('collaboration-events')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'collaboration_sessions'
        }, (payload) => {
          this.handleRealtimeEvent('session', payload);
        })
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'collaboration_participants'
        }, (payload) => {
          this.handleRealtimeEvent('participant', payload);
        })
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'collaboration_comments'
        }, (payload) => {
          this.handleRealtimeEvent('comment', payload);
        })
        .subscribe();

      log.info('Supabase realtime subscription established', {}, 'COLLABORATION');

    } catch (error) {
      log.error('Failed to setup realtime subscription', error as Error, 'COLLABORATION');
      throw error;
    }
  }

  /**
   * Handle realtime events
   */
  private handleRealtimeEvent(type: string, payload: any): void {
    log.debug('Received realtime event', { type, event: payload.eventType }, 'COLLABORATION');
    
    switch (type) {
      case 'session':
        this.handleSessionEvent(payload);
        break;
      case 'participant':
        this.handleParticipantEvent(payload);
        break;
      case 'comment':
        this.handleCommentEvent(payload);
        break;
    }
  }

  private handleSessionEvent(payload: any): void {
    // Handle session-related realtime events
    this.emit('realtime-session-event', payload);
  }

  private handleParticipantEvent(payload: any): void {
    // Handle participant-related realtime events
    this.emit('realtime-participant-event', payload);
  }

  private handleCommentEvent(payload: any): void {
    // Handle comment-related realtime events
    this.emit('realtime-comment-event', payload);
  }

  /**
   * Broadcast to peers via WebRTC
   */
  private broadcastToPeers(event: string, data: any): void {
    // WebRTC peer-to-peer broadcasting would go here
    log.debug('Broadcasting to peers', { event }, 'COLLABORATION');
  }

  /**
   * Get next available color for collaborator
   */
  private getNextAvailableColor(participants: Collaborator[]): string {
    const usedColors = participants.map(p => p.color);
    const availableColor = COLLABORATOR_COLORS.find(color => !usedColors.includes(color));
    return availableColor || COLLABORATOR_COLORS[0];
  }

  /**
   * Reconnection logic
   */
  private scheduleReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
      
      log.info('Scheduling reconnection attempt', { attempt: this.reconnectAttempts, delay }, 'COLLABORATION');

      setTimeout(() => {
        this.initializeService();
      }, delay);
    } else {
      log.error('Max reconnection attempts reached', {}, 'COLLABORATION');
      this.emit('connection-failed', { reason: 'max-attempts-reached' });
    }
  }

  /**
   * Cleanup
   */
  async cleanup(): Promise<void> {
    try {
      // Leave current session
      if (this.currentUser && this.currentSession) {
        await this.leaveSession(this.currentSession.id, this.currentUser.userId);
      }

      // Clear local state
      this.sessions.clear();
      this.participants.clear();
      this.eventListeners.clear();
      this.typingIndicators.clear();
      this.conflicts.clear();
      this.comments.clear();

      this.isConnected = false;
      this.currentSession = null;
      this.currentUser = null;

      log.info('Collaboration service cleaned up', {}, 'COLLABORATION');
        
      } catch (error) {
      log.error('Failed to cleanup collaboration service', error as Error, 'COLLABORATION');
    }
  }

  /**
   * Get connection status
   */
  isServiceConnected(): boolean {
    return this.isConnected;
  }

  /**
   * Get current session
   */
  getCurrentSession(): CollaborationSession | null {
    return this.currentSession;
  }

  /**
   * Get current user
   */
  getCurrentUser(): Collaborator | null {
    return this.currentUser;
  }
}

// Create singleton instance
export const collaborationService = new CollaborationService();

// Export types and service
export default collaborationService;
export { CollaborationService };