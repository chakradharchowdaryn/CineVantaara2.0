package com.cinevantaara.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "encrypted_messages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EncryptedMessage {

    @Id
    @Column(length = 64)
    private String id;

    @Column(nullable = false, length = 128)
    private String conversationId;

    @Column(nullable = false, length = 64)
    private String senderId;

    @Column(nullable = false)
    private String senderName;

    @Column(nullable = false, length = 64)
    private String recipientId;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String cipherText;

    @Builder.Default
    private Boolean isRead = false;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
