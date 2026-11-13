import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Moon, Sun, Heart, Sparkles } from 'lucide-react'
import './styles.css'

const MESSAGES = [
  'Qué bonito que tu vocación sea cuidar a los demás.',
  'Que hoy te pasen cosas tan lindas como las flores que te gustan.',
  'Las personas que cuidan también merecen ser cuidadas.',
  'Ojalá hoy tengás muchas razones para sonreír.',
  'Hasta las flores más fuertes necesitan descansar.',
  'Que nunca te falten calma, cafecito y flores.',
  'Un gesto pequeño puede hacer enorme la diferencia.',
  'No olvidés darte un respiro entre tantos días intensos.',
  'La medicina también está hecha de gestos bonitos.',
  'Tu esfuerzo merece reconocimiento, incluso en los días difíciles.',
  'Una flor para recordarte que también merecés cosas lindas.',
  'Cuidar a alguien también es una forma de hacer florecer el mundo.',
]

const STARS = Array.from({ length: 30 }, (_, i) => ({
  left: 5 + (i * 47.13) % 90,
  top: 6 + (i * 31.77) % 78,
  size: i % 5 === 0 ? 5 : i % 3 === 0 ? 3 : 2,
  delay: -((i * 11) % 17) / 4,
  duration: 2.3 + (i % 6) * .58,
}))

const BURST = Array.from({ length: 22 }, (_, i) => {
  const angle = (i * 137.508) * Math.PI / 180
  const distance = 98 + (i % 5) * 27
  return {
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance - 14,
    rotate: i * 41,
    color: ['#ef9dbd', '#cdb3ef', '#f2ce91', '#a3d9c2'][i % 4],
    delay: (i % 6) * .035,
  }
})

function BloomFlower({ night }) {
  return (
    <svg className="flower-art" viewBox="0 0 600 690" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <radialGradient id="outer" cx="0" cy="0" r="1" gradientTransform="translate(282 155) rotate(70) scale(159 113)" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFF7F2"/><stop offset=".39" stopColor="#FFDAE6"/><stop offset=".77" stopColor="#F3A4C7"/><stop offset="1" stopColor="#E47CA9"/>
        </radialGradient>
        <linearGradient id="inner" x1="255" y1="142" x2="351" y2="356" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFF6F0"/><stop offset=".48" stopColor="#F9BCD9"/><stop offset="1" stopColor="#CFADEB"/>
        </linearGradient>
        <radialGradient id="face" cx="0" cy="0" r="1" gradientTransform="translate(275 252) rotate(57) scale(145)">
          <stop stopColor="#FFF9D7"/><stop offset=".78" stopColor="#FFDD97"/><stop offset="1" stopColor="#F7BB7F"/>
        </radialGradient>
        <linearGradient id="stem" x1="290" y1="356" x2="342" y2="682" gradientUnits="userSpaceOnUse">
          <stop stopColor="#A7CEAD"/><stop offset="1" stopColor="#65A47E"/>
        </linearGradient>
        <filter id="bloom-shadow" x="-35%" y="-35%" width="170%" height="180%">
          <feDropShadow dx="0" dy="13" stdDeviation="13" floodColor="#AB628E" floodOpacity=".20"/>
        </filter>
      </defs>

      <g className="stem">
        <path d="M298 369 C288 472 330 550 300 675" stroke="url(#stem)" strokeWidth="16" strokeLinecap="round"/>
        <path d="M313 521 C385 460 465 465 447 509 C421 557 359 555 313 521Z" fill="#A3D4B1"/>
        <path d="M314 521 Q378 518 441 500" stroke="#72A88A" strokeWidth="2.6" strokeLinecap="round"/>
        <path d="M312 581 C258 515 173 516 194 567 C218 611 279 611 312 581Z" fill="#BCE1BC"/>
        <path d="M310 580 Q260 558 202 553" stroke="#7CAF8D" strokeWidth="2.6" strokeLinecap="round"/>
      </g>

      <g className="bloom-head">
        <g filter="url(#bloom-shadow)">
          <g className="outer-petals">
            {Array.from({length:11},(_,i)=>
              <ellipse key={i} cx="300" cy="162" rx="62" ry="145" transform={'rotate('+(i*360/11)+' 300 296)'} fill="url(#outer)" stroke="#FFE6EE" strokeWidth="2.4"/>
            )}
          </g>
          <g className="inner-petals">
            {Array.from({length:9},(_,i)=>
              <ellipse key={i} cx="300" cy="218" rx="46" ry="106" transform={'rotate('+(i*360/9 + 7)+' 300 296)'} fill="url(#inner)" fillOpacity=".89" stroke="#FFF2F5" strokeOpacity=".83" strokeWidth="2"/>
            )}
          </g>
        </g>

        <circle cx="300" cy="296" r="106" fill="#FBEAC1" stroke="#FFEFCD" strokeWidth="6"/>
        <circle cx="300" cy="296" r="98" fill="url(#face)"/>
        <ellipse cx="274" cy="244" rx="38" ry="23" fill="#FFF9EA" fillOpacity=".22" transform="rotate(-27 274 244)"/>

        <g className={'day-face '+(night?'hidden-face':'')}>
          <g className="eyes">
            <ellipse cx="266" cy="294" rx="7" ry="12" fill="#674954"/>
            <ellipse cx="334" cy="294" rx="7" ry="12" fill="#674954"/>
            <circle cx="263" cy="290" r="2.6" fill="white"/>
            <circle cx="331" cy="290" r="2.6" fill="white"/>
          </g>
          <path d="M288 319 Q300 333 312 319" stroke="#80545F" strokeWidth="5" strokeLinecap="round"/>
        </g>
        <g className={'night-face '+(night?'':'hidden-face')}>
          <path d="M253 292 Q266 307 279 292" stroke="#674954" strokeWidth="5.5" strokeLinecap="round"/>
          <path d="M321 292 Q334 307 347 292" stroke="#674954" strokeWidth="5.5" strokeLinecap="round"/>
          <path d="M291 324 Q300 331 309 324" stroke="#80545F" strokeWidth="4.6" strokeLinecap="round"/>
        </g>

        <ellipse cx="239" cy="323" rx="19" ry="10" fill="#F69DAB" opacity=".55"/>
        <ellipse cx="361" cy="323" rx="19" ry="10" fill="#F69DAB" opacity=".55"/>

        <g className="medic-pin" transform="translate(390 369) rotate(13)">
          <rect x="-32" y="-30" width="64" height="60" rx="21" fill="#FFFEFB" stroke="#EED5E0" strokeWidth="3"/>
          <path d="M0 -16V16M-16 0H16" stroke="#E38DAE" strokeWidth="9" strokeLinecap="round"/>
          <circle cx="-20" cy="-19" r="3" fill="#F9CEDD"/>
        </g>
        <path d="M94 192l5 16 16 5-16 5-5 16-5-16-16-5 16-5Z" fill="#FFF8E8" opacity=".9"/>
        <circle cx="491" cy="365" r="6" fill="#F8D298" opacity=".85"/>
      </g>
    </svg>
  )
}

function PetalBurst({ id }) {
  return <div className="petal-burst" aria-hidden="true">
    {BURST.map((p,i)=>
      <motion.span key={id+'-'+i} className="petal-confetti" style={{background:p.color}}
        initial={{x:0,y:0,scale:.2,opacity:0,rotate:0}}
        animate={{x:p.x,y:p.y,scale:[.2,1,.7],opacity:[0,1,1,0],rotate:p.rotate}}
        exit={{opacity:0}}
        transition={{duration:1.55,delay:p.delay,ease:[.2,.7,.25,1]}}/>
    )}
  </div>
}

function App() {
  const [night, setNight] = useState(() => {
    try { return window.localStorage.getItem('tefi-theme') === 'night' } catch { return false }
  })
  const [messageIndex, setMessageIndex] = useState(-1)
  const [touches, setTouches] = useState(0)
  const reduced = useReducedMotion()

  useEffect(() => {
    document.documentElement.style.colorScheme = night ? 'dark' : 'light'
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content',night?'#202644':'#fff9f5')
    try { window.localStorage.setItem('tefi-theme',night?'night':'day') } catch { /* Optional storage */ }
  }, [night])

  function touchFlower() {
    setMessageIndex(prev => (prev+1) % MESSAGES.length)
    setTouches(prev => prev+1)
  }

  function toggleSky() { setNight(prev => !prev) }

  return <div className={'scene '+(night?'is-night':'is-day')}>
    <div className="sky-base" aria-hidden="true"/>
    <div className="sky-night" aria-hidden="true"/>
    <div className="light-haze haze-left" aria-hidden="true"/>
    <div className="light-haze haze-right" aria-hidden="true"/>

    <div className="star-field" aria-hidden="true">
      {STARS.map((star,i)=>
        <span key={i} className={'star '+(i%7===0?'star-cross':'')}
          style={{left:star.left+'%',top:star.top+'%',width:star.size,height:star.size,animationDelay:star.delay+'s',animationDuration:star.duration+'s'}}/>
      )}
    </div>
    <div className="cloud cloud-one" aria-hidden="true"/>
    <div className="cloud cloud-two" aria-hidden="true"/>

    <header className="topbar">
      <div className="site-signature"><span className="signature-bloom">✿</span> para tefi</div>
      <button className="theme-toggle" onClick={toggleSky} type="button" aria-pressed={night} aria-label={night?'Encender el sol y volver al día':'Apagar el sol y cambiar a la noche'}>
        <span className="toggle-track"><Sun size={16} className="track-sun"/><Moon size={15} className="track-moon"/>
          <motion.span className="toggle-thumb" animate={{x:night?34:0}} transition={reduced?{duration:0}:{type:'spring',stiffness:320,damping:26}}>
            {night?<Moon size={17} fill="currentColor"/>:<Sun size={17}/>}
          </motion.span>
        </span>
        <span className="toggle-caption">{night?'noche':'día'}</span>
      </button>
    </header>

    <main className="content">
      <div className="intro">
        <span className="intro-overline">{night?'buenas noches ✦':'un detallito para vos ✳'}</span>
        <h1>{night?'Una flor bajo':'Una flor para'}<br/><em>{night?'las estrellas.':'tu día.'}</em></h1>
      </div>

      <section className="garden" aria-label="Una flor interactiva">
        <button className="celestial" onClick={toggleSky} type="button" aria-label={night?'Tocar la luna para encender el sol':'Tocar el sol para hacerlo de noche'}>
          <span className="sun-rays"/>
          <span className="celestial-core"><span className="moon-crater crater-a"/><span className="moon-crater crater-b"/></span>
        </button>
        <span className="little-star little-star-one" aria-hidden="true">✦</span>
        <span className="little-star little-star-two" aria-hidden="true">✧</span>
        <span className="little-star little-star-three" aria-hidden="true">✳</span>
        <span className="garden-glow" aria-hidden="true"/>

        <motion.button type="button" className="flower-button" onClick={touchFlower} aria-label="Tocar la flor para descubrir un mensaje bonito"
          whileTap={reduced?{}:{scale:.92,rotate:-4}}
          animate={touches>0 && !reduced?{scale:[1,1.1,1.03,1],rotate:[0,-5,4,0]}:{scale:1,rotate:0}}
          key={'flower-'+touches}
          transition={{duration:.75,ease:[.25,.76,.25,1]}}>
          <BloomFlower night={night}/>
        </motion.button>

        <AnimatePresence>
          {touches>0 && <PetalBurst key={touches} id={touches}/>}
        </AnimatePresence>
      </section>

      <div className="message-area" aria-live="polite" aria-atomic="true">
        <AnimatePresence mode="wait">
          {messageIndex<0 ?
            <motion.div key="hint" className="tap-hint" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-12}} transition={{duration:.4}}>
              <span className="tap-heart"><Heart size={15} fill="currentColor"/></span>
              Tocá la flor, tiene algo lindo que decirte.
            </motion.div> :
            <motion.div key={'msg-'+touches} className="message-card"
              initial={reduced?false:{opacity:0,y:20,scale:.93,filter:'blur(5px)'}}
              animate={{opacity:1,y:0,scale:1,filter:'blur(0px)'}}
              exit={{opacity:0,y:-12,scale:.97}}
              transition={{type:'spring',stiffness:180,damping:23}}>
              <Sparkles size={16} className="message-sparkle" aria-hidden="true"/>
              <p>{MESSAGES[messageIndex]}</p>
              <Heart size={13} className="message-heart" fill="currentColor" aria-hidden="true"/>
            </motion.div>
          }
        </AnimatePresence>
        <p className="bottom-caption">{messageIndex<0?'hecha con cariño, una flor a la vez':'tocá otra vez para descubrir otro mensaje'}</p>
      </div>
    </main>
  </div>
}

createRoot(document.getElementById('root')).render(<App/>)
