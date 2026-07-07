import React, { useState, useEffect } from "react";

const TextChange = ({ designation }) => {
  // Split by comma if multiple designations are configured in the backend
  const texts = designation
    ? designation.split(",").map((t) => t.trim())
    : [];

  const [currentText, setCurrentText] = useState("");
  const [index, setIndex] = useState(0);
  const [isForward, setIsForward] = useState(true);

  useEffect(() => {
    if (texts.length === 0) return;

    const intervalId = setInterval(() => {
      const fullText = texts[index];
      if (!fullText) return;

      setCurrentText(fullText.substring(0, currentText.length + (isForward ? 1 : -1)));

      if (isForward && currentText.length === fullText.length) {
        setIsForward(false);
      } else if (!isForward && currentText.length === 0) {
        setIsForward(true);
        setIndex((prev) => (prev + 1) % texts.length);
      }
    }, 100);

    return () => clearInterval(intervalId);
  }, [currentText, isForward, index, texts]);

  if (texts.length === 0) {
    return <div className="font-cursive">&nbsp;</div>;
  }

  return <div className="font-cursive">{currentText}</div>;
};

export default TextChange;