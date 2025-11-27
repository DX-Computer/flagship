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
      <div className="relative w-full half:w-fit h-full flex items-end justify-end half:order-1 order-2 text-mainText font-nerd">
        <div className="relative w-full h-full half:w-80 flex flex-col gap-2 items-end justify-between">
          <div className="relative w-full justify-between h-full flex flex-row gap-5 items-end">
            <div className="relative w-full sm:w-fit half:w-full h-full flex bg-[#985458] items-end">
              <div className="relative w-full sm:w-80 half:w-full h-80 half:h-[70vh] flex">
                <Image
                  draggable={false}
                  objectFit="cover"
                  layout="fill"
                  objectPosition={"center"}
                  src={`${INFURA_GATEWAY_INTERNAL}QmVGsLUY9EmS9MPAcjHkAQ6k55P3vyBH5nZKHLTj4EsPyL`}
                />
              </div>
            </div>
            <div className="relative w-fit sm:w-full half:w-fit h-full flex items-end justify-end">
              <div className="relative w-10 sm:w-full half:w-8 h-full flex bg-[#985458]"></div>
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
