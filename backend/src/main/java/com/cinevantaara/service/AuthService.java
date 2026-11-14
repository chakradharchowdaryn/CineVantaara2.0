package com.cinevantaara.service;

import com.cinevantaara.config.JwtUtils;
import com.cinevantaara.dto.AuthDto;
import com.cinevantaara.entity.RefreshToken;
import com.cinevantaara.entity.User;
import com.cinevantaara.repository.RefreshTokenRepository;
import com.cinevantaara.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.HashSet;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public AuthDto.AuthResponse register(AuthDto.RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email address already registered.");
        }

        String userId = "user-" + UUID.randomUUID().toString();
        User user = User.builder()
                .id(userId)
                .name(request.getName())
                .email(request.getEmail().toLowerCase())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .activeRole(request.getActiveRole() != null ? request.getActiveRole() : "DIRECTOR")
                .roles(request.getRoles() != null && !request.getRoles().isEmpty() ? request.getRoles() : new HashSet<>())
                .headline(request.getHeadline())
                .location(request.getLocation())
                .experienceYears(request.getExperienceYears() != null ? request.getExperienceYears() : 3)
                .skills(request.getSkills() != null ? request.getSkills() : new HashSet<>())
                .isVerified(false)
                .isAvailable(true)
                .build();

        if (user.getRoles().isEmpty()) {
            user.getRoles().add(user.getActiveRole());
        }

        userRepository.save(user);

        String accessToken = jwtUtils.generateToken(user.getEmail(), user.getActiveRole());
        String refreshToken = createRefreshToken(userId);

        return AuthDto.AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .activeRole(user.getActiveRole())
                .roles(user.getRoles())
                .build();
    }

    public AuthDto.AuthResponse login(AuthDto.LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail().toLowerCase())
                .orElseThrow(() -> new RuntimeException("Invalid credentials."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid credentials.");
        }

        String accessToken = jwtUtils.generateToken(user.getEmail(), user.getActiveRole());
        String refreshToken = createRefreshToken(user.getId());

        return AuthDto.AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .activeRole(user.getActiveRole())
                .roles(user.getRoles())
                .build();
    }

    private String createRefreshToken(String userId) {
        refreshTokenRepository.deleteByUserId(userId);
        RefreshToken token = RefreshToken.builder()
                .id(UUID.randomUUID().toString())
                .userId(userId)
                .token(UUID.randomUUID().toString())
                .expiryDate(Instant.now().plusSeconds(604800)) // 7 days
                .build();
        refreshTokenRepository.save(token);
        return token.getToken();
    }
}
