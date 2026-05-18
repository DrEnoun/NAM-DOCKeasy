/* eslint-disable */
/* PoseRanker — small interactive table that re-sorts a list of fake
 * docking poses by score / RMSD / cluster size. Demonstrates the
 * "energy-best of the largest cluster" rule. */
const { useState: useStateP } = React;

const POSES = [
  { rank: 1, name: 'pose_1', affinity: -9.2, rmsd: 0.0,  cluster: 1, members: 11 },
  { rank: 2, name: 'pose_2', affinity: -8.8, rmsd: 1.4,  cluster: 1, members: 11 },
  { rank: 3, name: 'pose_3', affinity: -8.4, rmsd: 1.9,  cluster: 1, members: 11 },
  { rank: 4, name: 'pose_4', affinity: -8.1, rmsd: 3.6,  cluster: 2, members: 4 },
  { rank: 5, name: 'pose_5', affinity: -7.9, rmsd: 1.5,  cluster: 1, members: 11 },
  { rank: 6, name: 'pose_6', affinity: -7.6, rmsd: 4.2,  cluster: 3, members: 3 },
  { rank: 7, name: 'pose_7', affinity: -7.3, rmsd: 3.9,  cluster: 2, members: 4 },
  { rank: 8, name: 'pose_8', affinity: -7.1, rmsd: 5.8,  cluster: 4, members: 1 },
  { rank: 9, name: 'pose_9', affinity: -6.8, rmsd: 1.8,  cluster: 1, members: 11 },
];

function PoseRanker() {
  const [sort, setSort] = useStateP('affinity');
  const sorted = [...POSES].sort((a, b) => {
    if (sort === 'affinity') return a.affinity - b.affinity;
    if (sort === 'rmsd')     return a.rmsd - b.rmsd;
    if (sort === 'cluster')  return (b.members - a.members) || (a.affinity - b.affinity);
    return 0;
  });
  const maxBar = 60;
  const minAff = Math.min(...POSES.map(p => p.affinity));
  return (
    <div className="poseranker">
      <div className="poseranker-controls">
        <span className="pr-label">Sort by</span>
        <button className={sort === 'affinity' ? 'active' : ''} onClick={() => setSort('affinity')}>Affinity</button>
        <button className={sort === 'rmsd' ? 'active' : ''} onClick={() => setSort('rmsd')}>RMSD vs top</button>
        <button className={sort === 'cluster' ? 'active' : ''} onClick={() => setSort('cluster')}>Cluster size · then affinity</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Pose</th>
            <th>Affinity (kcal/mol)</th>
            <th>RMSD (Å)</th>
            <th>Cluster</th>
            <th>Members</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((p, i) => {
            const width = Math.round((p.affinity / minAff) * maxBar);
            const isPick = sort === 'cluster' && i === 0;
            return (
              <tr key={p.name}>
                <td className="pr-rank">{i+1}</td>
                <td>{p.name}{isPick ? <span style={{marginLeft:6,fontSize:10,color:'var(--de-accent-dark)',fontWeight:700}}>← report this</span> : null}</td>
                <td className="pr-affinity"><span className="pr-bar" style={{width: width + 'px'}} />{p.affinity.toFixed(1)}</td>
                <td className="pr-affinity">{p.rmsd.toFixed(1)}</td>
                <td className="pr-affinity">{p.cluster}</td>
                <td className="pr-affinity">{p.members}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
Object.assign(window, { PoseRanker });
