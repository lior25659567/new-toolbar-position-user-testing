// =========================================================
// Design system entry point — adopted from align-ds.
// =========================================================
//
// New ADS API surface (from align-ds):
//   <Button variant="primary|secondary|ghost|link|danger" size="sm|md" />
//   <TextField label … />
//   <Tag tone="blue|green|red|orange|purple|magenta">
//   …plus Avatar, Card, Accordion, Tabs, ProgressBar, Notification, Modal,
//   Icon, LeftRail, TopBar, Logo, LogoMark.
//
// Back-compat API surface (preserved so existing call sites keep working):
//   PrimaryButton / SecondaryButton / WarningButton / LinkButton /
//   GhostButton / IconButton / TextInput / TextArea / Toggle /
//   Checkbox / RadioGroup / RadioItem / Tabs / Tag / ProgressBar /
//   Notification / Modal / ModalFooter / DesignSystemPage etc.
// =========================================================

// ─── Tokens & theme ─────────────────────────────────────────────────────────
export { color, space, radius, font, shadow, transition, zIndex, ads, v2 } from "./tokens";
export { ThemeProvider, useTheme } from "./ThemeProvider";

// ─── New ADS components ─────────────────────────────────────────────────────
export {
  Button,
  TextField,
  Checkbox as AdsCheckbox,
  Radio as AdsRadio,
  Toggle as AdsToggle,
  Tag as AdsTag,
  Avatar,
  Card,
  Accordion,
  Tabs as AdsTabs,
  ProgressBar as AdsProgressBar,
  Notification as AdsNotification,
  Modal as AdsModal,
  ModalFooter as AdsModalFooter,
} from "./Kit";
export type {
  ButtonProps,
  ButtonVariant,
  ButtonSize,
  TextFieldProps,
  CheckboxProps as AdsCheckboxProps,
  RadioProps as AdsRadioProps,
  ToggleProps as AdsToggleProps,
  TagProps as AdsTagProps,
  TagTone,
  AvatarProps,
  AvatarSize,
  CardProps,
  AccordionProps,
  AccordionItem,
  TabsProps as AdsTabsProps,
  ProgressBarProps as AdsProgressBarProps,
  ProgressTone,
  NotificationProps as AdsNotificationProps,
  NotificationTone,
  ModalProps as AdsModalProps,
} from "./Kit";

export { Icon } from "./Icon";
export type { IconName, IconProps } from "./Icon";

export { LeftRail, TopBar, Logo, LogoMark } from "./Shell";
export type { LeftRailProps, TopBarProps, NavGroupDef, NavItemDef, LogoProps } from "./Shell";

// ─── Back-compat: Buttons ───────────────────────────────────────────────────
export { PrimaryButton } from "./PrimaryButton";
export type { PrimaryButtonProps } from "./PrimaryButton";

export { IconButton } from "./IconButton";
export type { IconButtonProps } from "./IconButton";

export { SecondaryButton } from "./SecondaryButton";
export type { SecondaryButtonProps } from "./SecondaryButton";

export { WarningButton } from "./WarningButton";
export type { WarningButtonProps } from "./WarningButton";

export { LinkButton, GhostButton } from "./LinkButton";
export type { LinkButtonProps, GhostButtonProps } from "./LinkButton";

export { Toggle } from "./Toggle";
export type { ToggleProps } from "./Toggle";

// ─── Back-compat: Inputs ────────────────────────────────────────────────────
export { TextInput, TextArea } from "./TextInput";
export type { TextInputProps, TextAreaProps } from "./TextInput";

export { Select } from "./Select";
export type { SelectProps } from "./Select";

export { DropdownList } from "./DropdownList";
export type { DropdownListProps, DropdownItem } from "./DropdownList";

export { SearchInput } from "./SearchInput";
export type { SearchInputProps } from "./SearchInput";

export { NumberInput } from "./NumberInput";
export type { NumberInputProps } from "./NumberInput";

export { DatePicker } from "./DatePicker";
export type { DatePickerProps } from "./DatePicker";

export { Combobox } from "./Combobox";
export type { ComboboxProps, ComboboxOption, ComboboxLayerSet } from "./Combobox";

export { Slider } from "./Slider";
export type { SliderProps } from "./Slider";

export { Checkbox } from "./Checkbox";
export type { CheckboxProps } from "./Checkbox";

export { RadioGroup, RadioItem } from "./Radio";
export type { RadioGroupProps, RadioItemProps } from "./Radio";

// ─── Back-compat: Navigation ────────────────────────────────────────────────
export { Tabs, TabPanel } from "./Tabs";
export type { TabsProps, TabsPanelProps, TabItem } from "./Tabs";

export { Breadcrumbs } from "./Breadcrumbs";
export type { BreadcrumbsProps, BreadcrumbItem } from "./Breadcrumbs";

export { Stepper } from "./Stepper";
export type { StepperProps } from "./Stepper";

// ─── Back-compat: Data display ──────────────────────────────────────────────
export { Tag } from "./Tag";
export type { TagProps, TagColor, TagSize } from "./Tag";

export { ProgressBar } from "./ProgressBar";
export type { ProgressBarProps, ProgressBarSize } from "./ProgressBar";

// ─── Back-compat: Feedback ──────────────────────────────────────────────────
export { Tooltip } from "./Tooltip";
export type { TooltipProps, TooltipPosition, TooltipAlign } from "./Tooltip";

export { Notification } from "./Notification";
export type { NotificationProps, NotificationType } from "./Notification";

export { Modal, ModalFooter } from "./Modal";
export type { ModalProps } from "./Modal";

export { Spinner } from "./Spinner";
export type { SpinnerProps, SpinnerSize } from "./Spinner";

// ─── Overlays / Menus ───────────────────────────────────────────────────────
export { ContextualMenu, ContextualMenuItem, ContextualMenuSeparator } from "./ContextualMenu";
export type { ContextualMenuProps, ContextualMenuItemProps, ContextualMenuPlacement } from "./ContextualMenu";

// ─── Back-compat: Messaging ─────────────────────────────────────────────────
export { MessageList } from "./MessageList";
export type { MessageListProps, Message } from "./MessageList";

export { MessageBubble } from "./MessageBubble";
export type { MessageBubbleProps, MessageBubbleFrom, MessageBubblePosition } from "./MessageBubble";

// ─── Back-compat: Page ──────────────────────────────────────────────────────
export { DesignSystemPage } from "./DesignSystemPage";
export type { DesignSystemPageProps } from "./DesignSystemPage";
