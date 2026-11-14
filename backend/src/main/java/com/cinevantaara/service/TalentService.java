package com.cinevantaara.service;

import com.cinevantaara.entity.User;
import com.cinevantaara.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TalentService {

    private final UserRepository userRepository;

    public List<User> getAllTalent() {
        return userRepository.findAll();
    }

    public List<User> searchTalent(String query) {
        if (query == null || query.isBlank()) {
            return userRepository.findAll();
        }
        return userRepository.searchUsers(query);
    }

    public List<User> getTalentByRole(String role) {
        return userRepository.findByActiveRole(role);
    }

    public Optional<User> getTalentById(String id) {
        return userRepository.findById(id);
    }

    public User updateTalent(User user) {
        return userRepository.save(user);
    }
}
