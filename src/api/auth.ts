// src/api/auth.ts
import { request, setAccessToken } from "./client";
import type { LoginResponse } from "./types";

export async function login(email: string, password: string) {
  const body = await request<LoginResponse>("POST", "/auth/login", { body: { email, password } });
  setAccessToken(body.data.accessToken);           // sementara: Minggu 20 membuatnya benar
  return body.data.peserta;
}
