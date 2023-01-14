import Head from 'next/head'
import Image from 'next/image'
import SideMenu from '../components/SideMenu'
import styles from '../styles/Home.module.css'
import Loading from '../components/Loading'

export default function Home() {
    return (
        <div>
            <Head>
                <title>Next Chat</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <SideMenu></SideMenu>

            <h1>Next Chat</h1>
        </div>
    )

}
