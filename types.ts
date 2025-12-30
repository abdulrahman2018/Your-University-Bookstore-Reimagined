
export type University = 'BUE' | 'AUC' | 'GUC' | 'All Universities';

export type BookStatus = 'pending' | 'approved' | 'rejected';

export type BookCondition = 'New' | 'Like New' | 'Good' | 'Fair';

export interface Book {
  id: string;
  title: string;
  author_doctor: string;
  university: University;
  subject?: string;
  grade_year?: string;
  condition: BookCondition;
  edition?: string;
  price: number;
  description?: string;
  photos: string; // URL
  pdf_url?: string; // URL
  status: BookStatus;
  rejection_reason?: string;
  seller_id: string;
  seller_name: string;
  seller_phone: string;
  quantity: number;
  created_at: string;
}

export interface AdminUser {
  id: string;
  username: string;
  token: string;
}

export interface User {
  id: string;
  email: string;
  postalCode: string;
  university: string;
  createdAt: string;
}
