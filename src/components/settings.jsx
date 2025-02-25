import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
const apiUrl = 'https://apiforcards-git-messingaroundwithvideos-dylanero12s-projects.vercel.app';

const Settings = ({ onUpdateCardPool }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [allCharacters, setAllCharacters] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);

  useEffect(() => {
    const fetchAllCharacters = async () => {
      try {
        const response = await fetch(apiUrl + '/api/characters', {
          method: 'GET',
          mode: 'cors',
          credentials: 'omit',
          headers: {
            'Accept': 'application/json'
          }
        });
        const data = await response.json();
        setAllCharacters(data);
        const savedSelection = localStorage.getItem('selectedCards');
        const initialSelection = savedSelection 
          ? JSON.parse(savedSelection) 
          : data.map(char => char.id);
        setSelectedCards(initialSelection);
      } catch (error) {
        console.error('Error fetching characters:', error);
      }
    };

    fetchAllCharacters();
  }, []);

  const handleCardToggle = (cardId) => {
    setSelectedCards(prev => {
      if (prev.includes(cardId)) {
        return prev.filter(id => id !== cardId);
      } else {
        return [...prev, cardId];
      }
    });
  };

  const handleSaveSettings = () => {
    localStorage.setItem('selectedCards', JSON.stringify(selectedCards));
    onUpdateCardPool(selectedCards);
    setIsOpen(false);
  };

  return (
    <>
      <button 
        className="settings-button"
        onClick={() => setIsOpen(true)}
      >
        ⚙️
      </button>

      {isOpen && (
        <div className="fullscreen-overlay">
          <div className="settings-screen">
            <h2>Character Selection</h2>
            <p className="settings-description">Select which characters will appear in the game</p>
            <div className="cards-selection-grid">
              {allCharacters.map(character => (
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
            <button onClick={handleSaveSettings} className="save-button">
              Save & Return to Game
            </button>
          </div>
        </div>
      )}
    </>
  );
};

Settings.propTypes = {
  onUpdateCardPool: PropTypes.func.isRequired
};

export default Settings; 