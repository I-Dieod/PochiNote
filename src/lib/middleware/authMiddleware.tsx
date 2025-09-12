// src/lib/middleware/authMiddleware.tsx

import { jwtVerify, JWTPayload } from "jose";

import { redisClient } from "@/lib/config/redisClient";

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

        // 3. Redisに保存されているトークンと照合
        try {
            const storedToken = await redisClient.get(`user:${user.userName}`);
            
            if (!storedToken) {
                return {
                    valid: false,
                    error: "Token not found in session store"
                };
            }

            if (storedToken !== token) {
                return {
                    valid: false,
                    error: "Token mismatch - session may have been invalidated"
                };
            }

            // 4. すべての検証が成功
            return {
                valid: true,
                user: user
            };

        } catch (redisError) {
            console.error("Redis error during token verification:", redisError);
            return {
                valid: false,
                error: "Failed to verify session"
            };
        }

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

// トークンをRedisから削除する関数（ログアウト時に使用）
export const invalidateToken = async (userName: string): Promise<boolean> => {
    try {
        await redisClient.del(`user:${userName}`);
        return true;
    } catch (error) {
        console.error("Failed to invalidate token:", error);
        return false;
    }
};

// ユーザー名からトークンを取得する関数
export const getStoredToken = async (userName: string): Promise<string | null> => {
    try {
        return await redisClient.get(`user:${userName}`);
    } catch (error) {
        console.error("Failed to get stored token:", error);
        return null;
    }
};