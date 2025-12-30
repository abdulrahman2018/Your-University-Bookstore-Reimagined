
import { Book, AdminUser, User, University, BookStatus } from '../types';
import { MOCK_BOOKS, PIRACY_KEYWORDS } from '../constants';

const STORAGE_KEY = 'bue_marketplace_books';
const ADMIN_KEY = 'bue_marketplace_admin';
const USERS_KEY = 'bue_marketplace_users';
const CURRENT_USER_KEY = 'bue_marketplace_current_user';

class MockApiService {
  private books: Book[] = [];

  constructor() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      this.books = JSON.parse(stored);
    } else {
      this.books = [...MOCK_BOOKS];
      this.save();
    }
  }

  private save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.books));
  }

  async getBooks(university?: University, search?: string): Promise<Book[]> {
    let filtered = this.books.filter(b => b.status === 'approved');
    if (university && university !== 'All Universities') {
      filtered = filtered.filter(b => b.university === university);
    }
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(b => 
        b.title.toLowerCase().includes(s) || 
        b.author_doctor.toLowerCase().includes(s)
      );
    }
    return filtered;
  }

  async listBook(bookData: Partial<Book>): Promise<{ success: boolean; book?: Book; message?: string }> {
    // Auto-moderation
    const content = `${bookData.title} ${bookData.description} ${bookData.author_doctor}`.toLowerCase();
    const isPirated = PIRACY_KEYWORDS.some(kw => content.includes(kw));

    const newBook: Book = {
      id: Math.random().toString(36).substr(2, 9),
      title: bookData.title || '',
      author_doctor: bookData.author_doctor || '',
      university: bookData.university || 'BUE',
      subject: bookData.subject,
      grade_year: bookData.grade_year,
      condition: bookData.condition || 'Good',
      edition: bookData.edition,
      price: bookData.price || 0,
      description: bookData.description,
      photos: bookData.photos || 'https://picsum.photos/seed/newbook/400/600',
      pdf_url: bookData.pdf_url,
      status: 'pending',
      seller_id: 'user_123',
      seller_name: 'Current User',
      seller_phone: '01000000000',
      quantity: 1,
      created_at: new Date().toISOString(),
    };

    this.books.push(newBook);
    this.save();

    if (isPirated) {
      return { 
        success: true, 
        book: newBook,
        message: "Your listing has been flagged for review due to specific keywords. It will be moderated soon." 
      };
    }

    return { success: true, book: newBook };
  }

  // Admin Methods
  async adminLogin(username: string, password: string): Promise<AdminUser | null> {
    if (username === 'admin' && password === 'admin123') {
      const user = { id: 'admin_1', username: 'admin', token: 'fake_jwt_token' };
      localStorage.setItem(ADMIN_KEY, JSON.stringify(user));
      return user;
    }
    return null;
  }

  getAdmin(): AdminUser | null {
    const stored = localStorage.getItem(ADMIN_KEY);
    return stored ? JSON.parse(stored) : null;
  }

  async logout() {
    localStorage.removeItem(ADMIN_KEY);
    localStorage.removeItem(CURRENT_USER_KEY);
  }

  // User Authentication Methods
  async signup(email: string, password: string, postalCode: string, university: string): Promise<{ success: boolean; user?: User; message?: string }> {
    const users = this.getUsers();
    
    // Check if user already exists
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email: email.toLowerCase(),
      postalCode,
      university,
      createdAt: new Date().toISOString(),
    };

    // Store user with password (in real app, password would be hashed)
    const userWithPassword = { ...newUser, password };
    users.push(userWithPassword);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    // Auto-login after signup
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
    
    return { success: true, user: newUser };
  }

  async login(email: string, password: string): Promise<{ success: boolean; user?: User; message?: string }> {
    const users = this.getUsers();
    const user = users.find(
      u => u.email.toLowerCase() === email.toLowerCase() && (u as any).password === password
    );

    if (!user) {
      return { success: false, message: 'Invalid email or password.' };
    }

    // Remove password before storing current user
    const { password: _, ...userWithoutPassword } = user as any;
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));

    return { success: true, user: userWithoutPassword as User };
  }

  getCurrentUser(): User | null {
    const stored = localStorage.getItem(CURRENT_USER_KEY);
    return stored ? JSON.parse(stored) : null;
  }

  logoutUser() {
    localStorage.removeItem(CURRENT_USER_KEY);
  }

  private getUsers(): any[] {
    const stored = localStorage.getItem(USERS_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  async getAdminBooks(status?: BookStatus): Promise<Book[]> {
    if (status) return this.books.filter(b => b.status === status);
    return this.books;
  }

  async updateBookStatus(id: string, status: BookStatus, reason?: string): Promise<boolean> {
    const index = this.books.findIndex(b => b.id === id);
    if (index !== -1) {
      this.books[index].status = status;
      if (reason) this.books[index].rejection_reason = reason;
      this.save();
      return true;
    }
    return false;
  }

  async deleteBook(id: string): Promise<boolean> {
    this.books = this.books.filter(b => b.id !== id);
    this.save();
    return true;
  }

  async updateQuantity(id: string, quantity: number): Promise<boolean> {
    const index = this.books.findIndex(b => b.id === id);
    if (index !== -1) {
      this.books[index].quantity = quantity;
      this.save();
      return true;
    }
    return false;
  }

  // Stock/Inventory Statistics - Only approved books (what's in stock)
  async getStockStats() {
    const stockBooks = this.books.filter(b => b.status === 'approved');
    
    const totalItems = stockBooks.reduce((sum, b) => sum + b.quantity, 0);
    const totalValue = stockBooks.reduce((sum, b) => sum + (b.price * b.quantity), 0);
    
    const avgPrice = stockBooks.length > 0 
      ? stockBooks.reduce((sum, b) => sum + b.price, 0) / stockBooks.length
      : 0;

    const stockByUniversity = {
      BUE: stockBooks.filter(b => b.university === 'BUE').reduce((sum, b) => sum + b.quantity, 0),
      AUC: stockBooks.filter(b => b.university === 'AUC').reduce((sum, b) => sum + b.quantity, 0),
      GUC: stockBooks.filter(b => b.university === 'GUC').reduce((sum, b) => sum + b.quantity, 0),
    };

    const stockByCondition = {
      New: stockBooks.filter(b => b.condition === 'New').reduce((sum, b) => sum + b.quantity, 0),
      'Like New': stockBooks.filter(b => b.condition === 'Like New').reduce((sum, b) => sum + b.quantity, 0),
      Good: stockBooks.filter(b => b.condition === 'Good').reduce((sum, b) => sum + b.quantity, 0),
      Fair: stockBooks.filter(b => b.condition === 'Fair').reduce((sum, b) => sum + b.quantity, 0),
    };

    const lowStockBooks = stockBooks.filter(b => b.quantity <= 2 && b.quantity > 0);
    const outOfStockBooks = stockBooks.filter(b => b.quantity === 0);

    const totalSellers = new Set(stockBooks.map(b => b.seller_id)).size;
    const uniqueTitles = stockBooks.length;

    return {
      totalItems,
      uniqueTitles,
      totalValue,
      avgPrice: Math.round(avgPrice),
      stockByUniversity,
      stockByCondition,
      lowStockCount: lowStockBooks.length,
      outOfStockCount: outOfStockBooks.length,
      totalSellers,
    };
  }

  // Get only approved books (stock)
  async getStockBooks(university?: University): Promise<Book[]> {
    let stock = this.books.filter(b => b.status === 'approved');
    if (university && university !== 'All Universities') {
      stock = stock.filter(b => b.university === university);
    }
    return stock;
  }
}

export const api = new MockApiService();
