package com.cinevantaara.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reviews", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"author_id", "target_user_id", "project_title"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Review {

    @Id
    @Column(length = 64)
    private String id;

    @Column(name = "author_id", nullable = false, length = 64)
    private String authorId;

    @Column(nullable = false)
    private String authorName;

    @Column(nullable = false, length = 64)
    private String authorRole;

    @Column(columnDefinition = "TEXT")
    private String authorAvatar;

    @Column(name = "target_user_id", nullable = false, length = 64)
    private String targetUserId;

    @Column(name = "project_title", nullable = false)
    private String projectTitle;

    @Column(nullable = false)
    private Integer rating;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String feedback;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
