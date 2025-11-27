import { FunctionComponent, JSX } from "react";
import Bar from "./Bar";
import { ScreenProps } from "../types/common.types";
import Image from "next/legacy/image";
import { INFURA_GATEWAY_INTERNAL } from "@/app/lib/constants";
import Video from "./Video";
import { DndContext } from "@dnd-kit/core";
import {
  restrictToParentElement,
  restrictToWindowEdges,
} from "@dnd-kit/modifiers";

const Screen: FunctionComponent<ScreenProps> = ({
  dict,
  changeLanguage,
  videoLoading,
  setVideoLoading,
  chosenLanguage,
  setChosenLanguage,
}): JSX.Element => {
  return (
    <div id="header" className="half:gap-0 gap-3">
      <div className="relative w-fit h-full flex items-start justify-start half:order-1 order-2 text-mainText font-nerd">
        <div className="relative w-full half:h-full half:w-80 h-fit sm:h-52 flex flex-col gap-2 items-start justify-between">
          <div className="relative w-fit h-fit flex">
            {dict?.common?.agents}
          </div>
          <div className="relative text-xs flex half:flex-nowrap flex-wrap half:flex-col gap-3 items-start justify-start h-fit w-full">
            {[
              {
                title: dict?.common?.discoverT,
                description: dict?.common?.discoverD,
              },
              {
                title: dict?.common?.designT,
                description: dict?.common?.designD,
              },
              {
                title: dict?.common?.distroT,
                description: dict?.common?.distroD,
              },
              {
                title: dict?.common?.collectT,
                description: dict?.common?.collectD,
              },
              {
                title: dict?.common?.creativeT,
                description: dict?.common?.creativeD,
              },
              {
                title: dict?.common?.fulfillT,
                description: dict?.common?.fulfillD,
              },
            ].map((item, index) => {
              return (
                <div
                  key={index}
                  className="relative flex w-fit h-fit flex gap-2 flex-row items-center justify-between"
                >
                  <div className="relative w-fit h-fit py-1 px-1.5 flex items-center justify-center border border-mainText">
                    {item.title}
                  </div>
                  <div className="relative h-fit flex w-fit">
                    - {item.description}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="relative w-full justify-between h-fit half:h-full flex flex-row gap-5">
            <div className="relative w-full h-20 half:h-full flex bg-[#985458]">
              <Image
                draggable={false}
                objectFit="cover"
                layout="fill"
                src={`${INFURA_GATEWAY_INTERNAL}QmVGsLUY9EmS9MPAcjHkAQ6k55P3vyBH5nZKHLTj4EsPyL`}
              />
            </div>
            <div className="relative w-fit h-20 half:h-full flex items-end justify-end">
              <div className="relative w-8 h-full flex bg-[#985458]"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative w-full h-full flex items-center justify-start flex-col gap-3 half:order-2 order-1">
        <Bar
          dict={dict}
          chosenLanguage={chosenLanguage}
          setChosenLanguage={setChosenLanguage}
          changeLanguage={changeLanguage}
        />
        <DndContext
          modifiers={[restrictToParentElement, restrictToWindowEdges]}
        >
          <div
            className={`"relative w-full h-[60vh] half:h-full flex items-center justify-between rounded-sm overflow-hidden border-4 border-mainText bg-mainText`}
          >
            <Video
              setVideoLoading={setVideoLoading}
              videoLoading={videoLoading}
            />
          </div>
        </DndContext>
      </div>
    </div>
  );
};

export default Screen;
