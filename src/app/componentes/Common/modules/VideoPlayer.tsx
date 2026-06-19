"use client";

import { FunctionComponent, JSX, MouseEvent, useRef, useState } from "react";
import { VideoPlayerProps } from "../types/common.types";

const format = (t: number): string => {
  if (!t || !isFinite(t)) return "0:00";
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
};

const VideoPlayer: FunctionComponent<VideoPlayerProps> = ({
  src,
  poster,
}): JSX.Element => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const retriedRef = useRef<boolean>(false);
  const [playing, setPlaying] = useState<boolean>(false);
  const [current, setCurrent] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);
  const [muted, setMuted] = useState<boolean>(false);

  const updateDuration = (): void => {
    const v = videoRef.current;
    if (!v) return;
    if (isFinite(v.duration)) setDuration(v.duration);
  };

  const recover = (): void => {
    const v = videoRef.current;
    if (!v || retriedRef.current) return;
    retriedRef.current = true;
    v.load();
  };

  const toggle = (): void => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
    } else {
      v.pause();
    }
  };

  const seek = (e: MouseEvent<HTMLDivElement>): void => {
    const v = videoRef.current;
    if (!v || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
    v.currentTime = ratio * duration;
    setCurrent(v.currentTime);
  };

  const changeVolume = (e: MouseEvent<HTMLDivElement>): void => {
    const v = videoRef.current;
    if (!v) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
    v.volume = ratio;
    v.muted = ratio === 0;
    setVolume(ratio);
    setMuted(ratio === 0);
  };

  const toggleMute = (): void => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  const progress = duration && isFinite(duration) ? (current / duration) * 100 : 0;
  const level = (muted ? 0 : volume) * 100;

  return (
    <div className="relative w-full max-w-sm mx-auto h-fit flex flex-col rounded-md border border-mainText overflow-hidden bg-mainBg">
      <div className="relative w-full h-fit flex flex-row gap-1.5 items-center px-2.5 py-1.5 border-b border-mainText">
        <div className="relative w-2 h-2 flex rounded-full border border-mainText" />
        <div className="relative w-2 h-2 flex rounded-full border border-mainText" />
        <div className="relative w-2 h-2 flex rounded-full border border-mainText" />
      </div>
      <div className="relative w-full aspect-video flex overflow-hidden bg-black">
        <video
          ref={videoRef}
          src={src}
          className="relative w-full h-full object-cover cursor-sewingHS"
          poster={poster}
          playsInline
          preload="metadata"
          onClick={toggle}
          onTimeUpdate={() => setCurrent(videoRef.current?.currentTime ?? 0)}
          onLoadedMetadata={updateDuration}
          onDurationChange={updateDuration}
          onLoadedData={() => {
            retriedRef.current = false;
          }}
          onError={recover}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        />
      </div>
      <div className="relative w-full h-fit flex flex-row gap-2 items-center px-2.5 py-1.5 border-t border-mainText font-nerd text-mainText text-[0.55rem] uppercase tracking-wider">
        <div
          onClick={toggle}
          className="relative w-6 h-6 flex items-center justify-center rounded-sm border border-mainText cursor-sewingHS hover:bg-mainText hover:text-mainBg transition-colors duration-200"
        >
          {playing ? "❚❚" : "▶"}
        </div>
        <div className="relative w-fit h-fit flex shrink-0">
          {format(current)}/{format(duration)}
        </div>
        <div
          onClick={seek}
          className="relative flex-1 h-1.5 rounded-full border border-mainText cursor-sewingHS overflow-hidden"
        >
          <div
            className="absolute top-0 left-0 h-full bg-mainText"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div
          onClick={toggleMute}
          className="relative w-6 h-6 flex items-center justify-center rounded-sm border border-mainText cursor-sewingHS hover:bg-mainText hover:text-mainBg transition-colors duration-200"
        >
          {muted || volume === 0 ? "✕" : "♪"}
        </div>
        <div
          onClick={changeVolume}
          className="relative w-10 h-1.5 shrink-0 rounded-full border border-mainText cursor-sewingHS overflow-hidden"
        >
          <div
            className="absolute top-0 left-0 h-full bg-mainText"
            style={{ width: `${level}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
