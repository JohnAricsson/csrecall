"use client";

import { CSSProperties, useEffect, useState } from "react";
// @ts-expect-error lottie-react lacks proper types
import Lottie from "lottie-react";

interface GameLottieProps {
  style?: CSSProperties;
  className?: string;
  [key: string]: unknown;
}

export function GameLottie(props: GameLottieProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div style={props.style} className={props.className} />;
  }

  return <Lottie {...props} />;
}
