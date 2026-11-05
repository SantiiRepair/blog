import { useRef, type CSSProperties, type PointerEvent, type ReactNode } from "react";
import { t } from "../lib/i18n";
import type { Offset, WindowId } from "./windowManager";

// Below this width windows are fixed (full screen or in the page flow), so no dragging.
export const PHONE_QUERY = "(max-width: 900px)";
const TASKBAR_HEIGHT = 36;
// How much of a dragged window must stay on screen.
const KEEP_VISIBLE = 80;

type WindowProps = {
  id: WindowId;
  title: string;
  className: string;
  active: boolean;
  zIndex: number;
  minimized: boolean;
  collapsed: boolean;
  maximized: boolean;
  closable: boolean;
  offset?: Offset;
  onActivate: () => void;
  onClose: () => void;
  onToggleCollapse: () => void;
  onToggleMaximize: () => void;
  onMove: (offset: Offset) => void;
  children: ReactNode;
};

type DragState = {
  pointerId: number;
  startX: number;
  startY: number;
  origin: Offset;
  rect: DOMRect;
};

/**
 * A window with the site's classic frame: close box on the left, striped title bar
 * (only on the active window), zoom and collapse boxes on the right.
 * Drag it by the title bar; double-click the title bar to collapse it to just the bar.
 */
export default function Window({
  id,
  title,
  className,
  active,
  zIndex,
  minimized,
  collapsed,
  maximized,
  closable,
  offset,
  onActivate,
  onClose,
  onToggleCollapse,
  onToggleMaximize,
  onMove,
  children
}: WindowProps) {
  const frameRef = useRef<HTMLElement>(null);
  const drag = useRef<DragState | null>(null);

  const startDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || maximized || (event.target as HTMLElement).closest("button")) return;
    if (window.matchMedia(PHONE_QUERY).matches || !frameRef.current) return;
    drag.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      origin: offset ?? { x: 0, y: 0 },
      rect: frameRef.current.getBoundingClientRect()
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const moveDrag = (event: PointerEvent<HTMLDivElement>) => {
    const state = drag.current;
    if (!state || state.pointerId !== event.pointerId) return;
    const { rect } = state;
    // Keep the title bar reachable: never above the screen or under the taskbar,
    // and always some of the window visible on each side.
    const dy = Math.min(
      Math.max(event.clientY - state.startY, -rect.top),
      window.innerHeight - TASKBAR_HEIGHT - 24 - rect.top
    );
    const dx = Math.min(
      Math.max(event.clientX - state.startX, KEEP_VISIBLE - rect.right),
      window.innerWidth - KEEP_VISIBLE - rect.left
    );
    onMove({ x: state.origin.x + dx, y: state.origin.y + dy });
  };

  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (drag.current?.pointerId === event.pointerId) drag.current = null;
  };

  const classes = [
    "window",
    className,
    active ? "is-active" : "",
    collapsed ? "is-collapsed" : "",
    maximized ? "is-maximized" : ""
  ]
    .filter(Boolean)
    .join(" ");

  const style: CSSProperties = { zIndex };
  if (offset && !maximized) {
    style.transform = `translate(${offset.x}px, ${offset.y}px)`;
  }

  return (
    <section
      ref={frameRef}
      className={classes}
      style={style}
      hidden={minimized}
      aria-labelledby={`window-title-${id}`}
      onPointerDownCapture={onActivate}
      onFocusCapture={onActivate}
    >
      <div
        className="window-titlebar"
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onDoubleClick={(event) => {
          if (!(event.target as HTMLElement).closest("button")) onToggleCollapse();
        }}
      >
        {closable && (
          <button type="button" className="window-box window-close" aria-label={t("close")} onClick={onClose} />
        )}
        <h2 className="window-title" id={`window-title-${id}`}>
          {title}
        </h2>
        <span className="window-boxes">
          <button
            type="button"
            className="window-box window-zoom"
            aria-label={t("window_zoom")}
            aria-pressed={maximized}
            onClick={onToggleMaximize}
          />
          <button
            type="button"
            className="window-box window-shade"
            aria-label={t("window_collapse")}
            aria-pressed={collapsed}
            onClick={onToggleCollapse}
          />
        </span>
      </div>
      <div className="window-body">{children}</div>
    </section>
  );
}
