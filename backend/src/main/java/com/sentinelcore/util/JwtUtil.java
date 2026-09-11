package com.sentinelcore.util;

import java.util.Date;
import java.util.stream.Collectors;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Component;

import com.sentinelcore.entity.User;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

    private final SecretKey key =
            Keys.hmacShaKeyFor(
                    "SentinelCoreSecretKeyForJwtAuthentication123456"
                            .getBytes()
            );

    // Existing access token
    public String generateToken(String username) {

        return Jwts.builder()
                .subject(username)
                .issuedAt(new Date())
                .expiration(
                        new Date(System.currentTimeMillis() + 15L * 60 * 1000)
                )
                .signWith(key)
                .compact();
    }

    // Access token with roles
    public String generateToken(User user) {

        return Jwts.builder()
                .subject(user.getUsername())
                .claim(
                        "roles",
                        user.getRoles()
                                .stream()
                                .map(role -> role.getName())
                                .collect(Collectors.toList())
                )
                .issuedAt(new Date())
                .expiration(
                        new Date(System.currentTimeMillis() + 15L * 60 * 1000)
                )
                .signWith(key)
                .compact();
    }

    // Refresh token - 7 days
    public String generateRefreshToken(String username) {

        return Jwts.builder()
                .subject(username)
                .issuedAt(new Date())
                .expiration(
                        new Date(
                                System.currentTimeMillis()
                                        + 7L * 24 * 60 * 60 * 1000
                        )
                )
                .signWith(key)
                .compact();
    }

    public String extractUsername(String token) {

        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    public boolean validateToken(String token) {

        try {
            Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token);

            return true;

        } catch (Exception ignored) {
            return false;
        }
    }

    // Used by JwtFilter to read JWT claims
    public SecretKey getKey() {
        return key;
    }
}