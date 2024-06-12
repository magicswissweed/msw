package com.aa.msw.auth;

import com.aa.msw.auth.threadlocal.UserContext;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.GenericFilterBean;

import java.io.IOException;

@Component
public class RequestUserInterceptor extends GenericFilterBean {

	private static final Logger LOG = LoggerFactory.getLogger(RequestUserInterceptor.class);

	@Override
	public void doFilter (
			ServletRequest request,
			ServletResponse response,
			FilterChain chain
	) throws IOException, ServletException {
		Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		if(principal instanceof Jwt jwt) {;
			try {
				FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(jwt.getTokenValue());
				UserContext.setCurrentEmail(decodedToken.getEmail());
				UserContext.setCurrentExtUserId(decodedToken.getUid());
			} catch (FirebaseAuthException e) {
				LOG.info("Exception when decoding token: " + e.getMessage());
			}
		}

		chain.doFilter(request, response);
	}
}
