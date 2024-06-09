export interface UserResponse {
  accessToken?: string;
  refreshToken?: string;
  id: string;
  userName: string;
  avatar: string | null;
  email: string;
  isOnline: boolean;
  bannedBy: string[];
}

export interface ITokenPair {
  accessToken: string;
  refreshToken: string;
}
