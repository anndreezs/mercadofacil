import { AlertCircle } from "lucide-react";

interface Props {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  destructive,
  onConfirm,
  onClose,
}: Props) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="animate-fade-in w-full max-w-sm rounded-2xl border border-border bg-card p-5"
      >
        <div className="flex items-start gap-3">
          <div
            className={`grid h-10 w-10 place-items-center rounded-full ${
              destructive ? "bg-[var(--danger)]/15 text-[var(--danger)]" : "bg-primary/15 text-primary"
            }`}
          >
            <AlertCircle className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold">{title}</h3>
            {description && (
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
        <div className="mt-5 flex gap-2">
          <button
            onClick={onClose}
            className="tap-press flex-1 rounded-xl border border-border bg-background px-4 py-2.5 font-medium"
          >
            {cancelLabel}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`tap-press flex-1 rounded-xl px-4 py-2.5 font-semibold ${
              destructive
                ? "bg-[var(--danger)] text-white"
                : "bg-primary text-primary-foreground"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}