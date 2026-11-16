"use client";

import {
  createContext,
  startTransition,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { Dataset } from "@/contracts/dataset";
import type { LiveTick } from "@/contracts/live";
import { applyLiveTick } from "@/domain/live";
import { useDashboardState } from "@/features/dashboard/state/useDashboardState";
import { LiveDatasetContext } from "@/features/dataset/LiveDatasetContext";
import { datasetQueryKey } from "@/features/dataset/queries";
import { MotionRevisionContext } from "@/hooks/useMotionRevision";
import { useLiveFeed, type LiveStatus } from "./useLiveFeed";

interface LiveContextValue {
  enabled: boolean;
  revision: number;
  status: LiveStatus;
  updatedAt: string | null;
  setEnabled: (on: boolean) => void;
}

const LiveContext = createContext<LiveContextValue | null>(null);

export function LiveProvider({ children }: { children: ReactNode }) {
  const { live, setLive } = useDashboardState();
  const queryClient = useQueryClient();
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [revision, setRevision] = useState(0);
  const [wasLive, setWasLive] = useState(live);
  if (wasLive !== live) {
    setWasLive(live);
    if (!live) {
      setDataset(null);
      setUpdatedAt(null);
    }
  }

  const onTick = useCallback(
    (tick: LiveTick) => {
      const base = queryClient.getQueryData<Dataset>(datasetQueryKey);
      if (!base) return;
      startTransition(() => {
        setDataset(applyLiveTick(base, tick));
        setRevision((r) => r + 1);
        setUpdatedAt(tick.at);
      });
    },
    [queryClient],
  );
  const status = useLiveFeed(live, onTick);

  const value = useMemo(
    () => ({ enabled: live, revision, status, updatedAt, setEnabled: setLive }),
    [live, revision, status, updatedAt, setLive],
  );
  return (
    <LiveDatasetContext value={dataset}>
      <MotionRevisionContext value={revision}>
        <LiveContext value={value}>{children}</LiveContext>
      </MotionRevisionContext>
    </LiveDatasetContext>
  );
}

export function useLive(): LiveContextValue {
  const ctx = useContext(LiveContext);
  if (!ctx) throw new Error("useLive must be used inside <LiveProvider>");
  return ctx;
}
