import React, { useState, useEffect } from 'react';

interface TypewriterHeroProps {
  texts: string[];
  className?: string;
}

export const TypewriterHero = ({ texts, className = '' }: TypewriterHeroProps) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const currentFullText = texts[currentTextIndex];
    
    const handleTyping = () => {
      if (!isDeleting) {
        // Typing
        if (charIndex < currentFullText.length) {
          setCurrentText(currentFullText.substring(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        } else {
          // Finished typing, pause then start deleting
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        // Deleting
        if (charIndex > 0) {
          setCurrentText(currentFullText.substring(0, charIndex - 1));
          setCharIndex(charIndex - 1);
        } else {
          // Finished deleting, move to next text
          setIsDeleting(false);
          setCurrentTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
        }
      }
    };

    const typingSpeed = isDeleting ? 50 : 100;
    const timer = setTimeout(handleTyping, typingSpeed);

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, currentTextIndex, texts]);

  return (
    <div className={`typewriter ${className}`}>
      <span className="text-4xl md:text-6xl font-bold">
        {currentText}
        <span className="animate-pulse">|</span>
      </span>
    </div>
  );
};
