package com.cinevantaara.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog {

    @Id
    @Column(length = 64)
    private String id;

    @Column(nullable = false, length = 64)
    private String adminId;

    @Column(nullable = false)
    private String adminName;

    @Column(nullable = false, length = 128)
    private String action;

    @Column(length = 64)
    private String targetType;

    @Column(length = 64)
    private String targetId;

    @Column(columnDefinition = "TEXT")
    private String details;

    @Column(length = 64)
    private String ipAddress;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
