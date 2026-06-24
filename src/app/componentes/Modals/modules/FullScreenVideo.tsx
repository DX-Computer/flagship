"use client";

import { ModalContext } from "@/app/providers";
import {
  FunctionComponent,
  JSX,
  MouseEvent,
  useContext,
  useRef,
  useState,
} from "react";
import {
  DndContext,
  PointerSensor,
  TouchSensor,
  useDraggable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

const format = (t: number): string => {
  if (!t || !isFinite(t)) return "0:00";
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
};

const FullScreenVideo: FunctionComponent = (): JSX.Element => {
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { distance: 5 } }),
  );

  return (
    <DndContext
      onDragEnd={(event) => {
        if (event.delta) {
          setPosition((prev) => ({
            x: prev.x + event.delta.x,
            y: prev.y + event.delta.y,
          }));
        }
      }}
      sensors={sensors}
    >
      <DraggableVideo position={position} />
    </DndContext>
  );
};

export default FullScreenVideo;

const DraggableVideo: FunctionComponent<{
  position: { x: number; y: number };
}> = ({ position }) => {
  const context = useContext(ModalContext);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const retriedRef = useRef<boolean>(false);
  const [playing, setPlaying] = useState<boolean>(false);
  const [current, setCurrent] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);
  const [muted, setMuted] = useState<boolean>(false);
  const [loop, setLoop] = useState<boolean>(true);

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: "draggable-video",
  });
  const finalTransform = transform
    ? `translate3d(${position.x + transform.x}px, ${
        position.y + transform.y
      }px, 0)`
    : `translate3d(${position.x}px, ${position.y}px, 0)`;

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

  const progress =
    duration && isFinite(duration) ? (current / duration) * 100 : 0;
  const level = (muted ? 0 : volume) * 100;

  return (
    <div
      ref={setNodeRef}
      style={{ transform: finalTransform }}
      id="videoplayer"
      className="cypher-frame fixed z-50 xl:w-1/3 sm:w-1/2 w-full h-fit top-40 left-0 sm:left-10 flex flex-col gap-2 border border-white rounded-lg bg-offBlack p-2"
    >
      <div
        {...listeners}
        {...attributes}
        className="relative w-full h-6 flex flex-row items-center justify-between px-1 cursor-grab active:cursor-grabbing"
      >
        <span className="font-nerd text-[0.6rem] uppercase tracking-widest text-bright">
          dx.computer
        </span>
        <div
          className="relative w-fit h-fit text-white text-sm cursor-sewingHS"
          onClick={() =>
            context?.setFullScreenVideo(false)
          }
        >
          ✕
        </div>
      </div>
      <video
        ref={videoRef}
        src="/videos/dronesoverthegadigalhighlands.web.mp4"
        autoPlay
        loop={loop}
        playsInline
        preload="metadata"
        poster="/images/dxcomputer-opensourcehardware-35.png"
        className="relative w-full h-60 object-cover rounded-md bg-black cursor-sewingHS"
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
      <div className="relative w-full h-fit flex flex-row gap-2 items-center px-1 font-nerd text-white text-[0.6rem] uppercase tracking-wider">
        <div
          onClick={toggle}
          className={`relative w-6 h-6 flex items-center justify-center rounded-sm border border-white cursor-sewingHS textransition-colors duration-200 bg-bright text-offBlack hover:bg-white hover:text-offBlack`}
        >
          {playing ? "❚❚" : "▶"}
        </div>
        <div className="relative w-fit h-fit flex shrink-0">
          {format(current)}/{format(duration)}
        </div>
        <div
          onClick={seek}
          className="relative flex-1 h-1.5 rounded-full border border-white cursor-sewingHS overflow-hidden"
        >
          <div
            className="absolute top-0 left-0 h-full bg-bright"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div
          onClick={toggleMute}
          className={`relative w-6 h-6 flex items-center justify-center rounded-sm border border-white cursor-sewingHS transition-colors duration-200 hover:bg-white hover:text-offBlack bg-bright text-offBlack`}
        >
          {muted || volume === 0 ? "✕" : "♪"}
        </div>
        <div
          onClick={changeVolume}
          className="relative w-10 h-1.5 shrink-0 rounded-full border border-white cursor-sewingHS overflow-hidden"
        >
          <div
            className="absolute top-0 left-0 h-full bg-bright"
            style={{ width: `${level}%` }}
          />
        </div>
        <div
          onClick={() => setLoop((p) => !p)}
          className={`relative w-6 h-6 flex items-center justify-center rounded-sm border border-white cursor-sewingHS transition-colors duration-200 ${
            loop
              ? "bg-bright text-offBlack"
              : "hover:bg-white hover:text-offBlack"
          }`}
        >
          ↻
        </div>
      </div>
    </div>
  );
};
