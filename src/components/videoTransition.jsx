import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const VideoTransition = ({ videoUrl, onTransitionEnd }) => {
  const [error, setError] = useState(null);

  useEffect(() => {
    const video = document.getElementById('transition-video');
    
    const handleEnded = () => {
      console.log('Video ended successfully');
      onTransitionEnd();
    };

    const handleError = (e) => {
      console.error('Video playback error:', e);
      console.error('Video URL:', videoUrl);
      setError(e.message);
      // If video fails to load, proceed to defeat screen
      onTransitionEnd();
    };

    const handleLoadStart = () => {
      console.log('Video load started:', videoUrl);
    };

    const handleLoadedData = () => {
      console.log('Video data loaded successfully');
    };

    video.addEventListener('ended', handleEnded);
    video.addEventListener('error', handleError);
    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('loadeddata', handleLoadedData);

    // Log when video starts loading
    console.log('Loading video from URL:', videoUrl);

    return () => {
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('error', handleError);
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('loadeddata', handleLoadedData);
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