import { FunctionComponent, JSX, useContext } from "react";
import { HeaderProps } from "../types/common.types";
import { ModalContext } from "@/app/providers";
import useHeader from "../hooks/useHeader";
import Screen from "./Screen";

const Header: FunctionComponent<HeaderProps> = ({ dict }): JSX.Element => {
  const context = useContext(ModalContext);

  const {
    setVideoLoading,
    videoLoading,
    changeLanguage,
    chosenLanguage,
    setChosenLanguage,
  } = useHeader();
  return (
    <div
      ref={context?.rewind}
      className="relative flex flex-col h-fit w-full gap-1 justify-start items-stretch text-mainText"
    >
      <Screen
        dict={dict}
        chosenLanguage={chosenLanguage}
        setChosenLanguage={setChosenLanguage}
        changeLanguage={changeLanguage}
        setVideoLoading={setVideoLoading}
        videoLoading={videoLoading}
      />
    </div>
  );
};

export default Header;
