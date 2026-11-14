package com.cinevantaara.repository;

import com.cinevantaara.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, String> {
    List<Application> findByOpportunityId(String opportunityId);
    List<Application> findByApplicantId(String applicantId);
    List<Application> findByStatus(String status);
}
