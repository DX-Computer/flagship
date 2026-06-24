import { ReactNode, SetStateAction } from "react";

export type FooterProps = {
  dict: any;
};

export enum ItemType {
  CoinOp = "coinop",
  Chromadin = "chromadin",
  Listener = "listener",
  F3M = "f3m",
  Other = "other",
  Kinora = "kinora",
  TheDial = "dial",
}

export type HeartProps = {
  changeColor?: () => void;
  heartColor: string;
};

export type HeaderProps = {
  dict: any;
};


export type PortProps = {
  kind: string;
  color: string;
  size?: number;
};

export type LedProps = {
  tone?: string;
  size?: number;
  on?: boolean;
};

export type KeyButtonProps = {
  label?: string;
  sub?: string;
  tone?: string;
  lit?: boolean;
  onPress?: () => void;
};

export type BarButtonProps = {
  label?: string;
  tone?: string;
  onPress?: () => void;
};

export type KnobProps = {
  label?: string;
  tone?: string;
  angle?: number;
  size?: number;
};

export type EqualizerProps = {
  values?: number[];
  label?: string;
};

export type GaugeProps = {
  segments?: number;
  value?: number;
  colors?: string[];
};

export type ReadoutProps = {
  text?: string;
  tone?: string;
  align?: string;
  className?: string;
};

export type NameplateProps = {
  title?: string;
  sub?: string;
};

export type HatchProps = {
  label?: string;
  height?: number;
};

export type ChassisProps = {
  children?: ReactNode;
  className?: string;
};

export type WinProps = { title?: string; children?: ReactNode };
export type WinBtnProps = { sym?: string; onPress?: () => void };
export type MenuBarProps = { items?: string[] };
export type LcdProps = { children?: ReactNode; className?: string };
export type SegProps = { value?: string; size?: number };
export type SpectrumProps = { bars?: number[]; height?: number };
export type IndicatorProps = { label?: string; on?: boolean };
export type RoundBtnProps = { sym?: string; size?: number; onPress?: () => void };
export type GlossBtnProps = {
  label?: string;
  active?: boolean;
  tone?: string;
  onPress?: () => void;
  className?: string;
};
export type TabProps = { label?: string; active?: boolean; onPress?: () => void };
export type FaderProps = { label?: string; value?: number; sub?: string };
export type HSliderProps = { value?: number; className?: string };
export type PlRowProps = {
  left?: string;
  right?: string;
  sub?: string;
  selected?: boolean;
  idx?: number;
  onPress?: () => void;
};

export type ConnectionState = {
  address?: `0x${string}`;
  isConnected: boolean;
  short: string;
  network: string;
  wrongNetwork: boolean;
  nativeText: string;
  monaText: string;
  connect: () => void;
  disconnect: () => void;
  switchNetwork: () => void;
};

export type BandProps = { label?: string; accent?: string; children?: ReactNode };
export type JackProps = {
  kind?: string;
  color?: string;
  label?: string;
  sub?: string;
  selected?: boolean;
  onPress?: () => void;
};
export type BtnProps = {
  label?: string;
  accent?: string;
  active?: boolean;
  onPress?: () => void;
  className?: string;
};


export type ListKey = "hardware" | "software" | "fabrication";


export type FlywheelNode = {
  key: string;
  label: string;
  detail: string;
};

export type FlywheelProps = {
  dict: any;
};

export type EconomyProps = {
  dict: any;
};

export type VideoPlayerProps = {
  src: string;
  poster: string;
};

export type ScreenTimelineProps = {
  dict: any;
  changeLanguage: (lang: string) => void;
  setMessage: (e: SetStateAction<string>) => void;
  setVideoLoading: (e: SetStateAction<boolean>) => void;
  videoLoading: boolean;
  currentVideo: number | undefined;
  message: string;
  messageLoading: boolean;
  handleSendMessage: () => Promise<void>;
  changeVideo: (index: number) => void;
  handleShop: () => void;
  setChosenLanguage: (e: SetStateAction<number>) => void;
  chosenLanguage: number;
};

export type HeaderSwitchProps = {
  dict: any;
  changeLanguage: (lang: string) => void;
  setMessage: (e: SetStateAction<string>) => void;
  setVideoLoading: (e: SetStateAction<boolean>) => void;
  videoLoading: boolean;
  currentVideo: number | undefined;
  message: string;
  messageLoading: boolean;
  handleSendMessage: () => Promise<void>;
  changeVideo: (index: number) => void;
  handleShop: () => void;
  setChosenLanguage: (e: SetStateAction<number>) => void;
  chosenLanguage: number;
};

export type BarProps = {
  dict: any;
  setChosenLanguage: (e: SetStateAction<number>) => void;
  chosenLanguage: number;
  changeLanguage: (lang: string) => void;
};

export type VideoProps = {
  setVideoLoading: (e: SetStateAction<boolean>) => void;
  videoLoading: boolean;
};

export type ScreenProps = {
  dict: any;
  changeLanguage: (lang: string) => void;
  setVideoLoading: (e: SetStateAction<boolean>) => void;
  videoLoading: boolean;
  setChosenLanguage: (e: SetStateAction<number>) => void;
  chosenLanguage: number;
};

export type InfoProps = {
  setInfoOpen: (e: SetStateAction<boolean>) => void;
  dict: any;
  position: {
    x: number;
    y: number;
  };
};

export type MetalStop = {
  offset: string;
  color: string;
};

export type GrommetProps = {
  position?: [number, number, number];
  scale?: number;
  color?: string;
  ringR?: number;
  tubeR?: number;
  roughness?: number;
  holeColor?: string;
  holeMetalness?: number;
  holeRoughness?: number;
};

export type CanProps = {
  position?: [number, number, number];
  scale?: number;
  color?: string;
  radius?: number;
  height?: number;
  roughness?: number;
  dome?: number;
};

export type CrystalProps = {
  position?: [number, number, number];
  scale?: number;
  color?: string;
  w?: number;
  h?: number;
  roughness?: number;
  pins?: number;
  leadColor?: string;
};

export type QfpProps = {
  position?: [number, number, number];
  scale?: number;
  size?: number;
  pins?: number;
  color?: string;
  leadColor?: string;
};

export type HolePlateProps = {
  position?: [number, number, number];
  scale?: number;
  w?: number;
  h?: number;
  color?: string;
  border?: boolean;
};

export type BlockProps = {
  position?: [number, number, number];
  scale?: number;
  color?: string;
  size?: number;
  roughness?: number;
};

export type BlockFieldProps = {
  position?: [number, number, number];
  scale?: number;
  w?: number;
  h?: number;
  color?: string;
  size?: number;
};

export type TraceFieldProps = {
  position?: [number, number, number];
  scale?: number;
  w?: number;
  count?: number;
  color?: string;
  angle?: number;
};

export type ChipPartProps = {
  position?: [number, number, number];
  scale?: number;
  color?: string;
  length?: number;
  w?: number;
};

export type TransistorProps = {
  position?: [number, number, number];
  scale?: number;
  color?: string;
  leadColor?: string;
  size?: number;
};

export type Led3DProps = {
  position?: [number, number, number];
  scale?: number;
  color?: string;
  glow?: boolean;
};

export type LedClusterProps = {
  position?: [number, number, number];
  rows?: number[];
  scale?: number;
  fill?: boolean;
  fillRows?: number;
};

export type RegulatorProps = {
  position?: [number, number, number];
  scale?: number;
  color?: string;
};

export type DiodeProps = {
  position?: [number, number, number];
  scale?: number;
  color?: string;
  band?: string;
};

export type ChipResistorProps = {
  position?: [number, number, number];
  scale?: number;
  color?: string;
  code?: string;
};

export type ZenerProps = {
  position?: [number, number, number];
  scale?: number;
  glass?: string;
  band?: string;
  leads?: boolean;
};

export type CapacitorProps = {
  position?: [number, number, number];
  scale?: number;
  color?: string;
  band?: string;
  leads?: boolean;
};

export type RegTracesProps = {
  side?: number;
  cx?: number;
  cy?: number;
  frames?: {
    sil: { top: number; bot: number };
    thesis: { top: number; bot: number; halfW: number };
  };
};

export type Trace3DProps = {
  frames?: {
    sil: { top: number; bot: number };
    thesis: { top: number; bot: number; halfW: number };
    fan: { conn: number; box5: number };
  };
  bodyW?: number;
  bodyH?: number;
  dropBottom?: number;
  videoMode?: boolean;
};

export type SiliconBox = {
  top: number;
  left: number;
  width: number;
  height: number;
  pageW: number;
};

export type DotRingProps = {
  position?: [number, number, number];
  radius?: number;
  count?: number;
  rings?: number;
  ringGap?: number;
  pattern?: number[];
  inner?: number;
};
