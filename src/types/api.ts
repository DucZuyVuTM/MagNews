export interface UserCreate {
  email: string;
  username: string;
  full_name?: string;
  password: string;
}

export interface UserResponse {
  id: number;
  email: string;
  username: string;
  full_name?: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}

export interface PublicationCreate {
  title: string;
  description?: string;
  type: string;
  publisher?: string;
  frequency?: string;
  price_monthly: number;
  price_yearly: number;
  cover_image_url?: string;
}

export interface PublicationUpdate {
  title?: string;
  description?: string;
  type?: string;
  publisher?: string;
  frequency?: string;
  price_monthly?: number;
  price_yearly?: number;
  cover_image_url?: string;
  is_visible?: boolean;
  is_available?: boolean;
}

export interface PublicationResponse {
  id: number;
  title: string;
  description?: string;
  type: string;
  publisher?: string;
  frequency?: string;
  price_monthly: number;
  price_yearly: number;
  cover_image_url?: string;
  is_visible: boolean;
  is_available: boolean;
  created_at: string;
}

export interface SubscriptionCreate {
  publication_id: number;
  duration_months: number;
  auto_renew?: boolean;
}

export interface SubscriptionResponse {
  id: number;
  user_id: number;
  publication_id: number;
  start_date: string;
  end_date: string;
  status: string;
  price: number;
  auto_renew: boolean;
  created_at: string;
  publication: PublicationResponse;
}
