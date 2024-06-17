package com.aa.msw.auth;

import com.aa.msw.auth.threadlocal.UserContext;
import com.aa.msw.database.exceptions.NoSuchUserException;
import com.aa.msw.database.helpers.id.UserExtId;
import com.aa.msw.database.helpers.id.UserId;
import com.aa.msw.database.repository.dao.UserDao;
import com.aa.msw.model.User;
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

	private final UserDao userDao;

	public RequestUserInterceptor (UserDao userDao) {
		this.userDao = userDao;
	}

	@Override
	public void doFilter (
			ServletRequest request,
			ServletResponse response,
			FilterChain chain
	) throws IOException, ServletException {
		Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		if (principal instanceof Jwt jwt) {
			try {
				FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(jwt.getTokenValue());
				UserExtId extUserId = new UserExtId(decodedToken.getUid());
				User user;
				try {
					user = userDao.getUser(extUserId);
				} catch (NoSuchUserException e) { // on register
					user = new User(
							new UserId(),
							extUserId,
							decodedToken.getEmail(),
							"");
				}
				UserContext.setCurrentUser(user);
			} catch (FirebaseAuthException e) {
				LOG.info("Exception when decoding token: " + e.getMessage());
			}
		}

		chain.doFilter(request, response);
	}
}
