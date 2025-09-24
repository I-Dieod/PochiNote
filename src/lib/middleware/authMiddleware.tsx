// src/lib/middleware/authMiddleware.tsx

import { jwtVerify, JWTPayload } from "jose";

interface JWTUser extends JWTPayload {
    userName: string;
}

export const verifyAuthToken = async (token: string): Promise<{ valid: boolean; user?: JWTUser; error?: string }> => {
    try {
        // 1. JWTの構文と署名の検証
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error("JWT_SECRET is not configured");
        }

        const { payload } = await jwtVerify(
            token,
            new TextEncoder().encode(jwtSecret)
        );

        const user = payload as JWTUser;

        // 2. ペイロードの必須フィールドチェック
        if (!user.userName) {
            return {
                valid: false,
                error: "Invalid token payload: missing userName"
            };
        }

        // 3. Check token expired time
        const currentTime = Math.floor(Date.now() / 1000);
        const exp = payload.exp;
        if (exp && currentTime > exp) {
            return {
                valid: false,
                error: "Token has expired"
            };
        }

        // 4. すべての検証が成功
        return {
            valid: true,
            user: user
        };

    } catch (jwtError) {
        console.error("JWT verification error:", jwtError);

        // エラーの種類に応じてメッセージを返す
        if (jwtError instanceof Error) {
            if (jwtError.message.includes('expired')) {
                return {
                    valid: false,
                    error: "Token has expired"
                };
            }
            if (jwtError.message.includes('signature')) {
                return {
                    valid: false,
                    error: "Invalid token signature"
                };
            }
        }

        return {
            valid: false,
            error: "Invalid token format"
        };
    }
};

export const deleteAuthToken = async () => {
    try {
        localStorage.removeItem('authToken');
        sessionStorage.removeItem('authToken');
    } catch (error) {
        console.error("Error deleting auth token:", error);
    }
};