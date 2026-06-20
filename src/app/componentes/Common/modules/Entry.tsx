"use client";

import { FunctionComponent, JSX } from "react";
import Header from "./Header";
import Roadmap from "./Roadmap";
import Economy from "./Economy";
import Backdrop from "./Backdrop";
import Type from "./Type";

const Entry: FunctionComponent<{ dict: any }> = ({ dict }): JSX.Element => {
  return (
    <div className="w-full h-full flex bg-black text-white flex-col gap-2 items-center justify-start">
      <div className="relative w-full h-screen p-3 sm:p-6">
        <div className="crt-screen relative w-full h-full">
          <Backdrop />
        </div>
      </div>
      <div
        className="font-mag w-full flex h-fit text-[14vw] relative items-center justify-center"
        dir="ltr"
      >
        <Type />
      </div>
      <div className="w-full h-full flex flex-col gap-12 items-center justify-start">
        <Header dict={dict} />

        <div className="relative w-full h-fit flex items-center justify-center px-3">
          <div className="relative w-fit h-fit max-w-4xl flex items-center justify-center text-center border-y border-mainText py-6 px-4 font-nerd text-mainText sm:text-[2vw] text-[5vw] lg:text-[1.6vw] xl:text-[1.2vw] leading-snug whitespace-pre-line">
            {dict?.common?.silicon}
          </div>
        </div>
        <div className="relative w-full h-fit flex flex-row items-center justify-center px-3">
          <div
            dir="auto"
            className="relative w-fit h-fit max-w-2xl flex flex-col items-start justify-start text-start border-s border-mainText py-4 px-5 font-nerd text-mainText sm:text-[1.5vw] text-[3.6vw] lg:text-[1vw] xl:text-[0.85vw] leading-relaxed whitespace-pre-line"
          >
            {dict?.common?.thesis}
          </div>
        </div>
        <Roadmap dict={dict} />
        <Economy dict={dict} />
        <div
          className="font-mana text-xs pb-4 mt-auto relative w-fit h-fit text-mainText underline cursor-sewingHS"
          onClick={() => window.open("https://dx402.computer")}
        >
          dx402.computer
        </div>
      </div>
    </div>
  );
};

export default Entry;
