package com.example.newsletter_service.dto;


import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;

public class KafkaMessage<T> {

    private String action;
    private T data;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime timestamp;

    public KafkaMessage() {
        this.timestamp = LocalDateTime.now();
    }

    public KafkaMessage(String action, T data) {
        this();
        this.action = action;
        this.data = data;
    }

    // Getters and Setters
    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    @Override
    public String toString() {
        return "KafkaMessage{" +
                "action='" + action + '\'' +
                ", data=" + data +
                ", timestamp=" + timestamp +
                '}';
    }
}

