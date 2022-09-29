import { useEffect, useState } from "react";

export function useIsSmallDevice(
  width?: number | undefined,
  minWidth?: boolean
) {
  const [isSmallDevice, setIsSmallDevice] = useState(false);
  useEffect(() => {
    if (minWidth) {
      setIsSmallDevice(window.innerWidth > (width ? width : 768));
      window.addEventListener("resize", () =>
        setIsSmallDevice(window.innerWidth > (width ? width : 768))
      );
    } else {
      setIsSmallDevice(window.innerWidth < (width ? width : 768));
      window.addEventListener("resize", () =>
        setIsSmallDevice(window.innerWidth < (width ? width : 768))
      );
    }

    return () =>
      window.removeEventListener("resize", () => {
        if (minWidth) {
          return setIsSmallDevice(window.innerWidth > (width ? width : 768));
        } else {
          return setIsSmallDevice(window.innerWidth < (width ? width : 768));
        }
      });
  }, []);
  return isSmallDevice;
}
