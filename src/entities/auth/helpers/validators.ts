export const validateEmail = (value: string): string | null => {
    if (!value) return "Email is required";
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(value)) return "Enter a valid email address";
    return null;
}

export const validatePassword = (value: string): string | null => {
    if (!value) return "Password is required";
    if (value.length < 8) return "Password must be at least 8 characters";
    return null;
}