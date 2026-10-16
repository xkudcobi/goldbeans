import { useEffect, useRef, useState } from 'react'
import cafe from '../config/cafe.js'

/*
 * Menü — içerik src/config/cafe.js → menu.
 *
 * Üstte gruplara atlayan bir şerit var. Menü 60+ ürün; telefonda tek sütun
 * olunca Tatlılar'a ulaşmak için ekranlarca kaydırmak gerekiyordu. Şerit
 * sabit başlığın altına yapışıyor, o an ekranda olan grubu vurguluyor.
 * Bağlantılar düz <a href="#..."> — kayarak gitmeyi useSmoothAnchors yapıyor.
 */

const groupId = (i) => `menu-grup-${i}`

/** Ekranın üst kısmındaki grubun sırası — şeritte vurgulanacak olan */
function useActiveGroup(count) {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const els = Array.from({ length: count }, (_, i) => document.getElementById(groupId(i)))
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting)
        if (!hit.length) return
        /* aynı anda birkaç grup girerse en üsttekini al */
        hit.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        setActive(els.indexOf(hit[0].target))
      },
      /* sadece ekranın üst şeridi sayılıyor: başlığın hemen altı */
      { rootMargin: '-140px 0px -55% 0px' },
    )
    els.forEach((el) => el && io.observe(el))
    return () => io.disconnect()
  }, [count])

  return active
}

export default function MenuSection() {
  const active = useActiveGroup(cafe.menu.length)
  const navRef = useRef(null)

  /* vurgulanan düğme şeritte görünmüyorsa şeridi yana kaydır */
  useEffect(() => {
    const nav = navRef.current
    const chip = nav?.children[active]
    if (!chip) return
    const left = chip.offsetLeft - (nav.clientWidth - chip.offsetWidth) / 2
    nav.scrollTo({ left: Math.max(0, left), behavior: 'smooth' })
  }, [active])

  return (
    <section className="menu" id="menu">
      <header className="section-head">
        <p className="section-head__kicker">MENÜ</p>
        <h2 className="section-head__title">Tezgahta ne var</h2>
      </header>

      <nav className="menu__nav" aria-label="Menü grupları" ref={navRef}>
        {cafe.menu.map((group, i) => (
          <a
            key={group.group}
            className={`menu__chip${i === active ? ' is-active' : ''}`}
            href={`#${groupId(i)}`}
            aria-current={i === active ? 'true' : undefined}
          >
            {group.group}
          </a>
        ))}
      </nav>

      <div className="menu__grid">
        {cafe.menu.map((group, i) => (
          <div className="menu__group" key={group.group} id={groupId(i)}>
            <h3 className="menu__group-title">{group.group}</h3>
            <ul className="menu__list">
              {group.items.map((item) => (
                <li className="menu__item" key={item.name}>
                  <span className="menu__item-main">
                    <span className="menu__item-name">{item.name}</span>
                    {item.note && <span className="menu__item-note">{item.note}</span>}
                  </span>
                  <span className="menu__dots" aria-hidden="true" />
                  <span className="menu__item-price">{item.price}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="menu__footnote">{cafe.footerNote}</p>
    </section>
  )
}
