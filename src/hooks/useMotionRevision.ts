"use client";

import { createContext, useContext } from "react";

export const MotionRevisionContext = createContext(0);

export const useMotionRevision = (): number => useContext(MotionRevisionContext);
