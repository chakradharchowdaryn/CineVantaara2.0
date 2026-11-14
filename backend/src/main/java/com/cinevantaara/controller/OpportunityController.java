package com.cinevantaara.controller;

import com.cinevantaara.entity.Application;
import com.cinevantaara.entity.Opportunity;
import com.cinevantaara.service.OpportunityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/opportunities")
@RequiredArgsConstructor
public class OpportunityController {

    private final OpportunityService opportunityService;

    @GetMapping
    public ResponseEntity<List<Opportunity>> getAllOpportunities() {
        return ResponseEntity.ok(opportunityService.getAllOpportunities());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Opportunity> getOpportunityById(@PathVariable String id) {
        return opportunityService.getOpportunityById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Opportunity> createOpportunity(@RequestBody Opportunity opportunity) {
        return ResponseEntity.ok(opportunityService.createOpportunity(opportunity));
    }

    @PostMapping("/{id}/apply")
    public ResponseEntity<Application> applyToOpportunity(@PathVariable String id,
                                                          @RequestBody Application application) {
        application.setOpportunityId(id);
        return ResponseEntity.ok(opportunityService.applyToOpportunity(application));
    }

    @GetMapping("/{id}/applications")
    public ResponseEntity<List<Application>> getApplications(@PathVariable String id) {
        return ResponseEntity.ok(opportunityService.getApplicationsForOpportunity(id));
    }

    @PatchMapping("/applications/{applicationId}/status")
    public ResponseEntity<Application> updateStatus(@PathVariable String applicationId,
                                                    @RequestParam String status) {
        return ResponseEntity.ok(opportunityService.updateApplicationStatus(applicationId, status));
    }
}
