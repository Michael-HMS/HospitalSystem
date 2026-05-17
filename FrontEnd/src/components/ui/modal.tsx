import React, { useEffect } from "react";

export type BadgeVariant = "success" | "danger" | "info" | "warning" | "default";

export interface ModalField {
  icon?: React.ReactNode;   // Accepts React Icon component e.g. <TiMail />
  label: string;
  value: string | number;
}

export interface ModalSection {
  heading: string;
  fields?: ModalField[];
  list?: string[];          // For tag-style lists (e.g. doctors in a dept)
}

export interface ModalAction {
  label: string;
  icon?: React.ReactNode;   // Accepts React Icon component e.g. <TiCalendar />
  variant?: "default" | "danger";
  onClick?: () => void;
}

export interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;   // Accepts React Icon component e.g. <TiStethoscope />
  iconBg?: string;         // CSS color e.g. "rgba(10,46,70,0.08)"
  iconColor?: string;      // CSS color e.g. "#0a2e46" — defaults to var(--primary)
  badge?: {
    label: string;
    variant?: BadgeVariant;
  };
  sections: ModalSection[];
  actions?: ModalAction[];
}

const badgeStyles: Record<BadgeVariant, React.CSSProperties> = {
  success: { background: "#dcfce7", color: "#166534" },
  danger:  { background: "#fee2e2", color: "#991b1b" },
  info:    { background: "#dbeafe", color: "#1e40af" },
  warning: { background: "#fef9c3", color: "#854d0e" },
  default: { background: "rgba(103,120,147,0.15)", color: "var(--slate)" },
};

export default function DetailModal({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  iconBg = "rgba(10,46,70,0.08)",
  iconColor = "var(--primary)",
  badge,
  sections,
  actions = [],
}: DetailModalProps) {

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  const border = "1px solid rgba(103,120,147,0.2)";

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "rgba(10,46,70,0.5)",
        padding: "0 1rem",
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        style={{
          background: "var(--background)",
          color: "var(--text-base)",
          border,
          borderRadius: "0.75rem",
          width: "100%",
          maxWidth: "32rem",
          maxHeight: "85vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 8px 32px rgba(10,46,70,0.18)",
        }}
        onClick={(e) => e.stopPropagation()}
      >

        {/* ── Header ── */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "1rem 1.25rem",
          borderBottom: border,
          borderRadius: "0.75rem 0.75rem 0 0",
          background: "var(--background)",
          position: "sticky", top: 0, zIndex: 1,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            {icon && (
              <div style={{
                width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: iconBg,
                color: iconColor,
                fontSize: 18
              }}>
                {icon}
              </div>
            )}
            <div>
              <h2
                id="modal-title"
                style={{ fontSize: 14, fontWeight: 500, margin: 0, color: "var(--text-base)" }}
              >
                {title}
              </h2>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2 }}>
                {subtitle && (
                  <p style={{ fontSize: 12, margin: 0, color: "var(--slate)" }}>{subtitle}</p>
                )}
                {badge && (
                  <span style={{
                    fontSize: 11, padding: "2px 8px", borderRadius: 6, fontWeight: 500,
                    ...badgeStyles[badge.variant ?? "default"],
                  }}>
                    {badge.label}
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            style={{
              width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center",
              borderRadius: 8, border, background: "transparent", cursor: "pointer",
              color: "var(--slate)", transition: "background 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(103,120,147,0.12)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >
            {/* Hardcoded interface controls safely update to fallback styles */}
            <span style={{ display: "flex", fontSize: 15 }}>&times;</span>
          </button>
        </div>

        {/* ── Body ── */}
        <div style={{
          flex: 1, overflowY: "auto", padding: "1.25rem",
          display: "flex", flexDirection: "column", gap: "1.25rem",
        }}>
          {sections.map((section, i) => (
            <div key={i}>
              <p style={{
                fontSize: 10, fontWeight: 600, letterSpacing: "0.07em",
                textTransform: "uppercase", color: "var(--slate)",
                margin: "0 0 8px",
              }}>
                {section.heading}
              </p>

              {/* Field rows */}
              {section.fields && (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {section.fields.map((field, j) => (
                    <div key={j} style={{
                      display: "flex", alignItems: "flex-start", gap: 10,
                      padding: "7px 0",
                      borderBottom: j < section.fields!.length - 1 ? "1px solid rgba(103,120,147,0.12)" : "none",
                    }}>
                      {field.icon && (
                        <div style={{ fontSize: 15, color: "var(--slate)", marginTop: 1, flexShrink: 0, display: "flex" }}>
                          {field.icon}
                        </div>
                      )}
                      <span style={{ fontSize: 12, color: "var(--slate)", width: 112, flexShrink: 0 }}>
                        {field.label}
                      </span>
                      <span style={{ fontSize: 12, color: "var(--text-base)" }}>
                        {field.value}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Tag list */}
              {section.list && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {section.list.map((item, j) => (
                    <span key={j} style={{
                      fontSize: 12, padding: "3px 10px",
                      background: "rgba(103,120,147,0.1)",
                      color: "var(--dark-slate)",
                      border: "1px solid rgba(103,120,147,0.2)",
                      borderRadius: 6,
                    }}>
                      {item}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ── Footer ── */}
        {actions.length > 0 && (
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "flex-end",
            gap: 8, padding: "0.75rem 1.25rem",
            borderTop: border,
          }}>
            {actions.map((action, i) => (
              <button
                key={i}
                onClick={action.onClick}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  fontSize: 12, padding: "6px 14px", borderRadius: 8,
                  cursor: "pointer", transition: "background 0.15s",
                  ...(action.variant === "danger"
                    ? { color: "#dc2626", border: "1px solid #fca5a5", background: "transparent" }
                    : { color: "var(--text-base)", border, background: "transparent" }
                  ),
                }}
                onMouseEnter={e => (e.currentTarget.style.background =
                  action.variant === "danger" ? "#fee2e2" : "rgba(103,120,147,0.1)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                {action.icon && (
                  <div style={{ display: "flex", fontSize: 14 }}>{action.icon}</div>
                )}
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}