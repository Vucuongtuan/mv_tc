"use client";
import React, { useState, useCallback, memo } from "react";
import VideoPlayer from "./video";

interface IViewMovieProps {
  name: string;
  slug: string;
  filename: string;
  link_embed: string;
  link_m3u8: string;
}

const EmbeddedPlayer = memo(({ src }: { src: string }) => (
  <iframe
    width="560"
    height="315"
    src={src}
    title="Embedded Video"
    frameBorder="0"
    allowFullScreen
    className="w-full h-full rounded-sm"
  ></iframe>
));
EmbeddedPlayer.displayName = "EmbeddedPlayer";

export default function ViewMovie({ link }: { link: { link1: IViewMovieProps, link2: any } }) {
  const [serverLink, setServerLink] = useState<0 | 1 | 2 | 3>(0);

  const serverContent = useCallback(async () => {
    switch (serverLink) {
      case 0:
        return <EmbeddedPlayer src={link.link1.link_embed} />;
      case 1:
        return <VideoPlayer videoUrl={link.link1.link_m3u8} />;
      case 2:
        return <EmbeddedPlayer src={link.link2.link_embed} />;
      case 3:
        return <VideoPlayer videoUrl={link.link2.link_m3u8} />;
      default:
        return <EmbeddedPlayer src={link.link1.link_embed} />;
    }
  }, [link.link1.link_embed, link.link1.link_m3u8, link.link2, serverLink]);

  const handleReload = useCallback(() => {
    window.location.reload();
  }, []);

  const getButtonClass = (isActive: boolean) =>
    `px-4 py-1 mt-1 border-2 ml-2 rounded-md 
    ${isActive ? "bg-red-500 text-white" : "hover:bg-red-500 hover:text-white"} 
    transition-colors duration-200
    min-[200px]:max-md:px-2 min-[200px]:max-md:py-1 min-[200px]:max-md:text-sm
    ${isActive ? "cursor-not-allowed" : ""}`;

  console.log(link);

  return (
    <section className="h-full mb-2">
      <div className="h-[90%] w-full">
        {serverContent()}
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center h-[10%] my-1 gap-2">
        <div className="flex justify-end gap-2 w-full ">
          <button
            disabled={serverLink === 0}
            onClick={() => setServerLink(0)}
            className={getButtonClass(serverLink === 0)}
          >
            Server 1
          </button>
          <button
            disabled={serverLink === 1}
            onClick={() => setServerLink(1)}
            className={getButtonClass(serverLink === 1)}
          >
            Server 2
          </button>
          {link.link2 && (
            <>
              {link.link2.link_embed && (
                <button
                  disabled={serverLink === 2}
                  onClick={() => setServerLink(2)}
                  className={getButtonClass(serverLink === 2)}
                >
                  Server 3
                </button>
              )}
              {link.link2?.link_m3u8 && (
                <button
                  disabled={serverLink === 3}
                  onClick={() => setServerLink(3)}
                  className={getButtonClass(serverLink === 3)}
                >
                  Server 4
                </button>
              )}
            </>
          )
          }
        </div>
      </div>
    </section>
  );
}
