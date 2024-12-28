package com.polling.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class PollResponse {
    private String id;
    private String question;
    private List<String> options;
    private List<Integer> votes;
    private LocalDateTime createdAt;
    private int totalVotes;
}