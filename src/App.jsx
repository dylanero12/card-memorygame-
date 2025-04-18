import React, { useState, useEffect } from 'react';
import './App.css';
import Game from './components/game';
import Settings from './components/settings';
import Login from './components/login';
import Signup from './components/signup';
import { fetchWithAuth } from './utils/api';

export const AudioContext = React.createContext({
  isMuted: false,
  toggleMute: () => {}
});

export const apiUrl = 'http://localhost:3003';

function App() {
  const [activeCardIds, setActiveCardIds] = useState([]);
  const [healthStatus, setHealthStatus] = useState('Checking...');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [showLogin, setShowLogin] = useState(true);
  const [showSignup, setShowSignup] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    }
  }, []);

  // Initialize activeCardIds when authenticated
  useEffect(() => {
    const initializeCardIds = async () => {
      if (isAuthenticated) {
        try {
          const data = await fetchWithAuth('/api/characters');
          const allCharacterIds = data.map(char => char.id);
          setActiveCardIds(allCharacterIds);
        } catch (err) {
          console.error('Error initializing card IDs:', err);
        }
      }
    };

    initializeCardIds();
  }, [isAuthenticated]);

  const handleLogin = (newToken) => {
    setToken(newToken);
    setIsAuthenticated(true);
    localStorage.setItem('token', newToken);
  };

  const handleLogout = () => {
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
  };

  const handleSignup = (newToken) => {
    setToken(newToken);
    setIsAuthenticated(true);
    localStorage.setItem('token', newToken);
  };

  const toggleAuthForms = () => {
    setShowLogin(!showLogin);
    setShowSignup(!showSignup);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <AudioContext.Provider value={{ isMuted, toggleMute }}>
      <div className="App">
        <div className="title-container">
          <h1>Memory Game</h1>
          {isAuthenticated && <span className="health-status">{healthStatus}</span>}
        </div>
        
        {!isAuthenticated ? (
          <div className="auth-container">
            {showLogin ? (
              <Login onLogin={handleLogin} onSwitch={toggleAuthForms} />
            ) : (
              <Signup onSignup={handleSignup} onSwitch={toggleAuthForms} />
            )}
          </div>
        ) : (
          <>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
            <Settings
              onUpdateCardPool={setActiveCardIds}
            />
            <Game
              activeCardIds={activeCardIds}
              setHealthStatus={setHealthStatus}
              token={token}
            />
          </>
        )}
      </div>
    </AudioContext.Provider>
  );
}

export default App;
