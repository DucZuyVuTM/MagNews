export interface ReviewCreate {
  publication_id: number;
  rating: number;
  text?: string;
}

export interface ReviewResponse {
  id: number;
  user_id: number;
  publication_id: number;
  rating: number;
  text?: string | null;
  created_at: string;
}

export interface PublicationRatingSummary {
  publication_id: number;
  average_rating: number | null;
  review_count: number;
}
