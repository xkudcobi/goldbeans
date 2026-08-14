/** Bir sahne öğesini tuval koordinatlarına oturtan kutu — hover alanı da bu. */
export default function boxStyle(p) {
  return { left: `${p.x}px`, top: `${p.y}px`, width: `${p.w}px`, height: `${p.h}px` }
}
