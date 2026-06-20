export type ResolveStatus = "ok" | "revoked" | "not_found" | "mismatch";

export interface ResolveResult {
  status: ResolveStatus;
  content?: Uint8Array;
  cid?: string;
}
