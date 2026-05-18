/* eslint-disable */
/* Shared Sidebar — auto-builds nav from window.DOCKEASY.PHASES.
 * Reusable across tutorial / glossary / quickref / references. */
function Sidebar({ activeId, onNavigate, currentPage, open, onDismiss }) {
  const D = window.DOCKEASY;
  const groups = [];

  // Top-level pages
  groups.push({ label: 'NAM-DOCKeasy', items: [
    { id: 'home',     text: 'Home',         href: 'index.html' },
    { id: 'tutorial', text: 'Tutorial',     href: 'tutorial.html' },
    { id: 'case-study', text: 'Case study · Capsaicin → TRPV1', href: 'case-study.html' },
    { id: 'quickref', text: 'Quick reference', href: 'quickref.html' },
    { id: 'glossary', text: 'Glossary',     href: 'glossary.html' },
    { id: 'references', text: 'References', href: 'references.html' },
  ]});

  // Only show phase nav on the tutorial page
  if (currentPage === 'tutorial') {
    groups.push({ label: 'Decide first', items: [
      { id: 'decision', text: 'Decision tree', anchor: true },
    ]});
    D.PHASES.forEach(p => {
      groups.push({
        label: p.eyebrow,
        items: [{ id: p.id, text: p.title, anchor: true }],
      });
    });
  }

  /* Sister project — always visible at the bottom of the nav. */
  if (D.BRAND && D.BRAND.npeasy) {
    groups.push({ label: 'Sister project', items: [
      { id: 'npeasy-link', text: 'NAM-NPeasy ↗', href: D.BRAND.npeasy.pages_url, external: true },
    ]});
  }

  return (
    <>
      {open ? <div className="overlay active" onClick={onDismiss} /> : null}
      <nav className={"sidebar" + (open ? " open" : "")}>
        <div className="sidebar-logo">
          <div className="logo-title">{D.BRAND.prefix}<em style={{fontStyle:'italic',color:'var(--de-accent)'}}>{D.BRAND.wordmark}</em></div>
          <div className="logo-sub">Molecular Docking Tutorial</div>
        </div>
        {groups.map((group, gi) => (
          <div className="nav-group" key={gi}>
            <div className="nav-group-label">{group.label}</div>
            {group.items.map(it => {
              const isActive = activeId === it.id || (currentPage === it.id);
              const props = it.anchor
                ? { href: '#' + it.id, onClick: e => { e.preventDefault(); onNavigate && onNavigate(it.id); } }
                : it.external
                ? { href: it.href, target: '_blank', rel: 'noopener noreferrer' }
                : { href: it.href };
              return (
                <a key={it.id} className={"nav-item" + (isActive ? " active" : "")} {...props}>
                  <span className="nav-dot" />
                  {it.text}
                </a>
              );
            })}
          </div>
        ))}
      </nav>
    </>
  );
}
Object.assign(window, { Sidebar });
