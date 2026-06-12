export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

export interface CreateUserDto {
  name: string;
  email: string;
}

export interface UpdateUserDto {
  name: string;
  email: string;
}

export interface PartialUpdateUserDto {
  name?: string;
  email?: string;
}

export interface ChangeEmailDto {
  newEmail: string;
  confirmEmail: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}