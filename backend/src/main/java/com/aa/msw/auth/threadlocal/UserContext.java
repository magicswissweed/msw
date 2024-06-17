package com.aa.msw.auth.threadlocal;

import com.aa.msw.model.User;

public class UserContext {
	private static final ThreadLocal<User> currentUser = new ThreadLocal<>();

	public static User getCurrentUser () {
		return currentUser.get();
	}

	public static void setCurrentUser (User user) {
		currentUser.set(user);
	}

	// TODO: clear after request completion. Otherwise we could run into a security issue.
	public static void clear () {
		currentUser.remove();
	}
}