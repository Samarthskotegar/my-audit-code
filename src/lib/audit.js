const SEVERITY_WEIGHT = { high: 15, medium: 7, low: 3 };

const RULES = [
  {
    id: 'eval',
    title: 'Dynamic code execution',
    severity: 'high',
    category: 'Security',
    pattern: /(^|[^.\w$])eval\s*\(/,
    message: 'eval() runs arbitrary text as code. Parse the input or use a lookup map instead.',
  },
  {
    id: 'inner-html',
    title: 'Unescaped HTML assignment',
    severity: 'high',
    category: 'Security',
    pattern: /\.(innerHTML|outerHTML)\s*=/,
    message: 'Writing to innerHTML injects markup from untrusted data. Prefer textContent or sanitise first.',
  },
  {
    id: 'hardcoded-credential',
    title: 'Hardcoded credential',
    severity: 'high',
    category: 'Security',
    pattern: /(api[_-]?key|secret|password|passwd|token|private[_-]?key)\s*[:=]\s*['"][^'"]{6,}['"]/i,
    message: 'Secrets in source leak through git history and bundles. Read them from the environment.',
  },
  {
    id: 'sql-concatenation',
    title: 'Query built by concatenation',
    severity: 'high',
    category: 'Security',
    pattern: /(SELECT|INSERT|UPDATE|DELETE)\b[^;]*(?:\+\s*[A-Za-z_$]|\$\{)/i,
    message: 'Concatenated queries allow injection. Use parameterised statements.',
  },
  {
    id: 'document-write',
    title: 'document.write()',
    severity: 'medium',
    category: 'Security',
    pattern: /document\.write(ln)?\s*\(/,
    message: 'document.write blocks parsing and can inject markup. Build a DOM node instead.',
  },
  {
    id: 'empty-catch',
    title: 'Silently swallowed error',
    severity: 'medium',
    category: 'Reliability',
    pattern: /catch\s*(\([^)]*\))?\s*\{\s*\}/,
    message: 'An empty catch hides failures. Log the error or rethrow it.',
  },
  {
    id: 'debugger',
    title: 'Debugger statement',
    severity: 'medium',
    category: 'Reliability',
    pattern: /(^|[^.\w$])debugger\s*;?/,
    message: 'Remove debugger statements before shipping.',
  },
  {
    id: 'loose-equality',
    title: 'Loose equality comparison',
    severity: 'medium',
    category: 'Correctness',
    pattern: /[^=!<>]==[^=]|!=[^=]/,
    message: 'Use === and !== so operands are not coerced.',
  },
  {
    id: 'var-declaration',
    title: 'Function-scoped var',
    severity: 'low',
    category: 'Style',
    pattern: /(^|[^.\w$])var\s+[A-Za-z_$]/,
    message: 'Prefer const or let for block scoping.',
  },
  {
    id: 'console-log',
    title: 'Debug logging left in code',
    severity: 'low',
    category: 'Style',
    pattern: /console\.(log|debug|trace)\s*\(/,
    message: 'Remove debugging output or route it through a logger.',
  },
  {
    id: 'todo-comment',
    title: 'Unresolved TODO',
    severity: 'low',
    category: 'Maintainability',
    pattern: /(TODO|FIXME|XXX|HACK)\b/,
    message: 'Track unfinished work in the issue tracker rather than a source comment.',
    allowInComments: true,
  },
];

function isCommentLine(line) {
  const trimmed = line.trim();
  return trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*');
}

export function runAudit(source) {
  const lines = source.split('\n');
  const findings = [];

  lines.forEach((line, index) => {
    if (!line.trim()) return;
    const comment = isCommentLine(line);

    for (const rule of RULES) {
      if (comment && !rule.allowInComments) continue;
      if (!rule.pattern.test(line)) continue;
      findings.push({
        id: `${rule.id}-${index}`,
        ruleId: rule.id,
        title: rule.title,
        severity: rule.severity,
        category: rule.category,
        message: rule.message,
        line: index + 1,
        snippet: line.trim().slice(0, 140),
      });
    }
  });

  const counts = { high: 0, medium: 0, low: 0 };
  let penalty = 0;
  for (const finding of findings) {
    counts[finding.severity] += 1;
    penalty += SEVERITY_WEIGHT[finding.severity];
  }

  const score = Math.max(0, 100 - penalty);

  return {
    findings,
    counts,
    score,
    grade: gradeFor(score),
    total: findings.length,
    lines: lines.length,
  };
}

function gradeFor(score) {
  if (score >= 90) return 'A';
  if (score >= 75) return 'B';
  if (score >= 60) return 'C';
  if (score >= 40) return 'D';
  return 'F';
}

export const SEVERITIES = ['high', 'medium', 'low'];
