package com.aa.msw.database.exceptions;

import java.io.IOException;

public class NoDataAvailableException extends IOException {
	public NoDataAvailableException(String message) {
		super(message);
	}
}
