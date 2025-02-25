import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const VideoTransition = ({ videoUrl, onTransitionEnd }) => {
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    const video = document.getElementById('transition-video');
    
    const handleEnded = () => {
      setIsPlaying(false);
      onTransitionEnd();
    };

    if (video) {
      video.addEventListener('ended', handleEnded);
      // Ensure video plays
      video.play().catch(error => {
        console.error('Video playback failed:', error);
      });
    }

    return () => {
      if (video) {
        video.removeEventListener('ended', handleEnded);
      }
    };
  }, [onTransitionEnd]);

  if (!isPlaying) return null;

  return (
    <div className="video-transition" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'black',
      zIndex: 1000
    }}>
      <video 
        id="transition-video"
        src={videoUrl}
        autoPlay
        muted
        playsInline
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain'
        }}
      />
    </div>
  );
};

VideoTransition.propTypes = {
  videoUrl: PropTypes.string.isRequired,
  onTransitionEnd: PropTypes.func.isRequired
};

export default VideoTransition; 