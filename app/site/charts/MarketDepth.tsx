import Provenance from "./Provenance";

/**
 * Why a used car has a price and a used accelerator does not.
 *
 * Two comparisons, each spanning more than three orders of magnitude, so the
 * bars are on a logarithmic scale and say so. Every bar prints its value;
 * the scale is for the eye, the numbers are for the argument.
 */
const PAIRS = [
  {
    title: "Recorded resale transactions per year",
    rows: [
      { name: "Used cars · Manheim auctions", value: 5_000_000, label: "5,000,000+", note: "wholesale transactions behind one index" },
      { name: "Used accelerators · all recorded sales", value: 1003, label: "about 1,000", note: "3,009 sold listings over three years (CCIR)" },
    ],
  },
  {
    title: "Dollars",
    rows: [
      { name: "One GPU-backed loan facility", value: 8_500_000_000, label: "$8.5 billion", note: "CoreWeave delayed-draw term loan, March 2026" },
      { name: "Three years of recorded used-GPU sales", value: 26_300_000, label: "$26.3 million", note: "10,911 units; 0.3% of the facility above" },
    ],
  },
];

export default function MarketDepth() {
  return (
    <div className="chart-card">
      <div className="chart-head">
        <div>
          <h3>Why a lender cannot value the hardware</h3>
          <p>A resale price is trusted when it rests on many transactions. On a logarithmic scale, the market behind a used-car index beside the market behind a used accelerator.</p>
        </div>
        <Provenance state="reported" source="Manheim; CCIR; SEC filings" asOf="2026-08-31" />
      </div>
      {PAIRS.map((pair) => {
        const lo = Math.log10(Math.min(...pair.rows.map((r) => r.value))) - 1;
        const hi = Math.log10(Math.max(...pair.rows.map((r) => r.value)));
        return (
          <div key={pair.title} className="depth-pair">
            <span className="rail-label">{pair.title} · log scale</span>
            <ul className="hbars">
              {pair.rows.map((r) => (
                <li key={r.name} className="hbar-row">
                  <span className="hbar-name">{r.name}<small>{r.note}</small></span>
                  <span className="hbar-track"><i className="hbar-fill index" style={{ width: `${((Math.log10(r.value) - lo) / (hi - lo)) * 78}%` }} /><b style={{ left: `calc(${((Math.log10(r.value) - lo) / (hi - lo)) * 78}% + 6px)` }}>{r.label}</b></span>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
      <p className="chart-note">Models and quotes for used hardware exist; prints are what a rating agency needs. Until there are enough of them, loans are sized on the customer&apos;s contract and the hardware is assumed to be worth nothing at maturity.</p>
    </div>
  );
}
