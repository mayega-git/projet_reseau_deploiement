package com.letsgo.education_service.exception;

public class PodcastNotFoundException extends RuntimeException {
    public PodcastNotFoundException(String message) {
        super(message);
    }

    public PodcastNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
