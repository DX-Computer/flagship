import {
  idiomaAImagen,
  Idiomas,
  indiceAIdioma,
  indiceASimbolo,
  INFURA_GATEWAY_INTERNAL,
} from "@/app/lib/constants";
import Image from "next/legacy/image";
import { FunctionComponent, JSX, useContext } from "react";
import {
  PiArrowFatLinesLeftFill,
  PiArrowFatLinesRightFill,
} from "react-icons/pi";
import { BarProps } from "../types/common.types";
import Marquee from "react-fast-marquee";
import { ModalContext } from "@/app/providers";

const Bar: FunctionComponent<BarProps> = ({
  dict,
  setChosenLanguage,
  chosenLanguage,
  changeLanguage,
}): JSX.Element => {
  const context = useContext(ModalContext);
  return (
    <>
      <div className="relative w-full h-fit flex mr-0 flex-row gap-4 items-end justify-end">
        <div className="relative w-fit h-fit flex items-center justify-center flex flex-row gap-3">
          <div className="relative w-fit h-fit flex items-center justify-center text-mainText flex-col text-center font-pot uppercase">
            <div className="text-base flex items-center justify-center">
              {dict?.common?.select}
            </div>
            <div
              dir="ltr"
              className="relative w-fit h-fit flex items-center justify-center flex-row gap-2"
            >
              <div
                className="relative flex items-center justify-center w-fit h-fit active:scale-95 cursor-sewingHS"
                onClick={() =>
                  setChosenLanguage((prev) =>
                    prev > 0 ? prev - 1 : Object.keys(idiomaAImagen).length - 1,
                  )
                }
              >
                <PiArrowFatLinesLeftFill size={20} />
              </div>
              <div className="relative w-fit h-fit flex items-center justify-center">
                {indiceASimbolo[chosenLanguage]}
              </div>
              <div
                className="relative flex items-center justify-center w-fit h-fit active:scale-95 cursor-sewingHS"
                onClick={() =>
                  setChosenLanguage((prev) =>
                    prev < Object.keys(idiomaAImagen).length - 1 ? prev + 1 : 0,
                  )
                }
              >
                <PiArrowFatLinesRightFill size={20} />
              </div>
            </div>
            <div
              onClick={() => {
                if ([0, 1, 2, 4, 9].includes(chosenLanguage)) {
                  changeLanguage(indiceAIdioma[chosenLanguage]);
                }
              }}
              className={`text-xxs flex items-center justify-center px-2 border border-mainText rounded-sm h-6 w-full ${
                [0, 1, 2, 4, 9].includes(chosenLanguage) &&
                "cursor-sewingHS active:scale-95"
              }`}
            >
              ~*{" "}
              {![0, 1, 2, 4, 9].includes(chosenLanguage)
                ? dict?.common?.soon
                : dict?.common?.ve}{" "}
              *~
            </div>
          </div>
          <div className="relative w-fit h-fit flex items-center justify-center">
            <div className="relative w-8 h-10 flex items-center justify-center">
              <Image
                layout="fill"
                src={`${INFURA_GATEWAY_INTERNAL}${
                  idiomaAImagen[indiceAIdioma[chosenLanguage] as Idiomas]
                }`}
                draggable={false}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="relative w-full h-fit flex items-center justify-end gap-3 flex-row">
        <div
          className="relative w-96 h-9 rounded-r-md text-sm overflow-x-hidden whitespace-nowrap flex items-center justify-center text-offBlack"
          dir="ltr"
        >
          <div
            className="absolute w-full h-full top-0 left-0 z-0 flex items-center justify-center cursor-sewingHS border-y border-r border-mainText bg-white rounded-r-md"
            onClick={() =>
              context?.setFullScreenVideo(true)
            }
          >
            <Marquee
              className="z-0"
              direction="right"
              speed={25}
              gradient={false}
            >
              {Array.from({ length: 24 }).map((_, i) => (
                <span
                  key={i}
                  className="flex flex-row items-center gap-2 mx-2 whitespace-nowrap"
                >
                  Drones Over the Gadigal Highlands
                  <img
                    src="/images/bagpipes.png"
                    alt=""
                    draggable={false}
                    className="h-5 w-auto"
                  />
                  <img
                    src="/images/didgeridoo.png"
                    alt=""
                    draggable={false}
                    className="h-5 w-auto"
                  />
                </span>
              ))}
            </Marquee>
          </div>
        </div>
      </div>
    </>
  );
};

export default Bar;
