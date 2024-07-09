package com.aa.msw.integrationtest;

public record TestUser(String email, String password) {
    public static final TestUser THE_ONE = new TestUser("test.user@msw.ch", "*1.test-user.1*");
}
