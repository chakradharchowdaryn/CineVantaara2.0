package com.cinevantaara.service;

import com.cinevantaara.entity.CollaborationRequest;
import com.cinevantaara.repository.CollaborationRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CollaborationService {

    private final CollaborationRequestRepository collaborationRequestRepository;

    public List<CollaborationRequest> getRequestsForUser(String userId) {
        return collaborationRequestRepository.findByReceiverId(userId);
    }

    public CollaborationRequest createRequest(CollaborationRequest request) {
        if (request.getId() == null) {
            request.setId("collab-" + UUID.randomUUID().toString());
        }
        request.setStatus("PENDING");
        request.setCreatedAt(LocalDateTime.now());
        return collaborationRequestRepository.save(request);
    }

    public CollaborationRequest updateStatus(String requestId, String status) {
        CollaborationRequest request = collaborationRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Collaboration request not found"));
        request.setStatus(status);
        return collaborationRequestRepository.save(request);
    }
}
