"use client";
import { useState, useRef, useEffect } from "react";

const HOURS_12 = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const MINUTES = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

export default function TimeDial({ value, onChange, label, placeholder = "Select time" }) {
    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState("hour"); // "hour" | "minute"
    const [selectedHour, setSelectedHour] = useState(9);
    const [selectedMinute, setSelectedMinute] = useState(0);
    const [period, setPeriod] = useState("AM");
    const ref = useRef(null);

    // Parse incoming value (HH:mm 24h) into component state
    useEffect(() => {
        if (value) {
            const [hStr, mStr] = value.split(":");
            let h = parseInt(hStr, 10);
            const m = parseInt(mStr, 10);
            const p = h >= 12 ? "PM" : "AM";
            if (h === 0) h = 12;
            else if (h > 12) h -= 12;
            setSelectedHour(h);
            setSelectedMinute(m);
            setPeriod(p);
        }
    }, [value]);

    // Close on outside click
    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
                setMode("hour");
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const emitChange = (h, m, p) => {
        let hour24 = h;
        if (p === "AM" && h === 12) hour24 = 0;
        else if (p === "PM" && h !== 12) hour24 = h + 12;
        const timeStr = `${String(hour24).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
        onChange(timeStr);
    };

    const handleHourClick = (h) => {
        setSelectedHour(h);
        setMode("minute");
        // Don't emit yet — wait for minute selection
    };

    const handleMinuteClick = (m) => {
        setSelectedMinute(m);
        emitChange(selectedHour, m, period);
        setOpen(false);
        setMode("hour");
    };

    const togglePeriod = (p) => {
        setPeriod(p);
        if (value) {
            emitChange(selectedHour, selectedMinute, p);
        }
    };

    const getPosition = (index, total, radius) => {
        const angle = (index * 360) / total - 90; // start from top
        const rad = (angle * Math.PI) / 180;
        return {
            x: Math.cos(rad) * radius,
            y: Math.sin(rad) * radius,
        };
    };

    const items = mode === "hour" ? HOURS_12 : MINUTES;
    const selectedValue = mode === "hour" ? selectedHour : selectedMinute;

    // Calculate hand angle
    const getHandAngle = () => {
        if (mode === "hour") {
            const idx = HOURS_12.indexOf(selectedHour);
            return (idx * 360) / 12 - 90;
        }
        const idx = MINUTES.indexOf(selectedMinute);
        return (idx * 360) / 12 - 90;
    };

    const handAngle = getHandAngle();

    // Display formatted time
    const displayTime = value
        ? `${String(selectedHour).padStart(2, "0")}:${String(selectedMinute).padStart(2, "0")} ${period}`
        : placeholder;

    return (
        <div className="time-dial-wrapper" ref={ref}>
            <button
                type="button"
                className={`time-dial-trigger ${open ? "active" : ""} ${value ? "has-value" : ""}`}
                onClick={() => { setOpen(!open); setMode("hour"); }}
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                </svg>
                <span>{displayTime}</span>
            </button>

            {open && (
                <div className="time-dial-popup">
                    {/* Header showing selected time */}
                    <div className="dial-header">
                        <button
                            type="button"
                            className={`time-segment ${mode === "hour" ? "active" : ""}`}
                            onClick={() => setMode("hour")}
                        >
                            {String(selectedHour).padStart(2, "0")}
                        </button>
                        <span className="time-colon">:</span>
                        <button
                            type="button"
                            className={`time-segment ${mode === "minute" ? "active" : ""}`}
                            onClick={() => setMode("minute")}
                        >
                            {String(selectedMinute).padStart(2, "0")}
                        </button>
                        <div className="period-toggle">
                            <button
                                type="button"
                                className={`period-btn ${period === "AM" ? "active" : ""}`}
                                onClick={() => togglePeriod("AM")}
                            >AM</button>
                            <button
                                type="button"
                                className={`period-btn ${period === "PM" ? "active" : ""}`}
                                onClick={() => togglePeriod("PM")}
                            >PM</button>
                        </div>
                    </div>

                    {/* Clock face */}
                    <div className="clock-face">
                        <div className="clock-inner">
                            {/* Center dot */}
                            <div className="center-dot" />

                            {/* Clock hand */}
                            <div
                                className="clock-hand"
                                style={{
                                    transform: `rotate(${handAngle + 90}deg)`,
                                }}
                            >
                                <div className="hand-line" />
                                <div className="hand-tip" />
                            </div>

                            {/* Number positions */}
                            {items.map((item, i) => {
                                const pos = getPosition(i, items.length, 90);
                                const isSelected = item === selectedValue;
                                return (
                                    <button
                                        key={item}
                                        type="button"
                                        className={`clock-number ${isSelected ? "selected" : ""}`}
                                        style={{
                                            left: `calc(50% + ${pos.x}px)`,
                                            top: `calc(50% + ${pos.y}px)`,
                                        }}
                                        onClick={() => mode === "hour" ? handleHourClick(item) : handleMinuteClick(item)}
                                    >
                                        {mode === "minute" ? String(item).padStart(2, "0") : item}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="dial-footer">
                        <span className="mode-label">
                            {mode === "hour" ? "Select Hour" : "Select Minute"}
                        </span>
                    </div>
                </div>
            )}

            <style jsx>{`
        .time-dial-wrapper {
          position: relative;
        }

        .time-dial-trigger {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--card-border);
          padding: 0.75rem 1rem;
          border-radius: 10px;
          color: var(--text-muted);
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.25s ease;
          text-align: left;
        }

        .time-dial-trigger.has-value {
          color: var(--foreground);
        }

        .time-dial-trigger.active,
        .time-dial-trigger:hover {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(234, 179, 8, 0.1);
        }

        .time-dial-popup {
          position: absolute;
          top: calc(100% + 8px);
          left: 50%;
          transform: translateX(-50%);
          z-index: 1000;
          background: var(--background);
          border: 1px solid var(--card-border);
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255,255,255,0.05);
          padding: 1rem;
          width: 280px;
          animation: dialFadeIn 0.2s ease;
        }

        @keyframes dialFadeIn {
          from { opacity: 0; transform: translateX(-50%) scale(0.95) translateY(-4px); }
          to { opacity: 1; transform: translateX(-50%) scale(1) translateY(0); }
        }

        /* Header */
        .dial-header {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.15rem;
          margin-bottom: 0.75rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid var(--card-border);
        }

        .time-segment {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid transparent;
          color: var(--text-muted);
          font-size: 1.75rem;
          font-weight: 800;
          padding: 0.25rem 0.5rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          min-width: 50px;
          text-align: center;
          font-variant-numeric: tabular-nums;
        }

        .time-segment.active {
          background: var(--primary);
          color: #000;
          border-color: var(--primary);
        }

        .time-colon {
          font-size: 1.75rem;
          font-weight: 800;
          color: var(--text-muted);
          line-height: 1;
        }

        .period-toggle {
          display: flex;
          flex-direction: column;
          margin-left: 0.5rem;
          gap: 2px;
        }

        .period-btn {
          font-size: 0.65rem;
          font-weight: 700;
          padding: 0.2rem 0.4rem;
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-muted);
          border: 1px solid transparent;
          cursor: pointer;
          transition: all 0.2s ease;
          letter-spacing: 0.5px;
        }

        .period-btn.active {
          background: var(--primary);
          color: #000;
        }

        /* Clock Face */
        .clock-face {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.5rem;
        }

        .clock-inner {
          position: relative;
          width: 220px;
          height: 220px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--card-border);
        }

        .center-dot {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 8px;
          height: 8px;
          background: var(--primary);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          z-index: 3;
        }

        /* Clock hand */
        .clock-hand {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          transform-origin: 0 0;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 1;
        }

        .hand-line {
          position: absolute;
          bottom: 0;
          left: -1px;
          width: 2px;
          height: 72px;
          background: var(--primary);
          transform-origin: bottom center;
        }

        .hand-tip {
          position: absolute;
          top: -76px;
          left: -16px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--primary);
          opacity: 0.15;
        }

        /* Numbers */
        .clock-number {
          position: absolute;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--foreground);
          background: transparent;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          transform: translate(-50%, -50%);
          z-index: 2;
          font-variant-numeric: tabular-nums;
        }

        .clock-number:hover {
          background: rgba(234, 179, 8, 0.15);
          color: var(--primary);
          transform: translate(-50%, -50%) scale(1.15);
        }

        .clock-number.selected {
          background: var(--primary);
          color: #000;
          font-weight: 800;
          box-shadow: 0 2px 12px rgba(234, 179, 8, 0.4);
        }

        /* Footer */
        .dial-footer {
          text-align: center;
          padding-top: 0.5rem;
          border-top: 1px solid var(--card-border);
          margin-top: 0.5rem;
        }

        .mode-label {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--text-muted);
          font-weight: 600;
        }
      `}</style>
        </div>
    );
}
