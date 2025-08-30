// src/atoms/singup.atom.tsx

import { atom } from "jotai";

export const MailAtom = atom<string>("");
export const PasswordAtom = atom<string>("");
export const ConfirmPasswordAtom = atom<string>("");