import Head from 'next/head'

import App from 'next/app'
import react, { Component } from 'react'
import '../styles/globals.css'
import Nav from '../components/nav'

export function Home({ Component, pageProps }) {
    return (
        <>
            <Head>
                <title>Shopping</title>
            </Head>
            <Nav />
            <Component {...pageProps} />
        </>
    )
};

export default Home