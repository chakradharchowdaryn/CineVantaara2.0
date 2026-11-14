package com.cinevantaara.controller;

import com.cinevantaara.entity.EncryptedMessage;
import com.cinevantaara.repository.EncryptedMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final EncryptedMessageRepository messageRepository;
    private final SimpMessagingTemplate messagingTemplate;

    /**
     * Fetch conversation history.
     * Note: Returned payload contains ONLY AES-GCM ciphertext. The server cannot decrypt it.
     */
    @GetMapping("/{conversationId}")
    public ResponseEntity<List<EncryptedMessage>> getMessages(@PathVariable String conversationId) {
        List<EncryptedMessage> messages = messageRepository.findByConversationIdOrderByCreatedAtAsc(conversationId);
        return ResponseEntity.ok(messages);
    }

    /**
     * Dispatch and persist an end-to-end encrypted message.
     * Payload contains only cipherText. Broadcasts in real-time over WebSocket.
     */
    @PostMapping
    public ResponseEntity<EncryptedMessage> sendMessage(@RequestBody EncryptedMessage message) {
        if (message.getId() == null || message.getId().isBlank()) {
            message.setId("msg-" + UUID.randomUUID().toString());
        }
        if (message.getCreatedAt() == null) {
            message.setCreatedAt(LocalDateTime.now());
        }

        // Persist zero-knowledge ciphertext
        EncryptedMessage saved = messageRepository.save(message);

        // Real-time broadcast to conversation channel
        messagingTemplate.convertAndSend("/topic/chat/" + message.getConversationId(), saved);

        // Also notify recipient's personal queue if needed
        if (message.getRecipientId() != null) {
            messagingTemplate.convertAndSend("/topic/user/" + message.getRecipientId() + "/messages", saved);
        }

        return ResponseEntity.ok(saved);
    }

    /**
     * STOMP WebSocket endpoint: /app/chat.send/{conversationId}
     */
    @MessageMapping("/chat.send/{conversationId}")
    public void broadcastOverWebSocket(@DestinationVariable String conversationId, @Payload EncryptedMessage message) {
        if (message.getId() == null || message.getId().isBlank()) {
            message.setId("msg-" + UUID.randomUUID().toString());
        }
        if (message.getCreatedAt() == null) {
            message.setCreatedAt(LocalDateTime.now());
        }
        EncryptedMessage saved = messageRepository.save(message);
        messagingTemplate.convertAndSend("/topic/chat/" + conversationId, saved);
    }
}
