import { useState, createContext } from 'react';
import Game from './components/game';
import Settings from './components/settings';
import './App.css';

export const AudioContext = createContext();

function App() {
  const [activeCardIds, setActiveCardIds] = useState(() => {
    const saved = localStorage.getItem('selectedCards');
    return saved ? JSON.parse(saved) : null;
  });
  const [isMuted, setIsMuted] = useState(false);

  const handleUpdateCardPool = (selectedIds) => {
    setActiveCardIds(selectedIds);
  };

  return (
    <AudioContext.Provider value={{ isMuted, setIsMuted }}>
      <div className="App">
        <header className="App-header">
          <h1>Memory Card Game</h1>
          <div className="game-instructions">
            <p>Try to click each character card exactly once. The cards will shuffle after each click!</p>
            <p>Use the ⚙️ button to customize which characters appear in your game.</p>
          </div>
          <button 
            className="mute-button"
            onClick={() => setIsMuted(!isMuted)}
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? '🔇' : '🔊'}
          </button>
          <Settings onUpdateCardPool={handleUpdateCardPool} />
        </header>
        <main>
          <Game activeCardIds={activeCardIds} />
        </main>
      </div>
    </AudioContext.Provider>
  );
}

export default App;
