import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import kuromiIdle from "../../images/sprites/idle.webp";
import kuromiWalk from "../../images/sprites/walk.webp";
import kuromiAttack from "../../images/sprites/attack.webp";
import kuromiCelebrate from "../../images/sprites/jump2.webp";
import kuromiWink from "../../images/sprites/wink.webp";
import kuromiWink2 from "../../images/sprites/wink2.webp";
import hitSoundUrl from "../../audio/hit.mp3";
import missSoundUrl from "../../audio/huh.mp3";
import "../../css/kuromi-game.css";
import { t } from "../lib/i18n";

const BOARD_SLOTS = 9;
const BOARD_COLS = 3;
const TARGET_SCORE = 10;
const START_TIME = 28;
const SPAWN_MS = 900;
const VISIBLE_MS = 560;
const WINK_MS = 140;
const BEST_TIME_STORAGE_KEY = "kuromiBestTimeSeconds";
const WIN_SOUND_URL = "https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3";
const BIRTH_YEAR = 2006;
const BIRTH_MONTH = 4;
const BIRTH_DAY = 28;

type GameStatus = "playing" | "won" | "lost";
type KuromiAnim = "idle" | "walk" | "attack" | "celebrate";

const KUROMI_ANIM_SOURCES: Record<KuromiAnim, string> = {
  idle: kuromiIdle,
  walk: kuromiWalk,
  attack: kuromiAttack,
  celebrate: kuromiCelebrate
};

function randomInt(maxExclusive: number): number {
  return Math.floor(Math.random() * maxExclusive);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function getCurrentAge(
  birthYear: number,
  birthMonthOneBased: number,
  birthDay: number,
  today = new Date()
): number {
  let age = today.getFullYear() - birthYear;
  const month = today.getMonth() + 1;
  const hasHadBirthdayThisYear =
    month > birthMonthOneBased ||
    (month === birthMonthOneBased && today.getDate() >= birthDay);

  if (!hasHadBirthdayThisYear) {
    age -= 1;
  }

  return Math.max(age, 0);
}

function isBirthdayDate(
  birthMonthOneBased: number,
  birthDay: number,
  today = new Date()
): boolean {
  const month = today.getMonth() + 1;

  return month === birthMonthOneBased && today.getDate() === birthDay;
}

export default function KuromiGamePage() {
  const [status, setStatus] = useState<GameStatus>("playing");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(START_TIME);
  const [hasStarted, setHasStarted] = useState(false);
  const [kuromiIndex, setKuromiIndex] = useState<number | null>(null);
  const [winkIndex, setWinkIndex] = useState<number | null>(null);
  const [cursorIndex, setCursorIndex] = useState(4);
  const [anim, setAnim] = useState<KuromiAnim>("idle");
  const [isMuted, setIsMuted] = useState(false);
  const [flashState, setFlashState] = useState<"none" | "hit" | "miss">("none");
  const [showSurprisePopup, setShowSurprisePopup] = useState(false);
  const [bestTime, setBestTime] = useState<number | null>(() => {
    const savedRaw = window.localStorage.getItem(BEST_TIME_STORAGE_KEY);
    const savedValue = savedRaw ? Number(savedRaw) : Number.NaN;

    return Number.isFinite(savedValue) && savedValue >= 0 ? savedValue : null;
  });

  const hideTimerRef = useRef<number | null>(null);
  const winkTimerRef = useRef<number | null>(null);
  const animTimerRef = useRef<number | null>(null);
  const hitAudioRef = useRef<HTMLAudioElement | null>(null);
  const missAudioRef = useRef<HTMLAudioElement | null>(null);
  const winAudioRef = useRef<HTMLAudioElement | null>(null);
  const flashTimerRef = useRef<number | null>(null);

  const progress = useMemo(
    () => Math.min(100, Math.floor((score / TARGET_SCORE) * 100)),
    [score]
  );
  const birthdayAge = useMemo(
    () => getCurrentAge(BIRTH_YEAR, BIRTH_MONTH, BIRTH_DAY),
    []
  );
  const birthdayAgeMilestone = useMemo(
    () => `${birthdayAge}${t("kuromi_surprise_age_suffix")}`,
    [birthdayAge]
  );
  const isBirthdayToday = useMemo(
    () => isBirthdayDate(BIRTH_MONTH, BIRTH_DAY),
    []
  );
  const isPreStart = status === "playing" && !hasStarted;
  const characterSrc = isPreStart ? kuromiWink2 : KUROMI_ANIM_SOURCES[anim];

  useEffect(() => {
    document.body.classList.add("kuromi-game-body");

    return () => {
      document.body.classList.remove("kuromi-game-body");
    };
  }, []);

  const stopCurrentTimers = useCallback(() => {
    if (hideTimerRef.current !== null) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }

    if (winkTimerRef.current !== null) {
      window.clearTimeout(winkTimerRef.current);
      winkTimerRef.current = null;
    }

    if (animTimerRef.current !== null) {
      window.clearTimeout(animTimerRef.current);
      animTimerRef.current = null;
    }

    if (flashTimerRef.current !== null) {
      window.clearTimeout(flashTimerRef.current);
      flashTimerRef.current = null;
    }
  }, []);

  const saveBestTime = useCallback((nextBestTime: number) => {
    setBestTime(nextBestTime);

    window.localStorage.setItem(BEST_TIME_STORAGE_KEY, String(nextBestTime));
  }, []);

  const playSound = useCallback(
    (soundRef: { current: HTMLAudioElement | null }) => {
      if (isMuted) {
        return;
      }

      const audio = soundRef.current;
      if (!audio) {
        return;
      }

      audio.currentTime = 0;
      void audio.play().catch(() => {
        // Ignore autoplay restrictions until user interacts.
      });
    },
    [isMuted]
  );

  const triggerFlash = useCallback((nextState: "hit" | "miss") => {
    setFlashState(nextState);

    if (flashTimerRef.current !== null) {
      window.clearTimeout(flashTimerRef.current);
    }

    flashTimerRef.current = window.setTimeout(() => {
      setFlashState("none");
    }, 130);
  }, []);

  const triggerAnim = useCallback(
    (nextAnim: KuromiAnim, duration = 260) => {
      setAnim(nextAnim);

      if (animTimerRef.current !== null) {
        window.clearTimeout(animTimerRef.current);
      }

      animTimerRef.current = window.setTimeout(() => {
        setAnim(status === "won" ? "celebrate" : "idle");
      }, duration);
    },
    [status]
  );

  const hitSlot = useCallback(
    (slotIndex: number) => {
      if (status !== "playing") {
        return;
      }

      setCursorIndex(slotIndex);

      if (slotIndex !== kuromiIndex) {
        playSound(missAudioRef);
        triggerFlash("miss");
        return;
      }

      setScore((current) => current + 1);
      setKuromiIndex(null);
      setWinkIndex(slotIndex);

      if (winkTimerRef.current !== null) {
        window.clearTimeout(winkTimerRef.current);
      }

      winkTimerRef.current = window.setTimeout(() => {
        setWinkIndex(null);
      }, WINK_MS);

      triggerAnim("attack");
      playSound(hitAudioRef);
      triggerFlash("hit");
    },
    [kuromiIndex, playSound, status, triggerAnim, triggerFlash]
  );

  const moveCursor = useCallback(
    (rowDelta: number, colDelta: number) => {
      const row = Math.floor(cursorIndex / BOARD_COLS);
      const col = cursorIndex % BOARD_COLS;
      const nextRow = clamp(row + rowDelta, 0, BOARD_COLS - 1);
      const nextCol = clamp(col + colDelta, 0, BOARD_COLS - 1);
      setCursorIndex(nextRow * BOARD_COLS + nextCol);
    },
    [cursorIndex]
  );

  useEffect(() => {
    if (status !== "playing") {
      return;
    }

    const timer = window.setInterval(() => {
      setTimeLeft((current) => current - 1);
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [status]);

  useEffect(() => {
    if (status !== "playing") {
      return;
    }

    const timer = window.setInterval(() => {
      setHasStarted(true);
      const nextIndex = randomInt(BOARD_SLOTS);
      setKuromiIndex(nextIndex);
      setWinkIndex(null);
      setAnim("walk");

      if (hideTimerRef.current !== null) {
        window.clearTimeout(hideTimerRef.current);
      }

      hideTimerRef.current = window.setTimeout(() => {
        setKuromiIndex(null);
        setAnim("idle");
      }, VISIBLE_MS);
    }, SPAWN_MS);

    return () => {
      window.clearInterval(timer);
    };
  }, [status]);

  useEffect(() => {
    if (status !== "playing") {
      return;
    }

    if (score >= TARGET_SCORE) {
      const completedInSeconds = Math.max(0, START_TIME - timeLeft);

      if (bestTime === null || completedInSeconds < bestTime) {
        saveBestTime(completedInSeconds);
      }

      stopCurrentTimers();
      setStatus("won");
      setKuromiIndex(null);
      setWinkIndex(null);
      setAnim("celebrate");
      setShowSurprisePopup(true);
      playSound(winAudioRef);
    }
  }, [bestTime, playSound, saveBestTime, score, status, stopCurrentTimers, timeLeft]);

  useEffect(() => {
    if (status !== "playing") {
      return;
    }

    if (timeLeft > 0) {
      return;
    }

    stopCurrentTimers();
    setStatus("lost");
    setKuromiIndex(null);
    setWinkIndex(null);
    setAnim("idle");
  }, [status, timeLeft, stopCurrentTimers]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent): void {
      switch (event.key) {
        case "ArrowUp":
        case "w":
        case "W":
          event.preventDefault();
          moveCursor(-1, 0);
          return;
        case "ArrowDown":
        case "s":
        case "S":
          event.preventDefault();
          moveCursor(1, 0);
          return;
        case "ArrowLeft":
        case "a":
        case "A":
          event.preventDefault();
          moveCursor(0, -1);
          return;
        case "ArrowRight":
        case "d":
        case "D":
          event.preventDefault();
          moveCursor(0, 1);
          return;
        case "j":
        case "J":
        case "Enter":
        case " ":
          event.preventDefault();
          hitSlot(cursorIndex);
          return;
        default:
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [cursorIndex, hitSlot, moveCursor]);

  useEffect(() => {
    hitAudioRef.current = new Audio(hitSoundUrl);
    hitAudioRef.current.volume = 0.35;
    hitAudioRef.current.preload = "auto";

    missAudioRef.current = new Audio(missSoundUrl);
    missAudioRef.current.volume = 0.3;
    missAudioRef.current.preload = "auto";

    winAudioRef.current = new Audio(WIN_SOUND_URL);
    winAudioRef.current.volume = 0.5;
    winAudioRef.current.preload = "auto";

    return () => {
      stopCurrentTimers();

      [hitAudioRef.current, missAudioRef.current, winAudioRef.current].forEach((audio) => {
        if (!audio) {
          return;
        }

        audio.pause();
      });
    };
  }, [stopCurrentTimers]);

  const resetGame = useCallback(() => {
    stopCurrentTimers();
    setStatus("playing");
    setScore(0);
    setTimeLeft(START_TIME);
    setHasStarted(false);
    setKuromiIndex(null);
    setWinkIndex(null);
    setCursorIndex(4);
    setAnim("idle");
    setShowSurprisePopup(false);
  }, [stopCurrentTimers]);

  return (
    <section className={`kuromi-screen kuromi-flash-${flashState}`} aria-label={t("kuromi_game_aria")}>
      <div className="kuromi-topbar">
        <span className="kuromi-arcade-badge">{t("kuromi_arcade_mode")}</span>
        <button
          type="button"
          className="kuromi-sound-toggle"
          onClick={() => setIsMuted((value) => !value)}
        >
          {isMuted ? t("kuromi_sound_off") : t("kuromi_sound_on")}
        </button>
      </div>
      <p className="kuromi-easter-kicker">{t("easter_egg_found")}</p>
      <h1 className="kuromi-title">{t("kuromi_game_title")}</h1>
      <p className="kuromi-easter-note">{t("easter_egg_only_for_you")}</p>
      <p className="kuromi-subtitle">{t("kuromi_game_subtitle")}</p>

      <div className="kuromi-hero" aria-hidden="true">
        <img
          className="kuromi-character"
          src={characterSrc}
          alt={t("kuromi_alt")}
          data-anim={anim}
        />
      </div>

      <div className="kuromi-hud">
        <span>{t("kuromi_points_label")}: {score}/{TARGET_SCORE}</span>
        <span>{t("kuromi_time_label")}: {timeLeft}s</span>
        <span>{t("kuromi_best_time_label")}: {bestTime === null ? "--" : `${bestTime}s`}</span>
      </div>

      <div className="kuromi-progress" aria-hidden="true">
        <div className="kuromi-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="kuromi-pop-grid" role="application" aria-label={t("kuromi_board_label")}>
        {Array.from({ length: BOARD_SLOTS }, (_, slotIndex) => {
          const isCursor = cursorIndex === slotIndex;
          const isWink = winkIndex === slotIndex;
          const isVisible = kuromiIndex === slotIndex || isWink;

          return (
            <button
              key={slotIndex}
              type="button"
              className={`kuromi-pop-slot${isCursor ? " is-cursor" : ""}`}
              onClick={() => hitSlot(slotIndex)}
              aria-label={`${t("kuromi_hole_label")} ${slotIndex + 1}`}
            >
              <span className="kuromi-pop-hole" />
              {isVisible && (
                <img
                  className="kuromi-pop-sprite"
                  src={isWink ? kuromiWink : kuromiAttack}
                  alt={t("kuromi_target_alt")}
                  draggable={false}
                />
              )}
            </button>
          );
        })}
      </div>

      {status === "lost" && (
        <div className="kuromi-overlay" role="status" aria-live="polite">
          <h2>{t("kuromi_lost_title")}</h2>
          <p>{t("kuromi_lost_text")}</p>
          <button type="button" onClick={resetGame}>
            {t("kuromi_play_again")}
          </button>
        </div>
      )}

      {showSurprisePopup && (
        <div className="kuromi-surprise-backdrop" role="dialog" aria-modal="true" aria-live="polite">
          <div className="kuromi-surprise-popup">
            <p className="kuromi-surprise-kicker">
              {isBirthdayToday ? t("kuromi_surprise_kicker") : t("kuromi_win_kicker")}
            </p>
            <h2>{isBirthdayToday ? t("kuromi_surprise_title") : t("kuromi_win_title")}</h2>
            {isBirthdayToday && <p>{`${t("kuromi_surprise_age_label")} ${birthdayAgeMilestone}`}</p>}
            <p>{isBirthdayToday ? t("kuromi_surprise_text") : t("kuromi_win_text")}</p>
            <div className="kuromi-surprise-actions">
              <button type="button" onClick={() => setShowSurprisePopup(false)}>
                {t("kuromi_close")}
              </button>
              <button type="button" onClick={resetGame}>
                {t("kuromi_play_again")}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
