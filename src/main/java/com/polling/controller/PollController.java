package com.polling.controller;

import com.polling.dto.PollCreateRequest;
import com.polling.dto.PollResponse;
import com.polling.service.PollService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/polls")
@RequiredArgsConstructor
public class PollController {
    private final PollService pollService;

    @GetMapping
    public ResponseEntity<List<PollResponse>> getAllPolls() {
        return ResponseEntity.ok(pollService.getAllPolls());
    }

    @PostMapping
    public ResponseEntity<PollResponse> createPoll(@Valid @RequestBody PollCreateRequest request) {
        return ResponseEntity.ok(pollService.createPoll(request));
    }

    @PostMapping("/{id}/vote/{optionIndex}")
    public ResponseEntity<PollResponse> vote(
            @PathVariable String id,
            @PathVariable int optionIndex) {
        return ResponseEntity.ok(pollService.vote(id, optionIndex));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePoll(@PathVariable String id) {
        pollService.deletePoll(id);
        return ResponseEntity.ok().build();
    }
}
