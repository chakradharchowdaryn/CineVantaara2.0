package com.cinevantaara.controller;

import com.cinevantaara.entity.User;
import com.cinevantaara.service.TalentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/talent")
@RequiredArgsConstructor
public class TalentController {

    private final TalentService talentService;

    @GetMapping
    public ResponseEntity<List<User>> getAllTalent(@RequestParam(required = false) String search,
                                                  @RequestParam(required = false) String role) {
        if (role != null && !role.isBlank()) {
            return ResponseEntity.ok(talentService.getTalentByRole(role));
        }
        return ResponseEntity.ok(talentService.searchTalent(search));
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getTalentById(@PathVariable String id) {
        return talentService.getTalentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateTalent(@PathVariable String id, @RequestBody User user) {
        user.setId(id);
        return ResponseEntity.ok(talentService.updateTalent(user));
    }
}
