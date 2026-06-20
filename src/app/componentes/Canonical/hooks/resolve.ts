import { createPublicClient, http, type Address, type Hex } from "viem";
import { chains } from "@lens-chain/sdk/viem";
import { INFURA_GATEWAY } from "../../../lib/constants";
import type { ResolveResult } from "../types/canonical.types";

const client = createPublicClient({
  chain: chains.mainnet,
  transport: http("https://rpc.lens.xyz"),
});

const canonicalAbi = [
  {
    type: "function",
    name: "canonicals",
    stateMutability: "view",
    inputs: [{ name: "id", type: "uint256" }],
    outputs: [
      { name: "parentId", type: "uint256" },
      { name: "author", type: "address" },
      { name: "project", type: "address" },
      { name: "contentRoot", type: "bytes32" },
      { name: "version", type: "uint64" },
      { name: "revoked", type: "bool" },
      { name: "exists", type: "bool" },
    ],
  },
] as const;

const contentAbi = [
  {
    type: "function",
    name: "contents",
    stateMutability: "view",
    inputs: [{ name: "id", type: "uint256" }],
    outputs: [
      { name: "ownerTag", type: "bytes32" },
      { name: "contentHash", type: "bytes32" },
      { name: "version", type: "uint64" },
      { name: "exists", type: "bool" },
      { name: "revoked", type: "bool" },
    ],
  },
] as const;

const ZERO_HASH =
  "0x0000000000000000000000000000000000000000000000000000000000000000";
const BASE58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

function hexToBytes(hex: string): Uint8Array {
  const clean = hex.startsWith("0x") ? hex.slice(2) : hex;
  const out = new Uint8Array(clean.length / 2);
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}

function bytesToHex(bytes: Uint8Array): string {
  return (
    "0x" +
    Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
  );
}

function base58btc(bytes: Uint8Array): string {
  const digits = [0];
  for (let i = 0; i < bytes.length; i++) {
    let carry = bytes[i];
    for (let j = 0; j < digits.length; j++) {
      carry += digits[j] << 8;
      digits[j] = carry % 58;
      carry = (carry / 58) | 0;
    }
    while (carry > 0) {
      digits.push(carry % 58);
      carry = (carry / 58) | 0;
    }
  }
  let result = "";
  for (let i = 0; i < bytes.length && bytes[i] === 0; i++) result += "1";
  for (let i = digits.length - 1; i >= 0; i--) result += BASE58[digits[i]];
  return result;
}

function cidV0FromSha256(digestHex: Hex): string {
  const digest = hexToBytes(digestHex);
  const multihash = new Uint8Array(2 + digest.length);
  multihash[0] = 0x12;
  multihash[1] = 0x20;
  multihash.set(digest, 2);
  return base58btc(multihash);
}

async function sha256(bytes: Uint8Array): Promise<Uint8Array> {
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return new Uint8Array(digest);
}

export async function resolveByHash(
  contentHash: Hex,
  gateway: string = INFURA_GATEWAY
): Promise<ResolveResult> {
  if (contentHash === ZERO_HASH) return { status: "revoked" };
  const cid = cidV0FromSha256(contentHash);
  const res = await fetch(`${gateway}/ipfs/${cid}`);
  if (!res.ok) return { status: "not_found" };
  const buf = new Uint8Array(await res.arrayBuffer());
  const got = bytesToHex(await sha256(buf));
  if (got.toLowerCase() !== contentHash.toLowerCase()) {
    return { status: "mismatch" };
  }
  return { status: "ok", content: buf, cid };
}

export async function resolveCanonical(
  registry: Address,
  id: bigint,
  gateway?: string
): Promise<ResolveResult> {
  const record = await client.readContract({
    address: registry,
    abi: canonicalAbi,
    functionName: "canonicals",
    args: [id],
  });
  const contentRoot = record[3];
  const revoked = record[5];
  const exists = record[6];
  if (!exists) return { status: "not_found" };
  if (revoked) return { status: "revoked" };
  return resolveByHash(contentRoot, gateway);
}

export async function resolveComment(
  registry: Address,
  id: bigint,
  gateway?: string
): Promise<ResolveResult> {
  const record = await client.readContract({
    address: registry,
    abi: contentAbi,
    functionName: "contents",
    args: [id],
  });
  const contentHash = record[1];
  const exists = record[3];
  const revoked = record[4];
  if (!exists) return { status: "not_found" };
  if (revoked) return { status: "revoked" };
  return resolveByHash(contentHash, gateway);
}
