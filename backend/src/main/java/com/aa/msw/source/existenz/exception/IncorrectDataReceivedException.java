package com.aa.msw.source.existenz.exception;

import java.io.IOException;

public class IncorrectDataReceivedException extends IOException {
    public IncorrectDataReceivedException(String message) {
        super(message);
    }
}
