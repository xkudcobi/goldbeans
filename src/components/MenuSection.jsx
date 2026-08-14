import cafe from '../config/cafe.js'

/* Menü — içerik src/config/cafe.js'ten geliyor */

export default function MenuSection() {
  return (
    <section className="menu" id="menu">
      <header className="section-head">
        <p className="section-head__kicker">
          <span className="pulser" aria-hidden="true" />
          MENÜ
        </p>
        <h2 className="section-head__title">Tezgahta ne var</h2>
      </header>

      <div className="menu__grid">
        {cafe.menu.map((group) => (
          <div className="menu__group" key={group.group}>
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
