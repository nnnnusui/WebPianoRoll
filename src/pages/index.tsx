import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import Roll from "../components/pianoroll/Roll";

const Home: NextPage = () => {
  const [url, setUrl] = useState("");
  useEffect(() => {
    setUrl(`${window.location.protocol}//${window.location.hostname}:8080`);
    window.addEventListener(
      "touchmove",
      (e: TouchEvent) => e.preventDefault(),
      { passive: false }
    );
  }, []);
  return <Roll urlRoot={url} />;
};

export default Home;
