package com.aa.msw.api.user;

import com.aa.msw.auth.threadlocal.UserContext;
import com.aa.msw.database.helpers.id.UserExtId;
import com.aa.msw.database.helpers.id.UserId;
import com.aa.msw.gen.api.UserApi;
import com.aa.msw.model.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserApiController implements UserApi {
	private final UserApiService userApiService;

	public UserApiController (UserApiService userApiService) {
		this.userApiService = userApiService;
	}

	@Override
	public ResponseEntity<Void> registerUser () {
		User domainUser = new User(
				new UserId(),
				new UserExtId(UserContext.getCurrentExtUserId()),
				UserContext.getCurrentEmail(),
				"");
		userApiService.registerUser(domainUser);
		return new ResponseEntity<>(HttpStatus.OK);
	}
}
