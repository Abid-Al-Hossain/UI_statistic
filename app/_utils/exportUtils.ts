import type { StatisticState } from "../types";

export type ExportPayload = { fileName: string; mimeType: "text/plain;charset=utf-8"; content: string };

export function buildExportPayload(state: StatisticState, fileName = "statistic") : ExportPayload {
  return { fileName: `${fileName || "statistic"}.jsx`, mimeType: "text/plain;charset=utf-8", content: buildReactCode(state) };
}

export function buildReactCode(state: StatisticState) {
  return [
    "import * as React from \"react\";",
    "",
    "const state = " + JSON.stringify(state, null, 2) + ";",
    "",
    "function trendCopy() {",
    "  if (state.previewState === \"error\") return \"Metric needs attention\";",
    "  if (state.previewState === \"success\") return \"Metric is on target\";",
    "  if (state.trendDirection === \"down\") return `${state.trend} decrease`;",
    "  if (state.trendDirection === \"neutral\") return `${state.trend} change`;",
    "  return `${state.trend} increase`;",
    "}",
    "",
    "function trendColor() {",
    "  if (state.previewState === \"error\" || state.trendDirection === \"down\") return \"#f97316\";",
    "  if (state.previewState === \"success\" || state.trendDirection === \"up\") return state.accent;",
    "  return state.muted;",
    "}",
    "",
    "export default function StatisticComponent() {",
    "  const panel = { width: state.width, minHeight: state.height, padding: state.padding, borderRadius: state.radius, border: state.borderWidth + \"px solid \" + state.border, boxShadow: \"0 \" + Math.round(state.shadow / 3) + \"px \" + state.shadow + \"px rgba(0,0,0,.28)\", background: state.background, color: state.foreground, fontFamily: state.fontFamily, opacity: state.disabled ? 0.6 : 1 };",
    "  const trend = trendCopy();",
    "  const statusColor = trendColor();",
    "  return (",
    "    <section id={state.id} role={state.role} aria-labelledby={`${state.id}-label`} aria-describedby={`${state.id}-description ${state.id}-trend`} tabIndex={state.tabIndex} style={panel} data-component=\"statistic\" data-preview-state={state.previewState}>",
    "      <div style={{ display: \"flex\", alignItems: \"flex-start\", justifyContent: \"space-between\", gap: 16 }}>",
    "        <div>",
    "          <p id={`${state.id}-label`} style={{ color: state.muted, fontSize: 14, fontWeight: 700, letterSpacing: \".16em\", textTransform: \"uppercase\" }}>{state.label}</p>",
    "          <h3 style={{ fontSize: state.titleSize, fontWeight: state.fontWeight }}>{state.title}</h3>",
    "        </div>",
    "        <span role=\"status\" style={{ border: \"1px solid \" + statusColor, borderRadius: 999, padding: \"4px 12px\", color: statusColor, fontSize: 12, fontWeight: 700 }}>{state.previewState}</span>",
    "      </div>",
    "      <p id={`${state.id}-description`} style={{ color: state.muted, fontSize: state.bodySize, marginTop: 8 }}>{state.description}</p>",
    "      <div style={{ marginTop: 24 }} aria-label={`${state.ariaLabel}: ${state.prefix}${state.value}${state.suffix ? ` ${state.suffix}` : \"\"}`}>",
    "        <p style={{ fontSize: Math.max(state.titleSize * 2, 42), fontWeight: 900, lineHeight: 1, margin: 0 }}>",
    "          <span>{state.prefix}</span>",
    "          <data value={state.value}>{state.value}</data>",
    "          {state.unit && <span style={{ marginLeft: 8, color: state.muted, fontSize: 16, fontWeight: 700 }}>{state.unit}</span>}",
    "        </p>",
    "        {state.suffix && <p style={{ marginTop: 8, color: state.muted, fontSize: 14 }}>{state.suffix}</p>}",
    "      </div>",
    "      <p id={`${state.id}-trend`} role=\"status\" style={{ display: \"inline-flex\", border: \"1px solid \" + statusColor, borderRadius: 999, padding: \"4px 12px\", color: statusColor, fontSize: 14, fontWeight: 700, marginTop: 20 }}>{trend}</p>",
    "      {state.showSparkline && (",
    "        <svg aria-hidden=\"true\" viewBox=\"0 0 240 64\" style={{ display: \"block\", width: \"100%\", height: 64, marginTop: 20, overflow: \"visible\" }}>",
    "          <polyline points=\"0,46 32,38 64,42 96,24 128,30 160,14 192,20 240,8\" fill=\"none\" stroke={state.accent} strokeWidth=\"5\" strokeLinecap=\"round\" strokeLinejoin=\"round\" />",
    "          <line x1=\"0\" x2=\"240\" y1=\"58\" y2=\"58\" stroke={state.border} strokeWidth=\"2\" />",
    "        </svg>",
    "      )}",
    "      <p style={{ color: state.muted, fontSize: 12, marginTop: 16 }}>{state.helper}</p>",
    "    </section>",
    "  );",
    "}",
    "",
  ].join("\n");
}
