import { Injectable, signal } from '@angular/core';
import { User } from '../models/user.model';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

/**
 * Authentication Service
 * 
 * This service handles all authentication logic, including login, 
 * registration, and session management.
 * 
 * For beginners: A service in Angular is a class that provides 
 * functionality across different components.
 * 
 * NOTE: This service currently uses mock data for demonstration purposes.
 * In a production environment, these methods would use HttpClient
 * to communicate with a backend API for authentication.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Using Angular Signals for efficient state management
  private currentUserSignal = signal<User | null>(null);
  
  // Public access to the user state
  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isAuthenticated = signal(false).asReadonly();

  constructor() {
    // Check for existing session in localStorage
    // In a real app, this would involve token validation with the backend.
    this.checkSession();
  }

  /**
   * Mock login method
   * @param email User email
   * @param password User password
   */
  login(email: string, password: string): Observable<User> {
    console.log('Mock login initiated with:', email);
    
    // Simulate API call
    // const API_ENDPOINT = '/api/auth/login'; // Example backend endpoint
    // return this.http.post<User>(API_ENDPOINT, { email, password }).pipe(
    //   tap(user => {
    //     this.currentUserSignal.set(user);
    //     localStorage.setItem('f-lms-token', 'mock-jwt-token'); // Store mock token
    //   })
    // );

    const isSpecialAdmin = email === 'admin@formarka.com';
    const mockUser: User = {
      id: isSpecialAdmin ? '99' : '1',
      email: email,
      name: isSpecialAdmin ? 'Admin Formarka' : 'Usuario Demo',
      role: isSpecialAdmin ? 'admin' : 'student'
    };

    this.currentUserSignal.set(mockUser);
    // In a real app, you would receive and store a JWT from the backend.
    localStorage.setItem('f-lms-token', 'mock-jwt-token'); 
    return of(mockUser).pipe(delay(1000)); // Simulate network delay
  }

  /**
   * Mock register method
   */
  register(userData: any): Observable<User> {
    console.log('Mock registration initiated with:', userData.email);
    
    // Simulate API call
    // const API_ENDPOINT = '/api/auth/register'; // Example backend endpoint
    // return this.http.post<User>(API_ENDPOINT, userData).pipe(
    //   tap(user => {
    //     this.currentUserSignal.set(user);
    //     localStorage.setItem('f-lms-token', 'mock-jwt-token'); // Store mock token
    //   })
    // );

    const mockUser: User = {
      id: '2',
      email: userData.email,
      name: userData.name,
      role: 'student' // Default role for new users
    };
    // In a real app, you would receive and store a JWT from the backend.
    localStorage.setItem('f-lms-token', 'mock-jwt-token');
    return of(mockUser).pipe(delay(1000)); // Simulate network delay
  }

  /**
   * Logout the current user
   */
  logout(): void {
    console.log('Logging out user.');
    this.currentUserSignal.set(null);
    // In a real app, this would also involve invalidating the token on the backend.
    localStorage.removeItem('f-lms-token');
  }

  /**
   * Checks for an existing session (simulated via localStorage).
   * In a real application, this would involve validating a token with the backend.
   */
  private checkSession(): void {
    const token = localStorage.getItem('f-lms-token');
    if (token) {
      // Simulate fetching user data based on the token
      // In a real app, you would call an API like '/api/auth/me'
      // this.http.get<User>('/api/auth/me').subscribe(user => {
      //   this.currentUserSignal.set(user);
      // });
      
      // Mock user data if token exists
      this.currentUserSignal.set({
        id: '1',
        email: 'demo@formarka.com',
        name: 'Demo User',
        role: 'student' 
      });
    }
  }
}
