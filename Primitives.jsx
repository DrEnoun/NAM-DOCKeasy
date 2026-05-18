/* eslint-disable */
/* Decision tree, callouts, tool badges, threshold table — same vocabulary
 * as NAM-NPeasy, kept in one shared file. */

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
    return <div className={"callout callout-" + kind} dangerouslySetInnerHTML={{__html: children}} />;
  }
  return <div className={"callout callout-" + kind}>{children}</div>;
}

function ToolBadges({ tools }) {
  if (!tools || !tools.length) return null;
  return (
    <div className="tools-row">
      {tools.map((t, i) => <span key={i} className={"tool-badge tb-" + t.tone}>{t.label}</span>)}
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
          <span className="prot-text" dangerouslySetInnerHTML={{__html: p}} />
        </li>
      ))}
    </ul>
  );
}

Object.assign(window, { DecisionTree, Callout, ToolBadges, ProtocolList });
