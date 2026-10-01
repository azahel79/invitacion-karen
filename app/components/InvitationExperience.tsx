"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import NumberFlow from "@number-flow/react";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";
import ReactCanvasConfetti from "react-canvas-confetti";
import type { TCanvasConfettiInstance } from "react-canvas-confetti/dist/types";
import {
  FiArrowUpRight,
  FiCalendar,
  FiCheck,
  FiChevronDown,
  FiClock,
  FiCopy,
  FiDownload,
  FiMapPin,
  FiVolume2,
  FiVolumeX,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

const churchMap = "https://maps.app.goo.gl/nq4ar2cxgUZRWw2HA?g_st=aw";
const receptionMap =
  "https://maps.apple.com/place?map=explore&place-id=I375C3A0A9213C872&address=Avenida+Libertad+69%2C+Centro%2C+91300+Banderilla%2C+Ver.%2C+M%C3%A9xico&coordinate=19.587219%2C-96.936630&name=Sal%C3%B3+de+Eventos+%22Asunci%C3%B3n%22&_provider=9902";
const bankAccount = "036260711520986383";
const bankAccountHolder = "Elizabeth Ávila Villa";
const whatsappDisplay = "228 422 9584";
const eventDate = new Date("2026-10-10T13:00:00-06:00").getTime();
const countdownUnits = [
  { key: "days", label: "Días" },
  { key: "hours", label: "Horas" },
  { key: "minutes", label: "Minutos" },
  { key: "seconds", label: "Segundos" },
] as const;

type Countdown = Record<(typeof countdownUnits)[number]["key"], number>;

function getCountdown(): Countdown {
  const remaining = Math.max(0, eventDate - Date.now());

  return {
    days: Math.floor(remaining / 86_400_000),
    hours: Math.floor((remaining / 3_600_000) % 24),
    minutes: Math.floor((remaining / 60_000) % 60),
    seconds: Math.floor((remaining / 1_000) % 60),
  };
}

const whatsappMessage = encodeURIComponent(
  "Hola, deseo confirmar mi asistencia a los XV años de Karen Paola Hernández Ávila. Mi nombre completo es: ",
);
const whatsappUrl = `https://wa.me/522284229584?text=${whatsappMessage}`;
const googleCalendarBase = "https://calendar.google.com/calendar/render";
const googleCeremonyUrl = `${googleCalendarBase}?${new URLSearchParams({
  action: "TEMPLATE",
  text: "Ceremonia religiosa · XV de Karen Paola",
  dates: "20261010T130000/20261010T130000",
  ctz: "America/Mexico_City",
  details: "Ceremonia religiosa de los XV años de Karen Paola Hernández Ávila.",
  location: "Iglesia de San José, Benito Juárez 27, Lomas de Hidalgo, Centro, 91300 Banderilla, Ver.",
}).toString()}`;
const googleReceptionUrl = `${googleCalendarBase}?${new URLSearchParams({
  action: "TEMPLATE",
  text: "Recepción · XV de Karen Paola",
  dates: "20261010T150000/20261010T150000",
  ctz: "America/Mexico_City",
  details: "Recepción de los XV años de Karen Paola Hernández Ávila.",
  location: "Salón Asunción, Avenida Libertad 69, Centro, 91300 Banderilla, Ver.",
}).toString()}`;
const jewelParticles = [
  { left: "14%", top: "30%", x: -18, y: -56, delay: 0.02 },
  { left: "28%", top: "54%", x: -28, y: -34, delay: 0.08 },
  { left: "42%", top: "25%", x: -6, y: -72, delay: 0.14 },
  { left: "58%", top: "34%", x: 10, y: -64, delay: 0.05 },
  { left: "72%", top: "52%", x: 30, y: -42, delay: 0.12 },
  { left: "84%", top: "28%", x: 22, y: -58, delay: 0.18 },
];

const easeOut = [0.16, 1, 0.3, 1] as const;

function KarenMonogram({ compact = false }: { compact?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className={compact ? "karen-monogram compact" : "karen-monogram"}
      viewBox="0 0 120 120"
    >
      <path className="monogram-frame" d="M60 4 116 60 60 116 4 60Z" />
      <path className="monogram-rule" d="M29 36h62M29 84h62" />
      <text className="monogram-initials" x="60" y="68">KP</text>
      <text className="monogram-xv" x="60" y="82">XV</text>
    </svg>
  );
}

function CrystalOrnament({ compact = false }: { compact?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className={compact ? "crystal-ornament compact" : "crystal-ornament"}
      viewBox="0 0 240 30"
    >
      <path d="M4 15h91M145 15h91" />
      <path d="m120 3 10 12-10 12-10-12Z" />
      <path d="m120 7 4 8-4 8-4-8Z" />
      <circle cx="99" cy="15" r="1.5" />
      <circle cx="141" cy="15" r="1.5" />
    </svg>
  );
}

function Sparkles() {
  return (
    <div className="sparkles" aria-hidden="true">
      <span className="sparkle sparkle-one" />
      <span className="sparkle sparkle-two" />
      <span className="sparkle sparkle-three" />
      <span className="sparkle sparkle-four" />
    </div>
  );
}

function LetterReveal({
  text,
  active,
  delay = 0,
}: {
  text: string;
  active?: boolean;
  delay?: number;
}) {
  const textRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(textRef, { once: true, amount: 0.7 });
  const reduceMotion = useReducedMotion();
  const visible = active ?? inView;
  let letterIndex = 0;

  if (text.length > 48) {
    return (
      <motion.span
        ref={textRef}
        className="animated-letters"
        initial={false}
        animate={visible || reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0.6, y: 12 }}
        transition={{ duration: reduceMotion ? 0.12 : 0.58, delay, ease: easeOut }}
      >
        {text}
      </motion.span>
    );
  }

  return (
    <span ref={textRef} className="animated-letters" aria-label={text}>
      {text.split(" ").map((word, wordIndex, words) => (
        <span className="animated-word" aria-hidden="true" key={`${word}-${wordIndex}`}>
          {Array.from(word).map((letter) => {
            const index = letterIndex++;

            return (
              <motion.span
                className="animated-letter"
                key={`${letter}-${index}`}
                initial={false}
                animate={
                  visible || reduceMotion
                    ? { opacity: 1, y: 0, rotateX: 0 }
                    : { opacity: 0.18, y: "0.35em", rotateX: -38 }
                }
                transition={{
                  duration: reduceMotion ? 0.12 : 0.46,
                  delay: reduceMotion ? 0 : delay + index * 0.028,
                  ease: easeOut,
                }}
              >
                {letter}
              </motion.span>
            );
          })}
          {wordIndex < words.length - 1 && <span className="animated-space">&nbsp;</span>}
        </span>
      ))}
    </span>
  );
}

function RevealCopy({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.p
      className={className}
      initial={reduceMotion ? false : { opacity: 0.58, y: 14 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.58 }}
      transition={{ duration: 0.68, delay, ease: easeOut }}
    >
      {children}
    </motion.p>
  );
}

function SectionTitle({ children }: { children: string }) {
  return (
    <header className="section-title">
      <h2>
        <LetterReveal text={children} />
      </h2>
      <CrystalOrnament compact />
    </header>
  );
}

function MapLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <motion.a
      className="map-link"
      href={href}
      target="_blank"
      rel="noreferrer"
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.14 }}
    >
      <FiMapPin aria-hidden="true" />
      <span>{children}</span>
      <FiArrowUpRight aria-hidden="true" />
    </motion.a>
  );
}

function CountdownSection() {
  const [countdown, setCountdown] = useState<Countdown | null>(null);

  useEffect(() => {
    const updateCountdown = () => setCountdown(getCountdown());
    updateCountdown();

    const timer = window.setInterval(updateCountdown, 1_000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="countdown-section invitation-section" aria-labelledby="countdown-title">
      <header className="countdown-heading">
        <h2 id="countdown-title">
          <LetterReveal text="Falta muy poco" />
        </h2>
        <p>para celebrar mis XV años</p>
      </header>
      <div className="countdown-grid" aria-label="Cuenta regresiva para el evento">
        {countdownUnits.map((unit) => (
          <div className="countdown-unit" key={unit.key}>
            {countdown ? (
              <NumberFlow
                value={countdown[unit.key]}
                format={{ minimumIntegerDigits: 2, useGrouping: false }}
                trend={-1}
              />
            ) : (
              <span aria-hidden="true">--</span>
            )}
            <small>{unit.label}</small>
          </div>
        ))}
      </div>
      <p className="countdown-date">Sábado · 10 de octubre · 1:00 PM</p>
      <details className="calendar-options">
        <summary className="calendar-link">
          <FiCalendar aria-hidden="true" />
          <span>
            <strong>Agregar al calendario</strong>
            <small>Google, Android, Apple u Outlook</small>
          </span>
          <FiChevronDown className="calendar-chevron" aria-hidden="true" />
        </summary>
        <div className="calendar-choice-list">
          <p>Elige dónde deseas guardarlo</p>
          <a href={googleCeremonyUrl} target="_blank" rel="noreferrer">
            <span>
              <strong>Google Calendar</strong>
              <small>Ceremonia · 1:00 PM</small>
            </span>
            <FiArrowUpRight aria-hidden="true" />
          </a>
          <a href={googleReceptionUrl} target="_blank" rel="noreferrer">
            <span>
              <strong>Google Calendar</strong>
              <small>Recepción · 3:00 PM</small>
            </span>
            <FiArrowUpRight aria-hidden="true" />
          </a>
          <a href="/karen-paola-xv.ics">
            <span>
              <strong>Importar ambos eventos</strong>
              <small>Samsung Calendar, Apple, Outlook y otros</small>
            </span>
            <FiDownload aria-hidden="true" />
          </a>
        </div>
      </details>
    </section>
  );
}

export function InvitationExperience() {
  const [opened, setOpened] = useState(false);
  const [introComplete, setIntroComplete] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">("idle");
  const heroRef = useRef<HTMLElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const confettiRef = useRef<TCanvasConfettiInstance | null>(null);
  const reduceMotion = useReducedMotion();
  const heroInView = useInView(heroRef, { amount: 0.15 });

  useEffect(() => {
    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    return () => {
      window.history.scrollRestoration = previousRestoration;
    };
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = introComplete ? "" : "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [introComplete]);

  useEffect(() => {
    if (!opened) return;

    const timer = window.setTimeout(
      () => setIntroComplete(true),
      reduceMotion ? 120 : 1080,
    );

    return () => window.clearTimeout(timer);
  }, [opened, reduceMotion]);

  function openInvitation() {
    if (opened) return;
    window.scrollTo(0, 0);

    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.45;
      void audio.play().catch(() => setMusicPlaying(false));
    }

    setOpened(true);

    if (reduceMotion) return;
    void confettiRef.current?.({
      particleCount: 32,
      spread: 52,
      startVelocity: 20,
      gravity: 0.72,
      ticks: 100,
      scalar: 0.62,
      origin: { x: 0.5, y: 0.58 },
      colors: ["#DCEAE4", "#F7FCF9", "#8FD5BD", "#AC7E75"],
      shapes: ["circle"],
    });
  }

  function toggleMusic() {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      void audio.play().catch(() => setMusicPlaying(false));
    } else {
      audio.pause();
    }
  }

  async function copyAccount() {
    try {
      await navigator.clipboard.writeText(bankAccount);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }

    window.setTimeout(() => setCopyStatus("idle"), 2400);
  }

  return (
    <main className={opened ? "invitation-shell is-open" : "invitation-shell"}>
      <audio
        ref={audioRef}
        src="/sound/coldplay-yellow.mp3"
        preload="metadata"
        onPlay={() => setMusicPlaying(true)}
        onPause={() => setMusicPlaying(false)}
        onEnded={() => setMusicPlaying(false)}
      />
      <AnimatePresence>
        {introComplete && (
          <motion.button
            className={musicPlaying ? "music-toggle is-playing" : "music-toggle"}
            type="button"
            aria-label={musicPlaying ? "Pausar música" : "Reproducir música"}
            title={musicPlaying ? "Pausar música" : "Reproducir música"}
            onClick={toggleMusic}
            initial={reduceMotion ? false : { opacity: 0, scale: 0.72 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.82 }}
            whileTap={{ scale: 0.92 }}
            transition={{ duration: 0.3, ease: easeOut }}
          >
            {musicPlaying ? <FiVolume2 aria-hidden="true" /> : <FiVolumeX aria-hidden="true" />}
          </motion.button>
        )}
      </AnimatePresence>
      <ReactCanvasConfetti
        className="confetti-canvas"
        globalOptions={{ resize: true, useWorker: true }}
        onInit={({ confetti }) => {
          confettiRef.current = confetti;
        }}
      />
      <AnimatePresence>
        {!introComplete && (
          <motion.section
            key="invitation-entry"
            className="entry-gate"
            aria-label="Abrir invitación"
            initial={false}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0.12 : 0.34, ease: easeOut }}
          >
            <motion.div
              className="entry-fabric-wrap"
              animate={opened ? { scale: 1.045 } : { scale: 1 }}
              transition={{ duration: 1.35, ease: easeOut }}
            >
              <Image
                className="entry-fabric"
                src="/assets/couture-silk-background.png"
                alt=""
                width={1024}
                height={1536}
                priority
                sizes="(max-width: 480px) 100vw, 480px"
              />
            </motion.div>
            <div className="entry-shade" aria-hidden="true" />
            <Image
              className="entry-floral"
              src="/assets/floral-couture-cascade.png"
              alt=""
              width={1024}
              height={1536}
              priority
            />
            <motion.div
              className="entry-copy"
              animate={
                opened
                  ? { opacity: 0, y: -8 }
                  : { opacity: 1, y: 0 }
              }
              transition={{ duration: 0.32, ease: easeOut }}
            >
              <KarenMonogram />
              <h2>
                <LetterReveal text="Una noche especial" active={!opened} delay={0.08} />
              </h2>
              <p>está por comenzar</p>
              <motion.button
                className="open-invitation"
                type="button"
                onClick={openInvitation}
                disabled={opened}
                aria-expanded={opened}
                whileHover={reduceMotion ? undefined : { y: -2 }}
                whileTap={reduceMotion ? undefined : { scale: 0.975 }}
              >
                <span>Abrir invitación</span>
                <span className="button-gem" aria-hidden="true" />
              </motion.button>
            </motion.div>

            <motion.div
              className="curtain curtain-left"
              aria-hidden="true"
              initial={false}
              animate={opened ? { x: "-104%", clipPath: "inset(0 0 0 100%)" } : { x: "0%", clipPath: "inset(0 0 0 0%)" }}
              transition={{ duration: reduceMotion ? 0.12 : 1.08, ease: easeOut }}
            />
            <motion.div
              className="curtain curtain-right"
              aria-hidden="true"
              initial={false}
              animate={opened ? { x: "104%", clipPath: "inset(0 100% 0 0)" } : { x: "0%", clipPath: "inset(0 0% 0 0)" }}
              transition={{ duration: reduceMotion ? 0.12 : 1.08, ease: easeOut }}
            />
          </motion.section>
        )}
      </AnimatePresence>

      <section
        ref={heroRef}
        className={heroInView ? "opening is-active" : "opening"}
        aria-labelledby="invitation-title"
        aria-hidden={!introComplete}
      >
        <motion.div
          className="opening-fabric-wrap"
          style={{ position: "absolute" }}
          animate={introComplete ? { scale: 1.035 } : { scale: 1 }}
          transition={{ duration: 1.25, ease: easeOut }}
        >
          <Image
            className="opening-fabric"
            src="/assets/couture-silk-background.png"
            alt=""
            width={1024}
            height={1536}
            priority
            sizes="(max-width: 480px) 100vw, 480px"
          />
        </motion.div>
        <div className="opening-shade" aria-hidden="true" />
        <motion.div
          className="opening-floral-wrap"
          animate={introComplete ? { opacity: 1, scale: 1, rotate: -2 } : { opacity: 0.45, scale: 1.06, rotate: -5 }}
          transition={{ duration: 0.82, ease: easeOut }}
        >
          <Image
            className="opening-floral"
            src="/assets/floral-couture-corner.png"
            alt=""
            width={1024}
            height={1536}
            priority
          />
        </motion.div>
        <Sparkles />

        <div className="jewel-burst" aria-hidden="true">
          {jewelParticles.map((particle) => (
            <motion.span
              key={`${particle.left}-${particle.top}`}
              className="jewel-particle"
              style={{ left: particle.left, top: particle.top }}
              initial={false}
              animate={
                introComplete && !reduceMotion
                  ? {
                      opacity: [0, 0.95, 0],
                      scale: [0.3, 1.35, 0.2],
                      x: [0, particle.x],
                      y: [0, particle.y],
                      rotate: [45, 135],
                    }
                  : { opacity: 0, scale: 0.3, x: 0, y: 0, rotate: 45 }
              }
              transition={{ duration: 0.95, delay: particle.delay, ease: easeOut }}
            />
          ))}
        </div>

        <motion.div
          className="opening-copy"
          initial={false}
          animate={
            introComplete
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: 16 }
          }
          transition={{ duration: 0.72, ease: easeOut }}
        >
          <motion.p
            className="xv-mark"
            animate={introComplete ? { opacity: 1, letterSpacing: "0.48em" } : { opacity: 0, letterSpacing: "0.66em" }}
            transition={{ duration: 0.7, ease: easeOut }}
          >
            MIS XV
          </motion.p>
          <motion.div animate={{ scaleX: introComplete ? 1 : 0 }} transition={{ duration: 0.62, delay: 0.08, ease: easeOut }}>
            <CrystalOrnament compact />
          </motion.div>
          <h1 id="invitation-title">
            <LetterReveal text="Karen Paola" active={introComplete} delay={0.08} />
            <small>
              <LetterReveal text="Hernández Ávila" active={introComplete} delay={0.28} />
            </small>
          </h1>
          <motion.div animate={{ scaleX: introComplete ? 1 : 0 }} transition={{ duration: 0.62, delay: 0.24, ease: easeOut }}>
            <CrystalOrnament />
          </motion.div>
          <motion.p className="opening-date" animate={{ opacity: introComplete ? 1 : 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
            Sábado 10 de octubre
          </motion.p>
        </motion.div>

        <motion.div
          className="scroll-cue"
          aria-hidden="true"
          animate={introComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
          transition={{ duration: 0.5, delay: 0.62, ease: easeOut }}
        >
          <span />
          <small>Desliza para continuar</small>
        </motion.div>
      </section>

      <div
        id="invitation-content"
        className="invitation-content"
        aria-hidden={!introComplete}
        inert={!introComplete}
      >
        <section className="family-section invitation-section">
          <RevealCopy className="blessing">
            Con el amor de mis padres y el cariño de mis padrinos, quiero compartir
            contigo una noche que guardaré para siempre.
          </RevealCopy>
          <CrystalOrnament />
          <div className="family-groups">
            <motion.div
              className="family-group family-parents"
              initial={reduceMotion ? false : { opacity: 0.45, x: -20 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.65 }}
              transition={{ duration: 0.68, ease: easeOut }}
            >
              <span className="family-jewel" aria-hidden="true" />
              <h2><LetterReveal text="Mis padres" /></h2>
              <div className="family-names">
                <p>Jorge Hernández</p>
                <p>Elizabeth Ávila Villa</p>
              </div>
            </motion.div>
            <div className="family-thread" aria-hidden="true">
              <span />
              <i />
            </div>
            <motion.div
              className="family-group family-godparents"
              initial={reduceMotion ? false : { opacity: 0.45, x: 20 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.65 }}
              transition={{ duration: 0.68, ease: easeOut }}
            >
              <span className="family-jewel" aria-hidden="true" />
              <h2><LetterReveal text="Mis padrinos" /></h2>
              <div className="family-names">
                <p>Jesús Ávila</p>
                <p>Mitzy García</p>
              </div>
            </motion.div>
          </div>
          <Image
            className="family-floral"
            src="/assets/floral-couture-cascade.png"
            alt=""
            width={1024}
            height={1536}
          />
        </section>

        <section className="dedication-section invitation-section" aria-label="Dedicatoria de Karen">
          <KarenMonogram compact />
          <blockquote>
            <p>
              <LetterReveal text="Hay momentos que se vuelven eternos cuando se comparten con las personas que queremos. Gracias por acompañarme." />
            </p>
            <cite>Karen Paola</cite>
          </blockquote>
        </section>

        <section className="date-section invitation-section" aria-label="Fecha del evento">
          <p className="date-day">Sábado</p>
          <div className="date-lockup">
            <span className="date-number">10</span>
            <strong>Octubre</strong>
          </div>
          <p className="date-note">Una tarde para celebrar, una noche para recordar.</p>
        </section>

        <CountdownSection />

        <section className="schedule-section invitation-section" aria-label="Ruta de la tarde">
          <SectionTitle>Ruta de la tarde</SectionTitle>
          <p className="route-intro">Dos momentos para compartir una misma celebración.</p>
          <motion.div
            className="venue-block"
            initial={reduceMotion ? false : { opacity: 0.45, x: -16 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.62, ease: easeOut }}
          >
            <p className="venue-kind">Ceremonia religiosa</p>
            <div className="venue-time">
              <FiClock aria-hidden="true" />
              <span>1:00 PM</span>
            </div>
            <h3>Iglesia de San José</h3>
            <address>
              Benito Juárez 27, Lomas de Hidalgo, Centro, 91300 Banderilla, Ver.
            </address>
            <MapLink href={churchMap}>Ver ubicación de la iglesia</MapLink>
          </motion.div>

          <motion.div
            className="schedule-connector"
            aria-hidden="true"
            initial={reduceMotion ? false : { scaleY: 0 }}
            whileInView={reduceMotion ? undefined : { scaleY: 1 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ duration: 0.58, ease: easeOut }}
          >
            <span />
          </motion.div>

          <motion.div
            className="venue-block reception-block"
            initial={reduceMotion ? false : { opacity: 0.45, x: 16 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.62, ease: easeOut }}
          >
            <p className="venue-kind">Recepción</p>
            <div className="venue-time">
              <FiClock aria-hidden="true" />
              <span>15:00 hrs</span>
            </div>
            <h3>Salón Asunción</h3>
            <address>Avenida Libertad 69, Centro, 91300 Banderilla, Ver.</address>
            <MapLink href={receptionMap}>Ver ubicación del Salón Asunción</MapLink>
          </motion.div>
        </section>

        <section className="dress-section invitation-section" aria-label="Código de vestimenta">
          <h2 className="dress-message">
            <LetterReveal text="Se reserva el uso de los colores Verde Jade y Plata para la quinceañera y su corte de honor" />
          </h2>
          <motion.div
            className="dress-swatch-art"
            initial={reduceMotion ? false : { opacity: 0.45, y: 14, scale: 0.96 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ duration: 0.82, delay: 0.12, ease: easeOut }}
          >
            <Image
              src="/assets/dress-code-swatches-v1.webp"
              alt="Muestras de tela en verde jade y plata"
              width={1774}
              height={887}
              sizes="(max-width: 480px) 82vw, 360px"
            />
          </motion.div>
          <motion.div
            className="dress-crystal-divider"
            aria-hidden="true"
            initial={reduceMotion ? false : { opacity: 0, scaleX: 0.34 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, scaleX: 1 }}
            viewport={{ once: true, amount: 0.9 }}
            transition={{ duration: 0.68, delay: 0.28, ease: easeOut }}
          >
            <span />
            <i />
            <span />
          </motion.div>
        </section>

        <section className="gifts-section invitation-section" aria-label="Regalos">
          <h2 className="gift-message">
            <LetterReveal text="Tu presencia es mi mejor regalo, pero si deseas hacerme un detalle, podrás depositarlo en efectivo dentro del cofre que encontrarás en la recepción" />
          </h2>
          <motion.div
            className="gift-box-art"
            initial={reduceMotion ? false : { opacity: 0.45, y: 14, scale: 0.96 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.62 }}
            transition={{ duration: 0.88, delay: 0.14, ease: easeOut }}
          >
            <Image
              src="/assets/gift-box-blue-silver-v1.webp"
              alt="Caja de regalo verde jade con listón plateado"
              width={1254}
              height={1254}
              sizes="(max-width: 480px) 58vw, 250px"
            />
          </motion.div>
          <motion.div
            className="gift-crystal-divider"
            aria-hidden="true"
            initial={reduceMotion ? false : { opacity: 0, scaleX: 0.3 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, scaleX: 1 }}
            viewport={{ once: true, amount: 0.85 }}
            transition={{ duration: 0.7, delay: 0.22, ease: easeOut }}
          >
            <span />
            <i />
            <span />
          </motion.div>
        </section>

        <section className="transfer-section invitation-section" aria-label="Transferencia bancaria">
          <SectionTitle>Un detalle especial</SectionTitle>
          <p className="transfer-copy">
            Si deseas acompañar tus buenos deseos con un detalle, puedes hacerlo
            mediante una transferencia a la siguiente cuenta. Lo recibiré con mucho
            cariño y gratitud.
          </p>
          <motion.div
            className="transfer-account"
            initial={reduceMotion ? false : { opacity: 0, scaleX: 0.86 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, scaleX: 1 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ duration: 0.55, ease: easeOut }}
          >
            <div className="account-holder">
              <span>Titular de la cuenta</span>
              <strong>{bankAccountHolder}</strong>
            </div>
            <span className="account-number">{bankAccount}</span>
            <motion.button type="button" onClick={copyAccount} whileTap={{ scale: 0.96 }}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  className="copy-status"
                  key={copyStatus}
                  aria-live="polite"
                  initial={reduceMotion ? false : { opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, y: -5 }}
                  transition={{ duration: 0.16 }}
                >
                  {copyStatus === "copied" ? <FiCheck aria-hidden="true" /> : <FiCopy aria-hidden="true" />}
                  {copyStatus === "copied" ? "Cuenta copiada" : copyStatus === "error" ? "Copia manualmente" : "Copiar cuenta"}
                </motion.span>
              </AnimatePresence>
            </motion.button>
          </motion.div>
        </section>

        <section className="confirmation-section invitation-section">
          <Image
            className="confirmation-floral"
            src="/assets/floral-couture-corner.png"
            alt=""
            width={1024}
            height={1536}
          />
          <motion.div
            className="confirmation-content"
            initial={reduceMotion ? false : { opacity: 0.5, y: 16 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.45 }}
            transition={{ duration: 0.7, ease: easeOut }}
          >
            <SectionTitle>Confirmación</SectionTitle>
            <RevealCopy>
              Estamos cuidando cada detalle para que sea una noche mágica. Tu
              confirmación con nombre completo antes del 10 de octubre. Puedes
              hacerlo directamente por WhatsApp.
            </RevealCopy>
            <RevealCopy className="deadline" delay={0.08}>Antes del 10 de octubre</RevealCopy>
            <motion.a
              className="whatsapp-confirm"
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`Confirmar asistencia por WhatsApp al ${whatsappDisplay}`}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.14 }}
            >
              <FaWhatsapp aria-hidden="true" />
              <span>
                <strong>Confirmar por WhatsApp</strong>
                <small>{whatsappDisplay}</small>
              </span>
              <FiArrowUpRight aria-hidden="true" />
            </motion.a>
          </motion.div>
        </section>

        <footer className="invitation-footer">
          <KarenMonogram compact />
          <CrystalOrnament compact />
          <p>Con cariño,</p>
          <strong>Karen</strong>
        </footer>
      </div>
    </main>
  );
}
