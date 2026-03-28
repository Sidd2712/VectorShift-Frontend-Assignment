// DynamicWidthContainer.js
import React, { useRef, useEffect, useState } from "react";

export const DynamicWidthContainer = ({
  minWidth = 280,
  maxWidth = 400,
  children,
}) => {
  const containerRef = useRef(null);
  const [currentWidth, setCurrentWidth] = useState(minWidth);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Find the textarea inside the container
    const textarea = container.querySelector("textarea");
    if (!textarea) return;

    const updateWidth = () => {
      // Create a hidden div to measure the text width
      const measureDiv = document.createElement("div");
      measureDiv.style.position = "absolute";
      measureDiv.style.visibility = "hidden";
      measureDiv.style.whiteSpace = "nowrap";
      measureDiv.style.font = window.getComputedStyle(textarea).font;
      measureDiv.style.padding = window.getComputedStyle(textarea).padding;
      measureDiv.textContent = textarea.value || textarea.placeholder;

      document.body.appendChild(measureDiv);
      const textWidth = measureDiv.offsetWidth + 60; // Add padding for node chrome
      document.body.removeChild(measureDiv);

      // Calculate the required width (between min and max)
      const requiredWidth = Math.max(minWidth, Math.min(maxWidth, textWidth));
      setCurrentWidth(requiredWidth);
    };

    // Update width on input
    textarea.addEventListener("input", updateWidth);

    // Initial update
    updateWidth();

    return () => {
      textarea.removeEventListener("input", updateWidth);
    };
  }, [minWidth, maxWidth]);

  return (
    <div
      ref={containerRef}
      style={{ width: `${currentWidth}px`, transition: "width 0.2s ease" }}
    >
      {children}
    </div>
  );
};
