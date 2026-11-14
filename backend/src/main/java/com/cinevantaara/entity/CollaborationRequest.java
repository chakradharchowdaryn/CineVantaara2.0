package com.cinevantaara.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "collaboration_requests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CollaborationRequest {

    @Id
    @Column(length = 64)
    private String id;

    @Column(nullable = false, length = 64)
    private String senderId;

    @Column(nullable = false)
    private String senderName;

    @Column(nullable = false, length = 64)
    private String senderRole;

    @Column(columnDefinition = "TEXT")
    private String senderAvatar;

    @Column(nullable = false, length = 64)
    private String receiverId;

    @Column(nullable = false)
    private String receiverName;

    @Column(nullable = false)
    private String projectTitle;

    @Column(nullable = false)
    private String roleProposed;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String message;

    @Builder.Default
    private String status = "PENDING";

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
