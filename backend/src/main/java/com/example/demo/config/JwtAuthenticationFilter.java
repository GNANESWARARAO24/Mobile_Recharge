package com.example.demo.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.security.Key;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

	private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

	@Value("${jwt.secret}")
	private String jwtSecret;

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		String authHeader = request.getHeader("Authorization");
		if (authHeader == null || !authHeader.startsWith("Bearer ")) {
			logger.debug("No valid Bearer token found in Authorization header: {}", authHeader);
			filterChain.doFilter(request, response);
			return;
		}

		String token = authHeader.substring(7);
		logger.debug("Received token: {}", token);

		try {
			byte[] keyBytes = Base64.getDecoder().decode(jwtSecret);
			Key key = Keys.hmacShaKeyFor(keyBytes);

			Claims claims = Jwts.parser().setSigningKey(key).build().parseClaimsJws(token).getBody();

			String username = claims.getSubject();
			// Assuming your roles are stored in a "roles" claim as a List of Strings
			List<String> roles = claims.get("roles", List.class);

			List<SimpleGrantedAuthority> authorities = new ArrayList<>();
			if (roles != null) {
				for (String role : roles) {
					authorities.add(new SimpleGrantedAuthority("ROLE_" + role));
				}
			}

			if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
				UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(username, null,
						authorities); // <--- Pass the authorities here
				auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
				SecurityContextHolder.getContext().setAuthentication(auth);
				logger.debug("Authenticated user: {} with authorities: {}", username, authorities);
			}
		} catch (Exception e) {
			logger.error("Failed to validate JWT token: {}", e.getMessage(), e);
			response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
			response.getWriter().write("Invalid JWT token");
			return;
		}

		filterChain.doFilter(request, response);
	}
}