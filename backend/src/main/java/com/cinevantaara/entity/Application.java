package com.cinevantaara.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "applications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Application {

    @Id
    @Column(length = 64)
    private String id;

    @Column(nullable = false, length = 64)
    private String opportunityId;

    @Column(nullable = false)
    private String opportunityTitle;

    @Column(nullable = false, length = 64)
    private String applicantId;

    @Column(nullable = false)
    private String applicantName;

    @Column(nullable = false, length = 64)
    private String applicantRole;

    @Column(columnDefinition = "TEXT")
    private String applicantAvatar;

    @Builder.Default
    private Integer applicantExperience = 0;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String pitchNote;

    @Column(columnDefinition = "TEXT")
    private String showreelUrl;

    @Builder.Default
    private String status = "PENDING";

    @Builder.Default
    private LocalDateTime appliedAt = LocalDateTime.now();
}
