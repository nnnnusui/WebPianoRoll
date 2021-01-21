import React, { ReactElement, useEffect } from "react";
import type { AppProps } from "next/app";
import "../styles/globals.css";

const App = ({ Component, pageProps }: AppProps): ReactElement => {
  useEffect(()=> {
    window.addEventListener('touchmove', (e: TouchEvent) => e.preventDefault(), {passive: false});
  }, [])
  return <Component {...pageProps} />
};

export default App;
