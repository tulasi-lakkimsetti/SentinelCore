package com.sentinelcore.config;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.sentinelcore.util.JwtUtil;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    public JwtFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    /*
     * Do not process JWT for authentication endpoints.
     * These endpoints are already permitted in SecurityConfig.
     */
    @Override
    protected boolean shouldNotFilter(
            HttpServletRequest request) {

        String path = request.getServletPath();

        return path.startsWith("/api/auth/");
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        // Allow browser CORS preflight requests
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }

        String header = request.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")) {

            String token = header.substring(7);

            if (jwtUtil.validateToken(token)) {

                String username =
                        jwtUtil.extractUsername(token);

                List<SimpleGrantedAuthority> authorities =
                        Collections.emptyList();

                try {

                    Claims claims = Jwts.parser()
                            .verifyWith(jwtUtil.getKey())
                            .build()
                            .parseSignedClaims(token)
                            .getPayload();

                    List<?> roles =
                            claims.get("roles", List.class);

                    if (roles != null) {

                        authorities = roles.stream()
                                .map(role ->
                                        role.toString()
                                                .startsWith("ROLE_")
                                                ? role.toString()
                                                : "ROLE_" + role.toString()
                                )
                                .map(SimpleGrantedAuthority::new)
                                .toList();
                    }

                } catch (Exception ignored) {

                    authorities =
                            Collections.emptyList();
                }

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                username,
                                null,
                                authorities
                        );

                SecurityContextHolder
                        .getContext()
                        .setAuthentication(authentication);
            }
        }

        filterChain.doFilter(request, response);
    }
}