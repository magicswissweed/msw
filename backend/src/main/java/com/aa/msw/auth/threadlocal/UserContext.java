package com.aa.msw.auth.threadlocal;

public class UserContext {
	private static final ThreadLocal<String> currentEmail = new ThreadLocal<>();
	private static final ThreadLocal<String> currentExtUserId = new ThreadLocal<>();

	public static String getCurrentEmail() {
		return currentEmail.get();
	}

	public static void setCurrentEmail(String user) {
		currentEmail.set(user);
	}

	public static String getCurrentExtUserId() {
		return currentExtUserId.get();
	}

	public static void setCurrentExtUserId(String user) {
		currentExtUserId.set(user);
	}

	public static void clear() {
		currentEmail.remove();
		currentExtUserId.remove();
	}
}