import { useEffect, useMemo, useState } from "react";
import { api } from "../api";

function levelFromPercent(pct) {
  if (pct == null || Number.isNaN(Number(pct))) return "—";
  const p = Number(pct);
  if (p < 10) return "Low";
  if (p < 30) return "Medium";
  return "High";
}

export default function DashboardPage({ selectedProjectId }) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  // New: store last prediction payload (from localStorage via api.getDashboard())
  const [last, setLast] = useState(null);

  const derived = useMemo(() => {
    const summary = last?.summary || {};
    const buckets = summary?.risk_buckets || {};
    const percent = summary?.percent_defective;

    return {
      runId: last?.run_id || "—",
      rows: last?.rows ?? (Array.isArray(last?.results) ? last.results.length : "—"),
      countDefective: summary?.count_defective ?? "—",
      percentDefective: percent != null ? Number(percent) : null,
      avgProba: summary?.avg_probability_defect != null ? Number(summary.avg_probability_defect) : null,
      buckets: {
        low: buckets?.low ?? "—",
        medium: buckets?.medium ?? "—",
        high: buckets?.high ?? "—",
      },
      riskLevel: levelFromPercent(percent),
      // A simple “risk score” based on percent defective (0..1)
      riskScore: percent != null ? Math.max(0, Math.min(1, Number(percent) / 100)) : null,
    };
  }, [last]);

  async function refresh() {
    setErr("");
    setMsg("");

    if (!selectedProjectId) {
      setErr("No project selected. Go to Projects and click Select.");
      return;
    }

    setLoading(true);
    try {
      const d = await api.getDashboard(selectedProjectId);
      if (!d) {
        setErr("No prediction found yet. Upload a CSV first.");
        setLast(null);
      } else {
        setLast(d);
        setMsg("Dashboard refreshed ✅");
      }
    } catch (e) {
      setErr(e?.message || "Failed to refresh dashboard");
    } finally {
      setLoading(false);
    }
  }

  // Auto-refresh when project changes
  useEffect(() => {
    if (selectedProjectId) refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProjectId]);

  return (
    <div className="panel">
      <div className="title">Dashboard</div>
      <p className="sub">
        Shows the latest prediction for the selected project (from your most recent upload).
      </p>

      {err && <div className="notice bad">{err}</div>}
      {msg && <div className="notice ok">{msg}</div>}

      {!last ? (
        <div className="dashPlaceholder">
          No prediction loaded yet. Upload a CSV, then click “Refresh Dashboard”.
        </div>
      ) : (
        <>
          <div className="cardRow">
            <div className="smallCard">
              <div className="mutedSmall">Risk Score</div>
              <div className="bigNum">
                {derived.riskScore != null ? derived.riskScore.toFixed(2) : "—"}
              </div>
              <div className="muted">
                Level: <b>{derived.riskLevel}</b>
              </div>
              <div className="muted">
                Percent defective:{" "}
                <b>{derived.percentDefective != null ? `${derived.percentDefective.toFixed(2)}%` : "—"}</b>
              </div>
            </div>

            <div className="smallCard">
              <div className="mutedSmall">Predicted Defects</div>
              <div className="bigNum">{derived.countDefective}</div>
              <div className="muted">
                Rows analyzed: <b>{derived.rows}</b>
              </div>
              <div className="muted">
                Avg defect probability:{" "}
                <b>{derived.avgProba != null ? derived.avgProba.toFixed(3) : "—"}</b>
              </div>
            </div>

            <div className="smallCard">
              <div className="mutedSmall">Risk Buckets</div>
              <ol className="drivers">
                <li>Low: {derived.buckets.low}</li>
                <li>Medium: {derived.buckets.medium}</li>
                <li>High: {derived.buckets.high}</li>
              </ol>
              <div className="muted" style={{ marginTop: 8 }}>
                Run: <span className="mono" style={{ wordBreak: "break-all" }}>{derived.runId}</span>
              </div>
            </div>
          </div>

          <div className="dashPlaceholder">
            Next UI ideas: add a table of top “High” rows, trend over time (needs backend history endpoint),
            and breakdown by file/module if your CSV includes it.
          </div>
        </>
      )}

      <button className="btn" onClick={refresh} disabled={loading} style={{ marginTop: 12 }}>
        {loading ? "Refreshing..." : "Refresh Dashboard"}
      </button>
    </div>
  );
}