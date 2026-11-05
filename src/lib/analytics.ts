// Umami loads with `async` (index.html) so it never delays the site. Page views are sent
// by hand on every route change (data-auto-track="false"); if the script hasn't finished
// loading yet, the view is sent as soon as it does.

type UmamiWindow = Window & {
  umami?: {
    track: () => void;
  };
};

let waitingForScript = false;

export function trackPageview(): void {
  const umamiWindow = window as UmamiWindow;

  if (typeof umamiWindow.umami?.track === "function") {
    umamiWindow.umami.track();
    return;
  }

  const script = document.querySelector<HTMLScriptElement>("script[data-website-id]");
  if (!script || waitingForScript) {
    return;
  }

  waitingForScript = true;
  script.addEventListener(
    "load",
    () => {
      waitingForScript = false;
      umamiWindow.umami?.track();
    },
    { once: true }
  );
}
