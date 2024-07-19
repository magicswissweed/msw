package com.aa.msw.integrationtest;

import java.util.List;

public record TestUser(String email, String password, String token, String extUserId) {
    public static final TestUser THE_ONE = new TestUser("test.user@msw.ch", "*1.test-user.1*", "tokenOfTheOne", "extUserIdOfTheOne");

    public static final List<TestUser> ALL_TEST_USERS = List.of(
            THE_ONE
    );
}
