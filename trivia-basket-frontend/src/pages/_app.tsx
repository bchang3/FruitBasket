import { Layout } from "@/lib/components/Layout";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Fruit Basket</title>
        <link
          rel="icon"
          type="image/x-icon"
          href="/trivia-basket-icon.png"
        ></link>
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

export default App;
