"use client";

import { useEffect, useState } from "react";
// @ts-ignore
import Lottie from "lottie-react";

export function GameLottie(props: any) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div style={props.style} className={props.className} />;
  }

  return <Lottie {...props} />;
}
