"use client";

import { create } from "zustand";
import {
  getCookie,
  setActiveCenterCookie,
  deleteActiveCenterCookie,
  setActiveBranchCookie,
  deleteActiveBranchCookie,
} from "@/lib/cookies";

export interface CenterInfo {
  id: string;
  name: string;
  students_count?: number;
  revenue?: number;
  is_active?: boolean;
}

export interface BranchInfo {
  id: string;
  name: string;
  address?: string;
}

interface ActiveCenterState {
  // ── Center ──────────────────────────────────────────────
  activeCenter: string | null;
  centers: CenterInfo[];
  isCentersLoaded: boolean;
  setActiveCenter: (id: string) => void;
  setCenters: (centers: CenterInfo[]) => void;
  initFromIds: (ids: string[]) => void;

  // ── Branch ──────────────────────────────────────────────
  activeBranch: string | null;
  branches: BranchInfo[];
  isBranchesLoaded: boolean;
  setActiveBranch: (id: string) => void;
  setBranches: (branches: BranchInfo[]) => void;
  initBranchFromList: (branches: BranchInfo[]) => void;
  resetBranch: () => void;

  // ── Combined ────────────────────────────────────────────
  reset: () => void;
}

export const useActiveCenterStore = create<ActiveCenterState>((set, get) => ({
  // ── Center ──────────────────────────────────────────────
  activeCenter: null,
  centers: [],
  isCentersLoaded: false,

  setActiveCenter: (id) => {
    setActiveCenterCookie(id);
    // Center o'zgarganda branchni reset qilamiz
    deleteActiveBranchCookie();
    set({
      activeCenter: id,
      activeBranch: null,
      branches: [],
      isBranchesLoaded: false,
    });
  },

  setCenters: (centers) => {
    set({ centers, isCentersLoaded: true });
  },

  initFromIds: (ids) => {
    if (!ids.length) {
      // center_ids bo'sh — loaded lekin center yo'q
      set({ isCentersLoaded: true, activeCenter: null });
      return;
    }
    const cookieVal = getCookie("active_center");
    const valid =
      cookieVal && ids.includes(cookieVal) ? cookieVal : ids[0];
    setActiveCenterCookie(valid);
    set({ activeCenter: valid, isCentersLoaded: true });
  },

  // ── Branch ──────────────────────────────────────────────
  activeBranch: null,
  branches: [],
  isBranchesLoaded: false,

  setActiveBranch: (id) => {
    setActiveBranchCookie(id);
    set({ activeBranch: id });
  },

  setBranches: (branches) => {
    set({ branches, isBranchesLoaded: true });
  },

  initBranchFromList: (branches) => {
    if (!branches.length) {
      set({ branches, isBranchesLoaded: true, activeBranch: null });
      return;
    }
    set({ branches, isBranchesLoaded: true });
    const cookieVal = getCookie("active_branch");
    const ids = branches.map((b) => b.id);
    const valid =
      cookieVal && ids.includes(cookieVal) ? cookieVal : ids[0];
    if (get().activeBranch !== valid) {
      setActiveBranchCookie(valid);
      set({ activeBranch: valid });
    }
  },

  resetBranch: () => {
    deleteActiveBranchCookie();
    set({ activeBranch: null, branches: [], isBranchesLoaded: false });
  },

  // ── Combined ────────────────────────────────────────────
  reset: () => {
    deleteActiveCenterCookie();
    deleteActiveBranchCookie();
    set({
      activeCenter: null,
      centers: [],
      isCentersLoaded: false,
      activeBranch: null,
      branches: [],
      isBranchesLoaded: false,
    });
  },
}));
