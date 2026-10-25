import { isoFrame } from "@/lib/iso";

/*
 * One small iso-glow figure per Experience stop, each showing what happened
 * there: the degree's papers and first models, a release pipeline, a rack of
 * containers, a stack of coursework under a cap, a recitation, an open door.
 * Accent only on what is live; wires carry a moving dash.
 */

const PW = 200; // plate width (x)
const PD = 140; // plate depth (y)
const corners = (top: number[]) => [[0, 0, 0], [PW, 0, 0], [0, PD, 0], [PW, PD, 0], top];

function Frame({ id, top, label, children }: { id: string; top: number[]; label: string; children: (k: ReturnType<typeof isoFrame>) => React.ReactNode }) {
  const k = isoFrame(corners(top), 10);
  return (
    <svg viewBox={k.viewBox} role="img" aria-label={label} className="iso xfig w-full" style={{ "--xglow": `url(#${id})` } as React.CSSProperties}>
      <defs>
        <filter id={id} {...k.filterRegion}>
          <feGaussianBlur stdDeviation="2.2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <k.RoundBox x={0} y={0} z={0} w={PW} d={PD} h={8} r={10} />
      <g transform={k.TOP(0, 0, 8)}>
        <rect className="iso-detail" x={8} y={8} width={PW - 16} height={PD - 16} rx={5} />
      </g>
      {children(k)}
    </svg>
  );
}

/** Text lying on the plate. */
const Print = ({ k, x, y, size = 6, accent, children }: { k: ReturnType<typeof isoFrame>; x: number; y: number; size?: number; accent?: boolean; children: React.ReactNode }) => (
  <g transform={k.TOP(0, 0, 8)}>
    <text className={`iso-print ${accent ? "iso-name" : ""}`} x={x} y={y} fontSize={size}>
      {children}
    </text>
  </g>
);

// 01 · B.Tech, AI & Data Science: a chip running a small network, and three published papers.
function Degree() {
  const layers = [
    [18, 36, 54],
    [12, 28, 44, 60],
    [24, 48],
  ];
  const lit = new Set(["0-1", "1-2", "2-0"]);
  return (
    <Frame id="xg-0" top={[60, 60, 30]} label="A chip running a small neural network beside three published papers">
      {(k) => (
        <>
          {/* Chip pins on the plate, then the chip */}
          <g transform={k.TOP(0, 0, 8)}>
            {Array.from({ length: 8 }, (_, i) => (
              <line key={`a${i}`} className="iso-detail" x1={30 + i * 8} y1={100} x2={30 + i * 8} y2={109} />
            ))}
            {Array.from({ length: 8 }, (_, i) => (
              <line key={`b${i}`} className="iso-detail" x1={94} y1={36 + i * 8} x2={103} y2={36 + i * 8} />
            ))}
          </g>
          <k.Box x={24} y={30} z={8} w={72} d={72} h={12} />
          <g transform={k.TOP(24, 30, 20)}>
            {layers.slice(0, -1).flatMap((col, c) =>
              col.flatMap((v0, a) =>
                layers[c + 1].map((v1, b) => {
                  const hot = lit.has(`${c}-${a}`) && lit.has(`${c + 1}-${b}`);
                  return <line key={`${c}${a}${b}`} className={hot ? "iso-wire is-hot" : "iso-detail"} x1={14 + c * 22} y1={v0} x2={36 + c * 22} y2={v1} />;
                })
              )
            )}
            {layers.flatMap((col, c) =>
              col.map((v, a) => <circle key={`${c}${a}`} className={`iso-led ${lit.has(`${c}-${a}`) ? "is-on-dot" : ""}`} cx={14 + c * 22} cy={v} r={3.2} />)
            )}
          </g>
          {/* Three papers, the newest on top */}
          {[0, 1, 2].map((p) => (
            <k.Box key={p} x={118 + p * 5} y={40 - p * 4} z={8 + p * 3} w={54} d={70} h={2.4} className={p === 2 ? "x-edge" : ""} />
          ))}
          <g transform={k.TOP(128, 32, 16.4)}>
            <text className="iso-print iso-name" x={6} y={12} fontSize={7}>
              IEEE
            </text>
            {[20, 26, 32, 38, 44, 50].map((y, i) => (
              <line key={y} className="iso-detail" x1={6} y1={y} x2={i % 3 === 2 ? 30 : 46} y2={y} />
            ))}
          </g>
          <Print k={k} x={118} y={126} accent>
            3 PAPERS
          </Print>
        </>
      )}
    </Frame>
  );
}

// 02 · Creative Line: a dashboard halving P95 latency, and nine deploys with no rollback.
function Release() {
  return (
    <Frame id="xg-1" top={[10, 56, 92]} label="A monitor charting latency halved, and nine deploys in a row">
      {(k) => (
        <>
          <k.Box x={10} y={56} z={30} w={100} d={6} h={62} />
          <g transform={k.FRONT(10, 62, 92)}>
            <rect className="iso-glass is-hot" x={4} y={4} width={92} height={54} rx={1.5} />
            <text className="iso-scr-dim iso-scr" x={9} y={13} fontSize={5}>
              P95 LATENCY
            </text>
            <rect className="x-bar-dim" x={9} y={18} width={70} height={7} />
            <text className="iso-scr-dim iso-scr" x={82} y={24} fontSize={5}>
              620
            </text>
            <rect className="x-bar" x={9} y={30} width={35} height={7} />
            <text className="iso-scr" x={47} y={36} fontSize={5}>
              310 ms
            </text>
            <text className="iso-scr" x={9} y={51} fontSize={9}>
              −50%
            </text>
          </g>
          <k.Box x={56} y={66} z={11} w={8} d={6} h={19} />
          <k.Box x={40} y={60} z={8} w={40} d={26} h={3} />
          {/* The release line: nine deploys, all green */}
          <g transform={k.TOP(0, 0, 8)}>
            <line className="iso-wire is-hot x-flow" x1={122} y1={104} x2={190} y2={104} />
            {Array.from({ length: 9 }, (_, i) => (
              <circle key={i} className="iso-led is-on-dot" cx={124 + i * 8} cy={104} r={2.6} />
            ))}
          </g>
          <Print k={k} x={122} y={96}>
            9 DEPLOYS
          </Print>
          <Print k={k} x={122} y={118} accent>
            0 ROLLBACKS
          </Print>
        </>
      )}
    </Frame>
  );
}

// 03 · Aaditya Technologies: a rack serving the Django API, feeding containers bound for AWS.
function Rack() {
  const units = ["API", "API", "WORKER", "MYSQL", "CACHE"];
  return (
    <Frame id="xg-2" top={[24, 24, 112]} label="A server rack wired to a pallet of containers">
      {(k) => (
        <>
          <k.Box x={24} y={24} z={8} w={56} d={56} h={104} />
          <g transform={k.FRONT(24, 80, 112)}>
            {units.map((u, i) => (
              <g key={i}>
                <rect className="iso-detail" x={5} y={6 + i * 19} width={46} height={15} rx={1} />
                <circle className={`iso-led is-on-dot ${i === 3 ? "x-blink" : ""}`} cx={10} cy={13.5 + i * 19} r={1.9} />
                <text className="iso-print" x={15} y={15.5 + i * 19} fontSize={5}>
                  {u}
                </text>
              </g>
            ))}
          </g>
          <g transform={k.TOP(0, 0, 8)}>
            <line className="iso-wire is-hot x-flow" x1={80} y1={72} x2={104} y2={72} />
          </g>
          <k.Box x={104} y={58} z={8} w={80} d={54} h={4} />
          {[
            [106, 60, 12],
            [145, 60, 12],
            [106, 86, 12],
            [145, 86, 12],
            [125, 73, 30],
          ].map(([x, y, z], i) => (
            <g key={i}>
              <k.Box x={x} y={y} z={z} w={36} d={22} h={18} className={i === 4 ? "iso-lit" : ""} />
              <g transform={k.FRONT(x, y + 22, z + 18)}>
                {[6, 12, 18, 24, 30].map((u) => (
                  <line key={u} className="iso-detail" x1={u} y1={3} x2={u} y2={15} />
                ))}
              </g>
            </g>
          ))}
          <Print k={k} x={24} y={126} accent>
            P95 3,100 → 420 MS
          </Print>
        </>
      )}
    </Frame>
  );
}

// 04 · M.S. Computer Science: coursework stacked under a mortarboard.
function Masters() {
  return (
    <Frame id="xg-3" top={[62, 50, 58]} label="A stack of books under a graduation cap">
      {(k) => (
        <>
          {[
            [36, 46, 8, 116, 74, 14, "ALGORITHMS"],
            [46, 52, 22, 98, 64, 12, "SYSTEMS"],
            [56, 58, 34, 82, 54, 10, "MACHINE LEARNING"],
          ].map(([x, y, z, w, d, h, title]) => (
            <g key={title as string}>
              <k.Box x={x as number} y={y as number} z={z as number} w={w as number} d={d as number} h={h as number} />
              <g transform={k.FRONT(x as number, (y as number) + (d as number), (z as number) + (h as number))}>
                <text className="iso-print" x={6} y={(h as number) / 2 + 2.2} fontSize={5.2}>
                  {title}
                </text>
              </g>
            </g>
          ))}
          <k.RoundBox x={88} y={74} z={44} w={22} d={22} h={8} r={11} />
          <k.Box x={66} y={52} z={52} w={66} d={66} h={3} />
          <circle className="iso-led is-on-dot" cx={k.P(99, 85, 55)[0]} cy={k.P(99, 85, 55)[1]} r={2.4} />
          <path className="iso-wire is-hot" d={k.path([[99, 85, 55.2], [132, 118, 55.2], [132, 118, 38]])} />
          <circle className="iso-led is-on-dot x-blink" cx={k.P(132, 118, 35)[0]} cy={k.P(132, 118, 35)[1]} r={3} />
          <Print k={k} x={14} y={130} accent>
            GPA 3.83 / 4.0
          </Print>
        </>
      )}
    </Frame>
  );
}

// 05 · Teaching Assistant: a recitation; the board proves A AND B, rows of desks face it.
function Recitation() {
  return (
    <Frame id="xg-4" top={[30, 40, 100]} label="A whiteboard with a truth table and an AND gate, in front of rows of desks">
      {(k) => (
        <>
          <k.Box x={40} y={40} z={8} w={4} d={4} h={32} />
          <k.Box x={136} y={40} z={8} w={4} d={4} h={32} />
          <k.Box x={30} y={40} z={40} w={120} d={4} h={60} />
          <g transform={k.FRONT(30, 44, 100)}>
            <rect className="iso-glass is-hot" x={4} y={4} width={112} height={52} rx={1.5} />
            <text className="iso-scr" x={9} y={13} fontSize={5.5}>
              CS205
            </text>
            {[
              ["A B", "A∧B"],
              ["0 0", "0"],
              ["0 1", "0"],
              ["1 0", "0"],
              ["1 1", "1"],
            ].map(([ab, out], i) => (
              <g key={i}>
                <text className="iso-scr-dim iso-scr" x={9} y={22 + i * 7} fontSize={5}>
                  {ab}
                </text>
                <text className={i === 4 ? "iso-scr" : "iso-scr-dim iso-scr"} x={30} y={22 + i * 7} fontSize={5}>
                  {out}
                </text>
              </g>
            ))}
            <path className="iso-wire" d="M58 26 H70 M58 38 H70" />
            <path className="iso-wire" d="M70 20 H80 A12 12 0 0 1 80 44 H70 Z" />
            <path className="iso-wire is-hot x-flow" d="M92 32 H110" />
          </g>
          {[0, 1, 2].flatMap((r) =>
            [0, 1, 2, 3].map((c) => <k.Box key={`${r}${c}`} x={22 + c * 34} y={70 + r * 18} z={8} w={22} d={9} h={7} className={r === 0 && c === 1 ? "iso-lit" : ""} />)
          )}
          <Print k={k} x={22} y={132} accent>
            50+ STUDENTS · WEEKLY
          </Print>
        </>
      )}
    </Frame>
  );
}

// 06 · Next stop: an open door with light coming through, and the path to it.
function Door() {
  return (
    <Frame id="xg-5" top={[70, 50, 96]} label="An open doorway with light spilling out, and a signpost">
      {(k) => (
        <>
          <g transform={k.TOP(0, 0, 8)}>
            <path className="x-spill" d="M78 60 H122 L150 128 H58 Z" />
            <line className="iso-wire is-hot x-flow" x1={100} y1={132} x2={100} y2={64} />
          </g>
          <k.Box x={150} y={86} z={50} w={40} d={3} h={14} />
          <g transform={k.FRONT(150, 89, 64)}>
            <text className="iso-print iso-name" x={4} y={9.5} fontSize={5.5}>
              MAY 2027 →
            </text>
          </g>
          <k.Box x={166} y={96} z={8} w={4} d={4} h={56} />
          <k.Box x={70} y={50} z={8} w={8} d={10} h={80} />
          <g transform={k.FRONT(78, 60, 88)}>
            <rect className="x-door" x={0} y={0} width={44} height={80} />
          </g>
          <k.Box x={122} y={50} z={8} w={8} d={10} h={80} />
          <k.Box x={70} y={50} z={88} w={60} d={10} h={8} />
          <Print k={k} x={14} y={130} accent>
            OPEN TO SWE · AI/ML
          </Print>
        </>
      )}
    </Frame>
  );
}

export const STOP_FIGURES = [Degree, Release, Rack, Masters, Recitation, Door];
