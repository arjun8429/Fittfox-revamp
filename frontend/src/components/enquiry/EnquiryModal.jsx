"use client";

import { useEffect, useMemo, useState } from "react";

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwMAyCwIx03DdRnvJGcDl0Zf5b4qd1glJ1UtfoXl0LRbe9zS-Kk0NeaikuOK7QpSWB29Q/exec";

const FLAVORS = [
  { id: "mint", name: "Mint", hindi: "पुदीना", emoji: "🌿", color: "#16a34a" },
  { id: "guava_chilli", name: "Guava Chilli", hindi: "अमरूद मिर्च", emoji: "🍈", color: "#dc2626" },
  { id: "jal_jeera", name: "Jal Jeera", hindi: "जल जीरा", emoji: "🫙", color: "#d97706" },
  { id: "raw_mango", name: "Raw Mango", hindi: "कच्चा आम", emoji: "🥭", color: "#059669" },
];

const INTENSITY_LABELS = {
  mint: "How was the mint intensity?",
  guava_chilli: "How was the spice-fruit balance?",
  jal_jeera: "How was the masala intensity?",
  raw_mango: "How was the tanginess?",
};

const PRODUCT_QUESTIONS = [
  { id: "consistency", label: "How was the mix consistency?", options: ["Too thick", "Perfect", "Too thin"] },
  { id: "dissolve", label: "Did it dissolve well in water?", options: ["Dissolved fully", "Mostly", "Left lumps"] },
  { id: "buy", label: "Would you consider buying this?", options: ["Definitely", "Maybe", "Not likely"] },
  {
    id: "channel",
    label: "Where would you expect to buy this?",
    hint: "Select all that apply",
    multi: true,
    options: ["Local Kirana", "Quick Commerce (Blinkit/Zepto)", "Brand Website", "Modern Trade (DMart etc.)"],
  },
];

const STEP_LABELS = ["", "Flavours", "Rank", "Taste", "Experience", "Almost done"];

function Option({ children, selected, onClick, multi = false, color = "#111827" }) {
  return (
    <button
      type="button"
      className={`poll-option${selected ? " poll-option--selected" : ""}`}
      style={{ "--option-color": color }}
      onClick={onClick}
    >
      <span className={multi ? "poll-option__square" : "poll-option__circle"}>{selected ? "✓" : ""}</span>
      <span>{children}</span>
    </button>
  );
}

function Nav({ back, skip, next, nextLabel = "Next →", disabled = false, loading = false }) {
  return (
    <div className="poll-nav">
      {back && <button type="button" className="poll-button poll-button--back" onClick={back}>←</button>}
      <button type="button" className="poll-button poll-button--primary" onClick={next} disabled={disabled || loading}>
        {loading ? "Submitting..." : nextLabel}
      </button>
      {skip && <button type="button" className="poll-button poll-button--skip" onClick={skip} disabled={loading}>Skip</button>}
    </div>
  );
}

export default function EnquiryModal({ open, onClose }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [triedIds, setTriedIds] = useState([]);
  const [orderedIds, setOrderedIds] = useState([]);
  const [flavourAnswers, setFlavourAnswers] = useState({});
  const [productAnswers, setProductAnswers] = useState({});
  const [openFeedback, setOpenFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const triedFlavors = useMemo(
    () => FLAVORS.filter((flavor) => triedIds.includes(flavor.id)),
    [triedIds],
  );

  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open, onClose]);

  if (!open) return null;

  function toggleFlavor(id) {
    setTriedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  function answerFlavor(flavorId, key, value) {
    setFlavourAnswers((current) => ({
      ...current,
      [flavorId]: { ...(current[flavorId] || {}), [key]: value },
    }));
  }

  function answerProduct(question, value) {
    if (!question.multi) {
      setProductAnswers((current) => ({ ...current, [question.id]: value }));
      return;
    }
    setProductAnswers((current) => {
      const selected = Array.isArray(current[question.id]) ? current[question.id] : [];
      return {
        ...current,
        [question.id]: selected.includes(value)
          ? selected.filter((item) => item !== value)
          : [...selected, value],
      };
    });
  }

  function moveFlavor(index, direction) {
    const next = [...orderedIds];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setOrderedIds(next);
  }

  function reset() {
    setStep(0);
    setName("");
    setTriedIds([]);
    setOrderedIds([]);
    setFlavourAnswers({});
    setProductAnswers({});
    setOpenFeedback("");
    setSubmitting(false);
    setError("");
  }

  async function submitFeedback() {
    if (submitting) return;
    setSubmitting(true);
    setError("");

    const payload = {
      submittedAt: new Date().toISOString(),
      name: name || "Anonymous",
      triedFlavorIds: triedIds,
      triedFlavorNames: triedFlavors.map((flavor) => flavor.name),
      ranking: triedIds.length > 1
        ? orderedIds.map((id, index) => {
            const flavor = FLAVORS.find((item) => item.id === id);
            return { rank: index + 1, id, name: flavor.name };
          })
        : [],
      flavourAnswers,
      productAnswers,
      openFeedback,
    };

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        redirect: "follow",
        keepalive: true,
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      });
      setStep(6);
    } catch (submissionError) {
      console.error("Feedback submission failed:", submissionError);
      setError("Could not submit feedback. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const progress = step >= 1 && step <= 5 ? ((step - 1) / 4) * 100 : 0;

  return (
    <div className="poll-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="poll-card" role="dialog" aria-modal="true" aria-label="FITTFOX Sattu ProMix feedback">
        <header className="poll-header">
          <span>FITTFOX · Sattu ProMix</span>
          <button type="button" className="poll-close" aria-label="Close feedback form" onClick={onClose}>×</button>
        </header>

        {step >= 1 && step <= 5 && (
          <div className="poll-progress">
            <div className="poll-progress__labels"><b>STEP {step} OF 5</b><span>{STEP_LABELS[step]}</span></div>
            <div className="poll-progress__track"><span style={{ width: `${progress}%` }} /></div>
          </div>
        )}

        <div className="poll-body">
          {step === 0 && (
            <div className="poll-section poll-intro">
              <div className="poll-intro__icon">👋</div>
              <h2>Hey there! You&apos;re one of the first to try FITTFOX Sattu ProMix.</h2>
              <p>Your input helps shape our first launch.</p>
              <span className="poll-time">Takes just 2-3 minutes</span>
              <input className="poll-input" placeholder="Your name (optional)" value={name} onChange={(event) => setName(event.target.value)} />
              <button type="button" className="poll-button poll-button--primary poll-button--wide" onClick={() => setStep(1)}>Start →</button>
            </div>
          )}

          {step === 1 && (
            <div className="poll-section">
              <h2>What did you try today?</h2>
              <p>Select every flavour you tasted. We&apos;ll only ask about those.</p>
              <div className="poll-flavor-grid">
                {FLAVORS.map((flavor) => {
                  const selected = triedIds.includes(flavor.id);
                  return (
                    <button type="button" key={flavor.id} className={`poll-flavor${selected ? " poll-flavor--selected" : ""}`} style={{ "--flavor-color": flavor.color }} onClick={() => toggleFlavor(flavor.id)}>
                      <span className="poll-flavor__check">{selected ? "✓" : ""}</span>
                      <span className="poll-flavor__emoji">{flavor.emoji}</span>
                      <b>{flavor.name}</b>
                      <small>{flavor.hindi}</small>
                    </button>
                  );
                })}
              </div>
              <Nav
                back={() => setStep(0)}
                next={() => {
                  setOrderedIds(triedIds);
                  setStep(triedIds.length > 1 ? 2 : 3);
                }}
                disabled={!triedIds.length}
                nextLabel={triedIds.length ? `Continue with ${triedIds.length} flavour${triedIds.length > 1 ? "s" : ""} →` : "Select a flavour first"}
              />
            </div>
          )}

          {step === 2 && (
            <div className="poll-section">
              <h2>Rank the flavours</h2>
              <p>Move your favourite to the top.</p>
              <div className="poll-ranking">
                {orderedIds.map((id, index) => {
                  const flavor = FLAVORS.find((item) => item.id === id);
                  return (
                    <div className="poll-rank" key={id} style={{ "--flavor-color": flavor.color }}>
                      <b>#{index + 1}</b><span>{flavor.emoji}</span><strong>{flavor.name}</strong>
                      <div>
                        <button type="button" aria-label={`Move ${flavor.name} up`} onClick={() => moveFlavor(index, -1)} disabled={index === 0}>↑</button>
                        <button type="button" aria-label={`Move ${flavor.name} down`} onClick={() => moveFlavor(index, 1)} disabled={index === orderedIds.length - 1}>↓</button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <Nav back={() => setStep(1)} skip={() => setStep(3)} next={() => setStep(3)} />
            </div>
          )}

          {step === 3 && (
            <div className="poll-section">
              <h2>Tell us more</h2>
              <p>Quick questions about each flavour you tried.</p>
              {triedFlavors.map((flavor) => {
                const answers = flavourAnswers[flavor.id] || {};
                return (
                  <div className="poll-flavor-questions" key={flavor.id}>
                    <h3 style={{ "--flavor-color": flavor.color }}>{flavor.emoji} {flavor.name} <small>{flavor.hindi}</small></h3>
                    {[
                      ["overall", "How did you like this flavour overall?", ["Loved it", "It was okay", "Didn't like it"]],
                      ["intensity", INTENSITY_LABELS[flavor.id], ["Just right", "Too strong", "Too mild"]],
                      ["again", "Would you drink this again?", ["Yes", "Maybe", "No"]],
                    ].map(([key, label, options]) => (
                      <div className="poll-question" key={key}>
                        <h4>{label}</h4>
                        {options.map((option) => <Option key={option} color={flavor.color} selected={answers[key] === option} onClick={() => answerFlavor(flavor.id, key, option)}>{option}</Option>)}
                      </div>
                    ))}
                  </div>
                );
              })}
              <Nav back={() => setStep(triedIds.length > 1 ? 2 : 1)} skip={() => setStep(4)} next={() => setStep(4)} />
            </div>
          )}

          {step === 4 && (
            <div className="poll-section">
              <h2>Product experience</h2>
              <p>Quick questions about the product itself.</p>
              {PRODUCT_QUESTIONS.map((question) => (
                <div className="poll-question" key={question.id}>
                  <h4>{question.label} {question.hint && <small>{question.hint}</small>}</h4>
                  {question.options.map((option) => (
                    <Option
                      key={option}
                      multi={question.multi}
                      selected={question.multi ? productAnswers[question.id]?.includes(option) : productAnswers[question.id] === option}
                      onClick={() => answerProduct(question, option)}
                    >
                      {option}
                    </Option>
                  ))}
                </div>
              ))}
              <Nav back={() => setStep(3)} skip={() => setStep(5)} next={() => setStep(5)} />
            </div>
          )}

          {step === 5 && (
            <div className="poll-section">
              <h2>Anything else?</h2>
              <p>Unfiltered thoughts: what worked, what didn&apos;t, what&apos;s missing? Optional.</p>
              <textarea className="poll-textarea" rows="6" placeholder="Share your thoughts..." value={openFeedback} onChange={(event) => setOpenFeedback(event.target.value)} />
              <small className="poll-character-count">{openFeedback.length} characters</small>
              {error && <p className="poll-error" role="alert">{error}</p>}
              <Nav back={() => setStep(4)} skip={submitFeedback} next={submitFeedback} nextLabel="Submit feedback ✓" loading={submitting} />
            </div>
          )}

          {step === 6 && (
            <div className="poll-section poll-done">
              <div className="poll-done__icon">🙏</div>
              <h2>{name ? `Thank you, ${name}!` : "Thank you!"}</h2>
              <p>We read every response before deciding which flavours launch first. Your input genuinely matters.</p>
              <div className="poll-summary">{triedFlavors.map((flavor) => <span key={flavor.id}>{flavor.emoji} {flavor.name}</span>)}</div>
              <div className="poll-done__actions">
                <button type="button" className="poll-button poll-button--skip" onClick={reset}>Submit another</button>
                <button type="button" className="poll-button poll-button--primary" onClick={onClose}>Done</button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
