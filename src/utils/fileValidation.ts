/**
 * CineVantaara Secure File Upload Validator (Phase 11: Item 63)
 * Protects platform against unauthorized scripts, oversized payloads, and malicious MIME types.
 */

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
  sanitizedFileName?: string;
}

const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB max limit

const ALLOWED_MIME_TYPES = new Set([
  // Documents / Scripts
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  // Images / Concept Art / Lookbooks
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  // Audio / Stems / Score Demos
  'audio/mpeg',
  'audio/wav',
  'audio/aac',
  'audio/ogg',
  // Video / Showreels
  'video/mp4',
  'video/webm',
  'video/quicktime'
]);

const DANGEROUS_EXTENSIONS = new Set([
  'exe', 'bat', 'cmd', 'sh', 'php', 'js', 'vbs', 'ps1', 'jar', 'apk', 'bin', 'dll', 'com'
]);

export function validateFileUpload(file: File): FileValidationResult {
  if (!file) {
    return { isValid: false, error: 'No file provided for upload.' };
  }

  // 1. File size check
  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      isValid: false,
      error: `File exceeds maximum allowed size of 25MB (Current: ${sizeMb}MB).`
    };
  }

  if (file.size === 0) {
    return { isValid: false, error: 'File is empty (0 bytes).' };
  }

  // 2. Extension check
  const parts = file.name.split('.');
  const ext = parts.length > 1 ? parts.pop()?.toLowerCase() || '' : '';
  if (DANGEROUS_EXTENSIONS.has(ext)) {
    return {
      isValid: false,
      error: `Security Alert: File type .${ext} is restricted due to executable code risk.`
    };
  }

  // 3. MIME type check
  if (file.type && !ALLOWED_MIME_TYPES.has(file.type)) {
    return {
      isValid: false,
      error: `Unsupported file format (${file.type}). Allowed: PDF, Word, MP4, MOV, MP3, WAV, JPG, PNG, WEBP.`
    };
  }

  // 4. Sanitize file name
  const sanitized = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');

  return {
    isValid: true,
    sanitizedFileName: sanitized
  };
}
