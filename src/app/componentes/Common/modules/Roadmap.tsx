import { FunctionComponent, JSX } from "react";
import Image from "next/legacy/image";
import { INFURA_GATEWAY_INTERNAL } from "@/app/lib/constants";
import { RoadmapPhase, RoadmapProps } from "../types/common.types";

const PHASE_MEDIA: { type: "image" | "video"; src: string }[] = [
  { type: "image", src: "digitalax_secureenclave_dxcomputer" },
  { type: "image", src: "digitalax_internetcore_dxcomputer" },
  { type: "image", src: "digitalax_jumperwire_dxcomputer" },
  { type: "image", src: "digitalax_glitchcore_dxcomputer" },
  { type: "image", src: "digitalax_dimlab_dxcomputer" },
  { type: "image", src: "digitalax_risv_dxcomputer" },
];

const Roadmap: FunctionComponent<RoadmapProps> = ({ dict }): JSX.Element => {
  const phases: RoadmapPhase[] = dict?.common?.roadmap?.phases ?? [];
  const labels = dict?.common?.roadmap?.labels ?? {};

  return (
    <div
      id="roadmap"
      className="relative w-full h-fit flex flex-col gap-8 items-center justify-start text-mainText px-2"
    >
      <div className="relative w-fit h-fit flex flex-col gap-3 items-center justify-center text-center">
        <div className="relative w-fit h-fit py-1 px-2 border border-mainText font-nerd text-xs uppercase tracking-widest">
          {dict?.common?.roadmap?.label}
        </div>
      </div>
      <div className="relative w-full h-fit flex flex-row flex-wrap gap-4 items-stretch justify-center">
        {phases.map((phase, index) => {
          const media =
            PHASE_MEDIA[index] ?? PHASE_MEDIA[PHASE_MEDIA.length - 1];
          const rows = [
            { key: labels.hardware, value: phase.hardware },
            { key: labels.isolates, value: phase.isolates },
            { key: labels.protects, value: phase.protects },
            { key: labels.proves, value: phase.proves },
            { key: labels.runs, value: phase.runs },
          ];
          return (
            <div
              key={index}
              className="relative w-full sm:w-80 h-auto flex flex-col gap-3 border border-mainText p-4 bg-mainBg cursor-sewingHS hover:scale-[1.02] transition-transform duration-200"
            >
              <div className="relative w-full h-fit flex flex-row items-center justify-start font-nerd text-xs">
                <div className="relative w-fit h-fit py-0.5 px-1.5 border border-mainText">
                  {phase.id}
                </div>
              </div>
              <div className="relative w-fit h-fit font-firaL text-sm leading-none">
                {phase.title}
              </div>
              <div className="relative w-full aspect-video flex items-center justify-center overflow-hidden border border-mainText bg-mainText/5">
                {media.src ? (
                  media.type === "video" ? (
                    <video
                      className="relative w-full h-full object-cover"
                      autoPlay
                      muted
                      loop
                      playsInline
                    >
                      <source src={`${INFURA_GATEWAY_INTERNAL}${media.src}`} />
                    </video>
                  ) : (
                    <Image
                      draggable={false}
                      layout="fill"
                      objectFit="cover"
                      src={`/images/${media.src}.png`}
                    />
                  )
                ) : (
                  <div className="relative w-full h-full flex items-center justify-center font-nerd text-[0.6rem] opacity-40 uppercase tracking-widest">
                    {phase.id}
                  </div>
                )}
              </div>
              <div className="relative w-full h-fit flex flex-col gap-1.5">
                {rows.map((row, rowIndex) => (
                  <div
                    key={rowIndex}
                    className="relative w-full h-fit flex flex-row gap-2 items-start justify-between font-nerd text-[0.65rem] leading-snug"
                  >
                    <div className="relative w-20 shrink-0 h-fit opacity-50 uppercase tracking-wider">
                      {row.key}
                    </div>
                    <div className="relative w-full h-fit text-end">
                      {row.value}
                    </div>
                  </div>
                ))}
              </div>
              <div className="relative w-full h-fit font-nerd text-xs leading-snug border-t border-mainText pt-2">
                {phase.desc}
              </div>
              <div className="relative w-full h-fit font-firaL text-[0.65rem] leading-relaxed opacity-80">
                {phase.detail}
              </div>
            </div>
          );
        })}
      </div>
      <div className="relative w-fit h-fit font-firaB text-xs text-center opacity-80 whitespace-pre-line">
        {dict?.common?.roadmap?.mesh}
      </div>
    </div>
  );
};

export default Roadmap;
