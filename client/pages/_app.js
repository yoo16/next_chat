import React from 'react';
import Head from "next/head"
import "tailwindcss/tailwind.css"

function MyApp({ Component, pageProps }) {

    React.useEffect(() => {
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles) {
            jssStyles.parentElement.removeChild(jssStyles);
        }
    }, []);

    return (
        <>
            <Head>
                <title>Next Chat</title>
            </Head>
            <Component {...pageProps} />
        </>
    )
}

export default MyApp