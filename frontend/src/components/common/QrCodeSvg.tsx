import React from 'react';

interface QrCodeSvgProps {
  value: string;
  size?: number;
  fgColor?: string;
  bgColor?: string;
  className?: string;
}

export const QrCodeSvg: React.FC<QrCodeSvgProps> = ({
  value,
  size = 140,
  fgColor = '#F59E0B',
  bgColor = '#000000',
  className = ''
}) => {
  // Deterministic 25x25 QR Matrix Generator
  const matrixSize = 25;
  const matrix: boolean[][] = Array(matrixSize).fill(null).map(() => Array(matrixSize).fill(false));

  // Helper to draw QR finder pattern (7x7 with 3x3 inner square)
  const drawFinder = (startX: number, startY: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (
          r === 0 || r === 6 || c === 0 || c === 6 || // Outer ring
          (r >= 2 && r <= 4 && c >= 2 && c <= 4)      // Inner square
        ) {
          matrix[startY + r][startX + c] = true;
        } else {
          matrix[startY + r][startX + c] = false;
        }
      }
    }
  };

  // 1. Draw 3 Finders: Top-Left, Top-Right, Bottom-Left
  drawFinder(0, 0);
  drawFinder(matrixSize - 7, 0);
  drawFinder(0, matrixSize - 7);

  // 2. Draw Timing Patterns
  for (let i = 8; i < matrixSize - 8; i++) {
    matrix[6][i] = i % 2 === 0;
    matrix[i][6] = i % 2 === 0;
  }

  // 3. Draw Alignment pattern at (16, 16)
  const alignX = 16, alignY = 16;
  for (let r = -2; r <= 2; r++) {
    for (let c = -2; c <= 2; c++) {
      matrix[alignY + r][alignX + c] = (Math.abs(r) === 2 || Math.abs(c) === 2 || (r === 0 && c === 0));
    }
  }

  // 4. Populate data cells deterministically from payload hash
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = ((hash << 5) - hash + value.charCodeAt(i)) | 0;
  }

  let bitIdx = 0;
  for (let r = 0; r < matrixSize; r++) {
    for (let c = 0; c < matrixSize; c++) {
      // Skip finder zones
      const inTopLeft = r < 8 && c < 8;
      const inTopRight = r < 8 && c >= matrixSize - 8;
      const inBottomLeft = r >= matrixSize - 8 && c < 8;
      const inTiming = (r === 6 && c >= 8 && c < matrixSize - 8) || (c === 6 && r >= 8 && r < matrixSize - 8);
      const inAlign = Math.abs(r - alignY) <= 2 && Math.abs(c - alignX) <= 2;

      if (!inTopLeft && !inTopRight && !inBottomLeft && !inTiming && !inAlign) {
        // pseudo-random pseudo-noise from hash + coords
        const pseudoVal = (Math.sin(hash + bitIdx * 97 + r * 13 + c * 31) * 10000);
        matrix[r][c] = (pseudoVal - Math.floor(pseudoVal)) > 0.45;
        bitIdx++;
      }
    }
  }

  return (
    <div
      className={`inline-block p-2 rounded-xl border border-white/10 ${className}`}
      style={{ backgroundColor: bgColor }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${matrixSize} ${matrixSize}`}
        className="w-full h-full shape-rendering-crispEdges"
      >
        <rect width={matrixSize} height={matrixSize} fill={bgColor} />
        {matrix.map((row, r) =>
          row.map((filled, c) =>
            filled ? (
              <rect
                key={`${r}-${c}`}
                x={c}
                y={r}
                width={1}
                height={1}
                fill={fgColor}
              />
            ) : null
          )
        )}
      </svg>
    </div>
  );
};
