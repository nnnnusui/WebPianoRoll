import React, { ReactElement, useState, useEffect } from "react";
import Rest from "./rest/Rest";
import Context from "./context/Context";
import RollController from "./controller/RollController";
import AudioController from "./controller/AudioController";
import Grid from "./canvas/Grid";

const PianoRoll: React.FC = (): ReactElement => {
  const url = Init();
  if (url == undefined) return <></>;

  const rest = Rest(url);

  return (
    <div className="h-full w-full flex">
      <Context.Provider rest={rest}>
        <div>
          <AudioController rest={rest.sound} />
          <hr className="border-gray-400 mt-1.5 mb-1" />
          <RollController />
        </div>
        <Grid rest={rest} />
      </Context.Provider>
    </div>
  );
};
export default PianoRoll;

const Init = () => {
  const [url, setUrl] = useState<string>();
  useEffect(() => {
    setUrl(getUrl());
    suplessTouchMove();
  }, []);
  return url;
};
const getUrl = () => {
  const protocol = window.location.protocol;
  const hostName = window.location.hostname;
  const port = "8080";
  return `${protocol}//${hostName}:${port}`;
};
const suplessTouchMove = () => {
  window.addEventListener("touchmove", (e: TouchEvent) => e.preventDefault(), {
    passive: false,
  });
};
