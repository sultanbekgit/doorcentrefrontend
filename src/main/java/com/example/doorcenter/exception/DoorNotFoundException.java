package com.example.doorcenter.exception;

public class DoorNotFoundException extends RuntimeException {
    public DoorNotFoundException(String message) {
        super(message);
    }
}