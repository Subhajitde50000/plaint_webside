import React, { useRef, useEffect } from "react";

interface OtpInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  onComplete?: (otp: string) => void;
  hasError?: boolean;
  disabled?: boolean;
}

export function OtpInput({
  value,
  onChange,
  onComplete,
  hasError = false,
  disabled = false,
}: OtpInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus the first box on mount
    if (!disabled && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [disabled]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const val = e.target.value.replace(/\D/g, ""); // Allow only digits
    if (!val) return;

    // Use only the last digit typed
    const digit = val[val.length - 1];
    const newValue = [...value];
    newValue[index] = digit;
    onChange(newValue);

    // Auto-advance focus to next input
    if (index < 5 && digit) {
      inputRefs.current[index + 1]?.focus();
    }

    // Check if OTP is complete
    const completeCode = newValue.join("");
    if (completeCode.length === 6 && onComplete) {
      onComplete(completeCode);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      if (!value[index]) {
        // If current box is empty, clear previous box and focus it
        if (index > 0) {
          const newValue = [...value];
          newValue[index - 1] = "";
          onChange(newValue);
          inputRefs.current[index - 1]?.focus();
        }
      } else {
        // If current box is filled, clear it
        const newValue = [...value];
        newValue[index] = "";
        onChange(newValue);
      }
      e.preventDefault();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasteData) return;

    const newValue = [...value];
    for (let i = 0; i < 6; i++) {
      if (pasteData[i]) {
        newValue[i] = pasteData[i];
      }
    }
    onChange(newValue);

    // Focus the last filled input or the 6th input
    const focusIndex = Math.min(pasteData.length, 5);
    inputRefs.current[focusIndex]?.focus();

    if (pasteData.length === 6 && onComplete) {
      onComplete(pasteData);
    }
  };

  return (
    <div className="otp-container" role="group" aria-label="6-digit verification code">
      <style dangerouslySetInnerHTML={{ __html: `
        .otp-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin: 24px 0;
        }

        .otp-digit-input {
          width: 56px;
          height: 68px;
          border-radius: 12px;
          border: 1px solid var(--auth-input-border);
          background: #f8fafc;
          font-size: 20px;
          font-weight: 700;
          color: var(--auth-body);
          text-align: center;
          transition: all 150ms ease;
          outline: none;
        }

        .otp-digit-input:focus {
          border: 2px solid var(--auth-input-active);
          background: #ffffff;
          box-shadow: 0 0 0 4px rgba(0, 181, 102, 0.15);
        }

        .otp-digit-input.filled {
          background: var(--auth-accent-light);
          border-color: var(--auth-input-active);
        }

        .otp-digit-input.error {
          border-color: var(--auth-danger) !important;
          background: var(--auth-danger-bg) !important;
          box-shadow: 0 0 0 4px rgba(220, 38, 58, 0.15) !important;
        }

        /* Divider space between digit 3 and 4 */
        .otp-digit-input:nth-child(3) {
          margin-right: 8px;
        }

        @media (max-width: 520px) {
          .otp-digit-input {
            width: 44px;
            height: 56px;
            font-size: 18px;
            border-radius: 8px;
          }
          .otp-digit-input:nth-child(3) {
            margin-right: 4px;
          }
        }
      `}} />

      {Array.from({ length: 6 }).map((_, index) => (
        <input
          key={index}
          ref={(el) => { inputRefs.current[index] = el; }}
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={value[index] || ""}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={index === 0 ? handlePaste : undefined}
          disabled={disabled}
          className={`otp-digit-input ${value[index] ? "filled" : ""} ${hasError ? "error" : ""}`}
          aria-label={`Digit ${index + 1} of 6`}
          autoComplete={index === 0 ? "one-time-code" : "off"}
        />
      ))}
    </div>
  );
}
