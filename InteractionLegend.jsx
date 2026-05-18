/* eslint-disable */
/* InteractionLegend — visual key for PLIP / Discovery Studio interaction
 * line styles. Each card shows the colour-coded line, the name, the
 * typical distance range, and a one-line description. */
const INTXNS = [
  { cls: 'intxn-hbond',     name: 'Hydrogen bond',      dist: '2.5–3.5 Å',  body: 'Directional donor–acceptor contact. The dominant specific interaction.' },
  { cls: 'intxn-hydroph',   name: 'Hydrophobic',        dist: '3.5–4.5 Å',  body: 'Non-polar contacts between aliphatic / aromatic carbons. Diffuse.' },
  { cls: 'intxn-pi-stack',  name: 'π-stacking',         dist: '3.3–5.0 Å',  body: 'Face-to-face or T-shaped stacking between aromatic rings.' },
  { cls: 'intxn-pi-cation', name: 'π-cation',           dist: '< 6.0 Å',    body: 'Aromatic ring interacting with a positively-charged side chain.' },
  { cls: 'intxn-salt',      name: 'Salt bridge',        dist: '< 5.5 Å',    body: 'Electrostatic contact between oppositely-charged groups.' },
  { cls: 'intxn-halogen',   name: 'Halogen bond',       dist: '3.0–4.0 Å',  body: 'σ-hole-driven contact from a halogen (Cl, Br, I) to an acceptor.' },
];

function InteractionLegend() {
  return (
    <div className="intxn-legend">
      {INTXNS.map(x => (
        <div className="intxn-card" key={x.name}>
          <div className="intxn-row">
            <div className={"intxn-swatch " + x.cls} />
            <div>
              <div className="intxn-name">{x.name}</div>
              <div className="intxn-meta">{x.dist}</div>
            </div>
          </div>
          <p>{x.body}</p>
        </div>
      ))}
    </div>
  );
}
Object.assign(window, { InteractionLegend });
