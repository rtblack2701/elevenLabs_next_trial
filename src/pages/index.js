import Head from 'next/head';
import PlayWriter from '../components/PlayWriter';
import styles from '../styles/Home.module.css';

export default function Home() {
    return (
        <div className={styles.container}>
            <Head>
                <title>Play Writer</title>
                <meta name="description" content="A tool for writing plays and generating voice lines." />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>Play Writer</h1>
                <PlayWriter />
            </main>
        </div>
    );
}