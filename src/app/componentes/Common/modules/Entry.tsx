"use client";

import { FunctionComponent, JSX, useContext } from "react";
import Header from "./Header";
import Roadmap from "./Roadmap";
import Image from "next/legacy/image";
import { INFURA_GATEWAY_INTERNAL } from "@/app/lib/constants";
import { ModalContext } from "@/app/providers";

const Entry: FunctionComponent<{ dict: any }> = ({ dict }): JSX.Element => {
  const context = useContext(ModalContext);
  return (
    <div className="w-full h-full flex flex-col gap-2 items-center justify-start">
      <div className="relative w-full h-fit flex pt-3 items-start justify-start flex-row gap-1">
        <div className="relative w-fit h-fit flex">
          <div
            className="relative w-9 h-8 flex cursor-sewingHS"
            onClick={() => window.open("http://bridge.digitalax.xyz/")}
          >
            <Image
              src={`${INFURA_GATEWAY_INTERNAL}QmVceMKvPLRnyWHdHJnDiL13YuzdmqW5jwLhsXC3RWUGfa`}
              draggable={false}
              layout="fill"
              objectFit="cover"
            />
          </div>
        </div>
      </div>
      <div className="w-full h-full flex flex-col gap-12 items-center justify-start">
        <Header dict={dict} />

        <div className="relative w-full h-fit flex items-center justify-center px-3">
          <div className="relative w-fit h-fit max-w-4xl flex items-center justify-center text-center border-y border-mainText py-6 px-4 font-nerd text-mainText sm:text-[2vw] text-[5vw] lg:text-[1.6vw] xl:text-[1.2vw] leading-snug whitespace-pre-line">
            {dict?.common?.silicon}
          </div>
        </div>

        <Roadmap dict={dict} />

        <div className="relative w-full h-full text-mainText bg-mainBg font-lib sm:text-[1.8vw] text-[4vw] lg:text-[1.5vw] xl:text-[1vw] text-center pb-28 break-word px-2 flex items-center justify-center">
          {dict.common?.cc0}
        </div>
        <div
          className="font-mana text-xs pb-4 relative w-fit h-fit text-mainText underline cursor-sewingHS"
          onClick={() => window.open("https://dx402.computer")}
        >
          dx402.computer
        </div>
      </div>
    </div>
  );
};

export default Entry;
