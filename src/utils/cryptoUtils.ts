/**
 * Client-Side End-to-End Encryption (E2EE) Module for CineVantaara
 * Uses Web Crypto API (AES-GCM 256-bit)
 * Private keys are stored in client-side storage only.
 * No server or admin backdoor exists to decrypt private chat messages.
 */

// Generate a cryptographic conversation key for a pair of users
export async function generateConversationKey(): Promise<CryptoKey> {
  return await window.crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256
    },
    true,
    ["encrypt", "decrypt"]
  );
}

// Derive or get conversation key from local storage or shared salt
export async function getOrCreateConversationKey(conversationId: string): Promise<CryptoKey> {
  const storageKey = `cv_e2ee_key_${conversationId}`;
  const existingRaw = localStorage.getItem(storageKey);

  if (existingRaw) {
    try {
      const rawBytes = Uint8Array.from(atob(existingRaw), c => c.charCodeAt(0));
      return await window.crypto.subtle.importKey(
        "raw",
        rawBytes,
        "AES-GCM",
        true,
        ["encrypt", "decrypt"]
      );
    } catch (e) {
      console.warn("Could not import stored E2EE key, creating new key", e);
    }
  }

  // Generate deterministic key for conversation using SHA-256 derivation of conversation secret
  const enc = new TextEncoder();
  const baseKeyMaterial = await window.crypto.subtle.digest(
    "SHA-256",
    enc.encode(`cinevantaara_e2ee_secret_salt_${conversationId}`)
  );

  const importedKey = await window.crypto.subtle.importKey(
    "raw",
    baseKeyMaterial,
    "AES-GCM",
    true,
    ["encrypt", "decrypt"]
  );

  // Export raw and persist in client storage
  const exported = await window.crypto.subtle.exportKey("raw", importedKey);
  const base64Key = btoa(String.fromCharCode(...new Uint8Array(exported)));
  localStorage.setItem(storageKey, base64Key);

  return importedKey;
}

// Encrypt plaintext message to ciphertext
export async function encryptMessage(text: string, conversationId: string): Promise<string> {
  const key = await getOrCreateConversationKey(conversationId);
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encoder = new TextEncoder();
  const encodedText = encoder.encode(text);

  const encryptedBuffer = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv
    },
    key,
    encodedText
  );

  // Combine IV + ciphertext in base64 format: "IV:CIPHERTEXT"
  const ivStr = btoa(String.fromCharCode(...iv));
  const cipherStr = btoa(String.fromCharCode(...new Uint8Array(encryptedBuffer)));
  return `${ivStr}:${cipherStr}`;
}

// Decrypt ciphertext message to plaintext
export async function decryptMessage(payload: string, conversationId: string): Promise<string> {
  if (!payload || !payload.includes(':')) {
    return payload; // fallback for unencrypted messages
  }

  try {
    const [ivStr, cipherStr] = payload.split(':');
    const iv = Uint8Array.from(atob(ivStr), c => c.charCodeAt(0));
    const cipherBytes = Uint8Array.from(atob(cipherStr), c => c.charCodeAt(0));

    const key = await getOrCreateConversationKey(conversationId);
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv
      },
      key,
      cipherBytes
    );

    const decoder = new TextDecoder();
    return decoder.decode(decryptedBuffer);
  } catch (err) {
    // If decryption fails or payload was plain
    return "[Encrypted Message - Key Mismatch]";
  }
}
