import useHover from '../hooks/useHover.js'

/*
 * Sahnedeki her etkileşimli öğe için ortak sarmalayıcı.
 *
 * Üç kılıkta çıkıyor:
 *   href    → link (fincanlar menüye gider)
 *   onClick → düğme (lamba sunset'i, radyo müziği açıp kapatıyor)
 *   ikisi de yoksa → sadece hover'a tepki veren dekor
 *
 * `external` siteden çıkan linkler için (Instagram): yeni sekmede açar.
 *
 * Hover'da varyant swap + isteğe bağlı scale, geçişsiz.
 *
 * DOKUNMATİK: linklerde ilk dokunuş etiketi açıyor, ikincisi gidiyor
 * (hooks/useHover.js'teki `guard`). Düğmelerde böyle bir bekleme YOK —
 * lambaya dokununca sunset anında açılıyor. Sebep: düğmede balonun
 * anlatacağı bir şey yok, sonucu zaten gözünle görüyorsun; linkte ise
 * beklemenin amacı fiyat/bilgi etiketini okuyabilmen.
 */

/** İkinci dokunuşun ne yapacağı — "tekrar dokun" rozetinin yazısı */
function againText(href, external) {
  if (href.startsWith('tel:')) return 'aramak için tekrar dokun'
  return external ? 'açmak için tekrar dokun' : 'gitmek için tekrar dokun'
}

export default function InteractiveProp({
  name,
  className = '',
  href,
  external,
  style,
  onClick,
  pressed,
  scale = true,
  children,
}) {
  const [hot, bind, guard, armed] = useHover()

  const cls = [
    'iprop',
    hot ? 'is-hot' : '',
    armed ? 'is-armed' : '',
    pressed ? 'is-on' : '',
    scale ? 'iprop--scales' : '',
    className,
  ].filter(Boolean).join(' ')

  const content = typeof children === 'function' ? children(hot) : children

  if (href) {
    return (
      <a
        className={cls}
        href={href}
        aria-label={name}
        style={style}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        /*
         * Parmakla ilk dokunuş linki İZLEMİYOR, sadece etiketi açıyor —
         * fincanın fiyatını görmeden menüye fırlamasın diye. İkinci
         * dokunuş normal şekilde gidiyor. Fare etkilenmiyor.
         */
        onClick={guard}
        {...bind}
      >
        {content}
        {/*
         * İlk dokunuştan sonra "bu çalışmadı" sanılmasın — balonun yanında
         * ikinci dokunuşun ne yapacağı yazıyor. Sadece parmakla, sadece
         * bekçi kuruluyken görünüyor.
         */}
        <span className="iprop__again" aria-hidden="true">
          {againText(href, external)}
        </span>
      </a>
    )
  }

  if (onClick) {
    return (
      <button
        type="button"
        className={cls}
        aria-label={name}
        aria-pressed={pressed}
        style={style}
        onClick={onClick}
        {...bind}
      >
        {content}
      </button>
    )
  }

  return (
    <div className={cls} role="img" aria-label={name} style={style} tabIndex={0} {...bind}>
      {content}
    </div>
  )
}
