import Image, { placeholderBlur } from "@/components/Commons/Image";



export default function Placeholder() {
    return (
        <div className="aspect-video w-full h-full">
           <Image src={placeholderBlur} alt="placeholder" fill />
        </div>
    )
}