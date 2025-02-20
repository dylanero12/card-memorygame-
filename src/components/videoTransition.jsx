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

    video.addEventListener('ended', handleEnded);
    return () => video.removeEventListener('ended', handleEnded);
  }, [onTransitionEnd]);

  return (
    <div className="video-transition">
      <video 
        id="transition-video"
        src={videoUrl}
        autoPlay
        muted={false}
        className="fullscreen-video"
      />
    </div>
  );
};

VideoTransition.propTypes = {
  videoUrl: PropTypes.string.isRequired,
  onTransitionEnd: PropTypes.func.isRequired
};

export default VideoTransition; 