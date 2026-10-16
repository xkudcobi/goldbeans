import { CameraIcon, Hourglass } from './icons.jsx'

/*
 * Fotoğrafı olmayan şubenin kapağında / galerisinde duran içerik.
 *
 *   henüz açılmadı (soon) → kum saati + bekleme notu (cafe.js → soonNote)
 *   açık ama fotoğraf yok → kamera + "fotoğraflar yakında"
 *
 * Kabı çağıran veriyor (kart kapağı ya da galeri kutusu).
 */
export default function NoPhotos({ branch }) {
  if (branch.soon) {
    return (
      <>
        <Hourglass />
        <span>{branch.soonNote ?? 'çok yakında'}</span>
      </>
    )
  }
  return (
    <>
      <CameraIcon />
      <span>fotoğraflar yakında</span>
    </>
  )
}
