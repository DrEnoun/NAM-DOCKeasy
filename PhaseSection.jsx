/* eslint-disable */
/* MolPreview — wraps <image-slot> in a styled frame so users can drop
 * in a PyMOL / Chimera screenshot of their docking pose. Persists via
 * the image-slot starter's storage. */
function MolPreview({ id = 'dockeasy-pose-preview', placeholder = 'Drop a PyMOL / Chimera screenshot of your docked pose here' }) {
  return (
    <image-slot
      id={id}
      class="mol-preview"
      shape="rounded"
      radius="12"
      placeholder={placeholder}
    ></image-slot>
  );
}

/* StepBlock — same collapsible card as NAM-NPeasy, but with optional
 * "extras" slot in the body where we render docking-specific tools. */
function StepBlock({ step, hue, open, onToggle }) {
  return (
    <div className={"step-block ph-" + hue + (open ? " open" : "")}>
      <div className="step-header-bar" onClick={onToggle}>
        <div className="step-num-badge">{String(step.num).padStart(2,'0')}</div>
        <div className="step-title-group">
          <div className="step-title-main">{step.title}</div>
          {step.sub ? <div className="step-title-sub">{step.sub}</div> : null}
        </div>
        <div className="step-chevron">▾</div>
      </div>
      <div className="step-body">
        <ProtocolList items={step.protocol} />
        <ToolBadges tools={step.tools} />
        {step.callouts ? step.callouts.map((c, i) => <Callout key={i} kind={c.kind}>{c.body}</Callout>) : null}
        {step.extras?.gridboxVisualizer ? <GridBoxVisualizer /> : null}
        {step.extras?.poseRanker        ? <PoseRanker /> : null}
        {step.extras?.molPreview        ? <MolPreview id={"slot-" + step.num} /> : null}
        {step.extras?.interactionLegend ? <InteractionLegend /> : null}
        {step.extras?.dockVsMd          ? <DockVsMdMatrix /> : null}
      </div>
    </div>
  );
}

/* PhaseSection — eyebrow + section title + lead + phase header + steps */
function PhaseSection({ phase, openSteps, onToggleStep }) {
  return (
    <section className={"content-section ph-" + phase.hue} id={phase.id}>
      <div className="section-tag"><span className="tag-dot" />{phase.eyebrow}</div>
      <h2 className="section-title">{phase.title}</h2>
      {phase.desc ? <p className="section-desc" dangerouslySetInnerHTML={{__html: phase.desc}} /> : null}
      <div className="phase-header">
        <div className="phase-badge">{phase.letter}</div>
        <div className="phase-info">
          <div className="phase-name">{phase.title}</div>
          <div className="phase-when">{phase.when}</div>
        </div>
      </div>
      {phase.steps.map(step => (
        <StepBlock
          key={step.num}
          step={step}
          hue={phase.hue}
          open={!!openSteps[phase.id + '-' + step.num]}
          onToggle={() => onToggleStep(phase.id + '-' + step.num)}
        />
      ))}
    </section>
  );
}

Object.assign(window, { MolPreview, StepBlock, PhaseSection });
