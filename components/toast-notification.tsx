"use client";

import { toast } from "sonner";

type ToastType = "success" | "error" | "info" | "warning";

interface ShowToastProps {
  title: string;
  description?: string;
  type?: ToastType;
  duration?: number; // in ms
}

export function showToast({ title, description, type = "info", duration = 3000 }: ShowToastProps) {
    const typeIcons: Record<ToastType, string> = {
        success: "✅",
        error: "❌",
        info: "ℹ️",
        warning: "⚠️",
    };

    toast(
        `${typeIcons[type]} ${title}`,
        {
        description,
        duration,
        className: "rounded",
        style: {
            backgroundColor: getBackgroundColor(type),
            color: type === "warning" ? "black" : "white",
            fontWeight: "bold",
        },
        }
    );
}

function getBackgroundColor(type: ToastType) {
  switch (type) {
    case "success":
      return "#22c55e"; // green-500
    case "error":
      return "#ff7e75"; // red-500
    case "info":
      return "#3b82f6"; // blue-500
    case "warning":
      return "#facc15"; // yellow-400
    default:
      return "#334155"; // slate-700
  }
}
