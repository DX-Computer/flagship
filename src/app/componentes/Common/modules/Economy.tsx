import { FunctionComponent, JSX } from "react";
import { EconomyProps } from "../types/common.types";
import VideoPlayer from "./VideoPlayer";

const Economy: FunctionComponent<EconomyProps> = ({ dict }): JSX.Element => {
  const economy = dict?.common?.economy ?? {};

  return (
    <div className="relative w-full h-fit flex flex-col gap-6 items-center justify-start text-mainText px-2 lg:px-6">
      <div className="relative w-full max-w-4xl h-fit flex flex-col gap-5">
        <div className="relative w-full h-fit flex font-firaL text-sm leading-relaxed">
          {economy?.canonical}
        </div>
        <div className="relative w-full h-fit flex font-nerd text-xs uppercase tracking-wider leading-relaxed border-y border-mainText py-3">
          {economy?.intro}
        </div>
        <VideoPlayer
          src="/videos/atravesdelalineadearboles.web.mp4"
          poster="/images/atravesdelalineadearboles.png"
        />
        <div className="relative w-full h-fit flex flex-col lg:flex-row items-stretch justify-start">
          <div className="relative w-full lg:w-1/2 h-fit flex flex-col gap-2 lg:pr-6">
            <div className="relative w-fit h-fit flex font-nerd text-xs uppercase tracking-widest">
              {economy?.treelinerLabel}
            </div>
            <div className="relative w-full h-fit flex font-firaL text-[0.8rem] leading-relaxed opacity-90">
              {economy?.treeliner}
            </div>
          </div>
          <div className="relative w-full lg:w-1/2 h-fit flex flex-col gap-2 border-t lg:border-t-0 lg:border-l border-mainText pt-5 lg:pt-0 lg:pl-6">
            <div className="relative w-fit h-fit flex font-nerd text-xs uppercase tracking-widest">
              {economy?.cyberswagmanLabel}
            </div>
            <div className="relative w-full h-fit flex font-firaL text-[0.8rem] leading-relaxed opacity-90">
              {economy?.cyberswagman}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Economy;
