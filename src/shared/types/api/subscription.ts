import { PublicationResponse } from './publication'; // Quan trọng: Import từ tệp types khác

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
