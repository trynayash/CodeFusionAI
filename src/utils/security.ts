/**
 * Security Utilities
 * Comprehensive security hardening for XSS, CSRF, and input validation
 */

import { log } from './logger';

// CSRF Token Management
class CSRFTokenManager {
  private static instance: CSRFTokenManager;
  private token: string | null = null;
  private tokenExpiry: number = 0;
  private readonly TOKEN_LIFETIME = 30 * 60 * 1000; // 30 minutes

  static getInstance(): CSRFTokenManager {
    if (!CSRFTokenManager.instance) {
      CSRFTokenManager.instance = new CSRFTokenManager();
    }
    return CSRFTokenManager.instance;
  }

  private generateToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  getToken(): string {
    const now = Date.now();
    
    if (!this.token || now > this.tokenExpiry) {
      this.token = this.generateToken();
      this.tokenExpiry = now + this.TOKEN_LIFETIME;
      
      // Store in sessionStorage for server validation
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('csrf_token', this.token);
        sessionStorage.setItem('csrf_token_expiry', this.tokenExpiry.toString());
      }
      
      log.security('CSRF token generated', { tokenLength: this.token.length });
    }
    
    return this.token;
  }

  validateToken(token: string): boolean {
    const now = Date.now();
    const isValid = this.token === token && now <= this.tokenExpiry;
    
    if (!isValid) {
      log.security('CSRF token validation failed', { 
        provided: token?.substring(0, 8) + '...', 
        expected: this.token?.substring(0, 8) + '...',
        expired: now > this.tokenExpiry 
      });
    }
    
    return isValid;
  }

  refreshToken(): string {
    this.token = null;
    return this.getToken();
  }
}

export const csrfTokenManager = CSRFTokenManager.getInstance();

// XSS Protection
export class XSSProtection {
  private static readonly DANGEROUS_TAGS = [
    'script', 'iframe', 'object', 'embed', 'form', 'input', 'textarea',
    'button', 'select', 'option', 'link', 'meta', 'base', 'style'
  ];

  private static readonly DANGEROUS_ATTRIBUTES = [
    'onload', 'onerror', 'onclick', 'onmouseover', 'onmouseout', 'onkeydown',
    'onkeyup', 'onkeypress', 'onfocus', 'onblur', 'onchange', 'onsubmit',
    'onreset', 'onselect', 'onunload', 'onbeforeunload', 'href', 'src',
    'action', 'formaction', 'background', 'cite', 'codebase', 'data',
    'datasrc', 'dynsrc', 'lowsrc', 'profile', 'usemap'
  ];

  private static readonly DANGEROUS_PROTOCOLS = [
    'javascript:', 'data:', 'vbscript:', 'file:', 'about:', 'chrome:',
    'chrome-extension:', 'moz-extension:', 'ms-browser-extension:'
  ];

  static sanitizeHTML(input: string): string {
    if (typeof input !== 'string') {
      return '';
    }

    let sanitized = input;

    // Remove dangerous tags
    this.DANGEROUS_TAGS.forEach(tag => {
      const regex = new RegExp(`<\\s*\\/?\\s*${tag}[^>]*>`, 'gi');
      sanitized = sanitized.replace(regex, '');
    });

    // Remove dangerous attributes
    this.DANGEROUS_ATTRIBUTES.forEach(attr => {
      const regex = new RegExp(`\\s+${attr}\\s*=\\s*[^\\s>]*`, 'gi');
      sanitized = sanitized.replace(regex, '');
    });

    // Remove dangerous protocols
    this.DANGEROUS_PROTOCOLS.forEach(protocol => {
      const regex = new RegExp(protocol, 'gi');
      sanitized = sanitized.replace(regex, '');
    });

    // Remove HTML comments that could contain malicious code
    sanitized = sanitized.replace(/<!--[\s\S]*?-->/g, '');

    // Remove CDATA sections
    sanitized = sanitized.replace(/<!\[CDATA\[[\s\S]*?\]\]>/g, '');

    // Encode remaining angle brackets
    sanitized = sanitized.replace(/</g, '&lt;').replace(/>/g, '&gt;');

    if (sanitized !== input) {
      log.security('XSS attempt detected and sanitized', {
        originalLength: input.length,
        sanitizedLength: sanitized.length,
        removedContent: input.length - sanitized.length
      });
    }

    return sanitized;
  }

  static sanitizeAttribute(value: string): string {
    if (typeof value !== 'string') {
      return '';
    }

    // Remove quotes and potential script injections
    let sanitized = value
      .replace(/['"]/g, '')
      .replace(/javascript:/gi, '')
      .replace(/data:/gi, '')
      .replace(/vbscript:/gi, '')
      .replace(/on\w+=/gi, '');

    // Encode special characters
    sanitized = sanitized
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');

    return sanitized;
  }

  static sanitizeURL(url: string): string {
    if (typeof url !== 'string') {
      return '';
    }

    // Check for dangerous protocols
    const lowerUrl = url.toLowerCase().trim();
    for (const protocol of this.DANGEROUS_PROTOCOLS) {
      if (lowerUrl.startsWith(protocol)) {
        log.security('Dangerous URL protocol detected', { url: url.substring(0, 50) });
        return '';
      }
    }

    // Only allow http, https, mailto, tel, and relative URLs
    const allowedProtocolRegex = /^(https?:\/\/|mailto:|tel:|\/|\.\/|#)/i;
    if (!allowedProtocolRegex.test(url) && !url.startsWith('/')) {
      log.security('Invalid URL protocol', { url: url.substring(0, 50) });
      return '';
    }

    return encodeURI(url);
  }
}

// Input Validation
export class InputValidator {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private static readonly USERNAME_REGEX = /^[a-zA-Z0-9_-]{3,20}$/;
  private static readonly PASSWORD_MIN_LENGTH = 8;
  private static readonly MAX_INPUT_LENGTH = 10000;

  static validateEmail(email: string): { isValid: boolean; error?: string } {
    if (!email || typeof email !== 'string') {
      return { isValid: false, error: 'Email is required' };
    }

    if (email.length > 254) {
      return { isValid: false, error: 'Email is too long' };
    }

    if (!this.EMAIL_REGEX.test(email)) {
      return { isValid: false, error: 'Invalid email format' };
    }

    // Check for suspicious patterns
    if (email.includes('..') || email.includes('@@')) {
      log.security('Suspicious email pattern detected', { email: email.substring(0, 20) });
      return { isValid: false, error: 'Invalid email format' };
    }

    return { isValid: true };
  }

  static validateUsername(username: string): { isValid: boolean; error?: string } {
    if (!username || typeof username !== 'string') {
      return { isValid: false, error: 'Username is required' };
    }

    if (!this.USERNAME_REGEX.test(username)) {
      return { isValid: false, error: 'Username must be 3-20 characters, letters, numbers, underscore, or dash only' };
    }

    // Check for reserved usernames
    const reservedUsernames = ['admin', 'root', 'system', 'api', 'www', 'mail', 'support'];
    if (reservedUsernames.includes(username.toLowerCase())) {
      return { isValid: false, error: 'Username is reserved' };
    }

    return { isValid: true };
  }

  static validatePassword(password: string): { isValid: boolean; errors: string[]; strength: 'weak' | 'medium' | 'strong' } {
    const errors: string[] = [];
    let score = 0;

    if (!password || typeof password !== 'string') {
      return { isValid: false, errors: ['Password is required'], strength: 'weak' };
    }

    if (password.length < this.PASSWORD_MIN_LENGTH) {
      errors.push(`Password must be at least ${this.PASSWORD_MIN_LENGTH} characters long`);
    } else {
      score += 1;
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    } else {
      score += 1;
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    } else {
      score += 1;
    }

    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    } else {
      score += 1;
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    } else {
      score += 1;
    }

    // Check for common weak passwords
    const commonPasswords = ['password', '123456', 'qwerty', 'admin', 'letmein'];
    if (commonPasswords.includes(password.toLowerCase())) {
      errors.push('Password is too common');
      score = 0;
    }

    // Check for sequential characters
    if (/123|abc|qwe/i.test(password)) {
      errors.push('Password should not contain sequential characters');
    }

    let strength: 'weak' | 'medium' | 'strong' = 'weak';
    if (score >= 4) strength = 'strong';
    else if (score >= 2) strength = 'medium';

    return {
      isValid: errors.length === 0,
      errors,
      strength,
    };
  }

  static validateCodeInput(code: string, maxLength: number = this.MAX_INPUT_LENGTH): { isValid: boolean; error?: string } {
    if (typeof code !== 'string') {
      return { isValid: false, error: 'Code must be a string' };
    }

    if (code.length > maxLength) {
      return { isValid: false, error: `Code is too long (max ${maxLength} characters)` };
    }

    // Check for suspicious patterns that might indicate code injection
    const suspiciousPatterns = [
      /eval\s*\(/i,
      /function\s*\(\s*\)\s*\{.*document\./i,
      /window\s*\[\s*["'].*["']\s*\]/i,
      /<script[^>]*>/i,
      /document\.write/i,
      /innerHTML\s*=/i,
      /outerHTML\s*=/i,
    ];

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(code)) {
        log.security('Suspicious code pattern detected', { 
          pattern: pattern.toString(),
          codePreview: code.substring(0, 100) 
        });
        return { isValid: false, error: 'Code contains potentially dangerous patterns' };
      }
    }

    return { isValid: true };
  }

  static sanitizeInput(input: string, maxLength: number = this.MAX_INPUT_LENGTH): string {
    if (typeof input !== 'string') {
      return '';
    }

    // Truncate if too long
    let sanitized = input.substring(0, maxLength);

    // Remove null bytes and control characters
    sanitized = sanitized.replace(/\0/g, '').replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

    // Normalize whitespace
    sanitized = sanitized.replace(/\s+/g, ' ').trim();

    return sanitized;
  }
}

// Rate Limiting
export class RateLimiter {
  private static requests: Map<string, { count: number; resetTime: number }> = new Map();
  private static readonly DEFAULT_WINDOW_MS = 60 * 1000; // 1 minute
  private static readonly DEFAULT_MAX_REQUESTS = 100;

  static isAllowed(
    key: string, 
    maxRequests: number = this.DEFAULT_MAX_REQUESTS, 
    windowMs: number = this.DEFAULT_WINDOW_MS
  ): boolean {
    const now = Date.now();
    const record = this.requests.get(key);

    if (!record || now > record.resetTime) {
      // New window or expired window
      this.requests.set(key, {
        count: 1,
        resetTime: now + windowMs
      });
      return true;
    }

    if (record.count >= maxRequests) {
      log.security('Rate limit exceeded', { 
        key: key.substring(0, 20), 
        count: record.count, 
        maxRequests,
        resetIn: record.resetTime - now 
      });
      return false;
    }

    record.count++;
    return true;
  }

  static getRemainingRequests(key: string, maxRequests: number = this.DEFAULT_MAX_REQUESTS): number {
    const record = this.requests.get(key);
    if (!record || Date.now() > record.resetTime) {
      return maxRequests;
    }
    return Math.max(0, maxRequests - record.count);
  }

  static getResetTime(key: string): number {
    const record = this.requests.get(key);
    return record ? record.resetTime : Date.now();
  }

  static reset(key?: string): void {
    if (key) {
      this.requests.delete(key);
    } else {
      this.requests.clear();
    }
  }

  // Cleanup expired entries periodically
  static cleanup(): void {
    const now = Date.now();
    for (const [key, record] of this.requests.entries()) {
      if (now > record.resetTime) {
        this.requests.delete(key);
      }
    }
  }
}

// Content Security Policy
export class CSPManager {
  private static readonly DEFAULT_CSP = {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'https://cdn.jsdelivr.net', 'blob:'],
    'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
    'font-src': ["'self'", 'https://fonts.gstatic.com'],
    'img-src': ["'self'", 'data:', 'https:', 'blob:'],
    'connect-src': ["'self'", 'https://api.openai.com', 'https://openrouter.ai', 'https://*.supabase.co', 'wss://*.supabase.co', 'wss:'],
    'media-src': ["'self'"],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'none'"],
    'upgrade-insecure-requests': []
  };

  static generateCSPHeader(customPolicies?: Record<string, string[]>): string {
    const policies = { ...this.DEFAULT_CSP, ...customPolicies };
    
    return Object.entries(policies)
      .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
      .join('; ');
  }

  static setCSPMeta(): void {
    if (typeof document === 'undefined') return;

    const existingMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    if (existingMeta) {
      existingMeta.remove();
    }

    const meta = document.createElement('meta');
    meta.httpEquiv = 'Content-Security-Policy';
    meta.content = this.generateCSPHeader();
    document.head.appendChild(meta);

    log.security('CSP meta tag set', { csp: meta.content.substring(0, 100) });
  }
}

// Session Security
export class SessionSecurity {
  private static readonly SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  private static lastActivity = Date.now();
  private static sessionId: string | null = null;

  static initSession(): string {
    this.sessionId = this.generateSessionId();
    this.lastActivity = Date.now();
    
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('session_id', this.sessionId);
      sessionStorage.setItem('session_start', this.lastActivity.toString());
    }

    log.security('Session initialized', { sessionId: this.sessionId.substring(0, 8) });
    return this.sessionId;
  }

  private static generateSessionId(): string {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  static updateActivity(): void {
    this.lastActivity = Date.now();
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('last_activity', this.lastActivity.toString());
    }
  }

  static isSessionValid(): boolean {
    const now = Date.now();
    const isValid = (now - this.lastActivity) < this.SESSION_TIMEOUT;
    
    if (!isValid) {
      log.security('Session expired', { 
        lastActivity: new Date(this.lastActivity).toISOString(),
        timeout: this.SESSION_TIMEOUT 
      });
    }
    
    return isValid;
  }

  static getSessionId(): string | null {
    return this.sessionId;
  }

  static destroySession(): void {
    this.sessionId = null;
    this.lastActivity = 0;
    
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('session_id');
      sessionStorage.removeItem('session_start');
      sessionStorage.removeItem('last_activity');
    }

    log.security('Session destroyed');
  }
}

// Initialize security measures
export function initializeSecurity(): void {
  // Set CSP
  CSPManager.setCSPMeta();
  
  // Initialize session
  SessionSecurity.initSession();
  
  // Set up periodic cleanup
  setInterval(() => {
    RateLimiter.cleanup();
  }, 5 * 60 * 1000); // Every 5 minutes

  // Set up session activity tracking
  if (typeof window !== 'undefined') {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      document.addEventListener(event, () => {
        SessionSecurity.updateActivity();
      }, { passive: true });
    });
  }

  log.security('Security initialization complete');
}

// Security Headers for API requests
export function getSecurityHeaders(): Record<string, string> {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'X-CSRF-Token': csrfTokenManager.getToken(),
    'X-Session-ID': SessionSecurity.getSessionId() || '',
  };
}