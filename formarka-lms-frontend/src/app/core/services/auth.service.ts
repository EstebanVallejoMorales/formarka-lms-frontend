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
    this.checkSession();
  }

  /**
   * Mock login method
   * @param email User email
   * @param password User password
   */
  login(email: string, password: string): Observable<User> {
    console.log('Logging in with:', email);
    
    // Simulating API call
    const isSpecialAdmin = email === 'admin@formarka.com';
    const mockUser: User = {
      id: isSpecialAdmin ? '99' : '1',
      email: email,
      name: isSpecialAdmin ? 'Admin Formarka' : 'Usuario Demo',
      role: isSpecialAdmin ? 'admin' : 'student'
    };

    this.currentUserSignal.set(mockUser);
    localStorage.setItem('f-lms-token', 'mock-jwt-token');
    return of(mockUser).pipe(delay(1000));
  }

  /**
   * Mock register method
   */
  register(userData: any): Observable<User> {
    console.log('Registering user:', userData);
    const mockUser: User = {
      id: '2',
      email: userData.email,
      name: userData.name,
      role: 'student'
    };
    return of(mockUser).pipe(delay(1000));
  }

  /**
   * Logout the current user
   */
  logout(): void {
    this.currentUserSignal.set(null);
    localStorage.removeItem('f-lms-token');
  }

  private checkSession(): void {
    const token = localStorage.getItem('f-lms-token');
    if (token) {
      // In a real app, you would validate the token with the backend
      this.currentUserSignal.set({
        id: '1',
        email: 'demo@formarka.com',
        name: 'Demo User',
        role: 'student'
      });
    }
  }
}
