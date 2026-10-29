import { useState } from 'react';
import CodeInput from './components/CodeInput.jsx';
import FindingList from './components/FindingList.jsx';
import ScoreCard from './components/ScoreCard.jsx';
import { runAudit } from './lib/audit.js';
import { SAMPLE_CODE } from './lib/sample.js';

export default function App() {
  const [code, setCode] = useState('');
  const [result, setResult] = useState(null);
  const [filter, setFilter] = useState('all');

  function auditSource(source = code) {
    if (!source.trim()) return;
    setResult(runAudit(source));
    setFilter('all');
  }

  function loadSample() {
    setCode(SAMPLE_CODE);
    auditSource(SAMPLE_CODE);
  }

  function clear() {
    setCode('');
    setResult(null);
    setFilter('all');
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="mark" aria-hidden="true">
            &lt;/&gt;
          </span>
          <div>
            <h1>Audit Code</h1>
            <p>Static review for the mistakes that slip through review</p>
          </div>
        </div>
        <p className="topbar-note">Runs locally in your browser · nothing is uploaded</p>
      </header>

      <main className="workspace">
        <CodeInput
          value={code}
          onChange={setCode}
          onRun={() => auditSource()}
          onSample={loadSample}
          onClear={clear}
        />

        {result ? (
          <div className="report">
            <ScoreCard result={result} />
            <FindingList result={result} filter={filter} onFilterChange={setFilter} />
          </div>
        ) : (
          <section className="panel placeholder">
            <h2>No audit yet</h2>
            <p>
              Paste a snippet on the left and press <strong>Run audit</strong>, or load the sample to
              see the checks in action.
            </p>
            <button type="button" className="btn primary" onClick={loadSample}>
              Load sample
            </button>
          </section>
        )}
      </main>
    </div>
  );
}
