// components/icons/ColmenasIcon.tsx
import React from 'react';
import Svg, { Rect, Path } from 'react-native-svg';

type Props = { color?: string; size?: number };

export default function ColmenasIcon({ color = '#000', size = 24 }: Props) {
  const s = size;
  const stroke = color;
  const sw = Math.max(1.5, size * 0.07); // grosor relativo

  return (
    <Svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      {/* Techo */}
      <Path
        d="M4 7 L8 4 H16 L20 7"
        stroke={stroke}
        strokeWidth={sw}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Cuerpo */}
      <Rect
        x={5}
        y={7}
        width={14}
        height={13}
        rx={2}
        stroke={stroke}
        strokeWidth={sw}
      />
      {/* Patas */}
      <Path d="M8 20 v2 M16 20 v2" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      {/* Cajones / aberturas */}
      <Path d="M9 10 h6" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      <Path d="M9 13 h6" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      <Path d="M9 16 h6" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
    </Svg>
  );
}