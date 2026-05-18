/* eslint-disable */
/* DockVsMdMatrix — comparison table answering "when should I run MD
 * after docking, and what does it add?" */
const ROWS = [
  { metric: 'What it tells you',
    dock: { tone: 'good', text: 'Where the ligand sits.' },
    md:   { tone: 'good', text: 'Whether it stays there.' } },
  { metric: 'Timescale modelled',
    dock: { tone: 'warn', text: 'None — single static snapshot.' },
    md:   { tone: 'good', text: '100–200 ns of physical dynamics.' } },
  { metric: 'Receptor flexibility',
    dock: { tone: 'warn', text: 'Rigid (Vina) or limited side chains (AD4).' },
    md:   { tone: 'good', text: 'Fully flexible — induced fit captured.' } },
  { metric: 'Solvent',
    dock: { tone: 'warn', text: 'Implicit; no explicit waters.' },
    md:   { tone: 'good', text: 'Explicit TIP3P / SPC — water bridges visible.' } },
  { metric: 'Compute cost',
    dock: { tone: 'good', text: 'Minutes per ligand on a laptop.' },
    md:   { tone: 'warn', text: 'Hours to days per system on a GPU.' } },
  { metric: 'Use it when',
    dock: { tone: 'good', text: 'Initial pose hypothesis, virtual screening.' },
    md:   { tone: 'good', text: 'Validating one or two best poses for publication.' } },
];

function DockVsMdMatrix() {
  return (
    <table className="compare-matrix">
      <thead>
        <tr>
          <th>Aspect</th>
          <th>Docking</th>
          <th>Molecular dynamics</th>
        </tr>
      </thead>
      <tbody>
        {ROWS.map((r, i) => (
          <tr key={i}>
            <td className="row-label">{r.metric}</td>
            <td className={"cell-" + r.dock.tone}>{r.dock.text}</td>
            <td className={"cell-" + r.md.tone}>{r.md.text}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
Object.assign(window, { DockVsMdMatrix });
