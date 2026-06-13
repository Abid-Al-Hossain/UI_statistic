"use client";

import type { CSSProperties } from "react";
import type { StatisticState } from "../types";
import { SYSTEM_FONTS } from "@/components/shared/typography/fontConstants";

function resolveFont(state: { fontBucket: "system" | "google"; googleFontFamily: string; systemFontIdx: number }): string {
  return state.fontBucket === "google"
    ? `"${state.googleFontFamily}", sans-serif`
    : (SYSTEM_FONTS[state.systemFontIdx]?.css ?? "inherit");
}

function buildShadow(state: { shadowEnabled: boolean; shadowX: number; shadowY: number; shadowBlur: number; shadowSpread: number; shadowColor: string; shadowOpacity: number }): string {
  if (!state.shadowEnabled) return "none";
  const hex = Math.round(state.shadowOpacity * 255).toString(16).padStart(2, "0");
  return `${state.shadowX}px ${state.shadowY}px ${state.shadowBlur}px ${state.shadowSpread}px ${state.shadowColor}${hex}`;
}

function buildRadius(state: { radiusLinked: boolean; radius: number; radiusTL: number; radiusTR: number; radiusBR: number; radiusBL: number }): string {
  return state.radiusLinked
    ? `${state.radius}px`
    : `${state.radiusTL}px ${state.radiusTR}px ${state.radiusBR}px ${state.radiusBL}px`;
}

function shell(state: StatisticState): CSSProperties {
  return {
    width: state.width,
    minHeight: state.height,
    padding: state.padding,
    borderRadius: buildRadius(state),
    border: `${state.borderWidth}px ${state.borderStyle} ${state.border}`,
    boxShadow: buildShadow(state),
    background: state.background,
    color: state.foreground,
    fontFamily: resolveFont(state),
    fontStyle: state.fontStyle,
    textTransform: state.textTransform,
    textDecoration: state.textDecoration,
    letterSpacing: `${state.letterSpacing}${state.letterSpacingUnit}`,
    lineHeight: state.lineHeight,
    opacity: state.disabled ? 0.6 : 1,
    transition: state.transitionDuration > 0 ? "opacity 200ms ease" : "none",
  };
}

function trendCopy(state: StatisticState) {
  if (state.previewState === "error") return "Metric needs attention";
  if (state.previewState === "success") return "Metric is on target";
  if (state.trendDirection === "down") return `${state.trend} decrease`;
  if (state.trendDirection === "neutral") return `${state.trend} change`;
  return `${state.trend} increase`;
}

function trendColor(state: StatisticState) {
  if (state.previewState === "error" || state.trendDirection === "down") return "#f97316";
  if (state.previewState === "success" || state.trendDirection === "up") return state.accent;
  return state.muted;
}

export default function LivePreview({ state }: { state: StatisticState }) {
  const panel = shell(state);
  const trend = trendCopy(state);
  const statusColor = trendColor(state);

  return (
    <section
      id={state.id}
      role={state.role}
      aria-labelledby={`${state.id}-label`}
      aria-describedby={`${state.id}-description ${state.id}-trend`}
      tabIndex={state.tabIndex}
      style={panel}
      data-component="statistic"
      data-preview-state={state.previewState}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p id={`${state.id}-label`} className="text-sm font-semibold uppercase tracking-[0.16em]" style={{ color: state.muted }}>{state.label}</p>
          <h3 style={{ fontSize: state.titleSize, fontWeight: state.fontWeight }}>{state.title}</h3>
        </div>
        <span role="status" className="rounded-full border px-3 py-1 text-xs font-semibold" style={{ borderColor: statusColor, color: statusColor }}>
          {state.previewState}
        </span>
      </div>
      <p id={`${state.id}-description`} className="mt-2" style={{ color: state.muted, fontSize: state.bodySize }}>{state.description}</p>
      <div className="mt-6" aria-label={`${state.ariaLabel}: ${state.prefix}${state.value}${state.suffix ? ` ${state.suffix}` : ""}`}>
        <p className="leading-none" style={{ fontSize: Math.max(state.titleSize * 2, 42), fontWeight: 900, transition: state.transitionDuration > 0 ? "font-size 200ms ease" : "none" }}>
          <span>{state.prefix}</span>
          <data value={state.value}>{state.value}</data>
          {state.unit && <span className="ml-2 text-base font-semibold" style={{ color: state.muted }}>{state.unit}</span>}
        </p>
        {state.suffix && <p className="mt-2 text-sm" style={{ color: state.muted }}>{state.suffix}</p>}
      </div>
      <p id={`${state.id}-trend`} role="status" className="mt-5 inline-flex rounded-full border px-3 py-1 text-sm font-semibold" style={{ borderColor: statusColor, color: statusColor }}>
        {trend}
      </p>
      {state.showSparkline && (
        <svg aria-hidden="true" viewBox="0 0 240 64" className="mt-5 h-16 w-full overflow-visible">
          <polyline points="0,46 32,38 64,42 96,24 128,30 160,14 192,20 240,8" fill="none" stroke={state.accent} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="0" x2="240" y1="58" y2="58" stroke={state.border} strokeWidth="2" />
        </svg>
      )}
      <p className="mt-4 text-xs" style={{ color: state.muted }}>{state.helper}</p>
    </section>
  );
}
