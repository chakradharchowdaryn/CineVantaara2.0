package com.cinevantaara.repository;

import com.cinevantaara.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, String> {
    List<Review> findByTargetUserIdOrderByCreatedAtDesc(String targetUserId);
    boolean existsByAuthorIdAndTargetUserIdAndProjectTitle(String authorId, String targetUserId, String projectTitle);
}
