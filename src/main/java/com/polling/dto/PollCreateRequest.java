package com.polling.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.util.List;

@Data
public class PollCreateRequest {
    @NotEmpty(message = "Question is required")
    private String question;

    @Size(min = 2, message = "At least two options are required")
    private List<String> options;
}