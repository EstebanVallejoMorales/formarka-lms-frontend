export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'instructor' | 'student';
  photoUrl?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
