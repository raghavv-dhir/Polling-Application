import React from 'react';
import PollList from './components/PollList';
import CreatePollForm from './components/CreatePollForm';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Polling Application</h1>
      </header>
      <CreatePollForm />
      <PollList />
    </div>
  );
}

export default App;