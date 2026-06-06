"use client";

import { useState } from "react";
import { brand } from "@/constants/brand";
import { validateEmailAddress } from "@/utils/emailValidation";

export default function NotifyForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle");

  async function handleSubmit(event) {
    event.preventDefault();

    const validation = validateEmailAddress(email);
    if (validation.error) {
      setMessage(validation.error);
      setStatus("error");
      return;
    }

    setStatus("loading");
    setMessage("");

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/notify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: validation.email,
          website: formData.get("website"),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to join the waitlist.");
      }

      setMessage(result.message);
      setStatus("success");
      setEmail("");
    } catch (error) {
      setMessage(error.message || "Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  function handleEmailChange(event) {
    const nextEmail = event.target.value;
    setEmail(nextEmail);

    if (status === "error") {
      setMessage("");
      setStatus("idle");
    }

    const validation = validateEmailAddress(nextEmail);
    if (
      validation.error?.startsWith("Did you mean") ||
      validation.error === "Please use a permanent email address." ||
      validation.error === "Please enter your personal email address."
    ) {
      setMessage(validation.error);
      setStatus("error");
    }
  }

  function handleEmailBlur() {
    if (!email.trim()) return;

    const validation = validateEmailAddress(email);
    if (validation.error) {
      setMessage(validation.error);
      setStatus("error");
    }
  }

  return (
    <form className="notify-form" onSubmit={handleSubmit}>
      <div className="notify-form__row">
        <input
          type="email"
          placeholder={brand.emailPlaceholder}
          value={email}
          onChange={handleEmailChange}
          onBlur={handleEmailBlur}
          className="notify-form__input"
          autoComplete="email"
          required
          disabled={status === "loading"}
        />

        <input
          type="text"
          name="website"
          tabIndex="-1"
          autoComplete="off"
          className="notify-form__honeypot"
          aria-hidden="true"
        />

        <button
          type="submit"
          className="notify-form__button"
          disabled={status === "loading"}
        >
          {status === "loading" ? "Joining..." : brand.notifyButton}
        </button>
      </div>

      {message && (
        <p
          className="notify-form__message"
          data-status={status}
          role="status"
          aria-live="polite"
        >
          {message}
        </p>
      )}
    </form>
  );
}
