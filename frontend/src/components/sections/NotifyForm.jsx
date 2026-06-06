"use client";

import { useState } from "react";
import { brand } from "@/constants/brand";

export default function NotifyForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    if (!email.trim()) {
      setMessage("Please enter your email address.");
      return;
    }

    setMessage("You’re on the FITT FOX waitlist.");
    setEmail("");
  }

  return (
    <form className="notify-form" onSubmit={handleSubmit}>
      <div className="notify-form__row">
        <input
          type="email"
          placeholder={brand.emailPlaceholder}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="notify-form__input"
        />

        <button type="submit" className="notify-form__button">
          {brand.notifyButton}
        </button>
      </div>

      {message && <p className="notify-form__message">{message}</p>}
    </form>
  );
}