"use client";

import { FunctionComponent, JSX } from "react";
import Header from "./Header";
import Economy from "./Economy";
import Board3D from "./Board3D";
import Rings from "./Rings";
import Fanout from "./Fanout";
import RingFunnel from "./RingFunnel";
import Type from "./Type";
import Image from "next/image";

const Entry: FunctionComponent<{ dict: any }> = ({ dict }): JSX.Element => {
  return (
    <div
      style={{ position: "relative" }}
      className="relative w-full min-h-screen flex text-white flex-col items-center justify-start"
    >
      <Rings />
      <Board3D />
      <div className="relative z-10 w-full flex flex-col gap-2 items-center justify-start">
        <div className="w-full h-screen" />
        <div
          className="font-mag w-full flex h-fit text-[14vw] relative items-center justify-center"
          dir="ltr"
        >
          <Type />
        </div>
        <div className="w-full flex flex-col gap-12 items-center justify-start">
          <Header dict={dict} />
          <Fanout />
          <div className="relative w-full h-fit flex items-center justify-center px-3">
            <div
              id="silicon-block"
              className="relative w-fit h-fit max-w-4xl flex items-center justify-center text-center py-6 px-4 font-nerd text-mainText sm:text-[2vw] text-[5vw] lg:text-[1.6vw] xl:text-[1.2vw] leading-snug whitespace-pre-line"
            >
              {dict?.common?.silicon}
            </div>
          </div>
          <div className="relative w-full h-fit flex flex-row items-center justify-center px-3">
            <div
              id="thesis-block"
              dir="auto"
              className="relative w-fit h-fit max-w-2xl flex flex-col items-start justify-start text-start py-4 px-5 font-nerd text-mainText sm:text-[1.5vw] text-[3.6vw] lg:text-[1vw] xl:text-[0.85vw] leading-relaxed whitespace-pre-line"
            >
              {dict?.common?.thesis}
            </div>
          </div>
          <div className="w-full flex relative" style={{ height: 202 }} />
          <RingFunnel />
          <Economy dict={dict} />
          <div className="w-full flex relative" style={{ height: 240 }} />
          <div id="site-footer" className="pb-4 relative w-full h-fit flex flex-col gap-2 items-center justify-center">
            <div className="w-full h-1 flex relative ">
              <Image
                objectPosition="bottom center"
                layout="fill"
                objectFit="cover"
                alt="pcb board"
                draggable={false}
                src={"/images/pcbfondo.png"}
              />
            </div>
            <div
              onClick={() => window.open("https://dx402.computer")}
              className="relative w-fit h-fit flex cursor-sewingHS text-mainText underline font-mana text-xs py-4"
            >
              dx402.computer
            </div>
            <div className="w-full h-1 flex relative ">
              <Image
                objectPosition="left top"
                layout="fill"
                objectFit="cover"
                alt="pcb board"
                draggable={false}
                src={"/images/pcbfondo.png"}
              />
            </div>
            <div className="w-full h-1 flex relative ">
              <Image
                objectPosition="bottom right"
                layout="fill"
                objectFit="cover"
                alt="pcb board"
                draggable={false}
                src={"/images/pcbfondo.png"}
              />
            </div>
            <div className="w-full h-1 flex relative ">
              <Image
                objectPosition="center top"
                layout="fill"
                objectFit="cover"
                alt="pcb board"
                draggable={false}
                src={"/images/pcbfondo.png"}
              />
            </div>
            <div className="w-full h-1 flex relative ">
              <Image
                objectPosition="left bottom"
                layout="fill"
                alt="pcb board"
                objectFit="cover"
                draggable={false}
                src={"/images/pcbfondo.png"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Entry;
