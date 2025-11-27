"use client";

import { ModalContext } from "@/app/providers";
import { useContext } from "react";
import FullScreenVideo from "./FullScreenVideo";

export default function ModalsEntry({ dict }: { dict: any }) {
  const context = useContext(ModalContext);
  return <>{context?.fullScreenVideo?.open && <FullScreenVideo />}</>;
}
