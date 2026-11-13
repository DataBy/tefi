import React, { useRef, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
import { Activity, ArrowDown, ArrowRight, Check, Cross, Flower2, Heart, HeartPulse, Pause, Plus, RotateCcw, Sparkles, Stethoscope, Volume2, VolumeX } from 'lucide-react'
import './styles.css'

const TRAITS = [
  { id: 'vocacion', number: '01', name: 'Vocación', icon: Stethoscope, heading: 'Una decisión con propósito.', text: 'Elegir cuidar a otras personas no es cualquier cosa. Detrás de cada bata hay compromiso, estudio y muchísima entrega.' },
  { id: 'empatia', number: '02', name: 'Empatía', icon: Heart, heading: 'La parte más humana.', text: 'A veces, un gesto amable puede hacer que un día complicado se sienta un poquito menos difícil.' },
  { id: 'dedicacion', number: '03', name: 'Dedicación', icon: Sparkles, heading: 'Todo lo que no siempre se ve.', text: 'Horas aprendiendo, días intensos y ganas de hacerlo bien. Hay mucho esfuerzo detrás de lo que haces.' },
]
const SPECKS = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  left: 6 + ((i * 37.1) % 88),
  top: 7 + ((i * 19.7) % 85),
  delay: -(i % 9) * .8,
  duration: 4 + i % 5,
  size: i % 4 === 0 ? 6 : 3,
}))

function Ping({ enabled, pitch = 660 }) {
  if (!enabled) return
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (!AudioCtx) return
    const ctx = new AudioCtx()
    if (ctx.state === 'suspended') ctx.resume()
    ;[0, .095, .18].forEach((offset, index) => {
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.type = 'sine'
      o.frequency.setValueAtTime(pitch * (1 + index * .25), ctx.currentTime + offset)
      g.gain.setValueAtTime(.0001, ctx.currentTime + offset)
      g.gain.exponentialRampToValueAtTime(.027 / (index + 1), ctx.currentTime + offset + .025)
      g.gain.exponentialRampToValueAtTime(.0001, ctx.currentTime + offset + .43)
      o.connect(g)
      g.connect(ctx.destination)
      o.start(ctx.currentTime + offset)
      o.stop(ctx.currentTime + offset + .48)
    })
    window.setTimeout(() => ctx.close().catch(() => {}), 900)
  } catch { /* Audio is optional. */ }
}

function FlowerArt({ id = 'main', blooming = true, small = false }) {
  const reduced = useReducedMotion()
  const rotate = (i, n) => 'rotate(' + (i * 360 / n) + ' 300 291)'
  const gradient = (name) => 'url(#' + name + '-' + id + ')'
  return <svg className={'flower-art ' + (small ? 'flower-small' : '')} viewBox="0 0 600 685" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Una flor kawaii de pétalos rosados y lavanda, con carita sonriente y un pequeño símbolo médico">
    <defs>
      <radialGradient id={'outer-'+id} cx="0" cy="0" r="1" gradientTransform="translate(298 217) rotate(90) scale(180 135)" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFEDEB"/><stop offset=".54" stopColor="#FFC8D7"/><stop offset="1" stopColor="#F28BB4"/>
      </radialGradient>
      <linearGradient id={'inner-'+id} x1="240" y1="116" x2="357" y2="350" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFF2E8"/><stop offset=".52" stopColor="#F9AFCB"/><stop offset="1" stopColor="#CF9CE5"/>
      </linearGradient>
      <radialGradient id={'face-'+id} cx="0" cy="0" r="1" gradientTransform="translate(270 250) rotate(52) scale(133)">
        <stop stopColor="#FFF6C8"/><stop offset=".74" stopColor="#FFD98C"/><stop offset="1" stopColor="#F5B970"/>
      </radialGradient>
      <linearGradient id={'stem-'+id} x1="300" y1="390" x2="340" y2="674" gradientUnits="userSpaceOnUse">
        <stop stopColor="#9AC7A3"/><stop offset="1" stopColor="#6CA985"/>
      </linearGradient>
      <filter id={'soft-'+id} x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="8" />
      </filter>
      <filter id={'shadow-'+id} x="-40%" y="-40%" width="180%" height="180%">
        <feDropShadow dx="0" dy="11" stdDeviation="13" floodColor="#B66290" floodOpacity=".2"/>
      </filter>
      <filter id={'faceShadow-'+id} x="-40%" y="-40%" width="180%" height="180%">
        <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#B36A61" floodOpacity=".18"/>
      </filter>
    </defs>
    <g className="stem-group">
      <path d="M304 360 C 292 454 330 528 309 680" stroke={gradient('stem')} strokeWidth="16" strokeLinecap="round"/>
      <path d="M314 519 C382 440 455 466 439 514 C414 557 355 558 314 519Z" fill="#A8D3B0"/>
      <path d="M314 519 C351 517 389 510 431 502" stroke="#6FA887" strokeWidth="3" strokeLinecap="round"/>
      <path d="M313 585 C252 507 182 523 202 574 C223 611 275 606 313 585Z" fill="#B9DEB6"/>
      <path d="M313 585 Q273 565 211 558" stroke="#79B48C" strokeWidth="3" strokeLinecap="round"/>
      <path d="M322 640 C350 620 377 631 374 643" stroke="#8CBE96" strokeWidth="5" strokeLinecap="round"/>
    </g>
    <g className="flower-head" style={{ transformOrigin:'300px 291px' }}>
      <ellipse cx="300" cy="297" rx="191" ry="191" fill="#E696B8" opacity=".14" filter={gradient('soft')} />
      <g filter={gradient('shadow')}>
        {Array.from({length:11}, (_, i) =>
          <motion.ellipse key={'outer'+i} cx="300" cy="173" rx="67" ry="141"
            fill={gradient('outer')} stroke="#FFE2E9" strokeWidth="3" transform={rotate(i,11)}
            initial={reduced ? false : {opacity:0,scale:.54}}
            animate={{opacity:1,scale:blooming ? 1 : .68}}
            transition={{type:'spring',stiffness:88,damping:15,delay:i*.043}}/>
        )}
        {Array.from({length:9}, (_, i) =>
          <motion.ellipse key={'inner'+i} cx="300" cy="221" rx="47" ry="103"
            fill={gradient('inner')} fillOpacity=".88" stroke="#FFE9EF" strokeOpacity=".85" strokeWidth="2"
            transform={rotate(i+0.22,9)}
            initial={reduced ? false : {opacity:0,scale:.65}}
            animate={{opacity:1,scale:blooming ? 1 : .8}}
            transition={{type:'spring',stiffness:92,damping:17,delay:.28+i*.035}}/>
        )}
      </g>
      <g filter={gradient('faceShadow')}>
        <circle cx="300" cy="291" r="103" fill="#FCE7AA" stroke="#FFEBC7" strokeWidth="9"/>
        <circle cx="300" cy="291" r="94" fill={gradient('face')}/>
        <ellipse cx="274" cy="236" rx="37" ry="23" fill="#FFF8E7" opacity=".22" transform="rotate(-23 274 236)"/>
      </g>
      <g className="face-features">
        <ellipse className="eye eye-left" cx="266" cy="291" rx="7" ry="12" fill="#614852"/>
        <ellipse className="eye eye-right" cx="334" cy="291" rx="7" ry="12" fill="#614852"/>
        <circle cx="262" cy="286" r="2.8" fill="#FFF" opacity=".83"/>
        <circle cx="330" cy="286" r="2.8" fill="#FFF" opacity=".83"/>
        <ellipse cx="244" cy="320" rx="18" ry="9" fill="#F4A19E" opacity=".58"/>
        <ellipse cx="356" cy="320" rx="18" ry="9" fill="#F4A19E" opacity=".58"/>
        <path d="M288 313 Q300 325 312 313" stroke="#7A5158" strokeWidth="5" strokeLinecap="round"/>
      </g>
      <g className="doctor-pin" transform="translate(385 351) rotate(12)">
        <rect x="-35" y="-31" width="70" height="62" rx="20" fill="#FFFFFF" stroke="#E9D9E4" strokeWidth="3"/>
        <path d="M0-17 V17 M-17 0 H17" stroke="#E889A5" strokeWidth="9" strokeLinecap="round"/>
        <circle cx="-21" cy="-22" r="3" fill="#F9CCD8"/>
      </g>
      <path d="M107 170 l5 15 15 5 -15 5 -5 15 -5 -15 -15 -5 15 -5Z" fill="#FFF7F0" opacity=".86"/>
      <circle cx="493" cy="344" r="6" fill="#F3C77C"/>
    </g>
  </svg>
}

function ParticleField() {
  return <div className="particles" aria-hidden="true">
    {SPECKS.map(p => <i key={p.id} className="particle" style={{
      left:p.left+'%', top:p.top+'%', width:p.size, height:p.size,
      animationDelay:p.delay+'s', animationDuration:p.duration+'s'
    }}/>)}
    <span className="ambient-cross cross-a">✳</span>
    <span className="ambient-cross cross-b">✳</span>
    <span className="ambient-cross cross-c">✳</span>
  </div>
}

function PulseLine({ active }) {
  return <div className="pulse-wrap" aria-hidden="true">
    <svg viewBox="0 0 640 140" preserveAspectRatio="xMidYMid meet">
      <path d="M0 72 H130 L154 72 L173 56 L195 92 L225 14 L254 126 L281 69 L310 72 H405 L429 72 L447 54 L469 94 L495 30 L523 113 L549 71 H640"
        fill="none" stroke="#8FE4CA" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className={active?'pulse-draw':''}/>
      <path d="M0 72 H640" stroke="#8FE4CA" strokeOpacity=".12" strokeWidth="2"/>
      <circle cx="307" cy="72" r="6" fill="#D8FFF2" className="pulse-light"/>
    </svg>
  </div>
}

function Reveal({ children, className='', delay=0 }) {
  const reduced=useReducedMotion()
  return <motion.div className={className} initial={reduced?false:{opacity:0,y:36,filter:'blur(7px)'}} whileInView={{opacity:1,y:0,filter:'blur(0px)'}} viewport={{once:true,amount:.2}} transition={{duration:reduced?0:.9,delay,ease:[.2,.78,.2,1]}}>{children}</motion.div>
}

function BloomBurst({keyId}) {
  return <div className="bloom-burst" aria-hidden="true">
    {Array.from({length:26},(_,i) => {
      const angle = (i * 137.5) * Math.PI / 180
      const d = 115 + (i%6)*24
      return <motion.i key={keyId+'-'+i} className="burst-piece" style={{backgroundColor:['#F2A5C3','#D5BAF6','#F4D88C','#B0DCC2'][i%4]}}
        initial={{opacity:0,x:0,y:0,scale:.3,rotate:0}}
        animate={{opacity:[0,1,1,0],x:Math.cos(angle)*d,y:Math.sin(angle)*d-32,scale:[.3,1,.75],rotate:i*41}}
        transition={{duration:1.9,delay:(i%5)*.045,ease:[.21,.65,.21,1]}}/>
    })}
  </div>
}

function App(){
  const stageRef = useRef(null)
  const [activeTrait,setActiveTrait] = useState(0)
  const [sound,setSound] = useState(false)
  const [blooming,setBlooming] = useState(false)
  const [burst,setBurst] = useState(0)
  const reduced = useReducedMotion()
  const {scrollYProgress:rawProgress} = useScroll({target:stageRef,offset:['start start','end end']})
  const progress = useSpring(rawProgress,{stiffness:65,damping:25,mass:.35})
  const scale = useTransform(progress,[0,.16,.32,.47,.62,.81,1],[.85,1.05,2.9,4.7,2.75,1.26,.87])
  const x = useTransform(progress,[0,.15,.32,.5,.67,.82,1],[0,0,65,-130,115,0,0])
  const y = useTransform(progress,[0,.2,.38,.56,.78,1],[90,30,-25,68,-70,38])
  const rotate = useTransform(progress,[0,.3,.55,.8,1],[-8,-2,17,4,-6])
  const dim = useTransform(progress,[0,.27,.39,.57,.68,.8,1],[0,0,.86,.92,.6,0,0])
  const vignette = useTransform(progress,[0,.28,.42,.6,.75,1],[0,0,.48,.72,.16,0])
  const stageBar = useTransform(rawProgress,[0,1],['0%','100%'])
  const play=(freq)=>Ping({enabled:sound,pitch:freq})
  const finalRef=useRef(null)

  useEffect(()=>{
    if(!blooming) return
    const timeout=window.setTimeout(()=>setBlooming(false),3500)
    return ()=>clearTimeout(timeout)
  },[blooming,burst])

  function flourish(){
    setBlooming(true)
    setBurst(b=>b+1)
    play(570)
  }

  return <div className="app">
    <header className="nav">
      <a href="#inicio" className="brand" aria-label="Bloom Care, ir al inicio">
        <span className="brand-mark"><Plus size={14} strokeWidth={3}/><Flower2 size={14} strokeWidth={2.3}/></span>
        <span>bloom<span className="brand-dot">.</span>care</span>
      </a>
      <div className="nav-actions">
        <span className="for-tefi">made for tefi <span>✳</span></span>
        <button className="sound-toggle" type="button" title={sound?'Silenciar sonidos':'Activar sonidos'} aria-label={sound?'Desactivar sonidos':'Activar sonidos'} onClick={()=>{if(!sound) Ping({enabled:true,pitch:640});setSound(!sound)}}>
          {sound?<Volume2 size={18}/>:<VolumeX size={18}/>}
        </button>
      </div>
    </header>
    <div className="page-progress"><motion.span style={{width:stageBar}}/></div>

    <section className="cinematic" ref={stageRef} id="inicio" aria-label="Historia de Bloom Care">
      <div className="cinematic-sticky" aria-hidden="true">
        <div className="soft-orb orb-one"/><div className="soft-orb orb-two"/>
        <ParticleField/>
        <motion.div className="flower-camera" style={reduced ? {} : {scale,x,y,rotate}}>
          <FlowerArt id="hero"/>
        </motion.div>
        <motion.div className="night-overlay" style={{opacity:dim}}/>
        <motion.div className="camera-vignette" style={{opacity:vignette}}/>
        <span className="edge-label edge-left">BOTÁNICA · 001</span>
        <span className="edge-label edge-right">PEQUEÑOS DETALLES IMPORTAN</span>
      </div>

      <div className="scenes">
        <div className="scene scene-hero" id="comienzo">
          <Reveal className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-line"/> UN DETALLITO PARA UNA DOCTORA <span className="eyebrow-line"/></div>
            <h1>Una flor.<br/><em>Mil formas</em><br/>de cuidar.</h1>
            <p>Una experiencia pequeñita, inspirada en algo muy grande: tu vocación.</p>
          </Reveal>
          <motion.a href="#observacion" className="scroll-cue" initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{delay:1.2,duration:.7}}>
            <span>DESLIZA PARA DESCUBRIR</span>
            <span className="scroll-pill"><ArrowDown size={17}/></span>
          </motion.a>
          <div className="scene-index">00 <span>/</span> 04</div>
        </div>

        <div className="scene scene-observation" id="observacion">
          <Reveal className="observation-card">
            <div className="chapter-tag"><span className="chapter-number">01</span> OBSERVACIÓN</div>
            <h2>Una bata.<br/>Muchas <em>historias.</em></h2>
            <p>En un hospital pasan mil cosas al día. Entre tantas prisas, hay algo que siempre importa: cómo hacemos sentir a los demás.</p>
            <div className="mini-doctor-badge"><Stethoscope size={19}/> la medicina también tiene un lado tierno</div>
          </Reveal>
        </div>

        <div className="scene scene-heartbeat">
          <Reveal className="heartbeat-copy">
            <span className="chapter-light">02 / SIGNOS VITALES</span>
            <div className="heart-chip"><HeartPulse size={15} strokeWidth={2.2}/> VOCACIÓN DETECTADA</div>
            <h2>Hay cosas<br/>que se sienten<br/><em>en cada latido.</em></h2>
            <p>El conocimiento salva. La humanidad acompaña. Y cuando los dos se encuentran, suceden cosas increíbles.</p>
            <PulseLine active/>
            <div className="vitals"><span>♥  vocación</span><span>✳  humanidad</span><span>✦  dedicación</span></div>
          </Reveal>
        </div>

        <div className="scene scene-traits">
          <Reveal className="traits-inner">
            <span className="chapter-light">03 / UNA MIRADA MÁS CERCA</span>
            <h2>No todo se aprende<br/><em>en los libros.</em></h2>
            <p className="traits-intro">Hay cualidades que hacen especial a quien elige cuidar. Toca cada una.</p>
            <div className="trait-controls" role="group" aria-label="Descubrir cualidades de la vocación médica">
              {TRAITS.map((trait,index)=>{
                const Icon=trait.icon
                return <button key={trait.id} className={'trait-control '+(activeTrait===index?'trait-active':'')}
                  type="button" aria-pressed={activeTrait===index}
                  onClick={()=>{setActiveTrait(index);play(610+index*90)}}>
                  <Icon size={18} strokeWidth={1.8}/><span>{trait.name}</span>
                </button>
              })}
            </div>
            <div className="trait-note">
              <AnimatePresence mode="wait">
                <motion.div key={activeTrait} className="trait-note-inner" initial={reduced?false:{opacity:0,y:15,filter:'blur(5px)'}} animate={{opacity:1,y:0,filter:'blur(0px)'}} exit={{opacity:0,y:-10,filter:'blur(4px)'}} transition={{duration:.35}}>
                  <div className="trait-note-top"><span>0{activeTrait+1} / 03</span><Check size={16}/></div>
                  <h3>{TRAITS[activeTrait].heading}</h3>
                  <p>{TRAITS[activeTrait].text}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </Reveal>
        </div>

        <div className="scene scene-reminder">
          <Reveal className="reminder-copy">
            <div className="chapter-tag"><span className="chapter-number">04</span> RECORDATORIO</div>
            <h2>Y quien cuida,<br/><em>también merece</em><br/>ser cuidado.</h2>
            <p>Una pausa, un día bonito, un ramito de flores. A veces las cosas sencillas son las que más se agradecen.</p>
            <a href="#detalle" className="reminder-link">Hay algo más para ti <ArrowRight size={17}/></a>
          </Reveal>
        </div>
      </div>
    </section>

    <section className="final-section" id="detalle">
      <div className="final-noise" aria-hidden="true"/>
      <div className="final-inner">
        <Reveal className="final-label"><span className="sparkle">✳</span> NOTA DE CAMPO Nº 001 <span className="sparkle">✳</span></Reveal>
        <Reveal className="final-title">
          <h2>Un pequeño<br/><em>diagnóstico bonito.</em></h2>
          <p>No es una receta médica, claro. Pero sí un recordatorio hecho especialmente para ti.</p>
        </Reveal>

        <Reveal className="flower-finale" delay={.12}>
          <div className="final-halo halo-outer"/><div className="final-halo halo-inner"/>
          <motion.div className={'final-flower-wrap '+(blooming?'bloom-now':'')}
            animate={blooming && !reduced?{scale:[1,1.13,1.04,1],rotate:[0,-7,5,0]}:{scale:1,rotate:0}}
            transition={{duration:1.25,ease:[.16,.8,.2,1]}}>
            <FlowerArt id="end" small blooming/>
          </motion.div>
          <AnimatePresence>{burst>0 && <BloomBurst key={burst} keyId={burst}/>}</AnimatePresence>
          <div className="floating-sticker sticker-stetho"><Stethoscope size={19}/> cuidando el mundo</div>
          <div className="floating-sticker sticker-flower"><Flower2 size={18}/> también floreces</div>
        </Reveal>

        <Reveal className="diagnosis-card" delay={.05}>
          <div className="diagnosis-header"><div><span className="cross-square"><Plus size={15} strokeWidth={3}/></span><strong>BLOOM CARE</strong></div><span>EDICIÓN TEFI</span></div>
          <div className="diagnosis-main">
            <span className="small-label">RESULTADO DEL DÍA</span>
            <h3>Una persona que hace<br/>el mundo un poquito<br/><em>más amable.</em></h3>
          </div>
          <div className="diagnosis-lines">
            <div><span><Check size={15}/> Una flor bonita</span><span>✓</span></div>
            <div><span><Check size={15}/> Un descanso merecido</span><span>✓</span></div>
            <div><span><Check size={15}/> Muchas razones para sonreír</span><span>✓</span></div>
          </div>
          <p>Indicaciones: no olvidar que tú también mereces cosas bonitas.</p>
          <div className="diagnosis-footer"><span>CON APRECIO, PARA TI</span><Heart size={16} fill="#EC9CB8" stroke="none"/></div>
        </Reveal>

        <Reveal className="final-action">
          <button className="bloom-button" onClick={flourish} type="button"><Flower2 size={19}/> {burst ? 'Hacerla florecer otra vez' : 'Haz florecer esta flor'} <Sparkles size={16}/></button>
          <AnimatePresence mode="wait">
            {burst>0 && <motion.p className="after-bloom" role="status" initial={{opacity:0,y:9}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:.5}}>Para que nunca te falten razones para florecer, Tefi. ✳</motion.p>}
          </AnimatePresence>
          <a href="#inicio" className="from-top"><RotateCcw size={14}/> Ver desde el principio</a>
        </Reveal>
      </div>
    </section>
    <footer className="footer"><span>✳ bloom.care</span><span>hecho con creatividad, flores y un poquito de medicina</span></footer>
  </div>
}

createRoot(document.getElementById('root')).render(<App/>)
