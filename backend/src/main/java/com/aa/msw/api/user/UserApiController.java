package com.aa.msw.api.user;

import com.aa.msw.auth.threadlocal.UserContext;
import com.aa.msw.gen.api.UserApi;
import com.aa.msw.model.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserApiController implements UserApi {
    private final UserApiService userApiService;

    public UserApiController(UserApiService userApiService) {
        this.userApiService = userApiService;
    }

    @Override
    public ResponseEntity<Void> registerUser() {
        // User should already be registered by Interceptor. So here we only need to check if this worked.
        User domainUser = UserContext.getCurrentUser();
        boolean isUserPresent = userApiService.isUserPresent(domainUser);
        return isUserPresent ?
                new ResponseEntity<>(HttpStatus.OK) :
                new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
