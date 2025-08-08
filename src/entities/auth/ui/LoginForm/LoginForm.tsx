import React, { useEffect, useRef, useState } from "react";
import type { FieldErrors, LoginState } from "../../model/types.ts";
import styles from './LoginForm.module.css'
import { fakeLoginRequest } from "../../model/api.ts";
import {validateEmail, validatePassword} from "../../helpers/validators.ts";

export const LoginForm: React.FC = () => {
    const [state, setState] = useState<LoginState>({
        email: "",
        password: "",
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<FieldErrors>({});

    const submitBtnRef = useRef<HTMLButtonElement | null>(null);
    const globalErrorRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (errors.global) {
            globalErrorRef.current?.focus();
        }
    }, [errors.global]);

    function handleChange<K extends keyof LoginState>(key: K, value: LoginState[K]) {
        setState((s) => ({ ...s, [key]: value }));

        setErrors((prev) => {
            if (key === "email") return { ...prev, email: undefined };
            if (key === "password") return { ...prev, password: undefined };
            return prev;
        });
    }

    function handleBlur(field: "email" | "password") {
        const err = field === "email" ? validateEmail(state.email) : validatePassword(state.password);

        setErrors((prev) => ({ ...prev, [field]: err ?? undefined }));
    }

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();

        const emailErr = validateEmail(state.email);
        const passwordErr = validatePassword(state.password);
        setErrors({ email: emailErr ?? undefined, password: passwordErr ?? undefined });

        if (emailErr || passwordErr) return;

        setSubmitting(true);

        if (submitBtnRef.current) submitBtnRef.current.setAttribute("autocomplete", "off");

        try {
            await fakeLoginRequest(state);
            alert("Demo login succeeded — replace fakeLoginRequest with your real API call");
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : String(err);
            setErrors((prev) => ({ ...prev, global: errorMessage }));
        } finally {
            setSubmitting(false);
            if (submitBtnRef.current) submitBtnRef.current.removeAttribute("autocomplete");
        }
    }

    return (
        <div className={styles.loginContainer}>
            <form
                onSubmit={onSubmit}
                className={styles.loginForm}
                noValidate
                aria-describedby={errors.global ? "global-error" : undefined}
            >
                <h1 className={styles.title}>Sign in</h1>

                {errors.global && (
                    <div
                        id="global-error"
                        ref={globalErrorRef}
                        tabIndex={-1}
                        role="alert"
                        aria-live="assertive"
                        className={styles.globalError}
                    >
                        {errors.global}
                    </div>
                )}

                <label className={styles.labelBlock}>
                    <span className={styles.labelText}>Email</span>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="username"
                        required
                        aria-required="true"
                        aria-invalid={!!errors.email}
                        aria-errormessage={errors.email ? "email-error" : undefined}
                        value={state.email}
                        onChange={(ev) => handleChange("email", ev.target.value)}
                        onBlur={() => handleBlur("email")}
                        className={styles.inputField}
                    />

                        <div id="email-error" role="alert" className={styles.inputError}>
                            {errors.email}
                        </div>

                </label>

                <label className={styles.labelBlock}>
                    <span className={styles.labelText}>Password</span>
                    <div className={styles.flexRow}>
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="current-password"
                            required
                            aria-required="true"
                            aria-invalid={!!errors.password}
                            aria-errormessage={errors.password ? "password-error" : undefined}
                            value={state.password}
                            onChange={(ev) => handleChange("password", ev.target.value)}
                            onBlur={() => handleBlur("password")}
                            className={styles.inputField + " " + styles.flexGrow}
                            style={{ borderRadius: "0.375rem 0 0 0.375rem", borderRight: "none" }}
                        />
                        <button
                            type="button"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            aria-pressed={showPassword}
                            onClick={() => setShowPassword((s) => !s)}
                            className={styles.buttonShowHide}
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>

                        <div id="password-error" role="alert" className={styles.inputError}>
                            {errors.password}
                        </div>

                </label>

                <label className={styles.checkboxLabel}>
                    <input
                        type="checkbox"
                        checked={state.remember}
                        onChange={(ev) => handleChange("remember", ev.target.checked)}
                    />
                    <span>Remember me</span>
                </label>

                <div className={styles.flexBetween}>
                    <a className={styles.linkForgot} href="#/forgot">
                        Forgot password?
                    </a>

                    <button
                        ref={submitBtnRef}
                        type="submit"
                        disabled={submitting}
                        className={styles.submitButton}
                    >
                        {submitting ? "Signing in..." : "Sign in"}
                    </button>
                </div>

                <p className={styles.demoText}>
                    Demo: use <code className={styles.demoCode}>demo@example.com</code> /{" "}
                    <code className={styles.demoCode}>password123</code>
                </p>
            </form>
        </div>
    );
}
