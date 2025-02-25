import { useState, useEffect, useCallback } from 'react';
import Card from './cards';
import Score from './score';
import PropTypes from 'prop-types';
import AudioPlayer from './audio';
import VideoTransition from './videoTransition';

const Game = ({ activeCardIds }) => {
  const [allCharacters, setAllCharacters] = useState([]);
  const [displayedCharacters, setDisplayedCharacters] = useState([]);
  const [clickedCards, setClickedCards] = useState([]);
  const [currentScore, setCurrentScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasWon, setHasWon] = useState(false);
  const [lossInfo, setLossInfo] = useState(null);
  const [showVideo, setShowVideo] = useState(false);
  const [showLossScreen, setShowLossScreen] = useState(false);

  const MAX_CARDS = 10;

  const getRandomCharacters = useCallback((characters, count, clickedIds) => {
    // First, separate clicked and unclicked characters
    const unclickedCharacters = characters.filter(char => !clickedIds.includes(char.id));
    
    // If we have unclicked characters, ensure we include at least one
    if (unclickedCharacters.length > 0) {
      // Get one random unclicked character
      const guaranteedCard = unclickedCharacters[Math.floor(Math.random() * unclickedCharacters.length)];
      
      // Shuffle and select remaining cards from all characters
      const remainingCards = [...characters]
        .filter(char => char.id !== guaranteedCard.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, count - 1);
      
      // Combine and shuffle again
      return shuffleArray([guaranteedCard, ...remainingCards]);
    }
  }, []);

  const resetGame = () => {
    if (currentScore > bestScore) {
      setBestScore(currentScore);
    }
    setClickedCards([]);
    setCurrentScore(0);
    setHasWon(false);
    setLossInfo(null);
    setDisplayedCharacters(getRandomCharacters(allCharacters, MAX_CARDS, []));
  };

  const fetchCharacters = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('https://apiforcards-k9iu-git-messingaroundw-0708bd-dylanero12s-projects.vercel.app/api/characters', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        cache: 'no-cache',
        credentials: 'omit',
        mode: 'cors'
      });
      
      if (!response.ok) {
        console.error('Response not ok:', {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries())
        });
        const text = await response.text();
        console.log('Response text:', text);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Clone the response before reading it
      const responseClone = response.clone();
      
      try {
        const data = await response.json();
        console.log('Raw API response:', data);
        
        // Ensure we're working with an array
        const charactersArray = Array.isArray(data) ? data : [];
        console.log('Characters array:', charactersArray);
        
        // Filter characters based on activeCardIds
        const filteredData = activeCardIds 
          ? charactersArray.filter(char => activeCardIds.includes(char.id))
          : charactersArray;
        
        console.log('Filtered characters:', filteredData);
        
        if (filteredData.length === 0) {
          console.warn('No characters available after filtering');
          setError('No characters available to display');
          return;
        }
        
        setAllCharacters(filteredData);
        const randomChars = getRandomCharacters(filteredData, Math.min(MAX_CARDS, filteredData.length), []);
        console.log('Random characters selected:', randomChars);
        setDisplayedCharacters(randomChars);
        
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        // Try to read the cloned response as text for debugging
        const text = await responseClone.text();
        console.log('Raw response text:', text);
        throw new Error('Failed to parse response as JSON');
      }
      
    } catch (error) {
      console.error('Fetch error details:', error);
      setError(`Failed to load characters: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [activeCardIds, getRandomCharacters]);

  // Add debug effect for state changes
  useEffect(() => {
    console.log('Current game state:', {
      allCharacters: allCharacters.length,
      displayedCharacters: displayedCharacters.length,
      clickedCards,
      currentScore,
      bestScore,
      isLoading,
      error,
      hasWon,
      showVideo,
      showLossScreen
    });
  }, [allCharacters, displayedCharacters, clickedCards, currentScore, bestScore, isLoading, error, hasWon, showVideo, showLossScreen]);

  useEffect(() => {
    fetchCharacters();
  }, [fetchCharacters]);

  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const handleCardClick = (cardId) => {
    if (clickedCards.includes(cardId)) {
      // Game Over - card was clicked twice
      const losingCard = allCharacters.find(char => char.id === cardId);
      console.log('Losing card:', losingCard);
      setLossInfo(losingCard);
      
      if (losingCard.defeatVideo) {
        console.log('Playing defeat video:', losingCard.defeatVideo);
        setShowVideo(true);
      } else {
        console.log('No defeat video, showing loss screen');
        setShowLossScreen(true);
      }
    } else {
      const newClickedCards = [...clickedCards, cardId];
      setClickedCards(newClickedCards);
      setCurrentScore(currentScore + 1);
      
      // Check if all characters have been clicked
      if (newClickedCards.length === allCharacters.length) {
        setHasWon(true);
        if (currentScore + 1 > bestScore) {
          setBestScore(currentScore + 1);
        }
      } else {
        // Continue game - shuffle cards
        setDisplayedCharacters(getRandomCharacters(allCharacters, MAX_CARDS, newClickedCards));
      }
    }
  };

  const handleVideoEnd = () => {
    setShowVideo(false);
    setShowLossScreen(true);
  };

  if (isLoading) {
    return <div className="loading">Loading characters...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (hasWon) {
    return (
      <div className="win-screen">
        <h2>Congratulations! You Win!</h2>
        <p>Final Score: {currentScore}</p>
        <p>Best Score: {bestScore}</p>
        <button onClick={resetGame} className="restart-button">
          Play Again
        </button>
      </div>
    );
  }

  if (showVideo && lossInfo?.defeatVideo) {
    return (
      <VideoTransition 
        videoUrl={lossInfo.defeatVideo}
        onTransitionEnd={handleVideoEnd}
      />
    );
  }

  if (showLossScreen && lossInfo) {
    return (
      <div className="loss-screen">
        {lossInfo.defeatMusic && <AudioPlayer musicUrl={lossInfo.defeatMusic} />}
        <img 
          src={lossInfo.imageUrl} 
          alt={`${lossInfo.name}`}
          className="background-animation"
        />
        <div className="loss-content">
          <h2>Game Over!</h2>
          <h3>Defeated by {lossInfo.name}</h3>
          <p className="character-description">
            {lossInfo.description || "No description available for this character."}
          </p>
          <p>Final Score: {currentScore}</p>
          <p>Best Score: {bestScore}</p>
          <button onClick={resetGame} className="restart-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="game">
      {console.log('Scores:', { currentScore, bestScore })}
      <Score currentScore={currentScore} bestScore={bestScore} />
      <div className="cards-grid">
        {displayedCharacters.map((character) => (
          <Card
            key={character.id}
            character={character}
            onClick={handleCardClick}
          />
        ))}
      </div>
    </div>
  );
};

Game.propTypes = {
  activeCardIds: PropTypes.arrayOf(PropTypes.number)
};

export default Game;
