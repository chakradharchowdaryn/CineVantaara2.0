package com.cinevantaara.repository;

import com.cinevantaara.entity.Opportunity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OpportunityRepository extends JpaRepository<Opportunity, String> {
    List<Opportunity> findByStatus(String status);
    List<Opportunity> findByRequiredRole(String requiredRole);
    List<Opportunity> findByProducerId(String producerId);
}
