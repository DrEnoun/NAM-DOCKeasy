/* eslint-disable */
/* InteractiveDecisionTree — answer the questions, get a live recommendation.
 *
 * Each question is rendered with selectable options. As soon as ALL questions
 * have an answer, a recommendation card fades in below — showing the engine
 * to pick, phases to skip, phases to focus on, and a deep link into the
 * tutorial. Re-clicking any answer updates the recommendation in real time.
 *
 * The recommendation logic is pure: takes the answer object → returns a
 * structured plan. Easy to extend by adding entries to RECO_RULES below.
 */
const { useState: useStateDT, useMemo: useMemoDT } = React;

/* ---------- recommendation logic ---------- */
function buildRecommendation(answers) {
  // answers is { q0: 0|1, q1: 0|1|2, q2: 0|1 } — index into options
  if (Object.keys(answers).length < 3) return null;

  const site   = answers.q0;   // 0 = known, 1 = unknown
  const flex   = answers.q1;   // 0 = rigid, 1 = sidechain, 2 = large
  const system = answers.q2;   // 0 = small-mol, 1 = protein-protein

  let engine, engineNote;
  if (system === 1) {
    engine = 'HADDOCK 2.4';
    engineNote = 'protein–protein system';
  } else if (flex === 2) {
    engine = 'Ensemble docking · Vina against MD frames';
    engineNote = 'large conformational change expected';
  } else if (flex === 1) {
    engine = 'AutoDock 4 with flexible side chains';
    engineNote = 'side-chain flexibility expected';
  } else {
    engine = 'AutoDock Vina (rigid)';
    engineNote = 'rigid receptor';
  }

  // Build phase plan
  const skip = [];
  const focus = [];
  const startAt = { id: 'phA', label: 'Phase A · Receptor preparation' };

  if (site === 0) {
    skip.push({ id: 'phC', text: 'Phase C · Site identification' });
    focus.push({ id: 'phD', text: 'Phase D · tight grid around the known site' });
  } else {
    focus.push({ id: 'phC', text: 'Phase C · blind dock + cavity prediction first' });
  }

  if (system === 1) {
    skip.push({ id: 'phD', text: 'Phase D · grid box (HADDOCK uses restraints, not grids)' });
    skip.push({ id: 'phE', text: 'Phase E · skip Vina/AD4 — use HADDOCK web server' });
  } else {
    focus.push({ id: 'phE', text: 'Phase E · ' + engine });
  }

  if (flex === 2) {
    focus.push({ id: 'phI', text: 'Phase I · MD frames feed back into ensemble Phase E' });
  }
  focus.push({ id: 'phH', text: 'Phase H · always redock the co-crystal ligand' });

  // Headline
  const headline = (
    site === 0 && flex === 0 && system === 0
      ? 'Standard rigid targeted docking — the simplest path.'
      : site === 1 && system === 0
      ? 'Blind-then-targeted protocol — site discovery first.'
      : system === 1
      ? 'Protein–protein workflow — different engine, fewer phases.'
      : flex === 2
      ? 'Ensemble docking — heaviest path, most accurate.'
      : 'Flexible-receptor docking — adds side-chain freedom.'
  );

  return { engine, engineNote, skip, focus, headline, startAt };
}

/* ---------- inner option button ---------- */
function DTOption({ active, label, body, onClick }) {
  return (
    <button className={"idt-option" + (active ? ' active' : '')} onClick={onClick}>
      <span className="idt-arrow">{active ? '✓' : '→'}</span>
      <span className="idt-opt-text">
        <span className="idt-opt-label">{label}</span>
        <span className="idt-opt-body">{body}</span>
      </span>
    </button>
  );
}

/* ---------- main ---------- */
function InteractiveDecisionTree({ onNavigate }) {
  const D = window.DOCKEASY;
  const QS = D.DECISION_TREE.questions;
  const [answers, setAnswers] = useStateDT({});

  const reco = useMemoDT(() => buildRecommendation(answers), [answers]);
  const complete = Object.keys(answers).length === QS.length;

  function answer(qi, oi) {
    setAnswers(a => ({ ...a, ['q' + qi]: oi }));
  }
  function reset() { setAnswers({}); }

  return (
    <div className="idt">
      <div className="idt-head">
        <div className="dt-title">{D.DECISION_TREE.title}</div>
        <button className="idt-reset" onClick={reset} disabled={!Object.keys(answers).length}>↺ Reset</button>
      </div>

      {QS.map((q, qi) => {
        const ans = answers['q' + qi];
        const answered = ans !== undefined;
        return (
          <div className={"idt-question" + (answered ? ' answered' : '')} key={qi}>
            <div className="idt-q-row">
              <div className="idt-q-num">Q{qi + 1}</div>
              <div className="idt-q-text">{q.q}</div>
            </div>
            <div className="idt-options">
              {q.options.map((opt, oi) => (
                <DTOption key={oi}
                          active={ans === oi}
                          label={opt.label}
                          body={opt.body}
                          onClick={() => answer(qi, oi)} />
              ))}
            </div>
          </div>
        );
      })}

      {/* progress */}
      <div className="idt-progress">
        <div className="idt-progress-bar" style={{ width: (Object.keys(answers).length / QS.length * 100) + '%' }} />
        <div className="idt-progress-label">
          {complete ? 'All answered — see your plan below' : `${Object.keys(answers).length} of ${QS.length} answered`}
        </div>
      </div>

      {/* live recommendation card */}
      <div className={"idt-reco" + (complete ? ' visible' : '')}>
        {complete && reco ? (
          <>
            <div className="idt-reco-eyebrow">Your plan</div>
            <div className="idt-reco-headline">{reco.headline}</div>
            <div className="idt-reco-grid">
              <div className="idt-reco-cell">
                <div className="idt-reco-label">Use this engine</div>
                <div className="idt-reco-engine">{reco.engine}</div>
                <div className="idt-reco-engine-note">because · {reco.engineNote}</div>
              </div>
              <div className="idt-reco-cell">
                <div className="idt-reco-label">Focus on</div>
                <div className="idt-chips">
                  {reco.focus.map(f => (
                    <button key={f.id} className="idt-chip idt-chip-focus" onClick={() => onNavigate && onNavigate(f.id)}>
                      {f.text}
                    </button>
                  ))}
                </div>
              </div>
              {reco.skip.length ? (
                <div className="idt-reco-cell">
                  <div className="idt-reco-label">You can skip</div>
                  <div className="idt-chips">
                    {reco.skip.map(s => (
                      <span key={s.id} className="idt-chip idt-chip-skip">{s.text}</span>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
            <button className="idt-cta" onClick={() => onNavigate && onNavigate(reco.startAt.id)}>
              Start at {reco.startAt.label} →
            </button>
          </>
        ) : (
          <div className="idt-reco-placeholder">
            <span style={{opacity:0.6, fontStyle:'italic'}}>Answer all three questions to see your recommended workflow.</span>
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { InteractiveDecisionTree });
