"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogTitle, DialogActions } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import type { TransitionProps } from "@mui/material/transitions";
import { Transition } from "react-transition-group";
import clsx from "clsx";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Button } from "./Button";

export type DialogSize = "sm" | "md" | "lg" | "xl";

/** Keeps today's visual widths: md callers stay at MUI `sm`, lg callers stay at MUI `md`. */
const maxWidthMap: Record<DialogSize, "xs" | "sm" | "md" | "lg"> = {
  sm: "xs",
  md: "sm",
  lg: "md",
  xl: "lg",
};

/* ------------------------------------------------------------------ */
/* Transition: scale 0.96 -> 1 with opacity. Enter 200ms / exit 150ms. */
/* ------------------------------------------------------------------ */

type ScaleFadeProps = TransitionProps & { children: React.ReactElement<any> };

export const ScaleFade = React.forwardRef<HTMLElement, ScaleFadeProps>(function ScaleFade(
  { children, in: inProp, onEnter, onExited, appear = true, timeout, ...other },
  ref,
) {
  const theme = useTheme();
  const nodeRef = React.useRef<HTMLElement>(null);
  const handleRef = React.useCallback(
    (node: HTMLElement | null) => {
      (nodeRef as React.MutableRefObject<HTMLElement | null>).current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLElement | null>).current = node;
    },
    [ref],
  );

  const enterMs = theme.transitions.duration.enteringScreen;
  const exitMs = theme.transitions.duration.leavingScreen;
  const resolvedTimeout =
    typeof timeout === "number" ? { enter: timeout, exit: timeout } : (timeout ?? { enter: enterMs, exit: exitMs });

  const styles: Record<string, React.CSSProperties> = {
    entering: { opacity: 1, transform: "scale(1)" },
    entered: { opacity: 1, transform: "scale(1)" },
    exiting: { opacity: 0, transform: "scale(0.96)" },
    exited: { opacity: 0, transform: "scale(0.96)" },
  };

  return (
    <Transition
      appear={appear}
      in={inProp}
      nodeRef={nodeRef}
      timeout={resolvedTimeout}
      onEnter={onEnter as any}
      onExited={onExited as any}
      {...(other as any)}
    >
      {(state: string) =>
        React.cloneElement(children, {
          ref: handleRef,
          style: {
            opacity: 0,
            transform: "scale(0.96)",
            willChange: "opacity, transform",
            transition:
              state === "exiting" || state === "exited"
                ? `opacity ${exitMs}ms ${theme.transitions.easing.easeIn}, transform ${exitMs}ms ${theme.transitions.easing.easeIn}`
                : `opacity ${enterMs}ms ${theme.transitions.easing.easeOut}, transform ${enterMs}ms ${theme.transitions.easing.easeOut}`,
            visibility: state === "exited" && !inProp ? "hidden" : undefined,
            ...styles[state],
            ...children.props.style,
          },
        })
      }
    </Transition>
  );
});

/* ------------------------------------------------------------------ */
/* Shared chrome                                                        */
/* ------------------------------------------------------------------ */

export interface DialogShellProps {
  open: boolean;
  onClose: () => void;
  title: string;
  /** Rendered under the title and wired to aria-describedby. */
  description?: string;
  size?: DialogSize;
  /** `undefined` = no footer (DialogShell) or default actions (FormModal); `null` = no footer; node = custom. */
  footer?: React.ReactNode | null;
  children: React.ReactNode;
  /** Extra classes for the body wrapper. */
  bodyClassName?: string;
  /** Close button disabled while a confirm is in flight. */
  isLoading?: boolean;
}

export function DialogShell({
  open,
  onClose,
  title,
  description,
  size = "md",
  footer,
  children,
  bodyClassName,
  isLoading = false,
}: DialogShellProps) {
  const baseId = React.useId();
  const titleId = `${baseId}-title`;
  const descriptionId = `${baseId}-description`;

  return (
    <Dialog
      open={open}
      onClose={isLoading ? undefined : onClose}
      fullWidth
      maxWidth={maxWidthMap[size]}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      slots={{ transition: ScaleFade }}
      slotProps={{
        paper: {
          className: "max-h-[88vh]",
          style: { margin: "1rem" },
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        component="div"
        className="flex items-start justify-between gap-4 px-5 py-4 border-b border-gray-100"
        sx={{ padding: 0, font: "inherit", letterSpacing: "inherit" }}
      >
        <div className="flex items-start justify-between gap-4 px-5 py-4 w-full">
          <div className="min-w-0">
            <h2 id={titleId} className="text-base font-semibold text-gray-900">
              {title}
            </h2>
            {description && (
              <p id={descriptionId} className="mt-0.5 text-sm text-gray-500">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className={clsx(
              "flex-none -me-1.5 p-1.5 rounded-md text-gray-400 cursor-pointer",
              "hover:text-gray-600 hover:bg-gray-100",
              "transition-[background-color,color] duration-fast ease-out",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1",
              "disabled:opacity-50 disabled:cursor-not-allowed",
            )}
            aria-label="إغلاق"
          >
            <XMarkIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </DialogTitle>

      {/* Body */}
      <DialogContent dividers={false} sx={{ padding: 0, overflowY: "auto" }}>
        <div className={clsx("px-5 py-5", bodyClassName)}>{children}</div>
      </DialogContent>

      {/* Footer */}
      {footer != null && (
        <DialogActions
          className="border-t border-gray-100 bg-gray-50/60 rounded-b-xl"
          sx={{ padding: 0 }}
        >
          <div className="flex items-center justify-end gap-3 px-5 py-4 w-full">{footer}</div>
        </DialogActions>
      )}
    </Dialog>
  );
}

/* ------------------------------------------------------------------ */
/* FormModal: shell + space-y-4 body + default confirm/cancel footer    */
/* ------------------------------------------------------------------ */

interface FormModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  /** Required unless a custom `footer` is passed. */
  onConfirm?: () => void | Promise<void>;
  isLoading?: boolean;
  confirmLabel?: string;
  size?: DialogSize;
  /** `undefined` = default confirm/cancel actions, `null` = no footer, node = custom. */
  footer?: React.ReactNode | null;
  children: React.ReactNode;
}

const FormModal: React.FC<FormModalProps> = ({
  open,
  onClose,
  title,
  description,
  onConfirm,
  isLoading = false,
  confirmLabel = "حفظ",
  size = "md",
  footer,
  children,
}) => {
  const resolvedFooter =
    footer === undefined ? (
      <>
        <Button variant="muted" onClick={onClose} disabled={isLoading}>
          إلغاء
        </Button>
        <Button variant="primary" onClick={onConfirm} loading={isLoading}>
          {confirmLabel}
        </Button>
      </>
    ) : (
      footer
    );

  return (
    <DialogShell
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      size={size}
      footer={resolvedFooter}
      bodyClassName="space-y-4"
      isLoading={isLoading}
    >
      {children}
    </DialogShell>
  );
};

export default FormModal;
