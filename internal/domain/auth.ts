// Authentication Domain Types

/**
 * User role types
 */
export type UserRole = "user" | "helper";

/**
 * Authenticated user information
 * Used in JWT payload and context
 */
export interface AuthUser {
  id: string;
  role: UserRole;
  email: string;
}

/**
 * JWT Payload structure
 */
export interface JwtPayload {
  id: string;
  role: UserRole;
  email: string;
  iat?: number;
  exp?: number;
}
