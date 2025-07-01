import React from 'react';

const TTSPlayer = ({ text }) => {
  const playVoice = async () => {
    const response = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    const blob = await response.blob();
    const audio = new Audio(URL.createObjectURL(blob));
    audio.play();
  };

  return (
    <button onClick={playVoice} className="bg-blue-600 text-white px-3 py-1 rounded mt-2">
      🔊 Listen
    </button>
  );
};

export default TTSPlayer;
