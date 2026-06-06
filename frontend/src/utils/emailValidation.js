const EMAIL_PATTERN =
  /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/i;

const COMMON_DOMAIN_TYPOS = {
  "gkail.com": "gmail.com",
  "gmai.com": "gmail.com",
  "gmal.com": "gmail.com",
  "gmial.com": "gmail.com",
  "gmail.co": "gmail.com",
  "gmail.con": "gmail.com",
  "hotmial.com": "hotmail.com",
  "hotnail.com": "hotmail.com",
  "outlok.com": "outlook.com",
  "outlook.co": "outlook.com",
  "yaho.com": "yahoo.com",
  "yahoo.co": "yahoo.com",
};

const DISPOSABLE_DOMAINS = new Set([
  "10minutemail.com",
  "guerrillamail.com",
  "mailinator.com",
  "temp-mail.org",
  "tempmail.com",
  "throwawaymail.com",
  "yopmail.com",
]);

const PLACEHOLDER_LOCAL_PARTS = new Set([
  "abc",
  "asdf",
  "demo",
  "example",
  "fake",
  "qwerty",
  "sample",
  "test",
  "testing",
]);

export function validateEmailAddress(value) {
  const email = String(value || "").trim().toLowerCase();
  const [localPart, domain, ...extraParts] = email.split("@");

  if (!email) {
    return { email, error: "Please enter your email address." };
  }

  if (
    email.length > 254 ||
    localPart?.length > 64 ||
    extraParts.length ||
    !EMAIL_PATTERN.test(email) ||
    localPart.startsWith(".") ||
    localPart.endsWith(".") ||
    localPart.includes("..")
  ) {
    return { email, error: "Please enter a valid email address." };
  }

  const suggestedDomain = COMMON_DOMAIN_TYPOS[domain];
  if (suggestedDomain) {
    return {
      email,
      error: `Did you mean ${localPart}@${suggestedDomain}?`,
    };
  }

  if (DISPOSABLE_DOMAINS.has(domain)) {
    return {
      email,
      error: "Please use a permanent email address.",
    };
  }

  if (PLACEHOLDER_LOCAL_PARTS.has(localPart)) {
    return {
      email,
      error: "Please enter your personal email address.",
    };
  }

  return { email, domain, error: "" };
}
