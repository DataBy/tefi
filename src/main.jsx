import React, { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { motion, AnimatePresence, useReducedMotion, useScroll } from 'motion/react'
import { Heart, HeartPulse, Stethoscope, Flower2, Volume2, VolumeX, ArrowDown, ArrowUp, Sparkles, X, MailOpen, ChevronDown } from 'lucide-react'
import './styles.css'

const FLOWERS = [
  {
    id: 'vocacion',
    label: 'Tu vocación',
    kicker: '01 · UNA COSA QUE ADMIRO',
    title: 'La forma en que cuidas.',
    message: 'Me parece muy bonito que hayas elegido una profesión donde tu tiempo, tus manos y tu corazón pueden hacer la diferencia en la vida de alguien. Eso dice mucho de ti.',
    petal: '#f3aebc',
    petalLight: '#ffe0e5',
    center: '#f7d98a',
    turns: 9,
    tilt: -8,
  },
  {
    id: 'ternura',
    label: 'Tu esencia',
    kicker: '02 · OTRA COSITA',
    title: 'Esos detalles tan tuyos.',
    message: 'Hay personas que tienen una manera especial de hacer sentir bien a quienes están cerca. Me gusta ir descubriendo esas pequeñas cosas que te hacen ser tú.',
    petal: '#c9b8e9',
    petalLight: '#efe7ff',
    center: '#f9d38c',
    turns: 8,
    tilt: 5,
  },
  {
    id: 'flores',
    label: 'Tus flores',
    kicker: '03 · Y UNA MÁS',
    title: 'Tu manera de florecer.',
    message: 'Me encanta que entre los días intensos, los hospitales y tantas responsabilidades, guardes también un espacio para las flores y las cosas bonitas. Quise hacerte una de esas cosas bonitas.',
    petal: '#f5c982',
    petalLight: '#ffedc3',
    center: '#9e6b4b',
    turns: 11,
    tilt: 10,
  },
]

const SMALL_PETALS = Array.from({ length: 19 }, (_, i) => ({
  id: i,
  x: Math.sin(i * 2.13) * (105 + (i % 4) * 38),
  y: -70 - (i % 5) * 46,
  rotate: (i % 2 ? 1 : -1) * (70 + i * 21),
  delay: (i % 7) * 0.048,
  color: ['#f4b8c5', '#fbd9b5', '#e8d2f5', '#fff0ee'][i % 4],
}))

function SoundFX() {
  const contextRef = useRef(null)
  const play = (freq = 740, volume = 0.035) => {
    try {
      const Audio = window.AudioContext || window.webkitAudioContext
      if (!Audio) return
      if (!contextRef.current) contextRef.current = new Audio()
      const ctx = contextRef.current
      if (ctx.state === 'suspended') ctx.resume()
      ;[1, 1.5, 2].forEach((ratio, i) => {
        const oscillator = ctx.createOscillator()
        const gain = ctx.createGain()
        oscillator.type = 'sine'
        oscillator.frequency.setValueAtTime(freq * ratio, ctx.currentTime)
        oscillator.frequency.exponentialRampToValueAtTime(freq * ratio * 0.93, ctx.currentTime + 0.55)
        gain.gain.setValueAtTime(0.0001, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(volume / (i + 1), ctx.currentTime + 0.025 + i * 0.02)
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.65 + i * 0.13)
        oscillator.connect(gain)
        gain.connect(ctx.destination)
        oscillator.start()
        oscillator.stop(ctx.currentTime + 0.92)
      })
    } catch {
      // La carta funciona también en navegadores que bloquean audio.
    }
  }
  useEffect(() => () => {
    if (contextRef.current) contextRef.current.close().catch(() => {})
  }, [])
  return play
}

function TinyCross({ className = '' }) {
  return <span className={'tiny-cross ' + className} aria-hidden="true"><span /></span>
}

function FloatingBlossom({ className = '', color = '#f6c8d4', size = 100, spin = 0 }) {
  return (
    <svg className={'floating-blossom ' + className} width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true" style={{ '--spin': spin + 'deg' }}>
      <g transform="translate(50 50)">
        {Array.from({ length: 7 }, (_, i) => <ellipse key={i} cy="-24" rx="13" ry="25" fill={color} transform={'rotate(' + i * (360 / 7) + ')'} />)}
        <circle r="13.5" fill="#fff0b8" />
        <circle r="6" fill="#dfb56c" opacity=".42" />
        {Array.from({ length: 6 }, (_, i) => <circle key={i} cx={Math.cos(i * Math.PI / 3) * 8} cy={Math.sin(i * Math.PI / 3) * 8} r="1.8" fill="#c5955a" />)}
      </g>
    </svg>
  )
}

function AmbientDecor() {
  return (
    <div className="ambient-decor" aria-hidden="true">
      <div className="ambient-glow glow-a" />
      <div className="ambient-glow glow-b" />
      <FloatingBlossom className="float-a" color="#f8d9e1" size={118} spin={-12} />
      <FloatingBlossom className="float-b" color="#ece3f7" size={81} spin={24} />
      <FloatingBlossom className="float-c" color="#fde3c4" size={63} spin={10} />
      <FloatingBlossom className="float-d" color="#f4c8d5" size={104} spin={-8} />
      <i className="drift-petal drift-a" /><i className="drift-petal drift-b" /><i className="drift-petal drift-c" />
      <i className="drift-petal drift-d" /><i className="drift-petal drift-e" />
    </div>
  )
}

function FadeIn({ children, className = '', delay = 0, amount = 0.18 }) {
  const reduced = useReducedMotion()
  return (
    <motion.div className={className}
      initial={reduced ? false : { opacity: 0, y: 36, filter: 'blur(7px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount }}
      transition={{ duration: reduced ? 0 : 0.9, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  )
}

function PetalBurst({ nonce, mode = 'petal' }) {
  if (!nonce) return null
  return (
    <div className="burst-container" aria-hidden="true">
      <AnimatePresence>
        {SMALL_PETALS.map((petal) => (
          <motion.span key={nonce + '-' + petal.id}
            className={mode === 'heart' ? 'burst-heart' : 'burst-petal'}
            style={{ backgroundColor: petal.color }}
            initial={{ x: 0, y: 0, opacity: 0, scale: 0.25, rotate: 0 }}
            animate={{ x: petal.x, y: petal.y, opacity: [0, 1, 1, 0], scale: [0.3, 1, 0.8], rotate: petal.rotate }}
            transition={{ duration: 1.65, delay: petal.delay, ease: [0.18, 0.65, 0.23, 1] }} />
        ))}
      </AnimatePresence>
    </div>
  )
}

function Envelope({ opened, onOpen, burst }) {
  return (
    <div className="envelope-wrapper">
      <motion.button
        type="button"
        className={'envelope-button ' + (opened ? 'is-open' : '')}
        onClick={onOpen}
        disabled={opened}
        aria-label={opened ? 'Carta abierta' : 'Abrir la carta para Tefi'}
        initial={{ opacity: 0, y: 60, rotate: -5 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 82, damping: 16, delay: 0.35 }}
        whileHover={opened ? {} : { y: -6, rotate: -1 }}
        whileTap={opened ? {} : { scale: 0.97 }}>
        <div className="envelope-shadow" />
        <div className="envelope-shell">
          <div className="envelope-back" />
          <div className="letter-peek">
            <span className="peek-eyebrow">PARA UNA PERSONA ESPECIAL</span>
            <Heart size={19} fill="#edb5c2" strokeWidth={0} />
            <span className="peek-title">Para Tefi</span>
            <span className="peek-bottom">con cariño ♡</span>
          </div>
          <svg className="envelope-folds" viewBox="0 0 340 193" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 0 L170 117 L340 0 V193 H0 Z" fill="#f9dce2"/>
            <path d="M0 193 L148 84 Q170 68 192 84 L340 193 Z" fill="#f5c8d3"/>
            <path d="M0 0 L170 116 L0 193 Z" fill="#fbe8eb"/>
            <path d="M340 0 L170 116 L340 193 Z" fill="#f8d7df"/>
          </svg>
          <div className="envelope-flap" />
          <div className="wax-seal"><Heart size={16} strokeWidth={2.2} fill="#fff5f4" /><TinyCross className="seal-cross" /></div>
        </div>
        <PetalBurst nonce={burst} />
      </motion.button>
      <motion.div className="envelope-caption" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}>
        {opened ? <span>Tu carta está lista para florecer <span aria-hidden="true">♡</span></span> : <span>Toca el sobre para abrir tu carta</span>}
        {!opened && <motion.div animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.8 }}><ChevronDown size={18}/></motion.div>}
      </motion.div>
    </div>
  )
}

function FlowerIllustration({ flower, selected = false }) {
  return (
    <svg className="illustrated-flower" viewBox="0 0 220 295" fill="none" role="img" aria-label={'Flor ' + flower.label}>
      <defs>
        <linearGradient id={'stem-' + flower.id} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#9ec4a4"/><stop offset="1" stopColor="#648f77"/></linearGradient>
        <linearGradient id={'petal-' + flower.id} x1="0" y1="0" x2="1" y2="1"><stop stopColor={flower.petalLight}/><stop offset="1" stopColor={flower.petal}/></linearGradient>
      </defs>
      <motion.path d="M111 116 C108 158 121 198 107 278" stroke={'url(#stem-' + flower.id + ')'} strokeWidth="6.5" strokeLinecap="round"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.3, delay: .12 }}/>
      <path d="M115 196 C144 159 173 165 164 192 C148 215 126 207 115 196 Z" fill="#a6cbaa"/>
      <path d="M113 231 C88 198 63 201 66 227 C75 247 100 243 113 231 Z" fill="#b3d7b3"/>
      <path d="M115 196 Q138 191 159 188 M113 231 Q86 228 71 225" stroke="#73a588" strokeWidth="1.3" opacity=".6"/>
      <motion.g className="flower-blossom" style={{ transformOrigin: '110px 111px' }}
        initial={{ scale: .15, rotate: flower.tilt - 30 }}
        whileInView={{ scale: 1, rotate: flower.tilt }}
        animate={selected ? { scale: [1, 1.12, 1] } : undefined}
        viewport={{ once: true }}
        transition={{ type: 'spring', stiffness: 95, damping: 12, delay: .3 }}>
        <g transform="translate(110 110)">
          {Array.from({ length: flower.turns }, (_, i) => (
            <ellipse key={i} cy="-39" rx={flower.turns > 9 ? '16.5' : '19'} ry="38" fill={'url(#petal-' + flower.id + ')'}
              stroke="#ffffff" strokeOpacity=".55" strokeWidth="1.2" transform={'rotate(' + (i * (360 / flower.turns)) + ')'} />
          ))}
          <circle r="27" fill={flower.center} stroke="#fff4d8" strokeWidth="2"/>
          <circle r="19" fill="#e5b46f" opacity=".24"/>
          {Array.from({ length: 15 }, (_, i) => (
            <circle key={i} cx={Math.cos(i * 2.399) * (5 + i * 1.15)}
              cy={Math.sin(i * 2.399) * (5 + i * 1.15)} r={i % 3 === 0 ? 2.6 : 1.8} fill="#8b623d" opacity=".55"/>
          ))}
          <circle cx="-9" cy="-9" r="7" fill="#fff9e6" opacity=".3"/>
        </g>
      </motion.g>
      <circle cx="179" cy="66" r="2.8" fill="#e8a8b7"/>
      <path d="M37 104 v12 M31 110 h12" stroke="#d0abd1" strokeWidth="2" strokeLinecap="round" opacity=".85"/>
      <circle cx="163" cy="127" r="3" fill="#edce87" />
    </svg>
  )
}

function FlowerNote({ flower, onClose, reduced }) {
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    const old = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = old }
  }, [onClose])
  return (
    <motion.div className="note-backdrop" onClick={onClose}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: reduced ? 0 : .3 }}>
      <motion.div className="note-dialog" role="dialog" aria-modal="true" aria-labelledby="flower-note-title"
        onClick={(event) => event.stopPropagation()}
        initial={reduced ? false : { opacity: 0, y: 80, scale: .93, rotate: -2 }}
        animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
        exit={{ opacity: 0, y: 45, scale: .95 }}
        transition={{ type: 'spring', stiffness: 240, damping: 24 }}>
        <button className="note-close" onClick={onClose} aria-label="Cerrar mensaje"><X size={19} /></button>
        <div className="note-decoration"><FloatingBlossom color={flower.petal} size={102}/></div>
        <span className="eyebrow">{flower.kicker}</span>
        <h3 id="flower-note-title">{flower.title}</h3>
        <p>{flower.message}</p>
        <div className="note-signature">un detallito para ti <Heart size={16} fill="#dc9caa" strokeWidth={0}/></div>
      </motion.div>
    </motion.div>
  )
}

function FloralLine() {
  return (
    <svg className="floral-line" viewBox="0 0 320 86" fill="none" aria-hidden="true">
      <motion.path d="M15 66 Q64 15 110 53 T212 43 T307 23"
        stroke="#b8c9a9" strokeWidth="2" strokeLinecap="round"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.6 }} />
      {[{ x: 83, y: 43 },{ x: 183, y: 50 },{ x: 270, y: 29 }].map((p,i) => (
        <g key={i} transform={'translate(' + p.x + ' ' + p.y + ')'}>
          {Array.from({ length: 5 }, (_, j) => <ellipse key={j} cy="-8" ry="9" rx="5.5" fill={['#f4c8d4','#e1d6ee','#f9ddb1'][i]} transform={'rotate(' + j * 72 + ')'}/>)}
          <circle r="4.2" fill="#e7bc72" />
        </g>
      ))}
      <path d="M134 48 Q135 29 151 32 Q152 45 134 48Z M237 36 Q231 19 220 20 Q219 34 237 36Z" fill="#a8c9ad"/>
    </svg>
  )
}

function App() {
  const [opened, setOpened] = useState(false)
  const [burst, setBurst] = useState(0)
  const [activeFlower, setActiveFlower] = useState(null)
  const [sound, setSound] = useState(false)
  const [hug, setHug] = useState(0)
  const [showHug, setShowHug] = useState(false)
  const reduceMotion = useReducedMotion()
  const playTone = SoundFX()
  const { scrollYProgress } = useScroll()

  function openLetter() {
    if (opened) return
    setOpened(true)
    setBurst(value => value + 1)
    if (sound) playTone(520, .025)
    window.setTimeout(() => {
      document.getElementById('letter-start')?.scrollIntoView({ behavior: reduceMotion ? 'instant' : 'smooth', block: 'start' })
    }, reduceMotion ? 180 : 1750)
  }

  function openFlower(flower) {
    setActiveFlower(flower)
    if (sound) playTone(flower.id === 'flores' ? 660 : 785, .024)
  }

  function sendHug() {
    setHug(value => value + 1)
    setShowHug(true)
    if (sound) playTone(580, .02)
  }

  return (
    <div className="app">
      {opened && <motion.div className="reading-progress" style={{ scaleX: scrollYProgress }}/>}
      <header className="site-header">
        <a href="#inicio" className="site-mark" aria-label="Volver al inicio">
          <span className="mark-icon"><TinyCross/><Heart size={13} fill="currentColor" strokeWidth={0}/></span>
          <span>para tefi<span className="mark-period">.</span></span>
        </a>
        <button className="sound-switch" type="button" onClick={() => {
          setSound(value => {
            if (!value) playTone(630, .02)
            return !value
          })
        }} aria-label={sound ? 'Desactivar sonido' : 'Activar sonido'} title={sound ? 'Desactivar sonido' : 'Activar sonido'}>
          {sound ? <Volume2 size={16} /> : <VolumeX size={16}/>}
          <span>{sound ? 'sonido activado' : 'sonido opcional'}</span>
        </button>
      </header>

      <section className="hero" id="inicio">
        <AmbientDecor/>
        <div className="hero-content">
          <motion.div className="hero-kicker" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .1, duration: .8 }}>
            <span className="kicker-star">✳</span> una sorpresa pequeñita <span className="kicker-star">✳</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .2, duration: .9 }}>
            Para alguien<br/>que hace <em>florecer</em><br/>el mundo.
          </motion.h1>
          <motion.p className="hero-subtitle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .6, duration: 1 }}>
            Hay personas que hacen los días más bonitos<br className="desktop-break" /> sin siquiera darse cuenta.
          </motion.p>
          <Envelope opened={opened} onOpen={openLetter} burst={burst}/>
          <div className="hero-footer"><span>HECHO CON CARIÑO</span><span className="footer-dot">✦</span><span>SOLO PARA TI</span></div>
        </div>
      </section>

      <AnimatePresence>
        {opened && (
          <motion.main key="letter-main" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .9 }}>
            <section id="letter-start" className="story-section">
              <div className="section-sticker sticker-top"><Stethoscope size={24} strokeWidth={1.5}/><span>con amor por lo que haces</span></div>
              <FadeIn className="story-content">
                <div className="section-number"><TinyCross/> CAPÍTULO UNO</div>
                <h2>Una carta para quien<br/><em>siempre cuida</em> de otros.</h2>
                <p>Siempre estás cuidando a los demás. Así que hice este pequeño mundo para que tú también tengas un lugar donde recibir cariño.</p>
                <FloralLine/>
                <span className="story-postscript">un rinconcito de calma, flores y palabras bonitas ♡</span>
              </FadeIn>
              <div className="section-sticker sticker-bottom"><HeartPulse size={21} strokeWidth={1.6}/> <span>receta: una sonrisa</span></div>
            </section>

            <section className="flowers-section" id="flores">
              <FadeIn className="section-heading">
                <span className="eyebrow">UN RAMITO SOLO PARA TI</span>
                <h2>Si pudiera regalarte<br/><em>tres flores...</em></h2>
                <p>Cada una guardaría algo que me gusta de ti. Tócalas con calma, son tuyas.</p>
              </FadeIn>
              <div className="flower-bed">
                <div className="flower-haze" aria-hidden="true"/>
                {FLOWERS.map((flower, i) => (
                  <FadeIn key={flower.id} className={'flower-column flower-column-' + i} delay={i * .12} amount={.1}>
                    <motion.button type="button" className="flower-button" onClick={() => openFlower(flower)}
                      whileHover={reduceMotion ? {} : { y: -9, rotate: i % 2 ? 2 : -2 }}
                      whileTap={reduceMotion ? {} : { scale: .93 }}
                      transition={{ type: 'spring', stiffness: 190, damping: 15 }}
                      aria-label={'Descubrir el mensaje de ' + flower.label}>
                      <FlowerIllustration flower={flower}/>
                      <span className="flower-label">{flower.label}<span className="flower-plus">↗</span></span>
                    </motion.button>
                  </FadeIn>
                ))}
              </div>
              <FadeIn className="flowers-footnote"><Sparkles size={15} strokeWidth={1.6}/> Hay cosas bonitas que merecen decirse.</FadeIn>
            </section>

            <section className="care-section">
              <div className="care-container">
                <FadeIn className="care-illustration">
                  <div className="care-halo halo-one"/><div className="care-halo halo-two"/>
                  <div className="care-badge badge-top"><TinyCross/> una dosis de amor</div>
                  <div className="heart-illustration">
                    <motion.div animate={reduceMotion ? {} : { scale: [1, 1.055, 1] }} transition={{ duration: 2.65, repeat: Infinity, ease: 'easeInOut' }}>
                      <Heart size={126} fill="#eda6b8" stroke="#d9899e" strokeWidth={1.1}/>
                    </motion.div>
                    <span className="heart-cross"><TinyCross/></span>
                  </div>
                  <div className="care-badge badge-bottom"><Flower2 size={15}/> para días largos</div>
                </FadeIn>
                <FadeIn className="care-copy" delay={.12}>
                  <span className="eyebrow">UN RECORDATORIO SUAVECITO</span>
                  <h2>Y si algún día<br/>el mundo <em>pesa...</em></h2>
                  <p>Que no se te olvide algo importante: tú también mereces descansar, recibir flores y sentirte cuidada.</p>
                  <button className="hug-button" type="button" onClick={sendHug}>
                    <Heart size={17} fill="currentColor" strokeWidth={1.2}/> Te mando un abrazo
                  </button>
                  <div className="hug-feedback" aria-live="polite">{showHug ? 'Abrazo enviado, con muchísimo cariño ♡' : 'Este botón es solo para ti.'}</div>
                  <div className="hug-effect"><PetalBurst nonce={hug} mode="heart"/></div>
                </FadeIn>
              </div>
            </section>

            <section className="final-section" id="carta">
              <FadeIn className="final-heading">
                <span className="eyebrow">Y AHORA SÍ...</span>
                <h2>Lo que de verdad<br/><em>quería decirte.</em></h2>
              </FadeIn>
              <FadeIn className="paper-wrap" delay={.08}>
                <div className="paper-shadow"/>
                <article className="final-paper">
                  <div className="letter-ornament"><TinyCross/><span>una nota para ti</span><Heart size={12} fill="#da9cac" strokeWidth={0}/></div>
                  <div className="paper-date">UNA CARTITA PARA TEFI</div>
                  <h3>Querida Tefi,</h3>
                  <div className="letter-body">
                    <p>Apenas voy descubriendo tu mundo, pero hay algo que ya me parece muy bonito de ti: la forma en que te importa cuidar de los demás.</p>
                    <p>Detrás de esa bata hay días largos, esfuerzo, sueños y una persona que también merece momentos suaves, flores y razones para sonreír.</p>
                    <p>Quise hacerte algo pequeñito, pero lleno de detalles, porque me gusta pensar que las personas que hacen bien a los demás también merecen que alguien tenga gestos bonitos con ellas.</p>
                    <p>Ojalá esta carta te saque una sonrisa. Y si hoy fue un día cansado, espero que este pequeño rinconcito te recuerde lo especial que es lo que haces.</p>
                  </div>
                  <div className="letter-signoff"><span>Con cariño,</span><strong>alguien que disfruta mucho conocerte.</strong><span className="signed-heart">♡</span></div>
                  <div className="paper-bottom-illustration"><FloralLine/></div>
                </article>
              </FadeIn>
              <FadeIn className="after-letter">
                <span>Gracias por abrir mi cartita.</span>
                <motion.button className="reread-button" type="button" onClick={() => document.getElementById('inicio')?.scrollIntoView({ behavior: reduceMotion ? 'instant' : 'smooth' })}
                  whileHover={{ y: -3 }} whileTap={{ scale: .96 }}>
                  <ArrowUp size={15}/> Volver a verla
                </motion.button>
              </FadeIn>
            </section>

            <footer className="site-footer">
              <span><TinyCross/> hecha a mano, en píxeles y con cariño</span>
              <span>para tefi ♡</span>
            </footer>
          </motion.main>
        )}
      </AnimatePresence>
      <AnimatePresence>{activeFlower && <FlowerNote key={activeFlower.id} flower={activeFlower} onClose={() => setActiveFlower(null)} reduced={reduceMotion}/>}</AnimatePresence>
    </div>
  )
}

createRoot(document.getElementById('root')).render(<App />)
