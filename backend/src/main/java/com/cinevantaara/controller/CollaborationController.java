package com.cinevantaara.controller;

import com.cinevantaara.entity.CollaborationRequest;
import com.cinevantaara.service.CollaborationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/collaborations")
@RequiredArgsConstructor
public class CollaborationController {

    private final CollaborationService collaborationService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<CollaborationRequest>> getRequestsForUser(@PathVariable String userId) {
        return ResponseEntity.ok(collaborationService.getRequestsForUser(userId));
    }

    @PostMapping
    public ResponseEntity<CollaborationRequest> createRequest(@RequestBody CollaborationRequest request) {
        return ResponseEntity.ok(collaborationService.createRequest(request));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<CollaborationRequest> updateStatus(@PathVariable String id,
                                                             @RequestParam String status) {
        return ResponseEntity.ok(collaborationService.updateStatus(id, status));
    }
}
