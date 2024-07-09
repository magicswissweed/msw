package com.aa.msw.database.exceptions;

public class NoSuchUserException extends Exception {
    public NoSuchUserException(Exception e) {
        super(e);
    }
}
