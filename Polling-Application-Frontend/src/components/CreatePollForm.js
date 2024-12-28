import React, { useState } from 'react';
import axios from 'axios';

const CreatePollForm = () => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleQuestionChange = (event) => {
    setQuestion(event.target.value);
    setError(null);
  };

  const handleOptionChange = (index, event) => {
    const newOptions = [...options];
    newOptions[index] = event.target.value;
    setOptions(newOptions);
    setError(null);
  };

  const handleAddOption = () => {
    if (options.length >= 10) {
      setError('Maximum 10 options allowed');
      return;
    }
    setOptions([...options, '']);
  };

  const handleRemoveOption = (index) => {
    if (options.length <= 2) {
      setError('Minimum 2 options required');
      return;
    }
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Validate inputs
    if (!question.trim()) {
      setError('Please enter a question');
      return;
    }
    
    if (options.some(option => !option.trim())) {
      setError('Please fill in all options');
      return;
    }

    const uniqueOptions = new Set(options.map(opt => opt.trim()));
    if (uniqueOptions.size !== options.length) {
      setError('All options must be unique');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await axios.post('http://localhost:8080/api/polls', {
        question: question.trim(),
        options: options.map(opt => opt.trim())
      });
      
      // Reset form
      setQuestion('');
      setOptions(['', '']);
      
      // Use location.reload() as a last resort - ideally, implement a better state management solution
      window.location.reload();
    } catch (error) {
      setError('Failed to create poll. Please try again.');
      console.error('Error creating poll:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="create-poll-form" onSubmit={handleSubmit}>
      <h2>Create a New Poll</h2>
      {error && <div className="error-message">{error}</div>}
      <div>
        <label>Question:</label>
        <input
          type="text"
          value={question}
          onChange={handleQuestionChange}
          placeholder="Enter your poll question"
          maxLength={200}
          disabled={submitting}
          required
        />
      </div>
      <div>
        <label>Options:</label>
        {options.map((option, index) => (
          <div key={index} className="option-input-container">
            <input
              type="text"
              value={option}
              onChange={(event) => handleOptionChange(index, event)}
              placeholder={`Option ${index + 1}`}
              maxLength={100}
              disabled={submitting}
              required
            />
            {options.length > 2 && (
              <button
                type="button"
                onClick={() => handleRemoveOption(index)}
                className="remove-option-button"
                disabled={submitting}
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddOption}
          className="add-option-button"
          disabled={submitting}
        >
          Add Option
        </button>
      </div>
      <button type="submit" disabled={submitting}>
        {submitting ? 'Creating Poll...' : 'Create Poll'}
      </button>
    </form>
  );
};

export default CreatePollForm;