import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import './settings.css';
import { fetchWithAuth } from '../utils/api';
import { AudioContext } from '../App';

function Settings({ onUpdateCardPool }) {
  const [isOpen, setIsOpen] = useState(false);
  const [characters, setCharacters] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isMuted, toggleMute } = useContext(AudioContext);

  useEffect(() => {
    const fetchAllCharacters = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch characters
        const data = await fetchWithAuth('/api/characters');
        setCharacters(data);
        
        // Always select all characters by default
        const allCharacterIds = data.map(char => char.id);
        setSelectedCards(allCharacterIds);
        
        // Save the default selection
        localStorage.setItem('selectedCards', JSON.stringify(allCharacterIds));
        onUpdateCardPool(allCharacterIds);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchAllCharacters();
    }
  }, [isOpen, onUpdateCardPool]);

  const handleCardToggle = (cardId) => {
    setSelectedCards(prev => {
      const newSelection = prev.includes(cardId)
        ? prev.filter(id => id !== cardId)
        : [...prev, cardId];
      return newSelection;
    });
  };

  const handleSaveSettings = () => {
    localStorage.setItem('selectedCards', JSON.stringify(selectedCards));
    onUpdateCardPool(selectedCards);
    setIsOpen(false);
  };

  return (
    <div className="settings-container">
      <button 
        className="settings-button"
        onClick={() => setIsOpen(true)}
        title="Open Settings"
      >
        ⚙️
      </button>

      {isOpen && (
        <div className="fullscreen-overlay">
          <div className="settings-screen">
            <h2>Settings</h2>
            <div className="settings-section">
              <h3>Audio</h3>
              <button 
                className="mute-button"
                onClick={toggleMute}
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? "🔇" : "🔊"}
              </button>
            </div>
            <div className="settings-section">
              <h3>Character Selection</h3>
              <p className="settings-description">Select which characters will appear in the game</p>
              {loading ? (
                <div className="loading">Loading characters...</div>
              ) : error ? (
                <div className="error-message">{error}</div>
              ) : (
                <>
                  <div className="cards-selection-grid">
                    {characters.map(character => (
                      <div 
                        key={character.id} 
                        className={`card-selection ${selectedCards.includes(character.id) ? 'selected' : ''}`}
                        onClick={() => handleCardToggle(character.id)}
                      >
                        <img src={character.imageUrl} alt={character.name} />
                        <div className="card-selection-info">
                          <h3>{character.name}</h3>
                          <div className="selection-indicator">
                            {selectedCards.includes(character.id) ? '✓' : ''}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={handleSaveSettings} 
                    className="save-button"
                    disabled={selectedCards.length === 0}
                  >
                    Save & Return to Game
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

Settings.propTypes = {
  onUpdateCardPool: PropTypes.func.isRequired
};

export default Settings; 