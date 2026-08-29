/**
 * HoneyChain Pure-TypeScript Keccak-256 and Merkle Verification Engine
 * Problem Statement 26021 — Ministry of MSME, Coordination Section
 * Team: Beevil Knievel
 */

// Pure JS Keccak-256 for zero-dependency browser verification
function keccak256JS(data: Uint8Array): Uint8Array {
  const RC: bigint[] = [
    0x0000000000000001n, 0x0000000000008082n, 0x800000000000808an, 0x8000000080008000n,
    0x000000000000808bn, 0x0000000080000001n, 0x8000000080008081n, 0x8000000000008009n,
    0x000000000000008an, 0x0000000000000088n, 0x0000000080008009n, 0x000000008000000an,
    0x000000008000808bn, 0x800000000000008bn, 0x8000000000008089n, 0x8000000000008003n,
    0x8000000000008002n, 0x8000000000000080n, 0x000000000000800an, 0x800000008000000an,
    0x8000000080008081n, 0x8000000000008080n, 0x0000000080000001n, 0x8000000080008008n
  ];

  const ROTC: number[][] = [
    [0, 36, 3, 41, 18],
    [1, 44, 10, 45, 2],
    [62, 6, 43, 15, 61],
    [28, 55, 25, 21, 56],
    [27, 20, 39, 8, 14]
  ];

  const rateBytes = 136;
  const padlen = rateBytes - (data.length % rateBytes);
  const padded = new Uint8Array(data.length + padlen);
  padded.set(data);
  if (padlen === 1) {
    padded[data.length] = 0x81;
  } else {
    padded[data.length] = 0x01;
    padded[padded.length - 1] = 0x80;
  }

  const state: bigint[][] = Array.from({ length: 5 }, () => new Array<bigint>(5).fill(0n));

  const rol = (val: bigint, shift: number): bigint => {
    const s = BigInt(shift);
    return ((val << s) | (val >> (64n - s))) & 0xFFFFFFFFFFFFFFFFn;
  };

  for (let blockStart = 0; blockStart < padded.length; blockStart += rateBytes) {
    for (let i = 0; i < rateBytes / 8; i++) {
      const x = i % 5;
      const y = Math.floor(i / 5);
      const offset = blockStart + i * 8;
      let val = 0n;
      for (let b = 0; b < 8; b++) {
        val |= BigInt(padded[offset + b]) << BigInt(b * 8);
      }
      state[x][y] ^= val;
    }

    for (let round = 0; round < 24; round++) {
      const C: bigint[] = Array.from({ length: 5 }, (_, x) =>
        state[x][0] ^ state[x][1] ^ state[x][2] ^ state[x][3] ^ state[x][4]
      );
      const D: bigint[] = Array.from({ length: 5 }, (_, x) =>
        C[(x + 4) % 5] ^ rol(C[(x + 1) % 5], 1)
      );

      for (let x = 0; x < 5; x++) {
        for (let y = 0; y < 5; y++) {
          state[x][y] ^= D[x];
        }
      }

      const B: bigint[][] = Array.from({ length: 5 }, () => new Array<bigint>(5).fill(0n));
      for (let x = 0; x < 5; x++) {
        for (let y = 0; y < 5; y++) {
          B[y][(2 * x + 3 * y) % 5] = rol(state[x][y], ROTC[x][y]);
        }
      }

      for (let x = 0; x < 5; x++) {
        for (let y = 0; y < 5; y++) {
          state[x][y] = (B[x][y] ^ ((~B[(x + 1) % 5][y]) & B[(x + 2) % 5][y])) & 0xFFFFFFFFFFFFFFFFn;
        }
      }

      state[0][0] ^= RC[round];
    }
  }

  const out = new Uint8Array(32);
  for (let i = 0; i < 4; i++) {
    const x = i % 5;
    const y = Math.floor(i / 5);
    const val = state[x][y];
    for (let b = 0; b < 8; b++) {
      out[i * 8 + b] = Number((val >> BigInt(b * 8)) & 0xFFn);
    }
  }
  return out;
}

export function bytesToHex(bytes: Uint8Array): string {
  return "0x" + Array.from(bytes).map(b => b.toString(16).padStart(2, "0")).join("");
}

export function hexToBytes(hex: string): Uint8Array {
  const clean = hex.startsWith("0x") ? hex.slice(2) : hex;
  const bytes = new Uint8Array(clean.length / 2);
  for (let i = 0; i < clean.length; i += 2) {
    bytes[i / 2] = parseInt(clean.slice(i, i + 2), 16);
  }
  return bytes;
}

export function keccak256(data: Uint8Array): Uint8Array {
  return keccak256JS(data);
}

export function keccak256String(str: string): string {
  const enc = new TextEncoder().encode(str);
  return bytesToHex(keccak256(enc));
}

export function hashPair(left: Uint8Array, right: Uint8Array): Uint8Array {
  const leftBig = BigInt(bytesToHex(left));
  const rightBig = BigInt(bytesToHex(right));

  const combined = new Uint8Array(64);
  if (leftBig <= rightBig) {
    combined.set(left, 0);
    combined.set(right, 32);
  } else {
    combined.set(right, 0);
    combined.set(left, 32);
  }
  return keccak256(combined);
}

export function verifyMerkleProof(
  leafHex: string,
  proofHexArray: string[],
  rootHex: string
): boolean {
  let computed = hexToBytes(leafHex);
  for (const p of proofHexArray) {
    const proofElement = hexToBytes(p);
    computed = hashPair(computed, proofElement);
  }
  return bytesToHex(computed).toLowerCase() === rootHex.toLowerCase();
}
