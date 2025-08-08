import type {LoginState} from "./types.ts";

export const fakeLoginRequest = async (body: LoginState)=> {
    await new Promise((r) => setTimeout(r, 700));

    // demo credentials
    if (body.email === "demo@example.com" && body.password === "password123") {
        return;
    }

    const err: any = new Error("Invalid email or password");
    err.status = 401;
    throw err;
}
