import { Helmet } from "react-helmet-async";

function SEO({ title, description, canonical }) {
    const siteUrl = "https://hakeem-ismail.com";

    return (
        <Helmet>
            <title>{title}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={`${siteUrl}${canonical}`} />
        </Helmet>
    );
}

export default SEO;