import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError, map } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  AdminLoginRequest,
  MobileValidationRequest,
  RechargeRequest,
  RechargeResponse,
  Plan,
  Subscriber,
  Recharge,
  NewPlanRequest,
  UpdatePlanRequest,
} from './models/models.module';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  // --- REMOVE THESE PLACEHOLDER METHODS ---
  // getTotalPlans() {
  //   throw new Error('Method not implemented.');
  // }
  // getTotalSubscribers() {
  //   throw new Error('Method not implemented.');
  // }
  // --- END REMOVAL ---

  private readonly apiUrl = 'http://localhost:8082/api'; // Check if this URL is correct
  private token: string | null = null; // Changed to private as it's managed by setToken/getToken

  constructor(private http: HttpClient) {
    // Load token from localStorage on initialization
    // It's better to explicitly call getToken() here to ensure consistency
    this.token = localStorage.getItem('token');
  }

  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('token', token);
    console.log('Stored token:', token); // Debug log
  }

  // Changed to private as it's an internal helper
  private getToken(): string | null {
    // Always retrieve from localStorage to ensure it's up-to-date
    // especially after a new browser session or tab
    return localStorage.getItem('token');
  }

  // Added isLoggedIn for AuthGuard
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // Added logout for clearing token
  logout(): void {
    this.token = null;
    localStorage.removeItem('token');
    console.log('Token removed from localStorage.');
  }

  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json', // Default content type for most requests
    });
    const token = this.getToken(); // Get token dynamically
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
      console.log(
        'Sending Authorization header:',
        headers.get('Authorization')
      ); // Debug log
    } else {
      console.warn('No token available for request');
    }
    return headers;
  }

  adminLogin(request: AdminLoginRequest): Observable<string> {
    return this.http
      .post<{ token: string }>(`${this.apiUrl}/auth/admin/login`, request)
      .pipe(
        map((response) => {
          if (!response.token) {
            throw new Error('No token received from server');
          }
          console.log('Login response token:', response.token); // Debug log
          return response.token; // Return raw token string
        }),
        catchError(this.handleError)
      );
  }

  validateMobile(request: MobileValidationRequest): Observable<Subscriber> {
    return this.http
      .post<Subscriber>(`${this.apiUrl}/auth/validate-mobile`, request)
      .pipe(catchError(this.handleError));
  }

  getPlans(): Observable<Plan[]> {
    return this.http
      .get<Plan[]>(`${this.apiUrl}/user/plans`)
      .pipe(catchError(this.handleError));
  }

  recharge(request: RechargeRequest): Observable<RechargeResponse> {
    return this.http
      .post<RechargeResponse>(`${this.apiUrl}/user/recharge`, request, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  getExpiringSubscribers(): Observable<Subscriber[]> {
    return this.http
      .get<Subscriber[]>(`${this.apiUrl}/admin/subscribers/expiring`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  getRechargeHistory(mobileNumber: string): Observable<Recharge[]> {
    return this.http
      .get<Recharge[]>(
        `${this.apiUrl}/admin/subscribers/${mobileNumber}/history`,
        { headers: this.getHeaders() }
      )
      .pipe(catchError(this.handleError));
  }

  getAllSubscribersForAdmin(): Observable<Subscriber[]> {
    return this.http
      .get<Subscriber[]>(`${this.apiUrl}/admin/subscribers/all`, {
        headers: this.getHeaders(), // Include authorization headers
      })
      .pipe(catchError(this.handleError));
  }

  // --- Use this one for dashboard subscriber count ---
  getSubscribersCountForAdmin(): Observable<number> {
    return this.http
      .get<number>(`${this.apiUrl}/admin/subscribers/count`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  getAllPlansForAdmin(): Observable<Plan[]> {
    return this.http
      .get<Plan[]>(`${this.apiUrl}/admin/plans`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // --- Use this one for dashboard plan count ---
  getPlanCountForAdmin(): Observable<number> {
    return this.http
      .get<number>(`${this.apiUrl}/admin/plans/count`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  getPlanByIdForAdmin(id: number): Observable<Plan> {
    return this.http
      .get<Plan>(`${this.apiUrl}/admin/plans/${id}`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  createPlan(planData: NewPlanRequest): Observable<Plan> {
    return this.http
      .post<Plan>(`${this.apiUrl}/admin/plans`, planData, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  updatePlan(id: number, planData: UpdatePlanRequest): Observable<Plan> {
    return this.http
      .put<Plan>(`${this.apiUrl}/admin/plans/${id}`, planData, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  deletePlan(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/admin/plans/${id}`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  addSubscriber(subscriberData: Subscriber): Observable<Subscriber> {
    return this.http
      .post<Subscriber>(`${this.apiUrl}/admin/subscribers`, subscriberData, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      errorMessage = error.error?.message || `Server error: ${error.status}`;
    }
    console.error('API error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}

export type { Plan };
