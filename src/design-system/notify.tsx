import * as React from "react";
import { Notification, type NotificationType } from "./Notification";

/**
 * Lightweight transient-notification system built on the DS <Notification>
 * (ADS .toast styles). Mount <NotificationHost/> once at the app root, then
 * call notify.success/error/info/warning(message) from anywhere.
 */
interface ToastItem {
  id: number;
  type: NotificationType;
  message: React.ReactNode;
}

type Listener = (items: ToastItem[]) => void;

let items: ToastItem[] = [];
const listeners = new Set<Listener>();
let nextId = 1;

function emit() {
  const snapshot = [...items];
  listeners.forEach((l) => l(snapshot));
}

function dismiss(id: number) {
  items = items.filter((i) => i.id !== id);
  emit();
}

function push(type: NotificationType, message: React.ReactNode, duration = 4000) {
  const id = nextId++;
  items = [...items, { id, type, message }];
  emit();
  if (duration > 0) {
    window.setTimeout(() => dismiss(id), duration);
  }
}

export const notify = {
  success: (message: React.ReactNode) => push("success", message),
  error: (message: React.ReactNode) => push("error", message),
  info: (message: React.ReactNode) => push("info", message),
  warning: (message: React.ReactNode) => push("warning", message),
};

export function NotificationHost() {
  const [list, setList] = React.useState<ToastItem[]>([]);
  React.useEffect(() => {
    listeners.add(setList);
    return () => { listeners.delete(setList); };
  }, []);

  if (list.length === 0) return null;
  return (
    <div
      style={{
        position: "fixed",
        left: "50%",
        bottom: 24,
        transform: "translateX(-50%)",
        zIndex: 10000,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        alignItems: "center",
        pointerEvents: "none",
      }}
    >
      {list.map((item) => (
        <div key={item.id} style={{ pointerEvents: "auto", minWidth: 280, maxWidth: 440 }}>
          <Notification type={item.type} onDismiss={() => dismiss(item.id)}>
            {item.message}
          </Notification>
        </div>
      ))}
    </div>
  );
}
