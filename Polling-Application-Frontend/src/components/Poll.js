import React, { useState } from 'react';
import axios from 'axios';

const Poll = ({ poll: initialPoll, updatePolls }) => {
  // Keep local state for the poll data
  const [poll, setPoll] = useState(initialPoll);
  const [loadingOptions, setLoadingOptions] = useState({});
  const [error, setError] = useState(null);

  const handleVote = async (optionIndex) => {
    // Prevent voting if already loading
    if (loadingOptions[optionIndex]) return;

    setLoadingOptions(prev => ({ ...prev, [optionIndex]: true }));
    setError(null);

    // Store the previous state for rollback if needed
    const previousVotes = [...poll.votes];

    try {
      // Optimistically update the UI
      const newVotes = [...poll.votes];
      newVotes[optionIndex] += 1;
      setPoll(prev => ({
        ...prev,
        votes: newVotes
      }));

      // Make the API call
      await axios.post(
        `http://localhost:8080/api/polls/${poll.id}/vote/${optionIndex}`
      );
      
      // No need to update polls here since we've already updated locally
    } catch (error) {
      // Revert to previous state if the API call fails
      setPoll(prev => ({
        ...prev,
        votes: previousVotes
      }));
      setError('Failed to submit vote. Please try again.');
      console.error('Error submitting vote:', error);
    } finally {
      setLoadingOptions(prev => ({ ...prev, [optionIndex]: false }));
    }
  };

  const handleDeletePoll = async () => {
    if (!window.confirm('Are you sure you want to delete this poll?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:8080/api/polls/${poll.id}`);
      // Call updatePolls to remove the deleted poll from parent state
      updatePolls();
    } catch (error) {
      setError('Failed to delete poll. Please try again.');
      console.error('Error deleting poll:', error);
    }
  };

  const totalVotes = poll.votes.reduce((sum, count) => sum + count, 0);

  return (
    <div className="poll">
      <h2>{poll.question}</h2>
      {error && <div className="error-message">{error}</div>}
      <table className="poll-table">
        <tbody>
          {poll.options.map((option, index) => {
            const percentage = totalVotes ? ((poll.votes[index] / totalVotes) * 100).toFixed(1) : 0;
            const isLoading = loadingOptions[index];
            
            return (
              <tr
                key={index}
                className={`poll-row ${isLoading ? 'loading' : ''}`}
                onClick={() => !isLoading && handleVote(index)}
                style={{ cursor: isLoading ? 'wait' : 'pointer' }}
              >
                <td className="poll-option">
                  <div className="option-content">
                    <span className="option-text">{option}</span>
                    <div 
                      className="vote-percentage-bar" 
                      style={{ 
                        width: `${percentage}%`,
                        transition: 'width 0.3s ease' 
                      }} 
                    />
                  </div>
                </td>
                <td className="poll-votes">
                  {isLoading ? (
                    <span className="voting-text">Voting...</span>
                  ) : (
                    <span className="votes-text">
                      {`${poll.votes[index]} ${poll.votes[index] === 1 ? 'vote' : 'votes'} (${percentage}%)`}
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <button 
        onClick={handleDeletePoll} 
        className="poll-delete-button"
      >
        Delete Poll
      </button>
    </div>
  );
};

export default Poll;