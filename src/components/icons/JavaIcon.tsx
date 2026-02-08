import type React from "react";

export const JavaIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 256 256"
    className={className}
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Java"
  >
    <path d="M128 16c-17 17 19 36 19 57 0 18-18 28-30 40 21-10 44-22 44-45 0-19-21-30-33-52z" />
    <path d="M96 128c-25 15-20 33 15 33 23 0 35-2 53-9-8 8-27 16-55 16-50 0-47-33-13-52z" />
    <path d="M110 180c-20 14 0 26 33 26 32 0 51-4 71-14-5 9-31 23-75 23-67 0-47-33-29-35z" />
    {/* Java logo with brand colors */}
    {/* <path d="M128 16c-17 17 19 36 19 57 0 18-18 28-30 40 21-10 44-22 44-45 0-19-21-30-33-52z" fill="#ED8B00" />
    <path d="M96 128c-25 15-20 33 15 33 23 0 35-2 53-9-8 8-27 16-55 16-50 0-47-33-13-52z" fill="#ED8B00" />
    <path d="M110 180c-20 14 0 26 33 26 32 0 51-4 71-14-5 9-31 23-75 23-67 0-47-33-29-35z" fill="#ED8B00" /> */}
  </svg>
);