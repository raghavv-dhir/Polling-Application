import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Poll from './Poll';

const PollList = () => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPolls = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('http://localhost:8080/api/polls');
      setPolls(response.data);
    } catch (error) {
      setError('Failed to fetch polls. Please try again later.');
      console.error('Error fetching polls:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPolls();
  }, [fetchPolls]);

  if (loading) return <div className="loading">Loading polls...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="poll-list">
      {polls.length === 0 ? (
        <div className="no-polls">No polls available. Create one!</div>
      ) : (
        polls.map(poll => (
          <Poll 
            key={poll.id} 
            poll={poll} 
            updatePolls={fetchPolls} 
          />
        ))
      )}
    </div>
  );
};

export default PollList;