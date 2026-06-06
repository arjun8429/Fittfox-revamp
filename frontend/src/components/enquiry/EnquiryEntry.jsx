"use client";

import { useCallback, useEffect, useState } from "react";
import EnquiryModal from "./EnquiryModal";

export default function EnquiryEntry() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const syncFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      setOpen(params.get("enquiry") === "true");
    };

    syncFromUrl();
    window.addEventListener("popstate", syncFromUrl);
    return () => window.removeEventListener("popstate", syncFromUrl);
  }, []);

  const close = useCallback(() => {
    const url = new URL(window.location.href);
    url.searchParams.delete("enquiry");
    window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
    setOpen(false);
  }, []);

  return <EnquiryModal open={open} onClose={close} />;
}
