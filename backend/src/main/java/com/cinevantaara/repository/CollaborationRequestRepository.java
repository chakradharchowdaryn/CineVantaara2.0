package com.cinevantaara.repository;

import com.cinevantaara.entity.CollaborationRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CollaborationRequestRepository extends JpaRepository<CollaborationRequest, String> {
    List<CollaborationRequest> findByReceiverId(String receiverId);
    List<CollaborationRequest> findBySenderId(String senderId);
}
