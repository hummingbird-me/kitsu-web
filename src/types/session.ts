export type Session = {
  loggedIn: true;
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
} | null;
