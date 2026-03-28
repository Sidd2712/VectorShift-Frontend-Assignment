// AutoResizeTextarea.js
import { useEffect, useRef } from "react";

export const AutoResizeTextarea = ({
  value,
  onChange,
  onBlur,
  style,
  placeholder,
}) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      placeholder={placeholder}
      className="w-full min-h-[60px] resize-none overflow-hidden px-2.5 py-1.5 text-sm border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
      style={style}
    />
  );
};
