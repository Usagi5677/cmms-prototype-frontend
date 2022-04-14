import { useEffect, useState } from "react";

export function useIsSmallDevice() {
  const [isSmallDevice, setIsSmallDevice] = useState(false);
  useEffect(() => {
    setIsSmallDevice(window.innerWidth < 768);
    window.addEventListener("resize", () =>
      setIsSmallDevice(window.innerWidth < 768)
    );
    return () =>
      window.removeEventListener("resize", () =>
        setIsSmallDevice(window.innerWidth < 768)
      );
  }, []);
  return isSmallDevice;
}
