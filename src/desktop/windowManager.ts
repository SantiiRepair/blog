import type { IconName } from "./icons";

// Every window the desktop can show. Page windows have a URL; the chat is always open.
export type PageWindowId = "about" | "favorites" | "trips" | "diary" | "notfound";
export type WindowId = PageWindowId | "chat";

// Fixed render order. Stacking comes from z-index, never from DOM order: moving a node
// in the DOM would reload the iframes inside (chat, Spotify).
export const WINDOW_RENDER_ORDER: WindowId[] = ["chat", "about", "favorites", "trips", "diary", "notfound"];

export const PAGE_OF_WINDOW: Record<PageWindowId, string | null> = {
  about: "/",
  favorites: "/favorites",
  trips: "/trips",
  diary: "/diary",
  notfound: null
};

export const WINDOW_ICONS: Record<WindowId, IconName> = {
  about: "person",
  favorites: "star",
  trips: "photo",
  diary: "notepad",
  notfound: "notepad",
  chat: "chat"
};

export function windowForPage(page: string): PageWindowId {
  switch (page) {
    case "/":
      return "about";
    case "/favorites":
      return "favorites";
    case "/trips":
      return "trips";
    case "/diary":
      return "diary";
    default:
      return "notfound";
  }
}

export type Offset = { x: number; y: number };

export type WindowsState = {
  /** Open windows, bottom to top. */
  order: WindowId[];
  minimized: WindowId[];
  collapsed: WindowId[];
  maximized: WindowId[];
  /** How far each window was dragged from its default spot. */
  offsets: Partial<Record<WindowId, Offset>>;
};

export type WindowsAction =
  | { type: "open" | "close" | "minimize" | "toggleCollapse" | "toggleMaximize"; id: WindowId }
  | { type: "move"; id: WindowId; offset: Offset };

/** The desktop as it first appears (also at build time): the chat plus the URL's window. */
export function initialWindows(pageWindow: PageWindowId): WindowsState {
  return { order: ["chat", pageWindow], minimized: [], collapsed: [], maximized: [], offsets: {} };
}

const without = (list: WindowId[], id: WindowId) => list.filter((item) => item !== id);
const toggled = (list: WindowId[], id: WindowId) =>
  list.includes(id) ? without(list, id) : [...list, id];

export function windowsReducer(state: WindowsState, action: WindowsAction): WindowsState {
  const { id } = action;
  switch (action.type) {
    case "open":
      // Also used to focus: brings the window to the top and un-minimizes it.
      if (state.order[state.order.length - 1] === id && !state.minimized.includes(id)) {
        return state;
      }
      return { ...state, order: [...without(state.order, id), id], minimized: without(state.minimized, id) };
    case "close": {
      if (id === "chat") return state;
      const offsets = { ...state.offsets };
      delete offsets[id];
      return {
        order: without(state.order, id),
        minimized: without(state.minimized, id),
        collapsed: without(state.collapsed, id),
        maximized: without(state.maximized, id),
        offsets
      };
    }
    case "minimize":
      return state.minimized.includes(id) ? state : { ...state, minimized: [...state.minimized, id] };
    case "toggleCollapse":
      return { ...state, collapsed: toggled(state.collapsed, id) };
    case "toggleMaximize":
      return { ...state, maximized: toggled(state.maximized, id), collapsed: without(state.collapsed, id) };
    case "move":
      return { ...state, offsets: { ...state.offsets, [id]: action.offset } };
  }
}

/** The window in front (the "active" one), ignoring minimized windows. */
export function topWindow(state: WindowsState): WindowId | undefined {
  for (let index = state.order.length - 1; index >= 0; index--) {
    const id = state.order[index];
    if (!state.minimized.includes(id)) return id;
  }
  return undefined;
}
