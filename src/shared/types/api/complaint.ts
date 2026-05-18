export interface ComplaintCreate {
  publication_id: number;
  reason: string;
  description?: string;
}

export interface ComplaintStatusUpdate {
  status: string;
  resolution_note?: string;
}

export interface ComplaintResponse {
  id: number;
  user_id: number;
  publication_id: number;
  reason: string;
  description?: string;
  status: string;
  resolution_note?: string;
  created_at: string;
  updated_at: string;
}
