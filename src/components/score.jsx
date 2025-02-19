import PropTypes from 'prop-types'

const Score = ({ currentScore, bestScore }) => {
  return (
    <div className="score-board">
      <div className="current-score">Current Score: {currentScore}</div>
      <div className="best-score">Best Score: {bestScore}</div>
    </div>
  );
};

Score.propTypes = {
  currentScore: PropTypes.number.isRequired,
  bestScore: PropTypes.number.isRequired
};

export default Score;
