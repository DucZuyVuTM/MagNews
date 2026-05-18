export interface UserCreate {
  email: string;
  username: string;
  full_name?: string;
  password: string;
}

export interface ProviderRegister extends UserCreate {
  company_name: string;
  inn?: string | null;
}

export interface UserResponse {
  id: number;
  email: string;
  username: string;
  full_name?: string;
  role: string;
  is_active: boolean;
  company_name?: string | null;
  inn?: string | null;
  created_at: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}
