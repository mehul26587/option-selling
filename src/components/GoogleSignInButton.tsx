"use client";

import React, { useEffect, useRef, useState } from "react";
import { useApp } from "../context/AppContext";
import { Loader2 } from "lucide-react";

declare global {
  interface Window {
    google?: any;
    handleGoogleCallback?: (response: any) => void;
  }
}

const GOOGLE_CLIENT_ID = "207372613533-2lvj2glt01tn79f5tnd38kcc6d74h2ch.apps.googleusercontent.com";

function parseJwt(token: string) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Error parsing JWT:", e);
    return null;
  }
}

interface GoogleSignInButtonProps {
  onSuccess?: () => void;
  className?: string;
  theme?: "outline" | "filled_black" | "filled_blue";
  size?: "large" | "medium" | "small";
  shape?: "pill" | "rectangular";
  text?: "signin_with" | "signup_with" | "continue_with";
}

export const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  onSuccess,
  className = "",
  theme = "outline",
  size = "medium",
  shape = "pill",
  text = "continue_with",
}) => {
  const { loginWithGoogle, currentUser } = useApp();
  const btnContainerRef = useRef<HTMLDivElement>(null);
  const [isGsiLoaded, setIsGsiLoaded] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    window.handleGoogleCallback = (response: any) => {
      if (!response || !response.credential) return;
      setIsAuthenticating(true);
      const payload = parseJwt(response.credential);
      if (payload) {
        loginWithGoogle({
          name: payload.name || payload.given_name || payload.email.split("@")[0],
          email: payload.email,
          avatar: payload.picture || "",
        });
        if (onSuccess) onSuccess();
      }
      setIsAuthenticating(false);
    };

    let interval: NodeJS.Timeout;
    const checkGsi = () => {
      if (window.google?.accounts?.id && btnContainerRef.current) {
        clearInterval(interval);
        setIsGsiLoaded(true);

        try {
          window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: window.handleGoogleCallback,
            auto_select: false,
            cancel_on_tap_outside: true,
          });

          // Render the official native Google Sign-in button
          btnContainerRef.current.innerHTML = "";
          window.google.accounts.id.renderButton(btnContainerRef.current, {
            type: "standard",
            theme: theme,
            size: size,
            text: text,
            shape: shape,
            logo_alignment: "left",
          });
        } catch (err) {
          console.warn("Google GSI render error:", err);
        }
      }
    };

    interval = setInterval(checkGsi, 200);
    checkGsi();

    return () => clearInterval(interval);
  }, [theme, size, shape, text, loginWithGoogle, onSuccess]);

  // Fallback trigger if GSI script is blocked or local origin differs
  const triggerNativeGooglePrompt = () => {
    if (window.google?.accounts?.id) {
      try {
        window.google.accounts.id.prompt();
      } catch (e) {
        console.warn(e);
      }
    }
  };

  return (
    <div className={`inline-flex items-center ${className}`}>
      {isAuthenticating && (
        <div className="flex items-center gap-2 text-xs text-emerald-400 mr-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Verifying with Google...</span>
        </div>
      )}

      {/* Official Native Google Button container */}
      <div ref={btnContainerRef} className="min-h-[40px] flex items-center">
        {/* Fallback button while GSI is initializing */}
        {!isGsiLoaded && (
          <button
            type="button"
            onClick={triggerNativeGooglePrompt}
            className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white hover:bg-slate-100 text-slate-800 font-semibold text-xs transition border border-slate-300 shadow-sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>
        )}
      </div>
    </div>
  );
};
