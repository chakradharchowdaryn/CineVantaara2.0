package com.cinevantaara.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "opportunities")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Opportunity {

    @Id
    @Column(length = 64)
    private String id;

    @Column(length = 64)
    private String producerId;

    @Column(nullable = false)
    private String producerName;

    private String producerCompany;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 64)
    private String filmCategory;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(nullable = false, length = 64)
    private String requiredRole;

    @Builder.Default
    private Integer minExperienceYears = 0;

    private String location;

    @Builder.Default
    private Boolean isRemoteAllowed = false;

    private String compensationType;

    private String compensationDetails;

    private LocalDate deadline;

    private String projectDuration;

    @Builder.Default
    private String status = "OPEN";

    @Builder.Default
    private Integer applicantsCount = 0;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
