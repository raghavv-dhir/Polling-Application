package com.polling.service;

import com.polling.dto.PollCreateRequest;
import com.polling.dto.PollResponse;
import com.polling.exception.PollNotFoundException;
import com.polling.model.Poll;
import com.polling.repository.PollRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PollService {
    private final PollRepository pollRepository;

    public List<PollResponse> getAllPolls() {
        return pollRepository.findAll().stream()
                .map(this::mapToPollResponse)
                .collect(Collectors.toList());
    }

    public PollResponse createPoll(PollCreateRequest request) {
        Poll poll = new Poll();
        poll.setQuestion(request.getQuestion());
        poll.setOptions(request.getOptions());
        poll.setVotes(request.getOptions().stream()
                .map(option -> 0)
                .collect(Collectors.toList()));

        return mapToPollResponse(pollRepository.save(poll));
    }

    @Transactional
    public PollResponse vote(String pollId, int optionIndex) {
        Poll poll = pollRepository.findById(pollId)
                .orElseThrow(() -> new PollNotFoundException("Poll not found"));

        if (optionIndex < 0 || optionIndex >= poll.getOptions().size()) {
            throw new IllegalArgumentException("Invalid option index");
        }

        List<Integer> votes = poll.getVotes();
        votes.set(optionIndex, votes.get(optionIndex) + 1);

        return mapToPollResponse(pollRepository.save(poll));
    }

    public void deletePoll(String pollId) {
        if (!pollRepository.existsById(pollId)) {
            throw new PollNotFoundException("Poll not found");
        }
        pollRepository.deleteById(pollId);
    }

    private PollResponse mapToPollResponse(Poll poll) {
        PollResponse response = new PollResponse();
        response.setId(poll.getId());
        response.setQuestion(poll.getQuestion());
        response.setOptions(poll.getOptions());
        response.setVotes(poll.getVotes());
        response.setCreatedAt(poll.getCreatedAt());
        response.setTotalVotes(poll.getVotes().stream().mapToInt(Integer::intValue).sum());
        return response;
    }
}