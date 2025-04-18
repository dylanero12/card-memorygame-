import { useEffect, useRef, useContext } from 'react';
import PropTypes from 'prop-types';
import { AudioContext } from '../App';

const AudioPlayer = ({ musicUrl }) => {
  const audioRef = useRef(null);
  const { isMuted } = useContext(AudioContext);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : 1;
    }
  }, [isMuted]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play().catch(error => {
        console.error('Error playing audio:', error);
      });
    }
  }, [musicUrl]);

  return (
    <audio
      ref={audioRef}
      src={musicUrl}
      autoPlay
      loop
      controls={false}
    />
  );
};

AudioPlayer.propTypes = {
  musicUrl: PropTypes.string.isRequired
};

export default AudioPlayer; 