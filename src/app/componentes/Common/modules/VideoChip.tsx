"use client";

import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import {
  FunctionComponent,
  JSX,
  MouseEvent,
  Suspense,
  useEffect,
  useMemo,
  useState,
} from "react";
import * as THREE from "three";
import { VideoPlayerProps } from "../types/common.types";
import { Chip, Trace3D } from "./Board3D";

const GOLD = "#c9a84e";
const GOLD_LT = "#f4dd8e";
const goldFill = "linear-gradient(180deg,#f9e7a4,#a8842e)";
const ZOOM = 105;
const CANVAS_H = 660;
const MARGIN = -100;

const format = (t: number): string => {
  if (!t || !isFinite(t)) return "0:00";
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
};

const VideoChip: FunctionComponent<VideoPlayerProps> = ({
  src,
}): JSX.Element => {
  const [videoEl] = useState<HTMLVideoElement | null>(() => {
    if (typeof document === "undefined") return null;
    const v = document.createElement("video");
    v.src = src;
    v.loop = true;
    v.muted = false;
    v.autoplay = false;
    v.playsInline = true;
    v.crossOrigin = "anonymous";
    v.preload = "auto";
    return v;
  });
  const tex = useMemo(
    () => (videoEl ? new THREE.VideoTexture(videoEl) : null),
    [videoEl]
  );
  const [playing, setPlaying] = useState<boolean>(false);
  const [current, setCurrent] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [aspect, setAspect] = useState<number>(16 / 9);
  const [volume, setVolume] = useState<number>(1);
  const [muted, setMuted] = useState<boolean>(true);

  useEffect(() => {
    const fire = (): void => {
      window.dispatchEvent(new Event("resize"));
    };
    const a = setTimeout(fire, 60);
    const b = setTimeout(fire, 320);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, []);

  useEffect(() => {
    if (!videoEl || !tex) return;
    tex.colorSpace = THREE.SRGBColorSpace;
    const onTime = (): void => setCurrent(videoEl.currentTime);
    const onMeta = (): void => {
      if (isFinite(videoEl.duration)) setDuration(videoEl.duration);
      if (videoEl.videoWidth && videoEl.videoHeight)
        setAspect(videoEl.videoWidth / videoEl.videoHeight);
    };
    const onVol = (): void => {
      setVolume(videoEl.volume);
      setMuted(videoEl.muted);
    };
    const onPlay = (): void => setPlaying(true);
    const onPause = (): void => setPlaying(false);
    videoEl.addEventListener("timeupdate", onTime);
    videoEl.addEventListener("durationchange", onMeta);
    videoEl.addEventListener("loadedmetadata", onMeta);
    videoEl.addEventListener("volumechange", onVol);
    videoEl.addEventListener("play", onPlay);
    videoEl.addEventListener("pause", onPause);
    return () => {
      videoEl.removeEventListener("timeupdate", onTime);
      videoEl.removeEventListener("durationchange", onMeta);
      videoEl.removeEventListener("loadedmetadata", onMeta);
      videoEl.removeEventListener("volumechange", onVol);
      videoEl.removeEventListener("play", onPlay);
      videoEl.removeEventListener("pause", onPause);
    };
  }, [videoEl, tex]);

  const toggle = (): void => {
    if (!videoEl) return;
    if (videoEl.paused) videoEl.play();
    else videoEl.pause();
  };

  const seek = (e: MouseEvent<HTMLDivElement>): void => {
    if (!videoEl || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
    videoEl.currentTime = ratio * duration;
    setCurrent(videoEl.currentTime);
  };

  const changeVolume = (e: MouseEvent<HTMLDivElement>): void => {
    if (!videoEl) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
    videoEl.volume = ratio;
    videoEl.muted = ratio === 0;
  };

  const toggleMute = (): void => {
    if (!videoEl) return;
    videoEl.muted = !videoEl.muted;
  };

  const progress =
    duration && isFinite(duration) ? (current / duration) * 100 : 0;
  const level = (muted ? 0 : volume) * 100;
  const dieW = 1.72;
  const dieH = (2 / aspect) * 0.86;
  const chipW = 2 * 0.25 * 2.7 * ZOOM;
  const leadTip = (2 / aspect / 2 + 0.42) * 0.25 * 2.7;
  const controlsTop = CANVAS_H / 2 + MARGIN + leadTip * ZOOM + 6;

  return (
    <div dir="ltr" className="relative w-full">
      <div
        style={{
          position: "relative",
          width: "100vw",
          marginLeft: "calc(50% - 50vw)",
          height: CANVAS_H,
          marginTop: MARGIN,
          marginBottom: MARGIN,
          pointerEvents: "none",
        }}
      >
        <Canvas
          orthographic
          camera={{ position: [0, 0, 50], zoom: ZOOM, near: 0.1, far: 200 }}
          gl={{ alpha: true, antialias: true }}
          dpr={1}
        >
          <ambientLight intensity={0.8} />
          <directionalLight position={[4, 5, 9]} intensity={2.6} />
          <directionalLight position={[-6, -4, 6]} intensity={1.1} />
          <Suspense fallback={null}>
            <Trace3D
              bodyW={2}
              bodyH={2 / aspect}
              dropBottom={0.62}
              videoMode
            />
            <group position={[0, 0, 0.1]} scale={2.7}>
              <Chip
                dieTex={tex}
                bodyW={2}
                bodyH={2 / aspect}
                dieW={dieW}
                dieH={dieH}
              />
            </group>
            <Environment
              preset="warehouse"
              background={false}
              environmentIntensity={1.7}
            />
          </Suspense>
        </Canvas>
      </div>
      <div
        className="flex flex-col gap-1"
        style={{
          position: "absolute",
          top: controlsTop,
          left: "50%",
          transform: "translateX(-50%)",
          width: chipW,
          pointerEvents: "auto",
        }}
      >
        <div
          onClick={seek}
          className="relative w-full h-1.5 rounded-full cursor-sewingHS overflow-hidden"
          style={{ border: `1px solid ${GOLD}`, background: "rgba(10,10,12,0.6)" }}
        >
          <div
            className="absolute top-0 left-0 h-full"
            style={{ width: `${progress}%`, background: goldFill }}
          />
        </div>
        <div className="relative w-full flex flex-row items-center gap-1.5">
          <div
            onClick={toggle}
            className="relative flex items-center justify-center rounded-sm cursor-sewingHS shrink-0"
            style={{
              width: 18,
              height: 18,
              border: `1px solid ${GOLD}`,
              background: "rgba(10,10,12,0.6)",
            }}
          >
            {playing ? (
              <div className="flex flex-row" style={{ gap: 3 }}>
                <div style={{ width: 1.2, height: 3, background: GOLD_LT }} />
                <div style={{ width: 1.2, height: 3, background: GOLD_LT }} />
              </div>
            ) : (
              <div
                style={{
                  width: 0,
                  height: 0,
                  marginLeft: 2,
                  borderTop: "2px solid transparent",
                  borderBottom: "2px solid transparent",
                  borderLeft: `4px solid ${GOLD_LT}`,
                }}
              />
            )}
          </div>
          <div
            className="relative shrink-0 font-nerd"
            style={{ color: GOLD_LT, fontSize: "0.45rem" }}
          >
            {format(current)}/{format(duration)}
          </div>
          <div
            onClick={toggleMute}
            className="relative flex items-center justify-center rounded-sm cursor-sewingHS shrink-0 font-nerd"
            style={{
              width: 18,
              height: 18,
              border: `1px solid ${GOLD}`,
              background: "rgba(10,10,12,0.6)",
              color: GOLD_LT,
              fontSize: "0.5rem",
            }}
          >
            {muted || volume === 0 ? "✕" : "♪"}
          </div>
          <div
            onClick={changeVolume}
            className="relative flex-1 h-1.5 rounded-full cursor-sewingHS overflow-hidden"
            style={{ border: `1px solid ${GOLD}`, background: "rgba(10,10,12,0.6)" }}
          >
            <div
              className="absolute top-0 left-0 h-full"
              style={{ width: `${level}%`, background: goldFill }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoChip;
