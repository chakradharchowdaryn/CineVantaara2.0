package com.cinevantaara.controller;

import com.cinevantaara.entity.AuditLog;
import com.cinevantaara.entity.User;
import com.cinevantaara.repository.AuditLogRepository;
import com.cinevantaara.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;
    private final AuditLogRepository auditLogRepository;

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @GetMapping("/audit-logs")
    public ResponseEntity<List<AuditLog>> getAuditLogs() {
        return ResponseEntity.ok(auditLogRepository.findAllByOrderByCreatedAtDesc());
    }

    @PostMapping("/verify-user/{userId}")
    public ResponseEntity<User> verifyUser(@PathVariable String userId, @RequestParam String adminName) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setIsVerified(!user.getIsVerified());
        User updated = userRepository.save(user);

        // Record immutable audit log
        AuditLog log = AuditLog.builder()
                .id("audit-" + UUID.randomUUID().toString())
                .adminId("admin")
                .adminName(adminName)
                .action("TOGGLE_USER_VERIFICATION")
                .targetType("USER")
                .targetId(userId)
                .details("Admin updated verification status for " + user.getName())
                .createdAt(LocalDateTime.now())
                .build();
        auditLogRepository.save(log);

        return ResponseEntity.ok(updated);
    }
}
