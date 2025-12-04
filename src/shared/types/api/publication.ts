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
