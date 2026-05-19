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
  provider_id?: number | null;
  moderation_status: 'pending' | 'approved' | 'rejected';
  moderation_note?: string | null;
  created_at: string;
}

export interface ModerationDecision {
  decision: 'approve' | 'reject';
  note?: string;
}
