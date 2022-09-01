import { useEffect, useState } from "react";

export function useIsSmallDevice(width?: number | undefined) {
  const [isSmallDevice, setIsSmallDevice] = useState(false);
  useEffect(() => {
    setIsSmallDevice(window.innerWidth < (width ? width : 768));
    window.addEventListener("resize", () =>
      setIsSmallDevice(window.innerWidth < (width ? width : 768))
    );
    return () =>
      window.removeEventListener("resize", () =>
        setIsSmallDevice(window.innerWidth < (width ? width : 768))
      );
  }, []);
  return isSmallDevice;
}
