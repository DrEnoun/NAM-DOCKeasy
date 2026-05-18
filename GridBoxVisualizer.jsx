/* eslint-disable */
/* GridBoxVisualizer — interactive: drag-style sliders move the dashed
 * coral search cube around a stylised receptor. Pure visual aid;
 * numbers are illustrative of typical AutoDock Vina configs. */
const { useState } = React;

function GridBoxVisualizer() {
  const [cx, setCx] = useState(50);
  const [cy, setCy] = useState(46);
  const [sx, setSx] = useState(24);
  const [sy, setSy] = useState(24);
  const [sz, setSz] = useState(22);
  const [exh, setExh] = useState(16);

  // Convert grid % → Å for readout (illustrative scale)
  const dimX = (sx * 0.9).toFixed(1);
  const dimY = (sy * 0.9).toFixed(1);
  const dimZ = (sz * 0.9).toFixed(1);
  const ctrX = ((cx - 50) * 0.4).toFixed(1);
  const ctrY = ((50 - cy) * 0.4).toFixed(1);

  return (
    <div className="gridbox">
      <div className="gridbox-canvas">
        <div className="gridbox-receptor" />
        <div className="gridbox-cube"
             style={{
               left: (cx - sx/2) + '%',
               top:  (cy - sy/2) + '%',
               width:  sx + '%',
               height: sy + '%',
             }}>
          <span /><span />
        </div>
        <div className="gridbox-ligand" style={{ left: cx + '%', top: cy + '%' }} />
      </div>
      <div className="gridbox-controls">
        <div className="gb-slider-row">
          <label><span>Centre X</span><span>{ctrX} Å</span></label>
          <input type="range" min="20" max="80" value={cx} onChange={e => setCx(+e.target.value)} />
        </div>
        <div className="gb-slider-row">
          <label><span>Centre Y</span><span>{ctrY} Å</span></label>
          <input type="range" min="20" max="80" value={cy} onChange={e => setCy(+e.target.value)} />
        </div>
        <div className="gb-slider-row">
          <label><span>Size X</span><span>{dimX} Å</span></label>
          <input type="range" min="8" max="40" value={sx} onChange={e => setSx(+e.target.value)} />
        </div>
        <div className="gb-slider-row">
          <label><span>Size Y</span><span>{dimY} Å</span></label>
          <input type="range" min="8" max="40" value={sy} onChange={e => setSy(+e.target.value)} />
        </div>
        <div className="gb-slider-row">
          <label><span>Size Z</span><span>{dimZ} Å</span></label>
          <input type="range" min="8" max="40" value={sz} onChange={e => setSz(+e.target.value)} />
        </div>
        <div className="gb-slider-row">
          <label><span>exhaustiveness</span><span>{exh}</span></label>
          <input type="range" min="4" max="64" step="4" value={exh} onChange={e => setExh(+e.target.value)} />
        </div>
        <div className="gb-readout">
          center_x = {ctrX}<br/>
          center_y = {ctrY}<br/>
          size_x = {dimX}<br/>
          size_y = {dimY}<br/>
          size_z = {dimZ}<br/>
          exhaustiveness = {exh}
        </div>
      </div>
    </div>
  );
}
Object.assign(window, { GridBoxVisualizer });
