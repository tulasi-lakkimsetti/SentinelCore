package com.sentinelcore.controller;

import java.util.Map;
import java.util.Set;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sentinelcore.entity.Role;
import com.sentinelcore.entity.User;
import com.sentinelcore.repository.RoleRepository;
import com.sentinelcore.repository.UserRepository;
import com.sentinelcore.util.JwtUtil;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthController(
            UserRepository userRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil) {

        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    /* =========================
       REGISTER
    ========================= */

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody Map<String, String> request) {

        String username = request.get("username");
        String email = request.get("email");
        String password = request.get("password");
        String roleName = request.get("role");

        if (username == null || username.isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "message",
                            "Username is required"
                    ));
        }

        if (password == null || password.isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "message",
                            "Password is required"
                    ));
        }

        if (password.length() < 6) {
            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "message",
                            "Password must be at least 6 characters"
                    ));
        }

        if (userRepository.findByUsername(username).isPresent()) {
            return ResponseEntity.status(409)
                    .body(Map.of(
                            "message",
                            "Username already exists"
                    ));
        }

        if (roleName == null || roleName.isBlank()) {
            roleName = "ROLE_VIEWER";
        }

        String finalRoleName = roleName.toUpperCase();

        if (!finalRoleName.equals("ROLE_VIEWER")
                && !finalRoleName.equals("ROLE_ADMIN")) {

            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "message",
                            "Invalid role"
                    ));
        }

        Role role = roleRepository.findByName(finalRoleName)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Role not found: " + finalRoleName));

        User user = User.builder()
                .username(username.trim())
                .email(email)
                .password(passwordEncoder.encode(password))
                .roles(Set.of(role))
                .build();

        userRepository.save(user);

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Registration successful",
                        "username",
                        user.getUsername(),
                        "role",
                        finalRoleName
                )
        );
    }

    /* =========================
       LOGIN
    ========================= */

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody Map<String, String> request) {

        String username = request.get("username");
        String password = request.get("password");

        User user = userRepository.findByUsername(username)
                .orElse(null);

        if (user == null ||
                !passwordEncoder.matches(
                        password,
                        user.getPassword())) {

            return ResponseEntity.status(401)
                    .body(Map.of(
                            "message",
                            "Invalid username or password"
                    ));
        }

        // Generate access token with user roles
        String accessToken =
                jwtUtil.generateToken(user);

        String refreshToken =
                jwtUtil.generateRefreshToken(
                        user.getUsername());

        return ResponseEntity.ok(
                Map.of(
                        "username",
                        user.getUsername(),
                        "accessToken",
                        accessToken,
                        "refreshToken",
                        refreshToken
                )
        );
    }

    /* =========================
       REFRESH TOKEN
    ========================= */

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(
            @RequestBody Map<String, String> request) {

        String refreshToken =
                request.get("refreshToken");

        if (refreshToken == null ||
                !jwtUtil.validateToken(refreshToken)) {

            return ResponseEntity.status(401)
                    .body(Map.of(
                            "message",
                            "Invalid or expired refresh token"
                    ));
        }

        String username =
                jwtUtil.extractUsername(refreshToken);

        String newAccessToken =
                jwtUtil.generateToken(username);

        return ResponseEntity.ok(
                Map.of(
                        "accessToken",
                        newAccessToken
                )
        );
    }

    /* =========================
       GET CURRENT PROFILE
    ========================= */

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(
            Authentication authentication) {

        String username =
                authentication.getName();

        User user =
                userRepository.findByUsername(username)
                        .orElse(null);

        if (user == null) {

            return ResponseEntity.status(404)
                    .body(Map.of(
                            "message",
                            "User not found"
                    ));
        }

        return ResponseEntity.ok(
                Map.of(
                        "id",
                        user.getId(),
                        "username",
                        user.getUsername(),
                        "email",
                        user.getEmail() == null
                                ? ""
                                : user.getEmail()
                )
        );
    }

    /* =========================
       UPDATE PROFILE
       NAME + EMAIL
    ========================= */

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            Authentication authentication,
            @RequestBody Map<String, String> request) {

        String currentUsername =
                authentication.getName();

        User user =
                userRepository.findByUsername(
                        currentUsername)
                        .orElse(null);

        if (user == null) {

            return ResponseEntity.status(404)
                    .body(Map.of(
                            "message",
                            "User not found"
                    ));
        }

        String username =
                request.get("username");

        String email =
                request.get("email");

        if (username == null ||
                username.trim().isEmpty()) {

            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "message",
                            "Username cannot be empty"
                    ));
        }

        if (email == null ||
                email.trim().isEmpty()) {

            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "message",
                            "Email cannot be empty"
                    ));
        }

        username = username.trim();
        email = email.trim();

        /*
         * Check whether another user already
         * uses the requested username.
         */

        if (!username.equals(user.getUsername())) {

            User existingUser =
                    userRepository
                            .findByUsername(username)
                            .orElse(null);

            if (existingUser != null &&
                    !existingUser.getId()
                            .equals(user.getId())) {

                return ResponseEntity.status(409)
                        .body(Map.of(
                                "message",
                                "Username already exists"
                        ));
            }
        }

        user.setUsername(username);
        user.setEmail(email);

        userRepository.save(user);

        /*
         * Generate a new access token because
         * the username may have changed.
         */

        String newAccessToken =
                jwtUtil.generateToken(user);

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Profile updated successfully",
                        "username",
                        user.getUsername(),
                        "email",
                        user.getEmail(),
                        "accessToken",
                        newAccessToken
                )
        );
    }

    /* =========================
       CHANGE PASSWORD
    ========================= */

    @PutMapping("/password")
    public ResponseEntity<?> changePassword(
            Authentication authentication,
            @RequestBody Map<String, String> request) {

        String username =
                authentication.getName();

        User user =
                userRepository.findByUsername(username)
                        .orElse(null);

        if (user == null) {

            return ResponseEntity.status(404)
                    .body(Map.of(
                            "message",
                            "User not found"
                    ));
        }

        String currentPassword =
                request.get("currentPassword");

        String newPassword =
                request.get("newPassword");

        if (currentPassword == null ||
                currentPassword.isBlank()) {

            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "message",
                            "Current password is required"
                    ));
        }

        if (newPassword == null ||
                newPassword.isBlank()) {

            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "message",
                            "New password is required"
                    ));
        }

        if (newPassword.length() < 6) {

            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "message",
                            "New password must be at least 6 characters"
                    ));
        }

        /*
         * Verify current password.
         */

        if (!passwordEncoder.matches(
                currentPassword,
                user.getPassword())) {

            return ResponseEntity.status(401)
                    .body(Map.of(
                            "message",
                            "Current password is incorrect"
                    ));
        }

        /*
         * Prevent using the same password.
         */

        if (passwordEncoder.matches(
                newPassword,
                user.getPassword())) {

            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "message",
                            "New password must be different"
                    ));
        }

        /*
         * Encode and save the new password.
         */

        user.setPassword(
                passwordEncoder.encode(newPassword)
        );

        userRepository.save(user);

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Password changed successfully"
                )
        );
    }
}