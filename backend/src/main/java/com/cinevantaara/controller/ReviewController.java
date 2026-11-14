package com.cinevantaara.controller;

import com.cinevantaara.entity.Review;
import com.cinevantaara.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewRepository reviewRepository;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Review>> getReviewsForUser(@PathVariable String userId) {
        return ResponseEntity.ok(reviewRepository.findByTargetUserIdOrderByCreatedAtDesc(userId));
    }

    @PostMapping
    public ResponseEntity<Review> postReview(@RequestBody Review review) {
        if (reviewRepository.existsByAuthorIdAndTargetUserIdAndProjectTitle(
                review.getAuthorId(), review.getTargetUserId(), review.getProjectTitle())) {
            throw new RuntimeException("Review already submitted for this collaboration project.");
        }

        if (review.getId() == null) {
            review.setId("rev-" + UUID.randomUUID().toString());
        }
        review.setCreatedAt(LocalDateTime.now());
        return ResponseEntity.ok(reviewRepository.save(review));
    }
}
