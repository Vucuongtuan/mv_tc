import clsx from "clsx";
import st from "@/components/Sections/Movie/movie-info.module.scss"

export default function HtmlRender({html, className}: {html: string, className?: string}) {
    return (
        <section className={clsx(st.leftContent)}>
            <div className={st.section}>
        <h3 id="content-heading">Nội dung phim</h3>
        <div dangerouslySetInnerHTML={{ __html: html }} className={clsx(
            'prose prose-invert prose-lg md:prose-xl max-w-none',
            st.description
        )}/>
        </div>
        </section>
    )
}