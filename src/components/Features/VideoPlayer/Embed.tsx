


export default function Embed({src,fn} :{
    src: string;
    fn: (src: string) => void;
}) {
    return (
       <iframe
            src={src}
            className="w-full h-full border-0 absolute inset-0 z-10"
            allowFullScreen
            onLoad={() => fn(src)}
          />
    );
}