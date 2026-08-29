/**
 * HoneyChain Pure-TypeScript QR Code and Vector SVG Generator
 * Supports Byte-Mode encoding, Galois Field GF(256) Reed-Solomon Error Correction,
 * Format info calculation, standard masking, and high-resolution SVG rendering.
 */

// Galois Field GF(256) Exponential and Logarithmic Tables (Primitive polynomial 0x11D / 285)
const GF256_EXP = new Uint8Array(512);
const GF256_LOG = new Uint8Array(256);

(() => {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    GF256_EXP[i] = x;
    GF256_EXP[i + 255] = x;
    GF256_LOG[x] = i;
    x = (x << 1) ^ (x & 0x80 ? 0x11d : 0);
  }
})();

function gfMultiply(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return GF256_EXP[GF256_LOG[a] + GF256_LOG[b]];
}

function rsGeneratorPoly(degree: number): Uint8Array {
  let poly = new Uint8Array([1]);
  for (let i = 0; i < degree; i++) {
    const nextPoly = new Uint8Array(poly.length + 1);
    const factor = GF256_EXP[i];
    for (let j = 0; j < poly.length; j++) {
      nextPoly[j] ^= gfMultiply(poly[j], factor);
      nextPoly[j + 1] ^= poly[j];
    }
    poly = nextPoly;
  }
  return poly;
}

function rsCalculateEcc(data: Uint8Array, eccCount: number): Uint8Array {
  const genPoly = rsGeneratorPoly(eccCount);
  const result = new Uint8Array(data.length + eccCount);
  result.set(data, 0);

  for (let i = 0; i < data.length; i++) {
    const factor = result[i];
    if (factor !== 0) {
      for (let j = 0; j < genPoly.length; j++) {
        result[i + j] ^= gfMultiply(genPoly[j], factor);
      }
    }
  }
  return result.slice(data.length);
}

// Version table parameters for Error Correction Level M
interface QrVersionInfo {
  version: number;
  size: number;
  totalBytes: number;
  dataBytes: number;
  eccBytes: number;
  alignmentPositions: number[];
}

const QR_VERSIONS_M: QrVersionInfo[] = [
  { version: 1, size: 21, totalBytes: 26, dataBytes: 16, eccBytes: 10, alignmentPositions: [] },
  { version: 2, size: 25, totalBytes: 44, dataBytes: 28, eccBytes: 16, alignmentPositions: [6, 18] },
  { version: 3, size: 29, totalBytes: 70, dataBytes: 44, eccBytes: 26, alignmentPositions: [6, 22] },
  { version: 4, size: 33, totalBytes: 100, dataBytes: 64, eccBytes: 36, alignmentPositions: [6, 26] },
  { version: 5, size: 37, totalBytes: 134, dataBytes: 86, eccBytes: 48, alignmentPositions: [6, 30] },
  { version: 6, size: 41, totalBytes: 172, dataBytes: 108, eccBytes: 64, alignmentPositions: [6, 34] },
];

export function encodeQrToMatrix(text: string): boolean[][] {
  const textBytes = new TextEncoder().encode(text);
  const length = textBytes.length;

  let verInfo = QR_VERSIONS_M.find(v => v.dataBytes - 2 >= length);
  if (!verInfo) {
    verInfo = QR_VERSIONS_M[QR_VERSIONS_M.length - 1];
  }

  // 1. Bit Buffer packing for Byte Mode (0100) + 8-bit character count indicator
  const bitArray: number[] = [];
  const pushBits = (value: number, bitLength: number) => {
    for (let i = bitLength - 1; i >= 0; i--) {
      bitArray.push((value >> i) & 1);
    }
  };

  // Byte mode indicator: 0100
  pushBits(0b0100, 4);
  // Character count (8-bit for version 1-9)
  pushBits(length, 8);
  // Data bytes
  for (const byte of textBytes) {
    pushBits(byte, 8);
  }

  // Terminator (up to 4 zeroes)
  const maxDataBits = verInfo.dataBytes * 8;
  const termLen = Math.min(4, maxDataBits - bitArray.length);
  for (let i = 0; i < termLen; i++) bitArray.push(0);

  // Pad to byte boundary
  while (bitArray.length % 8 !== 0) {
    bitArray.push(0);
  }

  // Convert to byte array
  const dataBytes = new Uint8Array(verInfo.dataBytes);
  for (let i = 0; i < bitArray.length; i += 8) {
    let b = 0;
    for (let j = 0; j < 8; j++) {
      b = (b << 1) | bitArray[i + j];
    }
    dataBytes[i / 8] = b;
  }

  // Add pad bytes: 0xEC (11101100) and 0x11 (00010001) alternately
  const padSequence = [0xec, 0x11];
  let padIdx = 0;
  for (let i = bitArray.length / 8; i < verInfo.dataBytes; i++) {
    dataBytes[i] = padSequence[padIdx % 2];
    padIdx++;
  }

  // 2. Compute Reed-Solomon Error Correction Codewords
  const eccCodewords = rsCalculateEcc(dataBytes, verInfo.eccBytes);

  // Combine data + ECC
  const finalCodewords = new Uint8Array(verInfo.totalBytes);
  finalCodewords.set(dataBytes, 0);
  finalCodewords.set(eccCodewords, dataBytes.length);

  // 3. Initialize Matrix & Function module tracker
  const N = verInfo.size;
  const matrix: boolean[][] = Array.from({ length: N }, () => new Array<boolean>(N).fill(false));
  const isFunction: boolean[][] = Array.from({ length: N }, () => new Array<boolean>(N).fill(false));

  const setModule = (r: number, c: number, val: boolean, markFunc = true) => {
    if (r >= 0 && r < N && c >= 0 && c < N) {
      matrix[r][c] = val;
      if (markFunc) isFunction[r][c] = true;
    }
  };

  // Place Finder Pattern (7x7) + Separator (8x8)
  const placeFinder = (row: number, col: number) => {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const nr = row + r;
        const nc = col + c;
        if (nr >= 0 && nr < N && nc >= 0 && nc < N) {
          if (r >= 0 && r <= 6 && c >= 0 && c <= 6) {
            const isDark = (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4));
            setModule(nr, nc, isDark);
          } else {
            setModule(nr, nc, false);
          }
        }
      }
    }
  };

  placeFinder(0, 0);
  placeFinder(0, N - 7);
  placeFinder(N - 7, 0);

  // Timing patterns
  for (let i = 8; i < N - 8; i++) {
    const dark = i % 2 === 0;
    if (!isFunction[6][i]) setModule(6, i, dark);
    if (!isFunction[i][6]) setModule(i, 6, dark);
  }

  // Alignment patterns
  const alignPos = verInfo.alignmentPositions;
  if (alignPos.length > 0) {
    for (const r of alignPos) {
      for (const c of alignPos) {
        if (isFunction[r][c]) continue;
        for (let dr = -2; dr <= 2; dr++) {
          for (let dc = -2; dc <= 2; dc++) {
            const isDark = Math.abs(dr) === 2 || Math.abs(dc) === 2 || (dr === 0 && dc === 0);
            setModule(r + dr, c + dc, isDark);
          }
        }
      }
    }
  }

  // Dark module
  setModule(4 * verInfo.version + 9, 8, true);

  // Reserve format information areas
  for (let i = 0; i <= 8; i++) {
    if (!isFunction[8][i]) isFunction[8][i] = true;
    if (!isFunction[i][8]) isFunction[i][8] = true;
  }
  for (let i = N - 8; i < N; i++) {
    if (!isFunction[8][i]) isFunction[8][i] = true;
    if (!isFunction[i][8]) isFunction[i][8] = true;
  }

  // 4. Place Data Codewords (Zigzag 2-column tracks from right to left)
  const fullBits: number[] = [];
  for (const b of finalCodewords) {
    for (let i = 7; i >= 0; i--) {
      fullBits.push((b >> i) & 1);
    }
  }

  let bitIdx = 0;
  let upwards = true;
  for (let right = N - 1; right > 0; right -= 2) {
    if (right === 6) right--; // Skip vertical timing column
    const cols = [right, right - 1];

    const rows = upwards
      ? Array.from({ length: N }, (_, i) => N - 1 - i)
      : Array.from({ length: N }, (_, i) => i);

    for (const r of rows) {
      for (const c of cols) {
        if (!isFunction[r][c]) {
          const bit = bitIdx < fullBits.length ? fullBits[bitIdx++] : 0;
          matrix[r][c] = bit === 1;
        }
      }
    }
    upwards = !upwards;
  }

  // 5. Apply Mask 0: (row + col) % 2 == 0 to data modules
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      if (!isFunction[r][c]) {
        if ((r + c) % 2 === 0) {
          matrix[r][c] = !matrix[r][c];
        }
      }
    }
  }

  // 6. Write Format Info: EC Level M (00) + Mask 0 (000) = 00000 -> BCH format word 0x5412 (15 bits: 101010000010010)
  // Format bit string with standard mask 0x5412 applied: 101010000010010
  const formatBits = [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0];

  // Top-left format placement
  const tlCoords: [number, number][] = [
    [8, 0], [8, 1], [8, 2], [8, 3], [8, 4], [8, 5],
    [8, 7], [8, 8], [7, 8], [5, 8], [4, 8], [3, 8],
    [2, 8], [1, 8], [0, 8]
  ];
  for (let i = 0; i < 15; i++) {
    const [r, c] = tlCoords[i];
    matrix[r][c] = formatBits[i] === 1;
  }

  // Split format placement: bottom-left and top-right
  for (let i = 0; i < 7; i++) {
    matrix[N - 1 - i][8] = formatBits[i] === 1;
  }
  for (let i = 7; i < 15; i++) {
    matrix[8][N - 15 + i] = formatBits[i] === 1;
  }

  return matrix;
}

/**
 * Generate an optimized SVG path d="..." string for dark modules
 */
export function matrixToSvgPath(matrix: boolean[][], size = 200, margin = 2): string {
  const N = matrix.length;
  const totalDim = N + margin * 2;
  const cellSize = size / totalDim;

  const paths: string[] = [];
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      if (matrix[r][c]) {
        const x = (c + margin) * cellSize;
        const y = (r + margin) * cellSize;
        paths.push(`M${x.toFixed(2)},${y.toFixed(2)}h${cellSize.toFixed(2)}v${cellSize.toFixed(2)}h-${cellSize.toFixed(2)}z`);
      }
    }
  }
  return paths.join(" ");
}
