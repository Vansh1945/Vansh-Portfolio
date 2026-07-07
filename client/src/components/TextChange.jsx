import React, { useState, useEffect, useRef, useCallback } from "react";

const FALLBACK_DESIGNATIONS = [
  "Full Stack Developer",
  "MERN Stack Developer",
  "Frontend Developer",
];

const TYPING_SPEED = 100;
const PAUSE_BEFORE_DELETE = 1500;

const TextChange = ({ designation }) => {
  const texts = designation
    ? designation.split(",").map((t) => t.trim()).filter(Boolean)
    : FALLBACK_DESIGNATIONS;

  // Use refs to avoid stale closures inside setInterval
  const textsRef = useRef(texts);
  const indexRef = useRef(0);
  const charIndexRef = useRef(0);
  const isForwardRef = useRef(true);
  const isPausedRef = useRef(false);

  const [displayText, setDisplayText] = useState("");

  // Keep textsRef in sync with prop changes
  useEffect(() => {
    textsRef.current = texts;
    // Reset animation when designation prop changes
    indexRef.current = 0;
    charIndexRef.current = 0;
    isForwardRef.current = true;
    isPausedRef.current = false;
    setDisplayText("");
  }, [designation]);

  const tick = useCallback(() => {
    const currentTexts = textsRef.current;
    if (currentTexts.length === 0) return;

    if (isPausedRef.current) return;

    const fullText = currentTexts[indexRef.current % currentTexts.length];
    if (!fullText) return;

    if (isForwardRef.current) {
      // Typing forward
      charIndexRef.current += 1;
      setDisplayText(fullText.substring(0, charIndexRef.current));

      if (charIndexRef.current >= fullText.length) {
        // Pause at the end of the word before deleting
        isPausedRef.current = true;
        setTimeout(() => {
          isPausedRef.current = false;
          isForwardRef.current = false;
        }, PAUSE_BEFORE_DELETE);
      }
    } else {
      // Deleting backward
      charIndexRef.current -= 1;
      setDisplayText(fullText.substring(0, charIndexRef.current));

      if (charIndexRef.current <= 0) {
        isForwardRef.current = true;
        indexRef.current = (indexRef.current + 1) % currentTexts.length;
      }
    }
  }, []);

  useEffect(() => {
    const intervalId = setInterval(tick, TYPING_SPEED);
    return () => clearInterval(intervalId);
  }, [tick]);

  return (
    <span className="font-cursive">
      {displayText}
      <span className="animate-pulse">|</span>
    </span>
  );
};

export default TextChange;