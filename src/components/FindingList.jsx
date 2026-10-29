import { SEVERITIES } from '../lib/audit.js';

export default function FindingList({ result, filter, onFilterChange }) {
  const { findings, counts } = result;
  const visible = filter === 'all' ? findings : findings.filter((f) => f.severity === filter);
  const sortOrder = { high: 0, medium: 1, low: 2 };
  const sorted = [...visible].sort(
    (a, b) => sortOrder[a.severity] - sortOrder[b.severity] || a.line - b.line,
  );

  return (
    <section className="panel results">
      <header className="panel-head">
        <h2 className="panel-title">Findings</h2>
        <div className="filters" role="group" aria-label="Filter findings by severity">
          <button
            type="button"
            className={`chip ${filter === 'all' ? 'active' : ''}`}
            onClick={() => onFilterChange('all')}
          >
            All {findings.length}
          </button>
          {SEVERITIES.map((severity) => (
            <button
              key={severity}
              type="button"
              className={`chip ${filter === severity ? 'active' : ''}`}
              onClick={() => onFilterChange(severity)}
            >
              {severity} {counts[severity]}
            </button>
          ))}
        </div>
      </header>

      <div className="findings">
        {sorted.length === 0 ? (
          <p className="empty">
            {findings.length === 0
              ? 'Nothing flagged — this file passed every check.'
              : `No ${filter}-severity findings.`}
          </p>
        ) : (
          sorted.map((finding) => (
            <article key={finding.id} className="finding">
              <div className="finding-top">
                <span className={`pill ${finding.severity}`}>{finding.severity}</span>
                <h3>{finding.title}</h3>
                <span className="line-badge">line {finding.line}</span>
              </div>
              <p className="finding-message">{finding.message}</p>
              <pre className="finding-snippet">
                <code>{finding.snippet}</code>
              </pre>
              <p className="finding-meta">{finding.category}</p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
