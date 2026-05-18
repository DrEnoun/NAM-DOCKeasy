/* eslint-disable */
/* InteractiveDecisionTree — step-by-step wizard.
 *
 * Shows one question at a time. Clicking an option auto-advances to the next
 * question with a soft slide transition. After the last question, the
 * recommendation card animates in showing engine + phase plan.
 *
 * Behaviour:
 *   - Progress dots at the top reflect step state (current / answered / pending).
 *   - "Back" button steps backwards through answered questions; current answer
 *     is preserved so users can change their mind without restarting.
 *   - "Start over" resets everything from the recommendation screen.
 *   - onNavigate(id) is invoked when the user clicks a focus chip or the final
 *     "Start at Phase A →" call to action.
 */
const { useState: useStateDT, useMemo: useMemoDT, useEffect: useEffectDT } = React;

/* ---------- recommendation logic (unchanged) ---------- */
function buildRecommendation(answers) {
  if (Object.keys(answers).length < 3) return null;
  const site   = answers.q0;
  const flex   = answers.q1;
  const system = answers.q2;

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

/* ---------- option button ---------- */
function DTOption({ active, label, body, onClick, hotkey }) {
  return (
    <button className={"idtw-option" + (active ? ' active' : '')} onClick={onClick}>
      {hotkey ? <span className="idtw-hotkey" aria-hidden="true">{hotkey}</span> : null}
      <span className="idtw-opt-text">
        <span className="idtw-opt-label">{label}</span>
        <span className="idtw-opt-body">{body}</span>
      </span>
      <span className="idtw-opt-arrow" aria-hidden="true">{active ? '✓' : '→'}</span>
    </button>
  );
}

/* ---------- main ---------- */
function InteractiveDecisionTree({ onNavigate }) {
  const D = window.DOCKEASY;
  const QS = D.DECISION_TREE.questions;

  const [answers, setAnswers] = useStateDT({});
  const [step, setStep] = useStateDT(0);          // 0..QS.length → recommendation
  const [direction, setDirection] = useStateDT('forward');

  const reco = useMemoDT(() => buildRecommendation(answers), [answers]);
  const onReco = step >= QS.length;

  /* Keyboard: 1 / 2 / 3 picks options, Backspace goes back */
  useEffectDT(() => {
    function key(e) {
      if (onReco) return;
      const q = QS[step];
      if (!q) return;
      if (e.key === 'Backspace' && step > 0) { goBack(); }
      const n = parseInt(e.key, 10);
      if (!Number.isNaN(n) && n >= 1 && n <= q.options.length) {
        pickAnswer(step, n - 1);
      }
    }
    document.addEventListener('keydown', key);
    return () => document.removeEventListener('keydown', key);
  });

  function pickAnswer(qi, oi) {
    setAnswers(a => ({ ...a, ['q' + qi]: oi }));
    setDirection('forward');
    /* Small delay so the active-state animation is visible before advance */
    setTimeout(() => setStep(qi + 1), 220);
  }
  function goBack() {
    if (step <= 0) return;
    setDirection('back');
    setStep(s => s - 1);
  }
  function reset() {
    setAnswers({});
    setStep(0);
    setDirection('forward');
  }

  return (
    <div className="idtw">
      {/* Progress dots */}
      <div className="idtw-progress">
        {QS.map((q, i) => {
          const state = i < step ? 'done' : (i === step && !onReco) ? 'current' : 'pending';
          return (
            <button
              key={i}
              className={"idtw-dot idtw-dot-" + state}
              onClick={() => {
                if (state !== 'pending') {
                  setDirection(i < step ? 'back' : 'forward');
                  setStep(i);
                }
              }}
              disabled={state === 'pending' && Object.keys(answers).length < i}
              aria-label={`Question ${i + 1}`}>
              <span className="idtw-dot-num">{i + 1}</span>
            </button>
          );
        })}
        <div className="idtw-dot-rail" />
        <div className="idtw-dot-rail-fill" style={{ width: onReco ? '100%' : (step / QS.length * 100) + '%' }} />
      </div>

      {/* Stage — question or recommendation */}
      <div className={"idtw-stage idtw-dir-" + direction} key={onReco ? 'reco' : 'q-' + step}>
        {!onReco ? (
          <div className="idtw-question">
            <div className="idtw-q-meta">
              <span className="idtw-q-counter">Question {step + 1} of {QS.length}</span>
              {step > 0 ? <button className="idtw-back" onClick={goBack}>← Back</button> : null}
            </div>
            <h3 className="idtw-q-text">{QS[step].q}</h3>
            <div className="idtw-options">
              {QS[step].options.map((opt, oi) => (
                <DTOption
                  key={oi}
                  active={answers['q' + step] === oi}
                  label={opt.label}
                  body={opt.body}
                  onClick={() => pickAnswer(step, oi)}
                  hotkey={oi + 1} />
              ))}
            </div>
            <div className="idtw-hint">Pick an option to continue · press <kbd>1</kbd>{QS[step].options.length > 1 ? <>–<kbd>{QS[step].options.length}</kbd></> : null} on your keyboard</div>
          </div>
        ) : reco ? (
          <div className="idtw-reco-card">
            <div className="idtw-reco-eyebrow">Your tailored plan</div>
            <div className="idtw-reco-headline">{reco.headline}</div>
            <div className="idtw-reco-grid">
              <div className="idtw-reco-cell">
                <div className="idtw-reco-label">Use this engine</div>
                <div className="idtw-reco-engine">{reco.engine}</div>
                <div className="idtw-reco-engine-note">because · {reco.engineNote}</div>
              </div>
              <div className="idtw-reco-cell">
                <div className="idtw-reco-label">Focus on</div>
                <div className="idtw-chips">
                  {reco.focus.map(f => (
                    <button key={f.id} className="idtw-chip idtw-chip-focus" onClick={() => onNavigate && onNavigate(f.id)}>
                      {f.text}
                    </button>
                  ))}
                </div>
              </div>
              {reco.skip.length ? (
                <div className="idtw-reco-cell">
                  <div className="idtw-reco-label">You can skip</div>
                  <div className="idtw-chips">
                    {reco.skip.map(s => (
                      <span key={s.id} className="idtw-chip idtw-chip-skip">{s.text}</span>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
            <div className="idtw-reco-actions">
              <button className="idtw-cta" onClick={() => onNavigate && onNavigate(reco.startAt.id)}>
                Start at {reco.startAt.label} →
              </button>
              <button className="idtw-secondary" onClick={reset}>↺ Start over</button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

Object.assign(window, { InteractiveDecisionTree });
