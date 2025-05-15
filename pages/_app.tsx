import '../styles/globals.css';
import React from 'react';
import type { AppProps } from 'next/app';
import Layout from '../components/Layout';
import { Toaster } from 'react-hot-toast';

type NextPageWithLayout = AppProps & {
  Component: AppProps['Component'] & {
    getLayout?: (page: React.ReactElement) => React.ReactNode
  }
}

function MyApp({ Component, pageProps }: NextPageWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout || ((page: React.ReactElement) => page)

  return (
    <>
      <Toaster position="top-right" />
      <Layout>
        {getLayout(<Component {...pageProps} />)}
      </Layout>
    </>
  );
}

export default MyApp;
