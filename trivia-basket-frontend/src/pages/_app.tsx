import { Layout } from "@/lib/components/Layout";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { CookiesProvider } from "react-cookie";
import { ToastContainer } from "react-toastify";

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
        <CookiesProvider>
          <Component {...pageProps} />
          <ToastContainer theme="light" />
        </CookiesProvider>
      </Layout>
    </>
  );
}

export default App;
