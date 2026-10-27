"use client";

import Script from "next/script";
import { useRef } from "react";
import { useSubmit } from "@/hooks/use-submit";
import { api } from "@/lib/api";

const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

type GoogleId = {
  initialize: (options: {
    client_id: string;
    callback: (response: { credential: string }) => void;
  }) => void;
  renderButton: (
    element: HTMLElement,
    options: Record<string, unknown>,
  ) => void;
};

declare global {
  interface Window {
    google?: { accounts: { id: GoogleId } };
  }
}

// Patients only: Google gives an id token, the API verifies it and sets the session cookies.
export function GoogleLogin({ onSuccess }: { onSuccess: () => void }) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const { run } = useSubmit();

  if (!clientId) return null;

  const renderButton = () => {
    if (!window.google || !buttonRef.current) return;
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: async ({ credential }) => {
        const ok = await run(() =>
          api.post("/auth/google", { idToken: credential }),
        );
        if (ok) onSuccess();
      },
    });
    window.google.accounts.id.renderButton(buttonRef.current, {
      theme: "outline",
      size: "large",
      width: 320,
    });
  };

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        onReady={renderButton}
      />
      <div ref={buttonRef} className="flex justify-center" />
    </>
  );
}
