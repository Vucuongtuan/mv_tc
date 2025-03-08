import React from "react";

export default function LinkMovie({ linkMovie }: { linkMovie: any }) {
  return (
    <iframe
      width="560"
      height="315"
      src={linkMovie}
      title="Embedded Video"
      frameBorder="0"
      allowFullScreen
      className="w-full h-full rounded-sm"
    ></iframe>
  );
}
