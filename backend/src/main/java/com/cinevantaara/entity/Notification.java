package com.cinevantaara.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    @Column(length = 64)
    private String id;

    @Column(nullable = false, length = 64)
    private String userId;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String message;

    @Column(nullable = false, length = 64)
    private String type;

    @Builder.Default
    private Boolean isRead = false;

    @Column(columnDefinition = "TEXT")
    private String linkUrl;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
