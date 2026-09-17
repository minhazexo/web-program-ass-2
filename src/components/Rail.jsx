import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

// horizontal carousel rail - every step lands exactly on a card,
// never halfway between two (netflix style arrows + auto play)
function Rail({ title, link, children }) {
  const rowRef = useRef(null)
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(false)
  const [hover, setHover] = useState(false)
  const [barW, setBarW] = useState(0) // progress bar size + position (%)
  const [barX, setBarX] = useState(0)
  const dir = useRef(1) // auto slide direction, flips at the ends
  const lastTouch = useRef(0) // manual use pauses auto for a bit

  const updateArrows = () => {
    const el = rowRef.current
    if (!el) return
    setCanLeft(el.scrollLeft > 10)
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 10)
    // thin progress bar under the row
    setBarW(Math.max(8, (el.clientWidth / el.scrollWidth) * 100))
    setBarX((el.scrollLeft / el.scrollWidth) * 100)
  }

  // recheck when list loads + after images get their size
  useEffect(() => {
    updateArrows()
    const t = setTimeout(updateArrows, 1000)
    window.addEventListener('resize', updateArrows)
    return () => {
      clearTimeout(t)
      window.removeEventListener('resize', updateArrows)
    }
  }, [children])

  // which card is currently at the left edge
  const currentIndex = () => {
    const el = rowRef.current
    if (!el || el.children.length === 0) return 0
    const pad = parseFloat(getComputedStyle(el).paddingLeft) || 0
    let idx = 0
    for (let i = 0; i < el.children.length; i++) {
      if (el.children[i].offsetLeft - pad <= el.scrollLeft + 10) idx = i
      else break
    }
    return idx
  }

  // go to one exact card, clamped inside the row
  const goCard = (i, smooth = true) => {
    const el = rowRef.current
    if (!el || !el.children.length) return
    const n = Math.max(0, Math.min(el.children.length - 1, i))
    const pad = parseFloat(getComputedStyle(el).paddingLeft) || 0
    let behavior = smooth ? 'smooth' : 'auto'
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) behavior = 'auto'
    el.scrollTo({ left: el.children[n].offsetLeft - pad, behavior })
  }

  const slide = (d) => {
    lastTouch.current = Date.now()
    goCard(currentIndex() + d)
  }

  // auto carousel - one card at a time, turns around at each end
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setInterval(() => {
      const el = rowRef.current
      if (!el || hover || !el.children.length) return
      if (Date.now() - lastTouch.current < 5000) return
      let next = currentIndex() + dir.current
      if (next >= el.children.length) {
        dir.current = -1
        next = el.children.length - 2
      } else if (next < 0) {
        dir.current = 1
        next = 1
      }
      goCard(next)
    }, 3500)
    return () => clearInterval(t)
  }, [hover, children])

  return (
    <section className="rail">
      <div className="rail-head">
        <h2>{title}</h2>
        {link && <Link className="see-all" to={link}>See all →</Link>}
      </div>
      <div
        className="rail-wrap"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {canLeft && (
          <button className="rail-arrow left" aria-label="Scroll left" onClick={() => slide(-1)}>
            ‹
          </button>
        )}
        <div
          className="rail-row"
          ref={rowRef}
          onScroll={updateArrows}
          onTouchStart={() => (lastTouch.current = Date.now())}
        >
          {children}
        </div>
        {canRight && (
          <button className="rail-arrow right" aria-label="Scroll right" onClick={() => slide(1)}>
            ›
          </button>
        )}
      </div>
      <div className="rail-progress">
        <span style={{ width: barW + '%', left: barX + '%' }}></span>
      </div>
    </section>
  )
}

export default Rail
