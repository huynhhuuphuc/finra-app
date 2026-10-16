export interface JwtPayload {
  sub?: string;
  iss?: string;
  iat?: number;
  exp?: number;
  /** session id */
  data?: string;
  user?: string;
  [key: string]: any;
}

/**
 * Decode the payload of a JWT without verifying the signature.
 */
export const decodeJwt = (token?: string): JwtPayload | null => {
  if (!token) return null;
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
};
