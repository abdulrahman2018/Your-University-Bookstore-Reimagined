
import React from 'react';
import { Book, University, BookCondition } from './types';

export const UNIVERSITIES: University[] = ['All Universities', 'BUE', 'AUC', 'GUC'];

export const CONDITIONS: BookCondition[] = ['New', 'Like New', 'Good', 'Fair'];

export const PIRACY_KEYWORDS = [
  'soft copy',
  'scan',
  'ebook',
  'link',
  'drive',
  'pdf only',
  'cracked'
];

export const MOCK_BOOKS: Book[] = [
  {
    id: '1',
    title: 'Modern Operating Systems',
    author_doctor: 'Andrew S. Tanenbaum',
    university: 'BUE',
    subject: 'Computer Science',
    grade_year: 'Year 2',
    condition: 'Good',
    edition: '4th Ed',
    price: 450,
    description: 'Great condition, some highlights but very readable.',
    photos: 'https://picsum.photos/seed/os/400/600',
    pdf_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    status: 'approved',
    seller_id: 's1',
    seller_name: 'Ahmed Ali',
    seller_phone: '01012345678',
    quantity: 1,
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Principles of Economics',
    author_doctor: 'N. Gregory Mankiw',
    university: 'AUC',
    subject: 'Economics',
    grade_year: 'Year 1',
    condition: 'Like New',
    edition: '9th Ed',
    price: 800,
    description: 'Hardly used. Still has the original smell!',
    photos: 'https://picsum.photos/seed/econ/400/600',
    status: 'approved',
    seller_id: 's2',
    seller_name: 'Sara Ibrahim',
    seller_phone: '01198765432',
    quantity: 2,
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Advanced Engineering Math',
    author_doctor: 'Erwin Kreyszig',
    university: 'GUC',
    subject: 'Engineering',
    grade_year: 'Year 3',
    condition: 'Good',
    edition: '10th Ed',
    price: 600,
    photos: 'https://picsum.photos/seed/math/400/600',
    status: 'pending',
    seller_id: 's3',
    seller_name: 'Mona Hassan',
    seller_phone: '01234567890',
    quantity: 1,
    created_at: new Date().toISOString()
  }
];
