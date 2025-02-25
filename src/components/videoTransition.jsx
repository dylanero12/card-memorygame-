import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const VideoTransition = ({ videoUrl, onTransitionEnd }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const video = document.getElementById('transition-video');
    
    const handleEnded = () => {
      setIsPlaying(false);
      onTransitionEnd();
    };

    const handleError = (e) => {
      console.error('Video loading error:', e);
      setLoadError(true);
      onTransitionEnd(); // Skip to loss screen if video fails
    };

    if (video) {
      video.addEventListener('ended', handleEnded);
      video.addEventListener('error', handleError);

      // Log video element state
      console.log('Video element:', {
        url: videoUrl,
        readyState: video.readyState,
        networkState: video.networkState,
        error: video.error
      });

      // Ensure video plays
      video.play().catch(error => {
        console.error('Video playback failed:', error);
        handleError(error);
      });
    }

    return () => {
      if (video) {
        video.removeEventListener('ended', handleEnded);
        video.removeEventListener('error', handleError);
      }
    };
  }, [videoUrl, onTransitionEnd]);

  if (loadError || !isPlaying) return null;

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
        playsInline
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain'
        }}
        onLoadStart={() => console.log('Video load started')}
        onLoadedData={() => console.log('Video data loaded')}
      />
    </div>
  );
};

VideoTransition.propTypes = {
  videoUrl: PropTypes.string.isRequired,
  onTransitionEnd: PropTypes.func.isRequired
};

export default VideoTransition; 