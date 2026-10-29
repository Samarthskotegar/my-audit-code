import { useRef } from 'react';

export default function CodeInput({ value, onChange, onRun, onSample, onClear }) {
  const gutterRef = useRef(null);
  const lineCount = value ? value.split('\n').length : 1;

  return (
    <section className="panel editor">
      <header className="panel-head">
        <span className="file-chip">untitled.js</span>
        <span className="muted">
          {lineCount} {lineCount === 1 ? 'line' : 'lines'} · {value.length} chars
        </span>
      </header>

      <div className="editor-body">
        <div className="gutter" ref={gutterRef} aria-hidden="true">
          {Array.from({ length: lineCount }, (_, i) => (
            <span key={i}>{i + 1}</span>
          ))}
        </div>
        <textarea
          className="code-area"
          value={value}
          spellCheck={false}
          placeholder="Paste JavaScript here to audit it…"
          aria-label="Code to audit"
          onChange={(event) => onChange(event.target.value)}
          onScroll={(event) => {
            if (gutterRef.current) gutterRef.current.scrollTop = event.currentTarget.scrollTop;
          }}
          onKeyDown={(event) => {
            if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
              event.preventDefault();
              onRun();
            }
          }}
        />
      </div>

      <footer className="panel-foot">
        <span className="hint">Ctrl / ⌘ + Enter to run</span>
        <div className="row">
          <button type="button" className="btn ghost" onClick={onSample}>
            Load sample
          </button>
          <button type="button" className="btn ghost" onClick={onClear} disabled={!value}>
            Clear
          </button>
          <button type="button" className="btn primary" onClick={onRun} disabled={!value.trim()}>
            Run audit
          </button>
        </div>
      </footer>
    </section>
  );
}
