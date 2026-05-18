/* eslint-disable */
/* DecisionTreeModal — opens the InteractiveDecisionTree in an overlay.
 *
 * Use:
 *   <DecisionTreeButton onNavigate={fn} />
 *
 * The button renders a strong call-to-action. Click opens a centred modal
 * with the tree inside; ESC, backdrop click, and the × button all close it.
 * onNavigate (optional) is passed through to InteractiveDecisionTree so a
 * "Start at Phase A →" chip can deep-link into the tutorial. On the home
 * page (no tutorial loaded yet) we fall back to navigating to tutorial.html
 * with the target phase as a hash.
 */
const { useState: useStateDM, useEffect: useEffectDM } = React;

function DecisionTreeModal({ open, onClose, onNavigate }) {
  useEffectDM(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="dtm-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label="Decision tree">
      <div className="dtm-window" onClick={(e) => e.stopPropagation()}>
        <header className="dtm-head">
          <div>
            <div className="dtm-eyebrow">Quick start</div>
            <h2 className="dtm-title">Find your docking workflow</h2>
            <p className="dtm-sub">Answer three short questions — see your engine choice, the phases to focus on, and the ones you can skip.</p>
          </div>
          <button className="dtm-close" onClick={onClose} aria-label="Close decision tree">×</button>
        </header>
        <div className="dtm-body">
          <InteractiveDecisionTree onNavigate={onNavigate} />
        </div>
      </div>
    </div>
  );
}

/* CTA button — adapts size via the `size` prop ('hero' or 'inline'). */
function DecisionTreeButton({ onNavigate, size = 'hero', label }) {
  const [open, setOpen] = useStateDM(false);
  const buttonLabel = label || (size === 'hero'
    ? "Open the decision tree"
    : "Open decision tree");
  return (
    <>
      <button className={"dtm-trigger dtm-trigger-" + size} onClick={() => setOpen(true)}>
        <span className="dtm-trigger-icon" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="5" r="2.5"/>
            <circle cx="5" cy="19" r="2.5"/>
            <circle cx="19" cy="19" r="2.5"/>
            <path d="M12 7.5v3.5M12 11l-7 5.5M12 11l7 5.5"/>
          </svg>
        </span>
        <span className="dtm-trigger-text">
          <span className="dtm-trigger-label">{buttonLabel}</span>
          {size === 'hero' ? <span className="dtm-trigger-sub">3 questions · ~30 seconds · see your phase plan</span> : null}
        </span>
        <span className="dtm-trigger-arrow" aria-hidden="true">→</span>
      </button>
      <DecisionTreeModal open={open} onClose={() => setOpen(false)} onNavigate={(id) => {
        setOpen(false);
        if (onNavigate) onNavigate(id);
      }} />
    </>
  );
}

Object.assign(window, { DecisionTreeModal, DecisionTreeButton });
