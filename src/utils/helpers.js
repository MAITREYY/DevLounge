import confetti from 'canvas-confetti';

/**
 * Calculates CSS clamp() expression and exact slope parameters
 */
export function calculateFluidClamp(minPx, maxPx, minVw, maxVw, rootFont = 16) {
  const minFontSize = parseFloat(minPx);
  const maxFontSize = parseFloat(maxPx);
  const minViewport = parseFloat(minVw);
  const maxViewport = parseFloat(maxVw);

  if (isNaN(minFontSize) || isNaN(maxFontSize) || isNaN(minViewport) || isNaN(maxViewport)) {
    return { error: 'Invalid input values' };
  }

  const minRem = (minFontSize / rootFont).toFixed(4);
  const maxRem = (maxFontSize / rootFont).toFixed(4);

  // Slope calculation
  const slope = (maxFontSize - minFontSize) / (maxViewport - minViewport);
  const slopeVw = (slope * 100).toFixed(4);

  // Y-axis intercept calculation
  const interceptPx = minFontSize - slope * minViewport;
  const interceptRem = (interceptPx / rootFont).toFixed(4);

  const clampCss = `clamp(${minRem}rem, ${interceptRem}rem + ${slopeVw}vw, ${maxRem}rem)`;
  const clampCssPx = `clamp(${minFontSize}px, ${interceptPx.toFixed(2)}px + ${slopeVw}vw, ${maxFontSize}px)`;
  const tailwindValue = `text-[clamp(${minRem}rem,${interceptRem}rem+${slopeVw}vw,${maxRem}rem)]`;

  return {
    minRem,
    maxRem,
    slopeVw,
    interceptRem,
    interceptPx: interceptPx.toFixed(2),
    clampCss,
    clampCssPx,
    tailwindValue,
    slopeVal: slope,
  };
}

/**
 * Calculates current font size given a specific viewport width
 */
export function getInterpolatedFontSize(minPx, maxPx, minVw, maxVw, currentVw) {
  const minFontSize = parseFloat(minPx);
  const maxFontSize = parseFloat(maxPx);
  const minViewport = parseFloat(minVw);
  const maxViewport = parseFloat(maxVw);
  const currVw = parseFloat(currentVw);

  if (currVw <= minViewport) return minFontSize;
  if (currVw >= maxViewport) return maxFontSize;

  const progress = (currVw - minViewport) / (maxViewport - minViewport);
  return (minFontSize + progress * (maxFontSize - minFontSize)).toFixed(2);
}

/**
 * Calculates luminance and WCAG 2.1 contrast ratio
 */
export function getContrastRatio(hexColor1, hexColor2) {
  const getRGB = (hex) => {
    let cleanHex = hex.replace('#', '');
    if (cleanHex.length === 3) {
      cleanHex = cleanHex.split('').map(c => c + c).join('');
    }
    const num = parseInt(cleanHex, 16);
    return [ (num >> 16) & 255, (num >> 8) & 255, num & 255 ];
  };

  const getLuminance = (rgb) => {
    const a = rgb.map(v => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };

  try {
    const lum1 = getLuminance(getRGB(hexColor1));
    const lum2 = getLuminance(getRGB(hexColor2));
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    const ratio = (brightest + 0.05) / (darkest + 0.05);
    return {
      ratio: ratio.toFixed(2),
      passAA: ratio >= 4.5,
      passAAA: ratio >= 7.0,
      passLargeAA: ratio >= 3.0,
    };
  } catch (e) {
    return { ratio: 'N/A', passAA: true, passAAA: true, passLargeAA: true };
  }
}

/**
 * Triggers feedback confetti on copy
 */
export function triggerCopyConfetti() {
  try {
    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#10b981', '#34d399', '#059669', '#f59e0b'],
    });
  } catch (e) {
    // Ignore if canvas confetti fails
  }
}
