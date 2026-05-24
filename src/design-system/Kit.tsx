import * as React from "react";
import { Icon, type IconName } from "./Icon";

/* =========================================================
   Kit — primitive components ported from align-ds
   (https://github.com/lior25659567/align-ds Kit.jsx)
   ========================================================= */

/* ---------- Button ---------- */
export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "link";
export type ButtonSize = "sm" | "md";

export interface ButtonProps extends Omit<React.ComponentProps<"button">, "size"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconName | string;
  iconRight?: IconName | string;
  danger?: boolean;
  fullWidth?: boolean;
  children?: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  children,
  icon,
  iconRight,
  disabled,
  danger,
  fullWidth,
  className,
  ...rest
}: ButtonProps) {
  const cls = [
    "btn",
    `btn-${danger ? "danger" : variant}`,
    `btn-${size}`,
    fullWidth ? "btn-full" : "",
    disabled ? "disabled" : "",
    className || "",
  ].filter(Boolean).join(" ");
  // Figma "06. Web components 0.9.0" spec: text+icon buttons use 20px icons
  // (component 204:1241). Children render directly as flex items of the
  // .btn (inline-flex, gap:8). Tailwind preflight sets `svg { display:block }`
  // so wrapping children in a <span> causes the icon to wrap to its own line —
  // we render them as direct flex children to keep icon + label horizontal.
  return (
    <button className={cls} disabled={disabled} {...rest}>
      {icon && <Icon name={icon} size={20} />}
      {children}
      {iconRight && <Icon name={iconRight} size={20} />}
    </button>
  );
}

/* ---------- TextField ---------- */
export interface TextFieldProps {
  label?: React.ReactNode;
  required?: boolean;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  helper?: React.ReactNode;
  error?: React.ReactNode;
  type?: string;
  icon?: IconName | string;
  multiline?: boolean;
  rows?: number;
  disabled?: boolean;
  name?: string;
  id?: string;
  autoFocus?: boolean;
  onFocus?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  className?: string;
  style?: React.CSSProperties;
}

export function TextField({
  label,
  required,
  placeholder,
  value,
  onChange,
  helper,
  error,
  type = "text",
  icon,
  multiline,
  rows,
  disabled,
  name,
  id,
  autoFocus,
  onFocus,
  onBlur,
  onKeyDown,
  className,
  style,
}: TextFieldProps) {
  const wrapCls = ["input-wrap", error ? "error" : "", icon ? "has-icon" : ""].filter(Boolean).join(" ");
  return (
    <label className={["field", className].filter(Boolean).join(" ")} style={style}>
      {label && (
        <span className="field-label">
          {label}
          {required && <span className="req">*</span>}
        </span>
      )}
      <span className={wrapCls}>
        {icon && (
          <span className="input-icon">
            <Icon name={icon} size={16} color="var(--ads-icon-muted)" />
          </span>
        )}
        {multiline ? (
          <textarea
            placeholder={placeholder}
            value={value ?? ""}
            onChange={onChange as React.ChangeEventHandler<HTMLTextAreaElement>}
            disabled={disabled}
            rows={rows}
            name={name}
            id={id}
            autoFocus={autoFocus}
            onFocus={onFocus as React.FocusEventHandler<HTMLTextAreaElement>}
            onBlur={onBlur as React.FocusEventHandler<HTMLTextAreaElement>}
            onKeyDown={onKeyDown as React.KeyboardEventHandler<HTMLTextAreaElement>}
          />
        ) : (
          <input
            type={type}
            placeholder={placeholder}
            value={value ?? ""}
            onChange={onChange as React.ChangeEventHandler<HTMLInputElement>}
            disabled={disabled}
            name={name}
            id={id}
            autoFocus={autoFocus}
            onFocus={onFocus as React.FocusEventHandler<HTMLInputElement>}
            onBlur={onBlur as React.FocusEventHandler<HTMLInputElement>}
            onKeyDown={onKeyDown as React.KeyboardEventHandler<HTMLInputElement>}
          />
        )}
      </span>
      {(helper || error) && (
        <span className={`field-helper ${error ? "error" : ""}`}>{error || helper}</span>
      )}
    </label>
  );
}

/* ---------- Checkbox ---------- */
export interface CheckboxProps {
  checked?: boolean;
  onChange?: (next: boolean) => void;
  label?: React.ReactNode;
  indeterminate?: boolean;
  disabled?: boolean;
  className?: string;
}

export function Checkbox({ checked, onChange, label, indeterminate, disabled, className }: CheckboxProps) {
  const state = indeterminate ? "ind" : checked ? "on" : "";
  return (
    <label className={["check", className].filter(Boolean).join(" ")} aria-disabled={disabled || undefined}>
      <span
        className={`cbx ${state}`}
        onClick={() => !disabled && onChange && onChange(!checked)}
        role="checkbox"
        aria-checked={indeterminate ? "mixed" : !!checked}
      >
        {checked && !indeterminate && <Icon name="check" size={12} color="var(--ads-icon-on-color-primary)" />}
        {indeterminate && <span className="ind-bar" />}
      </span>
      {label && <span className="check-lbl">{label}</span>}
    </label>
  );
}

/* ---------- Radio ---------- */
export interface RadioProps {
  checked?: boolean;
  onChange?: () => void;
  label?: React.ReactNode;
  name?: string;
  disabled?: boolean;
  className?: string;
}

export function Radio({ checked, onChange, label, disabled, className }: RadioProps) {
  return (
    <label className={["radio", className].filter(Boolean).join(" ")} aria-disabled={disabled || undefined}>
      <span
        className={`rad ${checked ? "on" : ""}`}
        onClick={() => !disabled && onChange && onChange()}
        role="radio"
        aria-checked={!!checked}
      />
      {label && <span className="check-lbl">{label}</span>}
    </label>
  );
}

/* ---------- Toggle ---------- */
export interface ToggleProps {
  on?: boolean;
  onChange?: (next: boolean) => void;
  label?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export function Toggle({ on, onChange, label, disabled, className }: ToggleProps) {
  return (
    <label className={["toggle", className].filter(Boolean).join(" ")} aria-disabled={disabled || undefined}>
      <span
        className={`tg ${on ? "on" : ""}`}
        onClick={() => !disabled && onChange && onChange(!on)}
        role="switch"
        aria-checked={!!on}
      />
      {label && <span className="check-lbl">{label}</span>}
    </label>
  );
}

/* ---------- Tag ---------- */
export type TagTone = "blue" | "green" | "red" | "orange" | "purple" | "magenta";

export interface TagProps {
  tone?: TagTone;
  children?: React.ReactNode;
  onDismiss?: () => void;
  className?: string;
}

export function Tag({ tone = "blue", children, onDismiss, className }: TagProps) {
  return (
    <span className={["tag", `tag-${tone}`, className].filter(Boolean).join(" ")}>
      {children}
      {onDismiss && (
        <button className="tag-x" onClick={onDismiss} aria-label="Remove">
          <Icon name="close" size={12} />
        </button>
      )}
    </span>
  );
}

/* ---------- Avatar ---------- */
export type AvatarSize = "xs" | "sm" | "md" | "lg";

export interface AvatarProps {
  name?: string;
  size?: AvatarSize;
  className?: string;
}

function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

export function Avatar({ name = "AD", size = "md", className }: AvatarProps) {
  return (
    <span
      className={["avatar", `avatar-${size}`, className].filter(Boolean).join(" ")}
      aria-label={name}
      title={name}
    >
      {getInitials(name)}
    </span>
  );
}

/* ---------- Card ---------- */
export interface CardProps {
  title?: React.ReactNode;
  action?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export function Card({ title, action, children, className }: CardProps) {
  return (
    <section className={["card", className].filter(Boolean).join(" ")}>
      {title && (
        <div className="card-head">
          <h3>{title}</h3>
          {action}
        </div>
      )}
      <div className="card-body">{children}</div>
    </section>
  );
}

/* ---------- Accordion ---------- */
export interface AccordionItem {
  title: React.ReactNode;
  body: React.ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  defaultOpen?: number;
}

export function Accordion({ items, defaultOpen = 0 }: AccordionProps) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <div className="accordion">
      {items.map((it, i) => {
        const isOpen = i === open;
        return (
          <div key={i} className={`acc-item ${isOpen ? "open" : ""}`}>
            <button className="acc-head" onClick={() => setOpen(isOpen ? -1 : i)}>
              <span>{it.title}</span>
              <span className={`acc-chev ${isOpen ? "open" : ""}`}>
                <Icon name="chevron-down" size={16} color="var(--ads-icon-muted)" />
              </span>
            </button>
            {isOpen && <div className="acc-body">{it.body}</div>}
          </div>
        );
      })}
    </div>
  );
}

/* ---------- Tabs ---------- */
export interface TabsProps {
  tabs: string[];
  active: string;
  onChange: (next: string) => void;
}

export function Tabs({ tabs, active, onChange }: TabsProps) {
  return (
    <div className="tabs">
      {tabs.map((t) => (
        <button
          key={t}
          className={`tab ${t === active ? "active" : ""}`}
          onClick={() => onChange(t)}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

/* ---------- ProgressBar ---------- */
export type ProgressTone = "blue" | "red" | "green" | "orange";

export interface ProgressBarProps {
  value?: number;
  max?: number;
  tone?: ProgressTone;
  label?: React.ReactNode;
  hint?: React.ReactNode;
}

export function ProgressBar({ value = 0, max = 100, tone = "blue", label, hint }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="progress">
      {label && <div className="progress-lbl">{label}</div>}
      <div className={`progress-track tone-${tone}`}>
        <i style={{ width: `${pct}%` }} />
      </div>
      {hint && <div className={`progress-hint tone-${tone}`}>{hint}</div>}
    </div>
  );
}

/* ---------- Notification (toast) ---------- */
export type NotificationTone = "info" | "success" | "warning" | "error";

export interface NotificationProps {
  tone?: NotificationTone;
  title?: React.ReactNode;
  body?: React.ReactNode;
  onClose?: () => void;
}

export function Notification({ tone = "info", title, body, onClose }: NotificationProps) {
  const glyph =
    tone === "success" ? "✓" :
    tone === "error" ? "!" :
    tone === "warning" ? "!" : "i";
  return (
    <div className={`toast toast-${tone}`}>
      <span className="toast-icon">{glyph}</span>
      <div className="toast-body">
        {title && <span className="toast-title">{title}</span>}{" "}
        {body && <span className="toast-text">{body}</span>}
      </div>
      {onClose && (
        <button className="toast-close" onClick={onClose} aria-label="Close">
          <Icon name="close" size={14} color="var(--ads-icon-muted)" />
        </button>
      )}
    </div>
  );
}

/* ---------- Modal ---------- */
export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  width?: number | string;
}

export function Modal({ open, onClose, title, children, footer, width }: ModalProps) {
  if (!open) return null;
  return (
    <div className="modal-root">
      <div className="modal-scrim" onClick={onClose} />
      <div className="modal" style={width ? { width } : undefined}>
        <div className="modal-head">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <Icon name="close" size={16} color="var(--ads-icon-muted)" />
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-foot">{footer}</div>}
      </div>
    </div>
  );
}

export function ModalFooter({ children }: { children?: React.ReactNode }) {
  return <div className="modal-foot">{children}</div>;
}
