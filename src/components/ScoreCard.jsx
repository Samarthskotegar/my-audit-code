export default function ScoreCard({ result }) {
  const { score, grade, counts, total } = result;
  const tone = score >= 90 ? 'good' : score >= 60 ? 'warn' : 'bad';

  return (
    <section className={`panel score-card tone-${tone}`}>
      <div
        className="score-ring"
        style={{ '--value': `${score * 3.6}deg` }}
        aria-hidden="true"
      >
        <div className="score-inner">
          <strong>{score}</strong>
          <span>/ 100</span>
        </div>
      </div>

      <div className="score-meta">
        <p className="eyebrow">Health score</p>
        <h2>
          Grade {grade}
          <span className="score-count">
            {total === 0 ? 'no findings' : `${total} finding${total === 1 ? '' : 's'}`}
          </span>
        </h2>
        <ul className="severity-totals">
          <li>
            <span className="dot high" /> {counts.high} high
          </li>
          <li>
            <span className="dot medium" /> {counts.medium} medium
          </li>
          <li>
            <span className="dot low" /> {counts.low} low
          </li>
        </ul>
      </div>
    </section>
  );
}
