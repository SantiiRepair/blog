import { useEffect } from "react";

export default function useAnimatedTitle(pathname: string, title: string) {
  useEffect(() => {
    document.title = title;

    if (pathname === "/") {
      return;
    }

    let index = 0;
    const text = title;
    let timeoutId: number | undefined;

    const transform = () => {
      if (index <= text.length) {
        document.title = text.substring(0, index);
        index += 1;
        timeoutId = window.setTimeout(transform, 200);
      } else {
        index = 0;
        timeoutId = window.setTimeout(transform, 1000);
      }
    };

    transform();

    return () => {
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
      }
      document.title = title;
    };
  }, [pathname, title]);
}
