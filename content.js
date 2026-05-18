/* ===============================================================
 * NAM-DockEasy — single source of truth for tutorial content.
 * Edit this file to add/remove/reword phases and steps. Everything
 * in the PWA (tutorial, quick ref, glossary, citations, slides,
 * printable card) renders from this object.
 *
 * Structure:
 *   BRAND           — wordmark, tagline, hero pills
 *   DECISION_TREE   — the 3 branching questions before Phase A
 *   PHASES          — 9 ordered phases. Each has:
 *     id, letter, hue, title, when, desc, steps[]
 *   STEPS shape:
 *     num, title, sub, protocol[], tools[], callouts[], extras{}
 *   GLOSSARY        — flat A→Z term list
 *   CITATIONS       — numbered reference list
 *   QUICK_REF       — printable card sections
 *
 * Hues are: sage / sky / gold / teal / coral / lilac — match the
 * NAM-NPeasy phase palette so the families share vocabulary.
 * =============================================================== */

window.DOCKEASY = {

BRAND: {
  prefix: 'NAM-',
  wordmark: 'DockEasy',
  tagline: 'Molecular Docking Basic Tutorial for Novice',
  star: '✦ From structure to binding — one pose at a time ✦',
  description: 'A general-purpose, decision-tree-guided protocol for structure-based molecular docking. Covers receptor prep, ligand prep, grid setup, docking with Vina / AutoDock4 / SwissDock / HADDOCK / AMDock, post-docking analysis, and validation. Designed as a reusable core framework.',
  version: 'Core Framework · Version 1.0',
  pills: ['9 Phases', '24 Steps', 'Vina · AD4 · AMDock · HADDOCK', 'Free + Commercial tools', 'Decision Trees Included'],
},

DECISION_TREE: {
  title: 'Which docking workflow applies?',
  questions: [
    {
      q: 'Is your binding site known from a co-crystal structure or literature?',
      options: [
        { label: 'Yes — known site', body: 'Use targeted docking with a small grid around the residue cluster. Go to Phase D.' },
        { label: 'No — site unknown', body: 'Run blind docking first (whole-protein grid), then refine. Add Phase C: Site Identification.' },
      ],
    },
    {
      q: 'How flexible is your receptor?',
      options: [
        { label: 'Rigid / minimal motion', body: 'Standard rigid docking with AutoDock Vina is sufficient.' },
        { label: 'Side-chain flexibility expected', body: 'Use AutoDock Vina with flexible residues, or AutoDock4 with explicit flex sidechains.' },
        { label: 'Large conformational change', body: 'Run ensemble docking against multiple receptor conformations from MD or NMR.' },
      ],
    },
    {
      q: 'Is this a protein–protein or protein–small-molecule study?',
      options: [
        { label: 'Protein–small-molecule', body: 'Vina / AutoDock4 / AMDock — continue with this protocol.' },
        { label: 'Protein–protein or protein–peptide', body: 'Switch to HADDOCK (data-driven) or ClusPro. Some phases here will not apply.' },
      ],
    },
  ],
},

PHASES: [

/* ────────────────────────────────────────────────────────────── */
{
  id: 'phA', letter: 'A', hue: 'sage',
  title: 'Receptor preparation',
  when: 'When · before any docking run',
  eyebrow: 'Phase A — Receptor',
  desc: 'Pull the target structure, strip co-crystallised waters and ligands you do not want, add hydrogens, assign charges, and save in the docking program\'s native format. Garbage in, garbage out — invest the time.',
  steps: [
    {
      num: 1,
      title: 'Retrieve the structure',
      sub: 'From PDB, AlphaFold DB, or homology model',
      protocol: [
        '<strong>PDB</strong> · prefer X-ray ≤ 2.5 Å resolution with a co-crystallised ligand similar to yours.',
        '<strong>AlphaFold</strong> · acceptable for novel targets; check pLDDT scores in the binding pocket region.',
        '<strong>Homology model</strong> · only when neither of the above exists; document template and sequence identity.',
      ],
      tools: [{ tone: 'a', label: 'RCSB PDB' }, { tone: 'a', label: 'AlphaFold DB' }, { tone: 'ref', label: 'SWISS-MODEL' }],
      callouts: [
        { kind: 'blue', body: '<strong>Tip.</strong> Always record the PDB ID, resolution, R-free, and any mutations. Reviewers ask.' },
      ],
    },
    {
      num: 2,
      title: 'Clean the structure',
      sub: 'Remove waters, ions, ligands, and alternate conformers',
      protocol: [
        '<strong>Strip waters</strong> unless a water is structurally bridging your ligand pose (rare; document if kept).',
        '<strong>Remove crystallographic additives</strong> — PEG, SO₄, glycerol — unless biologically relevant.',
        '<strong>Resolve alt-confs</strong> · keep the conformer with the highest occupancy.',
      ],
      tools: [{ tone: 'a', label: 'PyMOL' }, { tone: 'a', label: 'Chimera' }, { tone: 'ref', label: 'PDB Tools' }],
    },
    {
      num: 3,
      title: 'Add hydrogens & assign charges',
      sub: 'Polar H only for Vina; all H for AD4; assign Gasteiger or AMBER charges',
      protocol: [
        '<strong>AutoDock Vina</strong> · add polar hydrogens only via AutoDock Tools or Open Babel.',
        '<strong>AutoDock4</strong> · add all hydrogens and assign Gasteiger charges.',
        '<strong>HADDOCK</strong> · OPLS or AMBER topology; the web server handles this automatically.',
      ],
      tools: [{ tone: 'a', label: 'AutoDock Tools' }, { tone: 'ref', label: 'Open Babel' }, { tone: 'ref', label: 'PDB2PQR' }],
      callouts: [{ kind: 'amber', body: '<strong>Caution.</strong> Histidine protonation matters. Decide between HIE, HID, or HIP based on pH and microenvironment — don\'t accept defaults blindly.' }],
    },
    {
      num: 4,
      title: 'Save as receptor format',
      sub: 'PDBQT for Vina/AD4 · PDB for HADDOCK · MOL2 for some viewers',
      protocol: [
        '<strong>Vina / AD4 / AMDock</strong> · export <span class="code">.pdbqt</span> via AutoDock Tools.',
        '<strong>HADDOCK</strong> · standard <span class="code">.pdb</span> with chain IDs intact.',
        '<strong>SwissDock</strong> · upload <span class="code">.pdb</span>; the server prepares the rest.',
      ],
      tools: [{ tone: 'a', label: 'AutoDock Tools' }],
    },
  ],
},

/* ────────────────────────────────────────────────────────────── */
{
  id: 'phB', letter: 'B', hue: 'sky',
  title: 'Ligand preparation',
  when: 'When · in parallel with receptor prep',
  eyebrow: 'Phase B — Ligand',
  desc: 'Build or download the small molecule, generate 3D conformations, assign protonation at the docking pH, and convert to the format your docking program expects.',
  steps: [
    {
      num: 1,
      title: 'Acquire 2D / 3D structure',
      sub: 'PubChem, ZINC, ChEMBL, or hand-drawn from SMILES',
      protocol: [
        '<strong>PubChem</strong> · download SDF (3D conformer) by CID.',
        '<strong>ZINC22</strong> · the largest free database of purchasable, lead-like ligands.',
        '<strong>SMILES → 3D</strong> · use Open Babel <span class="code">obabel -ismi in.smi -O out.sdf --gen3d</span> when no structure exists.',
      ],
      tools: [{ tone: 'b', label: 'PubChem' }, { tone: 'b', label: 'ZINC22' }, { tone: 'ref', label: 'ChEMBL' }],
    },
    {
      num: 2,
      title: 'Protonate at docking pH',
      sub: 'Usually pH 7.4 for physiological docking',
      protocol: [
        '<strong>Generate the dominant protonation state</strong> with OpenBabel or RDKit at pH 7.4.',
        '<strong>Inspect tautomers</strong> manually for compounds with multiple ionisable groups.',
      ],
      tools: [{ tone: 'b', label: 'Open Babel' }, { tone: 'ref', label: 'RDKit' }, { tone: 'ref', label: 'Marvin' }],
    },
    {
      num: 3,
      title: 'Convert to PDBQT (Vina / AD4)',
      sub: 'Define torsion tree and merge non-polar hydrogens',
      protocol: [
        'In AutoDock Tools · <em>Ligand → Input → Open</em> · then <em>Torsion Tree → Detect Root</em>.',
        'Merge non-polar Hs and save as <span class="code">.pdbqt</span>.',
        'For batch conversion, use Open Babel: <span class="code">obabel ligand.sdf -O ligand.pdbqt</span>.',
      ],
      tools: [{ tone: 'b', label: 'AutoDock Tools' }, { tone: 'b', label: 'Open Babel' }],
      callouts: [{ kind: 'blue', body: '<strong>Pro tip.</strong> Cap the number of active torsions at 8–10. More torsions explode the search space without improving accuracy.' }],
    },
  ],
},

/* ────────────────────────────────────────────────────────────── */
{
  id: 'phC', letter: 'C', hue: 'gold',
  title: 'Binding site identification',
  when: 'When · binding site unknown (skip if known from literature)',
  eyebrow: 'Phase C — Site ID',
  desc: 'If you don\'t already know where the ligand binds, predict the site computationally before running targeted docking. Skip this phase entirely if your reference structure has a co-crystallised ligand.',
  steps: [
    {
      num: 1,
      title: 'Predict cavities',
      sub: 'Pocket-detection algorithms — pick top 3 by druggability',
      protocol: [
        '<strong>CASTp</strong> · geometry-based pocket detection.',
        '<strong>FPocket</strong> · fast, command-line, scores by druggability.',
        '<strong>DoGSiteScorer</strong> · web-based; ranks pockets by drug-likeness.',
      ],
      tools: [{ tone: 'c', label: 'CASTp' }, { tone: 'c', label: 'FPocket' }, { tone: 'c', label: 'DoGSiteScorer' }],
    },
    {
      num: 2,
      title: 'Run a blind docking pass',
      sub: 'Vina with a grid covering the whole protein',
      protocol: [
        'Set the grid box to enclose the entire receptor.',
        'Run Vina with <span class="code">exhaustiveness = 32</span> for a coarse sweep.',
        'Cluster the top 20 poses; the dominant cluster centre is your candidate site.',
      ],
      tools: [{ tone: 'c', label: 'AutoDock Vina' }, { tone: 'c', label: 'AMDock' }],
      callouts: [{ kind: 'amber', body: '<strong>Caveat.</strong> Blind docking is exploratory, not definitive. Cross-check with at least one cavity predictor before committing to a site.' }],
    },
  ],
},

/* ────────────────────────────────────────────────────────────── */
{
  id: 'phD', letter: 'D', hue: 'teal',
  title: 'Grid box configuration',
  when: 'When · site is known or selected from Phase C',
  eyebrow: 'Phase D — Grid',
  desc: 'Define the search volume around the binding site. The grid centre and size dictate what conformations Vina or AD4 sample. Too small and you miss the pose; too large and you waste compute on irrelevant space.',
  steps: [
    {
      num: 1,
      title: 'Centre the grid on the binding site',
      sub: 'Use co-crystal ligand centroid or pocket centroid',
      protocol: [
        'In AutoDock Tools · <em>Grid → Grid Box</em> · drag the box to enclose your site.',
        'Record the centre coordinates (Cx, Cy, Cz) — you\'ll paste them into the Vina config file.',
      ],
      tools: [{ tone: 'd', label: 'AutoDock Tools' }, { tone: 'd', label: 'PyMOL' }],
      extras: { gridboxVisualizer: true },
    },
    {
      num: 2,
      title: 'Size the box',
      sub: 'Ligand longest dimension × 2.5 is a good rule of thumb',
      protocol: [
        'Measure the ligand\'s longest dimension in Å.',
        'Set <span class="code">size_x = size_y = size_z = 2.5 × longest_dim</span>.',
        'For Vina, keep total volume under ~30³ Å³ unless doing blind docking.',
      ],
      callouts: [
        { kind: 'navy', body: '<strong style="color:#fff;">Threshold.</strong> Default spacing is <span class="code">0.375 Å</span> for AD4 and <span class="code">1.0 Å</span> for Vina. Don\'t change unless you understand the consequence.' },
      ],
    },
  ],
},

/* ────────────────────────────────────────────────────────────── */
{
  id: 'phE', letter: 'E', hue: 'coral',
  title: 'Docking run',
  when: 'When · receptor, ligand, and grid are ready',
  eyebrow: 'Phase E — Dock',
  desc: 'Execute the docking. Pick the engine that matches your study (rigid vs flex, single-target vs ensemble, free vs commercial). Always run with the same seed and version that you intend to report.',
  steps: [
    {
      num: 1,
      title: 'Pick your docking engine',
      sub: 'Free → Vina · AD4 · AMDock · SwissDock · HADDOCK',
      protocol: [
        '<strong>AutoDock Vina 1.2+</strong> · default choice; fast, accurate, well-validated.',
        '<strong>AutoDock4</strong> · use when you need explicit flexible side chains.',
        '<strong>AMDock</strong> · graphical wrapper over Vina/AD4; great for batch jobs and beginners.',
        '<strong>SwissDock</strong> · web-based; no installation, easy for teaching.',
        '<strong>HADDOCK</strong> · data-driven docking for protein–protein or peptide systems.',
      ],
      tools: [
        { tone: 'g', label: 'AutoDock Vina' },
        { tone: 'g', label: 'AutoDock4' },
        { tone: 'g', label: 'AMDock' },
        { tone: 'g', label: 'SwissDock' },
        { tone: 'g', label: 'HADDOCK' },
        { tone: 'ref', label: 'Glide *' },
        { tone: 'ref', label: 'GOLD *' },
      ],
      callouts: [{ kind: 'purple', body: '<strong>* Commercial.</strong> Glide (Schrödinger) and GOLD (CCDC) are gold-standard but require institutional licenses. The free engines above are sufficient for most teaching and research use.' }],
    },
    {
      num: 2,
      title: 'Configure & run',
      sub: 'Set exhaustiveness, energy range, and number of modes',
      protocol: [
        '<strong>exhaustiveness</strong> · 8 for screening, 32+ for publication runs.',
        '<strong>num_modes</strong> · 9 (default) gives enough pose diversity for clustering.',
        '<strong>energy_range</strong> · keep poses within 3 kcal/mol of the best.',
      ],
      callouts: [{ kind: 'green', body: '<strong>Best practice.</strong> Set <span class="code">--seed</span> explicitly so runs are reproducible.' }],
    },
  ],
},

/* ────────────────────────────────────────────────────────────── */
{
  id: 'phF', letter: 'F', hue: 'gold',
  title: 'Post-docking analysis',
  when: 'When · docking finishes successfully',
  eyebrow: 'Phase F — Analyse',
  desc: 'Don\'t trust the top-scored pose blindly. Cluster, inspect, and rank. The cheapest pose by Vina score is not always the most plausible.',
  steps: [
    {
      num: 1,
      title: 'Cluster poses & rank',
      sub: 'RMSD-based clustering · take the cluster head, not the best score',
      protocol: [
        'Cluster all output poses with RMSD threshold of <span class="code">2.0 Å</span>.',
        'Sort clusters by size first, then by best energy within each cluster.',
        'The pose to report is the energy-best of the largest cluster.',
      ],
      extras: { poseRanker: true },
    },
    {
      num: 2,
      title: 'Visual sanity check',
      sub: 'Open in PyMOL · check buried surface, clashes, geometry',
      protocol: [
        'Load receptor + top pose in PyMOL.',
        'Inspect for steric clashes (any atom < 2.0 Å from receptor heavy atom).',
        'Confirm the ligand is fully inside the pocket — not docked into solvent.',
      ],
      tools: [{ tone: 'c', label: 'PyMOL' }, { tone: 'c', label: 'Chimera' }, { tone: 'ref', label: 'VMD' }],
      extras: { molPreview: true },
    },
  ],
},

/* ────────────────────────────────────────────────────────────── */
{
  id: 'phG', letter: 'G', hue: 'coral',
  title: 'Interaction analysis',
  when: 'When · top pose is selected',
  eyebrow: 'Phase G — Interactions',
  desc: 'Identify the specific contacts that explain why your ligand binds where it does. This is what makes the docking story publishable — a list of residues with named interaction types.',
  steps: [
    {
      num: 1,
      title: 'Detect interaction types',
      sub: 'H-bonds, π-stacking, hydrophobic, salt bridges, halogen bonds',
      protocol: [
        '<strong>PLIP</strong> · web or CLI; outputs a complete annotated interaction table.',
        '<strong>Discovery Studio Visualizer</strong> · free; pretty 2D interaction diagrams.',
        '<strong>LigPlot+</strong> · classic schematic for publication figures.',
      ],
      tools: [{ tone: 'g', label: 'PLIP' }, { tone: 'g', label: 'Discovery Studio' }, { tone: 'ref', label: 'LigPlot+' }],
      extras: { interactionLegend: true },
    },
    {
      num: 2,
      title: 'Compare against the literature',
      sub: 'Which contacts match known SAR? Which are novel?',
      protocol: [
        'Compile a residue–contact table from your pose.',
        'Cross-check against published SAR or co-crystal structures of similar ligands.',
        'Note novel contacts — these are your hypotheses for the wet-lab validation.',
      ],
    },
  ],
},

/* ────────────────────────────────────────────────────────────── */
{
  id: 'phH', letter: 'H', hue: 'lilac',
  title: 'Validation & rescoring',
  when: 'When · you have a working pose to defend',
  eyebrow: 'Phase H — Validate',
  desc: 'Redock the co-crystallised ligand to confirm your protocol reproduces the crystal pose, then optionally rescore with an independent scoring function. This is the single most important step for reviewer trust.',
  steps: [
    {
      num: 1,
      title: 'Re-dock the co-crystal ligand',
      sub: 'RMSD against the crystal pose must be < 2.0 Å',
      protocol: [
        'Extract the co-crystallised ligand and dock it back with your exact protocol.',
        'Compute RMSD of the best-scoring pose against the crystallographic pose.',
        '<span class="code">RMSD &lt; 2.0 Å</span> is the standard passing threshold.',
      ],
      callouts: [{ kind: 'red', body: '<strong>If RMSD &gt; 2.0 Å.</strong> Your protocol is not reproducing the crystal pose — re-examine grid centre, exhaustiveness, and protonation states before trusting any new docking result.' }],
    },
    {
      num: 2,
      title: 'Rescore with an independent function',
      sub: 'Smina, GBSA, or MM-PBSA',
      protocol: [
        '<strong>Smina</strong> · drop-in Vina-compatible binary with multiple scoring functions.',
        '<strong>MM-GBSA / MM-PBSA</strong> · run on a short MD trajectory of the docked complex.',
      ],
      tools: [{ tone: 'h', label: 'Smina' }, { tone: 'h', label: 'MM-PBSA.py' }, { tone: 'ref', label: 'gmx_MMPBSA' }],
    },
  ],
},

/* ────────────────────────────────────────────────────────────── */
{
  id: 'phI', letter: 'I', hue: 'sage',
  title: 'MD follow-up & wet-lab handoff',
  when: 'When · the pose is validated and worth defending',
  eyebrow: 'Phase I — Handoff',
  desc: 'Docking gives you a static snapshot. MD adds dynamics and confidence. Wet-lab assays confirm reality. End every docking project with a clear handoff plan.',
  steps: [
    {
      num: 1,
      title: 'Run molecular dynamics on the complex',
      sub: 'Confirm pose stability over 100–200 ns',
      protocol: [
        'Solvate the complex, neutralise, equilibrate (NVT then NPT).',
        'Run production MD for at least 100 ns; 200 ns for membrane systems.',
        'Compute RMSD/RMSF; the ligand RMSD plateau confirms a stable pose.',
      ],
      tools: [{ tone: 'a', label: 'GROMACS' }, { tone: 'a', label: 'AMBER' }, { tone: 'ref', label: 'NAMD' }],
      extras: { dockVsMd: true },
    },
    {
      num: 2,
      title: 'Plan wet-lab validation',
      sub: 'In vitro binding, mutagenesis, or activity assay',
      protocol: [
        '<strong>SPR / ITC / MST</strong> · quantitative binding constants.',
        '<strong>Mutagenesis</strong> · mutate predicted contact residues; expect binding loss.',
        '<strong>Activity assay</strong> · enzyme inhibition, cellular phenotype, etc.',
      ],
    },
  ],
},

],  /* end PHASES */

/* ============================================================ */
GLOSSARY: [
  { term: 'Binding affinity', def: 'Strength of the ligand–receptor interaction, usually expressed in kcal/mol (more negative = stronger). Vina reports this as the docking score.' },
  { term: 'Blind docking', def: 'Docking with the grid box covering the entire receptor — used when the binding site is unknown.' },
  { term: 'Conformer', def: 'One specific 3D arrangement of a flexible molecule. A ligand may have many conformers.' },
  { term: 'Ensemble docking', def: 'Docking against multiple receptor conformations (from MD, NMR, or alternative crystal structures) to account for protein flexibility.' },
  { term: 'Exhaustiveness', def: 'Vina parameter controlling search thoroughness. Higher = slower but more reliable. 8 for screening, 32+ for publication.' },
  { term: 'Flexible docking', def: 'Docking where specified receptor side chains are allowed to move during the search. More accurate but slower.' },
  { term: 'Gasteiger charge', def: 'Partial atomic charges computed by the Gasteiger–Marsili method. Standard for AutoDock-family programs.' },
  { term: 'Grid box', def: 'The 3D volume around the binding site within which docking poses are searched. Defined by a centre and box size.' },
  { term: 'H-bond', def: 'Hydrogen bond — a 2.5–3.5 Å directional contact between an H-donor and an acceptor atom. The dominant specific interaction in most docking poses.' },
  { term: 'Hub target', def: 'A protein with many connections in a PPI network — usually high in degree centrality. Often a worthwhile docking candidate.' },
  { term: 'Induced fit', def: 'Conformational change in the receptor triggered by ligand binding. Standard rigid docking can miss this.' },
  { term: 'MD (molecular dynamics)', def: 'Atomistic simulation of how the docked complex moves over time. Validates pose stability post-docking.' },
  { term: 'PDBQT', def: 'Extended PDB format used by AutoDock-family programs. Adds partial charges (Q) and atom types (T).' },
  { term: 'π-stacking', def: 'Stacking interaction between aromatic rings. Common between ligand aromatics and Phe / Tyr / Trp / His side chains.' },
  { term: 'Pose', def: 'A specific predicted binding conformation of the ligand inside the receptor pocket.' },
  { term: 'RMSD', def: 'Root-mean-square deviation. Measures how far two poses are from each other. < 2.0 Å is the standard threshold for "matching" poses.' },
  { term: 'Redocking', def: 'Docking a co-crystallised ligand back into its own receptor to validate the protocol. RMSD < 2 Å is the pass criterion.' },
  { term: 'Salt bridge', def: 'Electrostatic interaction between oppositely charged side chains (e.g. Asp/Glu with Lys/Arg) or a charged ligand group.' },
  { term: 'Scoring function', def: 'The mathematical formula that converts a docked pose into a numerical binding score. Different engines use different functions.' },
],

CITATIONS: [
  { num: 1, text: 'Trott O, Olson AJ. AutoDock Vina: improving the speed and accuracy of docking. <em>J Comput Chem</em>. 2010;31(2):455–461.', doi: '10.1002/jcc.21334' },
  { num: 2, text: 'Eberhardt J, Santos-Martins D, Tillack AF, Forli S. AutoDock Vina 1.2.0: New Docking Methods, Expanded Force Field, and Python Bindings. <em>J Chem Inf Model</em>. 2021;61(8):3891–3898.', doi: '10.1021/acs.jcim.1c00203' },
  { num: 3, text: 'Morris GM et al. AutoDock4 and AutoDockTools4: Automated docking with selective receptor flexibility. <em>J Comput Chem</em>. 2009;30(16):2785–2791.', doi: '10.1002/jcc.21256' },
  { num: 4, text: 'Valdés-Tresanco MS et al. AMDock: a versatile graphical tool for assisting molecular docking with AutoDock Vina and AutoDock4. <em>Biol Direct</em>. 2020;15(1):12.', doi: '10.1186/s13062-020-00267-2' },
  { num: 5, text: 'Grosdidier A, Zoete V, Michielin O. SwissDock, a protein-small molecule docking web service based on EADock DSS. <em>Nucleic Acids Res</em>. 2011;39:W270–W277.', doi: '10.1093/nar/gkr366' },
  { num: 6, text: 'Honorato RV et al. The HADDOCK2.4 web server for integrative modeling of biomolecular complexes. <em>Nat Protoc</em>. 2024;19:3219–3241.', doi: '10.1038/s41596-024-01011-0' },
  { num: 7, text: 'Adasme MF et al. PLIP 2021: expanding the scope of the protein-ligand interaction profiler. <em>Nucleic Acids Res</em>. 2021;49:W530–W534.', doi: '10.1093/nar/gkab294' },
  { num: 8, text: 'Friesner RA et al. Glide: A New Approach for Rapid, Accurate Docking and Scoring. <em>J Med Chem</em>. 2004;47(7):1739–1749.', doi: '10.1021/jm0306430' },
  { num: 9, text: 'Jones G et al. Development and validation of a genetic algorithm for flexible docking [GOLD]. <em>J Mol Biol</em>. 1997;267(3):727–748.', doi: '10.1006/jmbi.1996.0897' },
  { num: 10, text: 'Tian W et al. CASTp 3.0: computed atlas of surface topography of proteins. <em>Nucleic Acids Res</em>. 2018;46:W363–W367.', doi: '10.1093/nar/gky473' },
],

QUICK_REF: [
  { title: 'Receptor', hue: 'sage', rows: [['Resolution', '≤ 2.5 Å'], ['pLDDT (AF)', '> 70'], ['Hydrogens', 'polar only · Vina'], ['Charges', 'Gasteiger']] },
  { title: 'Ligand',   hue: 'sky',  rows: [['Source', 'PubChem · ZINC'], ['Protonation', 'pH 7.4'], ['Max torsions', '≤ 10'], ['Format', 'PDBQT']] },
  { title: 'Grid',     hue: 'teal', rows: [['Box size', '2.5 × longest dim'], ['Spacing AD4', '0.375 Å'], ['Spacing Vina', '1.0 Å'], ['Max vol', '< 30³ Å³']] },
  { title: 'Docking',  hue: 'coral',rows: [['exhaustiveness', '8 → 32'], ['num_modes', '9'], ['energy_range', '3 kcal/mol'], ['Seed', 'explicit']] },
  { title: 'Pass criteria', hue: 'lilac', rows: [['Redock RMSD', '< 2.0 Å'], ['Affinity', '≤ −7.0 kcal/mol'], ['Cluster size', 'largest = pose'], ['MD stability', 'RMSD plateau']] },
],

};
