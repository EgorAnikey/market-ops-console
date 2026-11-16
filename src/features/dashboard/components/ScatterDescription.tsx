import { shareSnapshotNote } from "../hooks/useShareSnapshot";

interface ScatterDescriptionProps {
  current: { name: string } | undefined;
  region: string | undefined;
  shareAsOf: string | null;
  unavailable: boolean;
  onSelectSeveral: () => void;
}

export function ScatterDescription(props: ScatterDescriptionProps) {
  const { current, region, shareAsOf, unavailable, onSelectSeveral } = props;
  if (unavailable) return "Each market's growth against its market share.";
  return (
    <>
      {current ? (
        <>
          {current.name} among {region ?? "its"} markets. Pick one to open it, or{" "}
          <button
            type="button"
            onClick={onSelectSeveral}
            className="touch-target text-accent hover:underline"
          >
            select several in {region ?? "the region"}
          </button>
          .
        </>
      ) : (
        "Drag across markets to focus the tables below."
      )}{" "}
      Bubble size is revenue.
      {shareAsOf ? ` ${shareSnapshotNote(shareAsOf)}` : null}
    </>
  );
}
