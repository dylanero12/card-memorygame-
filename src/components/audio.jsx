import { useEffect, useContext, useRef } from 'react';
import PropTypes from 'prop-types';
import { AudioContext } from '../App';

const AudioPlayer = ({ musicUrl }) => {
  const { isMuted } = useContext(AudioContext);
  const audioRef = useRef(null);

  useEffect(() => {
    let isSubscribed = true; // For cleanup

    const setupAudio = async () => {
      try {
        // Create new audio element only if we don't have one
        if (!audioRef.current) {
          audioRef.current = new window.Audio();
        }

        const audio = audioRef.current;
        audio.src = musicUrl;
        audio.loop = true;

        // Wait for audio to be loaded
        await new Promise((resolve, reject) => {
          audio.addEventListener('canplaythrough', resolve, { once: true });
          audio.addEventListener('error', reject, { once: true });
          
          // Timeout after 5 seconds
          const timeout = setTimeout(() => {
            reject(new Error('Audio loading timed out'));
          }, 5000);
          
          // Clean up timeout if loaded
          audio.addEventListener('canplaythrough', () => clearTimeout(timeout), { once: true });
        });

        if (isSubscribed && !isMuted) {
          await audio.play();
        }
      } catch (error) {
        console.error('Audio setup failed:', error);
      }
    };

    setupAudio();

    // Cleanup function
    return () => {
      isSubscribed = false;
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
    };
  }, [musicUrl, isMuted]);

  // Handle mute changes
  useEffect(() => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => {
          console.error('Failed to resume audio:', error);
        });
      }
    }
  }, [isMuted]);

  return null;
};

AudioPlayer.propTypes = {
  musicUrl: PropTypes.string.isRequired
};

export default AudioPlayer; 