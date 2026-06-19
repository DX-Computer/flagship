"use client";

import { FunctionComponent, JSX, useState } from "react";
import Image from "next/legacy/image";
import { RoadmapPhase, RoadmapProps } from "../types/common.types";

const LEDGER_VALUES: string[] = ["0", "0", "v0", "0"];

const Roadmap: FunctionComponent<RoadmapProps> = ({ dict }): JSX.Element => {
  const roadmap = dict?.common?.roadmap ?? {};
  const phases: RoadmapPhase[] = roadmap?.phases ?? [];
  const labels = roadmap?.labels ?? {};
  const openness = roadmap?.openness ?? {};
  const rungs: string[] = openness?.rungs ?? [];
  const shape = roadmap?.shape ?? {};
  const shapeActions: string[] = shape?.actions ?? [];
  const ledger = roadmap?.ledger ?? {};
  const ledgerLabels: string[] = [
    ledger?.staked,
    ledger?.authors,
    ledger?.revision,
    ledger?.proposals,
  ];
  const actions = roadmap?.actions ?? {};
  const useActions: string[] = [
    actions?.spec,
    actions?.software,
    actions?.tutorial,
  ];
  const ui = roadmap?.ui ?? {};
  const propose = roadmap?.propose ?? {};
  const proposeFields = [
    { label: propose?.title, area: false },
    { label: propose?.summary, area: true },
    { label: propose?.hardware, area: true },
    { label: propose?.software, area: true },
    { label: propose?.fabrication, area: true },
  ];

  const [query, setQuery] = useState<string>("");
  const [filter, setFilter] = useState<string>("all");
  const [proposeOpen, setProposeOpen] = useState<boolean>(false);

  const statuses = Array.from(new Set(phases.map((p) => p.status)));
  const chips = ["all", ...statuses];

  const filtered = phases.filter((p) => {
    const matchesFilter = filter === "all" || p.status === filter;
    const q = query.trim().toLowerCase();
    const matchesQuery =
      q === "" ||
      [p.title, p.hardware, p.software, p.desc]
        .join(" ")
        .toLowerCase()
        .includes(q);
    return matchesFilter && matchesQuery;
  });

  return (
    <div
      id="roadmap"
      className="relative w-full h-fit flex flex-col gap-6 items-center justify-start text-mainText px-2 lg:px-6"
    >
      <div className="relative w-full h-fit flex flex-row flex-wrap gap-3 items-center justify-between border border-mainText p-3">
        <div className="relative w-fit h-fit flex flex-row gap-2 items-center">
          <div className="relative w-fit h-fit py-1 px-2 border border-mainText font-nerd text-xs uppercase tracking-widest">
            {roadmap?.label}
          </div>
          <div className="relative w-fit h-fit flex font-nerd text-[0.6rem] uppercase tracking-wider opacity-50">
            {filtered.length}/{phases.length} {ui?.unit}
          </div>
        </div>
        <div className="relative w-fit h-fit flex flex-row flex-wrap gap-2 items-center">
          <div className="relative w-fit h-fit flex py-1 px-2 border border-mainText font-nerd text-[0.6rem] uppercase tracking-wider opacity-50">
            0 {ui?.balance}
          </div>
          <div
            onClick={() => setProposeOpen(!proposeOpen)}
            className="relative w-fit h-fit flex py-1 px-3 border border-mainText font-nerd text-[0.65rem] uppercase tracking-wider cursor-sewingHS hover:bg-mainText hover:text-mainBg transition-colors duration-200"
          >
            {propose?.open}
          </div>
          <div className="relative w-fit h-fit flex py-1 px-3 border border-mainText font-nerd text-[0.65rem] uppercase tracking-wider opacity-40 select-none">
            {ui?.connect}
          </div>
        </div>
      </div>

      <div className="relative w-full h-fit flex flex-row flex-wrap gap-3 items-center justify-between">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={ui?.search}
          className="relative w-full sm:w-64 h-fit py-1.5 px-2 bg-transparent border border-mainText font-nerd text-[0.65rem] uppercase tracking-wider placeholder:opacity-40 focus:outline-none"
        />
        <div className="relative w-fit h-fit flex flex-row flex-wrap gap-1.5 items-center">
          {chips.map((chip, cIndex) => (
            <div
              key={cIndex}
              onClick={() => setFilter(chip)}
              className={`relative w-fit h-fit flex py-1 px-2 border border-mainText font-nerd text-[0.6rem] uppercase tracking-wider cursor-sewingHS transition-colors duration-200 ${
                filter === chip ? "bg-mainText text-mainBg" : "opacity-60"
              }`}
            >
              {chip === "all" ? ui?.all : chip}
            </div>
          ))}
        </div>
      </div>

      {proposeOpen && (
        <div className="relative w-full h-fit flex flex-col gap-4 border border-mainText p-4">
          <div className="relative w-full h-fit flex flex-col gap-1">
            <div className="relative w-fit h-fit flex font-nerd text-xs uppercase tracking-widest">
              {propose?.open}
            </div>
            <div className="relative w-full h-fit flex font-firaL text-[0.75rem] leading-relaxed opacity-70">
              {propose?.intro}
            </div>
          </div>
          <div className="relative w-full h-fit flex flex-col gap-3 opacity-40">
            {proposeFields.map((f, fIndex) => (
              <div
                key={fIndex}
                className="relative w-full h-fit flex flex-col gap-1"
              >
                <div className="relative w-fit h-fit flex font-nerd text-[0.6rem] uppercase tracking-widest opacity-70">
                  {f.label}
                </div>
                {f.area ? (
                  <textarea
                    readOnly
                    rows={2}
                    className="relative w-full h-fit py-1.5 px-2 bg-transparent border border-mainText font-nerd text-[0.65rem] resize-none focus:outline-none"
                  />
                ) : (
                  <input
                    readOnly
                    className="relative w-full h-fit py-1.5 px-2 bg-transparent border border-mainText font-nerd text-[0.65rem] focus:outline-none"
                  />
                )}
              </div>
            ))}
            <div className="relative w-full h-fit flex flex-col gap-1">
              <div className="relative w-fit h-fit flex font-nerd text-[0.6rem] uppercase tracking-widest opacity-70">
                {propose?.stake}
              </div>
              <input
                readOnly
                placeholder="0 $mona"
                className="relative w-full sm:w-40 h-fit py-1.5 px-2 bg-transparent border border-mainText font-nerd text-[0.65rem] placeholder:opacity-40 focus:outline-none"
              />
              <div className="relative w-full h-fit flex font-firaL text-[0.6rem] leading-relaxed opacity-70">
                {propose?.stakeNote}
              </div>
            </div>
          </div>
          <div className="relative w-fit h-fit flex py-1.5 px-4 border border-mainText font-nerd text-[0.65rem] uppercase tracking-wider opacity-30 select-none">
            {propose?.submit}
          </div>
        </div>
      )}

      <div className="relative w-full h-fit flex flex-row flex-wrap gap-6 items-stretch justify-center">
        {filtered.map((phase) => {
          const maps = [
            { key: labels?.hardware, value: phase.hardware },
            { key: labels?.software, value: phase.software },
          ];
          return (
            <div
              key={phase.id}
              className="relative w-full max-w-3xl h-fit flex flex-col gap-4 border border-mainText p-4 bg-mainBg"
            >
              <div className="relative w-full h-fit flex flex-row gap-2 items-center justify-between font-nerd text-xs">
                <div className="relative w-fit h-fit flex flex-row gap-2 items-center">
                  <div className="relative w-fit h-fit py-0.5 px-1.5 border border-mainText">
                    {phase.id}
                  </div>
                  <div className="relative w-fit h-fit font-firaL text-sm uppercase tracking-wider">
                    {phase.title}
                  </div>
                </div>
                <div className="relative w-fit h-fit py-0.5 px-1.5 border border-mainText uppercase tracking-wider text-[0.6rem]">
                  {phase.status}
                </div>
              </div>

              <div className="relative w-full h-fit flex flex-col gap-1.5">
                <div className="relative w-fit h-fit font-nerd text-[0.6rem] uppercase tracking-widest opacity-50">
                  {openness?.label}
                </div>
                <div className="relative w-full h-fit flex flex-row gap-1">
                  {rungs.map((_, rIndex) => (
                    <div
                      key={rIndex}
                      className={`relative flex flex-1 h-1.5 border border-mainText ${
                        rIndex < (phase.openness ?? 0)
                          ? "bg-mainText"
                          : "bg-transparent"
                      }`}
                    />
                  ))}
                </div>
                <div className="relative w-full h-fit flex flex-row gap-1 justify-between font-nerd text-[0.55rem] uppercase tracking-wider">
                  {rungs.map((rung, rIndex) => (
                    <div
                      key={rIndex}
                      className={`relative w-fit h-fit flex ${
                        rIndex < (phase.openness ?? 0)
                          ? "opacity-100"
                          : "opacity-40"
                      }`}
                    >
                      {rung}
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative w-full h-fit flex flex-col lg:flex-row gap-4 items-stretch justify-start">
                <div className="relative w-full lg:w-1/2 h-fit flex flex-col gap-3">
                  <div className="relative w-full aspect-video flex items-center justify-center overflow-hidden border border-mainText bg-mainText/5">
                    <Image
                      draggable={false}
                      layout="fill"
                      objectFit="cover"
                      src={`/images/${phase.image}.png`}
                    />
                  </div>
                  {maps.map((m, mIndex) => (
                    <div
                      key={mIndex}
                      className="relative w-full h-fit flex flex-col gap-1"
                    >
                      <div className="relative w-fit h-fit font-nerd text-[0.6rem] uppercase tracking-widest opacity-50">
                        {m.key}
                      </div>
                      <div className="relative w-full h-fit flex flex-col gap-0.5 font-nerd text-[0.65rem] leading-snug">
                        {(m.value ?? "").split(" · ").map((item, iIndex) => (
                          <div
                            key={iIndex}
                            className="relative w-full h-fit flex"
                          >
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  <div className="relative w-full h-fit flex flex-col gap-1">
                    <div className="relative w-fit h-fit font-nerd text-[0.6rem] uppercase tracking-widest opacity-50">
                      {labels?.fabrication}
                    </div>
                    {phase.fabrication ? (
                      <div className="relative w-full h-fit flex flex-col gap-0.5 font-nerd text-[0.65rem] leading-snug">
                        {phase.fabrication.split(" · ").map((item, iIndex) => (
                          <div
                            key={iIndex}
                            className="relative w-full h-fit flex"
                          >
                            {item}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="relative w-full h-fit flex items-center justify-center py-2 px-2 border border-dashed border-mainText/40 font-nerd text-[0.6rem] uppercase tracking-wider opacity-40 text-center">
                        {roadmap?.fabPending}
                      </div>
                    )}
                  </div>
                </div>

                <div className="relative w-full lg:w-1/2 h-fit flex flex-col gap-3">
                  <div className="relative w-full h-fit flex font-firaL text-[0.8rem] leading-relaxed opacity-80">
                    {phase.desc}
                  </div>

                  <div className="relative w-full h-fit flex flex-col gap-1.5">
                    <div className="relative w-fit h-fit font-nerd text-[0.6rem] uppercase tracking-widest opacity-50">
                      {shape?.label}
                    </div>
                    <div className="relative w-full h-fit flex flex-row flex-wrap gap-1">
                      {shapeActions.map((action, aIndex) => (
                        <div
                          key={aIndex}
                          className="relative flex flex-1 items-center justify-center h-fit py-1 px-1 border border-mainText font-nerd text-[0.55rem] uppercase tracking-wider opacity-30 text-center select-none"
                        >
                          {action}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="relative w-full h-fit flex flex-row flex-wrap gap-2">
                    {ledgerLabels.map((label, lIndex) => (
                      <div
                        key={lIndex}
                        className="relative flex flex-col flex-1 min-w-[6.5rem] h-fit gap-0.5 py-2 px-2 border border-mainText"
                      >
                        <div className="relative w-fit h-fit flex font-firaL text-base leading-none">
                          {LEDGER_VALUES[lIndex]}
                        </div>
                        <div className="relative w-fit h-fit flex font-nerd text-[0.55rem] uppercase tracking-wider opacity-50">
                          {label}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="relative w-full h-fit flex flex-col gap-1.5">
                    {useActions.map((action, uIndex) => (
                      <div
                        key={uIndex}
                        className="relative w-full h-fit flex items-center justify-center py-1.5 px-2 border border-mainText font-nerd text-[0.6rem] uppercase tracking-wider opacity-30 text-center select-none"
                      >
                        {action}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Roadmap;
