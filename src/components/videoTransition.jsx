import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const VideoTransition = ({ videoUrl, onTransitionEnd }) => {
  const [error, setError] = useState(null);

  useEffect(() => {
    const video = document.getElementById('transition-video');
    
    const handleEnded = () => {
      onTransitionEnd();
    };

    const handleError = (e) => {
      console.error('Video playback error:', e);
      setError(e.message);
      // If video fails to load, proceed to defeat screen
      onTransitionEnd();
    };

    video.addEventListener('ended', handleEnded);
    video.addEventListener('error', handleError);

    // Log when video starts loading
    console.log('Loading video from URL:', videoUrl);

    return () => {
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('error', handleError);
    };
  }, [onTransitionEnd, videoUrl]);

  return (
    <div className="video-transition">
      {error && <div className="video-error">Error playing video: {error}</div>}
      <video 
        id="transition-video"
        src={videoUrl}
        autoPlay
        playsInline
        controls={false}
        muted={false}
        className="fullscreen-video"
        style={{ width: '100%', height: '100vh', objectFit: 'cover' }}
      />
    </div>
  );
};

VideoTransition.propTypes = {
  videoUrl: PropTypes.string.isRequired,
  onTransitionEnd: PropTypes.func.isRequired
};

export default VideoTransition; 