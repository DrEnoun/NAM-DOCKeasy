/* ===============================================================
 * Case study data — Capsaicin into TRPV1 (PDB 8JQR) via AMDock
 * Lifted from the user's "Tutorial Docking - AMDock Capsaicin_TRPV1.pdf"
 * by Dr Nur 'Ainun Mokhtar (UiTM Bertam).
 *
 * To add more case studies, append objects to window.DOCKEASY.CASES.
 * Each step has stable id (used as image-slot key) so student-uploaded
 * screenshots survive reload.
 * =============================================================== */
window.DOCKEASY = window.DOCKEASY || {};
window.DOCKEASY.CASES = [
{
  id: 'capsaicin-trpv1',
  title: 'Capsaicin → TRPV1',
  subtitle: 'How the hot in chilli activates the pain receptor',
  receptor: { name: 'TRPV1', pdb: '8JQR', source: 'RCSB PDB' },
  ligand:   { name: 'Capsaicin', source: 'PubChem · CID 1548943', notes: 'The vanilloid that gives chilli its heat' },
  engine: 'AMDock (AutoDock Vina backend)',
  estimated_time: '60–90 min',
  outcome: 'Top binding pose of capsaicin in the TRPV1 vanilloid pocket, with a 2D interaction diagram suitable for a manuscript figure.',
  phases_covered: ['A', 'B', 'D', 'E', 'F', 'G'],
  steps: [

    /* ───────── Phase A — Receptor ───────── */
    {
      n: 1, hue: 'sage', phase: 'Phase A · Receptor',
      title: 'Download the TRPV1 structure',
      tool: 'RCSB PDB · web',
      do: [
        'Open <a href="https://www.rcsb.org/" target="_blank" rel="noopener" style="color:var(--de-accent-dark);font-weight:600;">rcsb.org</a>.',
        'Search <span class="code">8JQR</span> in the top bar.',
        'Click <strong>Download Files → PDB Format</strong>.',
        'Save as <span class="code">TRPV1_8JQR.pdb</span>.',
      ],
      expects: 'A ~2.1 MB PDB file with four chains (homotetramer) and a co-crystallised ligand in the vanilloid pocket.',
      slotPlaceholder: 'Drop your PDB-download confirmation screenshot here',
    },

    {
      n: 2, hue: 'sage', phase: 'Phase A · Receptor',
      title: 'Determine the docking search space in AutoDock Tools',
      tool: 'AutoDock Tools (ADT)',
      do: [
        'Open ADT. <em>File → Read Molecule</em> · select <span class="code">TRPV1_8JQR.pdb</span>.',
        'In the dashboard panel, click chain <span class="code">A</span> → ribbon <span class="code">R</span> to show ribbon. Hide the other chains via the <span class="code">L</span> toggle.',
        '<em>Grid → Grid Box</em>. Enable <em>View → Show box as lines</em>.',
        'Drag and resize the box so it encloses the co-crystal ligand fully.',
        'Record the box dimensions and centre — you\'ll paste them into AMDock.',
      ],
      values: [
        ['Points (X · Y · Z)', '76 × 78 × 98'],
        ['Centre X', '188.1'],
        ['Centre Y', '171.3'],
        ['Centre Z', '156.7'],
        ['Spacing', '0.375 Å'],
      ],
      callout: { kind: 'amber', body: '<strong>Write these down.</strong> AMDock will not auto-detect them — you paste them in by hand in Step 5.' },
      slotPlaceholder: 'Drop your ADT screenshot showing the grid box around the ligand',
    },

    {
      n: 3, hue: 'sage', phase: 'Phase A · Receptor',
      title: 'Strip water and the co-crystal ligand',
      tool: 'Notepad++ (text editor)',
      do: [
        'Right-click <span class="code">TRPV1_8JQR.pdb</span> → Edit with Notepad++.',
        'Find the first line starting with <span class="code">HETATM</span> (line <span class="code">20279</span> in this file).',
        'Delete all <span class="code">HETATM</span> and <span class="code">TER</span> lines through to line <span class="code">20482</span>.',
        'Save as <span class="code">TRPV1_8JQR_nolig.pdb</span>.',
      ],
      callout: { kind: 'blue', body: '<strong>Why strip the ligand?</strong> You\'re about to dock <em>capsaicin</em> into the empty pocket. Leaving the crystal ligand in would let it steal the search space.' },
      slotPlaceholder: 'Drop your Notepad++ screenshot showing the deleted HETATM lines',
    },

    /* ───────── Phase B — Ligand ───────── */
    {
      n: 4, hue: 'sky', phase: 'Phase B · Ligand',
      title: 'Get capsaicin from PubChem',
      tool: 'PubChem · web',
      do: [
        'Open <a href="https://pubchem.ncbi.nlm.nih.gov" target="_blank" rel="noopener" style="color:var(--de-accent-dark);font-weight:600;">pubchem.ncbi.nlm.nih.gov</a>.',
        'Search <strong>Capsaicin</strong> (CID 1548943).',
        'Open the structure record → <em>Download → 3D Conformer → SDF</em>.',
      ],
      values: [
        ['CID', '1548943'],
        ['SMILES', 'CC(C)/C=C/CCCCC(=O)NCc1ccc(O)c(OC)c1'],
        ['MW', '305.41 g/mol'],
      ],
      slotPlaceholder: 'Drop your PubChem capsaicin page screenshot here',
    },

    {
      n: 5, hue: 'sky', phase: 'Phase B · Ligand',
      title: 'Convert SDF to PDB',
      tool: 'NCI Online SMILES Translator',
      do: [
        'Open <a href="https://cactus.nci.nih.gov/translate/" target="_blank" rel="noopener" style="color:var(--de-accent-dark);font-weight:600;">cactus.nci.nih.gov/translate/</a>.',
        'Upload your capsaicin SDF in <em>Choose file</em>.',
        'Tick <em>PDB</em> and <em>3D</em>. Click <strong>Translate</strong>.',
        'Save the result as <span class="code">CAPSAICIN.pdb</span>.',
        'Open in PyMOL or BIOVIA to confirm the structure looks correct.',
      ],
      callout: { kind: 'blue', body: '<strong>Tip.</strong> Open Babel (<span class="code">obabel capsaicin.sdf -O CAPSAICIN.pdb</span>) does the same job from the command line if you prefer scripted prep.' },
      slotPlaceholder: 'Drop your PyMOL/BIOVIA view of capsaicin here',
    },

    /* ───────── Phase E — Dock ───────── */
    {
      n: 6, hue: 'coral', phase: 'Phase E · Docking',
      title: 'Set up the AMDock project',
      tool: 'AMDock (Vina backend)',
      do: [
        'Create a folder named <span class="code">8JQR_CAPSAICIN</span> in your working directory.',
        'Copy <span class="code">TRPV1_8JQR_nolig.pdb</span> and <span class="code">CAPSAICIN.pdb</span> into it.',
        'Open AMDock → <strong>AutoDock Vina</strong>.',
        'Project name: <span class="code">8JQR_CAPSAICIN</span>. Project folder: the folder you just created. Click <strong>Create Project</strong>.',
        'Upload <span class="code">TRPV1_8JQR_nolig.pdb</span> as the <strong>target</strong>.',
        'Upload <span class="code">CAPSAICIN.pdb</span> as the <strong>ligand</strong>.',
        'Click <strong>Prepare Input</strong>.',
      ],
      slotPlaceholder: 'Drop your AMDock project-creation screenshot here',
    },

    {
      n: 7, hue: 'coral', phase: 'Phase E · Docking',
      title: 'Paste the grid coordinates and run',
      tool: 'AMDock (Vina backend)',
      do: [
        'In <strong>Search Space</strong>, tick <em>Box</em>.',
        'Paste the centre coordinates and box size you recorded in Step 2.',
        'Click <strong>Define Search Space</strong>.',
        'Click <strong>Run</strong>. Vina will execute — expect 5–20 minutes on a laptop.',
      ],
      values: [
        ['Centre X · Y · Z', '188.1 · 171.3 · 156.7'],
        ['Size X · Y · Z (points)', '76 · 78 · 98'],
        ['Engine', 'AutoDock Vina'],
        ['exhaustiveness (default)', '8'],
      ],
      callout: { kind: 'amber', body: '<strong>Reproducibility.</strong> If you intend to publish, bump <span class="code">exhaustiveness</span> to <span class="code">32</span> and record the AMDock + Vina versions.' },
      slotPlaceholder: 'Drop your AMDock Search-Space configuration screenshot here',
    },

    /* ───────── Phase F — Results ───────── */
    {
      n: 8, hue: 'gold', phase: 'Phase F · Analyse',
      title: 'Read the docking results',
      tool: 'AMDock · file explorer',
      do: [
        'Navigate to <span class="code">8JQR_CAPSAICIN / results /</span>.',
        'You\'ll find 10 output pose files: <span class="code">CAPSAICIN_TRPV1_8jqr_nolig_out01.pdb</span> … <span class="code">_out10.pdb</span>.',
        'The <span class="code">out01</span> file is the best-scored pose.',
        'AMDock also writes a combined <span class="code">all_poses_…pdb</span> for viewing all 10 at once.',
      ],
      values: [
        ['Best pose file', 'out01.pdb'],
        ['Number of poses', '10'],
        ['Typical top affinity', '−8 to −10 kcal/mol'],
      ],
      callout: { kind: 'navy', body: '<strong style="color:#fff;">Pass criterion.</strong> A capsaicin–TRPV1 pose with affinity <span class="code">≤ −7.0 kcal/mol</span> is considered strong binding. Cluster the 10 poses by RMSD &lt; 2 Å; the largest cluster\'s top-scoring pose is what you report.' },
      slotPlaceholder: 'Drop a screenshot of your AMDock results table here',
    },

    /* ───────── Phase G — Interactions ───────── */
    {
      n: 9, hue: 'coral', phase: 'Phase G · Interactions',
      title: '3D interaction analysis with PyMOL',
      tool: 'PyMOL (integrated in AMDock)',
      do: [
        'In AMDock\'s result panel, click <strong>Binding site 1</strong> → <strong>Show in PyMOL</strong>.',
        'Or open <span class="code">TRPV1_8JQR_nolig.pdb</span> in PyMOL, then <em>File → Open</em> the pose <span class="code">_out01.pdb</span>.',
        '<em>Action → find → polar contacts → to any excluding solvents</em>.',
        'For all 10 poses, open <span class="code">all_poses_…pdb</span> instead.',
        '<em>File → Save Image → PNG</em>. For publication, use <em>Draw/Ray → Ray (slow)</em> first.',
      ],
      slotPlaceholder: 'Drop your PyMOL 3D pose screenshot here',
    },

    {
      n: 10, hue: 'coral', phase: 'Phase G · Interactions',
      title: '2D interaction diagram with PoseView',
      tool: 'proteins.plus · web',
      do: [
        'Open <a href="https://proteins.plus/" target="_blank" rel="noopener" style="color:var(--de-accent-dark);font-weight:600;">proteins.plus</a>.',
        'Upload <span class="code">TRPV1_8JQR_nolig.pdb</span> as the protein.',
        'Convert <span class="code">CAPSAICIN_TRPV1_8jqr_nolig_out01.pdb</span> to SDF at <a href="https://cactus.nci.nih.gov/translate/" target="_blank" rel="noopener" style="color:var(--de-accent-dark);font-weight:600;">cactus.nci.nih.gov/translate/</a> first.',
        'Upload the SDF as the ligand. Click <strong>Go → PoseView</strong>.',
        'Copy the ligand label (e.g. <span class="code">LIG_B_1</span>), paste it, click <strong>Calculate</strong>.',
        'Change format to PNG and download.',
      ],
      callout: { kind: 'purple', body: '<strong>Alternative.</strong> Discovery Studio Visualizer produces a comparable 2D diagram and is free for academic use — handy when proteins.plus is overloaded.' },
      slotPlaceholder: 'Drop your PoseView / Discovery Studio 2D diagram here',
    },

    /* ───────── Phase H — Validate ───────── */
    {
      n: 11, hue: 'lilac', phase: 'Phase H · Validate',
      title: 'Redock the co-crystal ligand to validate the protocol',
      tool: 'AMDock + PyMOL',
      do: [
        'Extract the original co-crystal ligand from <span class="code">TRPV1_8JQR.pdb</span> (the HETATM block you deleted in Step 3).',
        'Save as <span class="code">8JQR_ligand.pdb</span> and convert to PDB-compatible format.',
        'Run a second AMDock project with the same grid against this ligand.',
        'In PyMOL, align the docked pose against the crystallographic pose. <em>align ligand_dock, ligand_xtal</em>.',
        'The reported RMSD should be <span class="code">&lt; 2.0 Å</span> — if not, your protocol cannot reproduce the crystal and your capsaicin pose is also untrustworthy.',
      ],
      callout: { kind: 'green', body: '<strong>This step is non-negotiable.</strong> Reviewers will ask for it. It is the single strongest evidence that your docking protocol is sound.' },
      slotPlaceholder: 'Drop the PyMOL alignment showing redock vs crystal pose',
    },

  ],
}
];
