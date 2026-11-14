package com.cinevantaara.service;

import com.cinevantaara.entity.Application;
import com.cinevantaara.entity.Opportunity;
import com.cinevantaara.repository.ApplicationRepository;
import com.cinevantaara.repository.OpportunityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OpportunityService {

    private final OpportunityRepository opportunityRepository;
    private final ApplicationRepository applicationRepository;

    public List<Opportunity> getAllOpportunities() {
        return opportunityRepository.findAll();
    }

    public Optional<Opportunity> getOpportunityById(String id) {
        return opportunityRepository.findById(id);
    }

    public Opportunity createOpportunity(Opportunity opportunity) {
        if (opportunity.getId() == null) {
            opportunity.setId("opp-" + UUID.randomUUID().toString());
        }
        opportunity.setCreatedAt(LocalDateTime.now());
        opportunity.setStatus("OPEN");
        return opportunityRepository.save(opportunity);
    }

    public Application applyToOpportunity(Application app) {
        if (app.getId() == null) {
            app.setId("app-" + UUID.randomUUID().toString());
        }
        app.setStatus("PENDING");
        app.setAppliedAt(LocalDateTime.now());

        // Increment applicant count on opportunity
        opportunityRepository.findById(app.getOpportunityId()).ifPresent(opp -> {
            opp.setApplicantsCount((opp.getApplicantsCount() == null ? 0 : opp.getApplicantsCount()) + 1);
            opportunityRepository.save(opp);
        });

        return applicationRepository.save(app);
    }

    public List<Application> getApplicationsForOpportunity(String opportunityId) {
        return applicationRepository.findByOpportunityId(opportunityId);
    }

    public Application updateApplicationStatus(String applicationId, String status) {
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        app.setStatus(status);
        return applicationRepository.save(app);
    }
}
