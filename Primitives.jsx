/* eslint-disable */
/* Decision tree, callouts, tool badges, threshold table — same vocabulary
 * as NAM-NPeasy, kept in one shared file. */

/* Build a single regex that matches any known tool/DB name, longest first
 * so "AutoDock Vina" wins over "Vina". Used by linkifyHtml(). */
const TOOL_URL_KEYS = (window.DOCKEASY && window.DOCKEASY.TOOL_URLS)
  ? Object.keys(window.DOCKEASY.TOOL_URLS).sort((a, b) => b.length - a.length)
  : [];
const TOOL_RE = TOOL_URL_KEYS.length
  ? new RegExp('\\b(' + TOOL_URL_KEYS.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')\\b', 'g')
  : null;

/* Find tool/DB names in an HTML string and wrap them in anchor tags.
 * Skips matches already inside <a>...</a> or inside <span class="code"> blocks. */
function linkifyHtml(html) {
  if (!html || !TOOL_RE) return html;
  /* Split by tags so we never inject into existing anchors / code spans. */
  const PROTECT_RE = /<a\b[\s\S]*?<\/a>|<span class="code"[\s\S]*?<\/span>|<code[\s\S]*?<\/code>/gi;
  const protected_chunks = [];
  let prepared = html.replace(PROTECT_RE, m => {
    protected_chunks.push(m);
    return `\u0000${protected_chunks.length - 1}\u0000`;
  });

  prepared = prepared.replace(TOOL_RE, (match) => {
    const url = window.DOCKEASY.TOOL_URLS[match] || window.DOCKEASY.TOOL_URLS[match.replace(/\s+/g, ' ')];
    if (!url) return match;
    return `<a class="tool-link" href="${url}" target="_blank" rel="noopener noreferrer">${match}</a>`;
  });

  /* Restore protected chunks */
  prepared = prepared.replace(/\u0000(\d+)\u0000/g, (_, i) => protected_chunks[Number(i)]);
  return prepared;
}

function DecisionTree({ title, questions }) {
  return (
    <div className="decision-tree">
      <div className="dt-title">{title}</div>
      {questions.map((q, i) => (
        <div className="dt-question" key={i}>
          <div className="dt-q-text">{q.q}</div>
          <div className="dt-options">
            {q.options.map((opt, oi) => (
              <div className="dt-option" key={oi}>
                <span className="dt-arrow">→</span>
                <span><span className="dt-result">{opt.label}</span> · {opt.body}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function Callout({ kind = 'blue', children }) {
  if (typeof children === 'string') {
    return <div className={"callout callout-" + kind} dangerouslySetInnerHTML={{__html: linkifyHtml(children)}} />;
  }
  return <div className={"callout callout-" + kind}>{children}</div>;
}

function ToolBadges({ tools }) {
  if (!tools || !tools.length) return null;
  const URLS = (window.DOCKEASY && window.DOCKEASY.TOOL_URLS) || {};
  return (
    <div className="tools-row">
      {tools.map((t, i) => {
        const url = URLS[t.label];
        const cls = "tool-badge tb-" + t.tone;
        if (url) {
          return (
            <a key={i} className={cls + " tool-badge-link"}
               href={url} target="_blank" rel="noopener noreferrer"
               title={"Open " + t.label + " in a new tab"}>
              {t.label}
              <span className="tool-badge-arrow" aria-hidden="true">↗</span>
            </a>
          );
        }
        return <span key={i} className={cls}>{t.label}</span>;
      })}
    </div>
  );
}

function ProtocolList({ items }) {
  if (!items || !items.length) return null;
  return (
    <ul className="protocol-list">
      {items.map((p, i) => (
        <li key={i}>
          <span className="prot-num">{String(i+1).padStart(2,'0')}</span>
          <span className="prot-text" dangerouslySetInnerHTML={{__html: linkifyHtml(p)}} />
        </li>
      ))}
    </ul>
  );
}

Object.assign(window, { DecisionTree, Callout, ToolBadges, ProtocolList, linkifyHtml });
