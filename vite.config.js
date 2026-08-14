import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/*
 * base: GitHub Pages'te site kökte değil, /<repo>/ altında duruyor.
 * Dev'de ve kökten yayınlarken '/' olması gerekiyor, o yüzden ortam
 * değişkeniyle veriliyor — deploy iş akışı BASE_PATH'i ayarlıyor
 * (.github/workflows/deploy.yml).
 *
 * Çizimlerin içindeki varlık yolları __BASE__ yer tutucusuyla yazılıyor ve
 * bu değerle dolduruluyor (src/components/Stage.jsx).
 */
export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  plugins: [react()],
})
