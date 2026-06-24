import { FunctionComponent, JSX } from "react";
import { EconomyProps } from "../types/common.types";
import VideoChip from "./VideoChip";

const Economy: FunctionComponent<EconomyProps> = ({ dict }): JSX.Element => {
  const economy = dict?.common?.economy ?? {};

  return (
    <div
      id="economy-wrap"
      className="relative w-full flex flex-col gap-28 items-center justify-start text-mainText px-3"
    >
      <div
        id="econ-canonical"
        className="relative w-fit max-w-2xl flex items-center justify-center text-center font-firaL text-sm leading-relaxed py-4"
      >
        {economy?.canonical}
      </div>
      <div
        id="econ-intro"
        className="relative w-fit max-w-2xl flex items-center justify-center text-center font-nerd text-xs uppercase tracking-wider leading-relaxed py-4"
      >
        {economy?.intro}
      </div>
      <div
        id="econ-video"
        className="relative w-full max-w-2xl flex items-center justify-center"
      >
        <VideoChip
          src="/videos/atravesdelalineadearboles.web.mp4"
          poster="/images/atravesdelalineadearboles.png"
        />
      </div>
      <div
        id="econ-treeliner"
        className="relative w-fit max-w-2xl flex flex-col gap-2 items-center justify-center text-center py-4"
      >
        <div className="relative w-fit flex font-nerd text-xs uppercase tracking-widest">
          {economy?.treelinerLabel}
        </div>
        <div className="relative w-full flex font-firaL text-[0.8rem] leading-relaxed opacity-90">
          {economy?.treeliner}
        </div>
      </div>
      <div
        id="econ-cyber"
        className="relative w-fit max-w-2xl flex flex-col gap-2 items-center justify-center text-center py-4"
      >
        <div className="relative w-fit flex font-nerd text-xs uppercase tracking-widest">
          {economy?.cyberswagmanLabel}
        </div>
        <div className="relative w-full flex font-firaL text-[0.8rem] leading-relaxed opacity-90">
          {economy?.cyberswagman}
        </div>
      </div>
    </div>
  );
};

export default Economy;
