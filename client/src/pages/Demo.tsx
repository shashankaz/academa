import { useState, useRef } from "react";
import { Pause, Play } from "lucide-react";

const Demo = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayPause = async () => {
    if (videoRef.current) {
      try {
        if (isPlaying) {
          videoRef.current.pause();
        } else {
          await videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleVideoPlay = () => {
    setIsPlaying(true);
  };

  const handleVideoPause = () => {
    setIsPlaying(false);
  };

  return (
    <div className="h-screen bg-accent p-20">
      <div className="border-2 border-primary h-full rounded-xl relative group overflow-hidden">
        <button
          onClick={handlePlayPause}
          className="hidden group-hover:block absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 border-2 border-primary rounded-full p-6 cursor-pointer hover:scale-110 transition-transform z-10"
        >
          {isPlaying ? <Pause /> : <Play />}
        </button>

        <video
          ref={videoRef}
          poster="/demo-thumbnail.svg"
          className="h-full w-full object-cover"
          onPlay={handleVideoPlay}
          onPause={handleVideoPause}
          preload="metadata"
        >
          <source src="/demo.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
};

export default Demo;
