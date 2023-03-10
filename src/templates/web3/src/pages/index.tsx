import Head from 'next/head';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Home() {
  return (
    <>
      <Head>
        <title>Create Manu App</title>
        <meta name="description" content="Generated by create manu app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen w-screen flex flex-col justify-center items-center gap-8">
        <h1>Ready to code</h1>
        <ConnectButton />
      </main>
    </>
  );
}
