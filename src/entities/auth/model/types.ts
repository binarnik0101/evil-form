export type LoginState = {
    email: string;
    password: string;
    remember: boolean;
};

export type FieldErrors = {
    email?: string;
    password?: string;
    global?: string;
};