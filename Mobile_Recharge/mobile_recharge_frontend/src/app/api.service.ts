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
  private readonly apiUrl = 'http://localhost:8082/api';
  private token: string | null = null;

  constructor(private http: HttpClient) {
    // Load token from localStorage on initialization
    this.token = localStorage.getItem('token');
  }

  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('token', token);
    console.log('Stored token:', token);
  }

  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem('token');
    console.log('Token removed from localStorage.');
  }

  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const token = this.getToken();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
      console.log(
        'Sending Authorization header:',
        headers.get('Authorization')
      );
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
          console.log('Login response token:', response.token);
          return response.token;
        }),

        catchError((error) => this.handleError(error))
      );
  }

  validateMobile(request: MobileValidationRequest): Observable<Subscriber> {
    return this.http
      .post<Subscriber>(`${this.apiUrl}/auth/validate-mobile`, request)
      .pipe(catchError((error) => this.handleError(error)));
  }

  getPlans(): Observable<Plan[]> {
    return this.http
      .get<Plan[]>(`${this.apiUrl}/user/plans`)
      .pipe(catchError((error) => this.handleError(error)));
  }

  recharge(request: RechargeRequest): Observable<RechargeResponse> {
    return this.http
      .post<RechargeResponse>(`${this.apiUrl}/user/recharge`, request, {
        headers: this.getHeaders(),
      })
      .pipe(catchError((error) => this.handleError(error)));
  }

  getExpiringSubscribers(): Observable<Subscriber[]> {
    return this.http
      .get<Subscriber[]>(`${this.apiUrl}/admin/subscribers/expiring`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError((error) => this.handleError(error)));
  }

  getRechargeHistory(
    mobileNumber: string,
    startDate?: string,
    endDate?: string,
    sortBy: string = 'rechargeDate',
    sortOrder: string = 'desc'
  ): Observable<Recharge[]> {
    let url = `${this.apiUrl}/admin/subscribers/${mobileNumber}/history?sortBy=${sortBy}&sortOrder=${sortOrder}`;
    
    if (startDate) {
      url += `&startDate=${startDate}`;
    }
    if (endDate) {
      url += `&endDate=${endDate}`;
    }
    
    return this.http
      .get<Recharge[]>(url, { headers: this.getHeaders() })
      .pipe(catchError((error) => this.handleError(error)));
  }

  getUserRechargeHistory(mobileNumber: string): Observable<Recharge[]> {
    return this.http
      .get<Recharge[]>(`${this.apiUrl}/user/recharge-history/${mobileNumber}`)
      .pipe(catchError((error) => this.handleError(error)));
  }

  getAllSubscribersForAdmin(): Observable<Subscriber[]> {
    return this.http
      .get<Subscriber[]>(`${this.apiUrl}/admin/subscribers/all`, {
        headers: this.getHeaders(), // Include authorization headers
      })
      .pipe(catchError((error) => this.handleError(error)));
  }

  getSubscribersCountForAdmin(): Observable<number> {
    return this.http
      .get<number>(`${this.apiUrl}/admin/subscribers/count`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError((error) => this.handleError(error)));
  }

  getAllPlansForAdmin(): Observable<Plan[]> {
    return this.http
      .get<Plan[]>(`${this.apiUrl}/admin/plans`, { headers: this.getHeaders() })
      .pipe(catchError((error) => this.handleError(error)));
  }

  getPlanCountForAdmin(): Observable<number> {
    return this.http
      .get<number>(`${this.apiUrl}/admin/plans/count`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError((error) => this.handleError(error)));
  }

  getPlanByIdForAdmin(id: number): Observable<Plan> {
    return this.http
      .get<Plan>(`${this.apiUrl}/admin/plans/${id}`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError((error) => this.handleError(error)));
  }

  createPlan(planData: NewPlanRequest): Observable<Plan> {
    return this.http
      .post<Plan>(`${this.apiUrl}/admin/plans`, planData, {
        headers: this.getHeaders(),
      })
      .pipe(catchError((error) => this.handleError(error)));
  }

  updatePlan(id: number, planData: UpdatePlanRequest): Observable<Plan> {
    return this.http
      .put<Plan>(`${this.apiUrl}/admin/plans/${id}`, planData, {
        headers: this.getHeaders(),
      })
      .pipe(catchError((error) => this.handleError(error)));
  }

  deletePlan(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/admin/plans/${id}`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError((error) => this.handleError(error)));
  }

  addSubscriber(subscriberData: Subscriber): Observable<Subscriber> {
    return this.http
      .post<Subscriber>(`${this.apiUrl}/admin/subscribers`, subscriberData, {
        headers: this.getHeaders(),
      })
      .pipe(catchError((error) => this.handleError(error)));
  }

  updateDataUsage(mobileNumber: string, dataUsed: number): Observable<Subscriber> {
    return this.http
      .put<Subscriber>(`${this.apiUrl}/admin/data-usage/${mobileNumber}?dataUsed=${dataUsed}`, {}, {
        headers: this.getHeaders(),
      })
      .pipe(catchError((error) => this.handleError(error)));
  }

  simulateDailyConsumption(): Observable<string> {
    return this.http
      .post<string>(`${this.apiUrl}/admin/data-usage/simulate-daily`, {}, {
        headers: this.getHeaders(),
      })
      .pipe(catchError((error) => this.handleError(error)));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';

    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      // Backend error (e.g., HTTP 401, 404, 500)
      console.error(
        `Backend returned code ${error.status}, body was:`,
        error.error
      );

      // Check if the error.error is a string (like "Invalid credentials")
      if (typeof error.error === 'string') {
        errorMessage = error.error; // Use the raw string from the backend
      }
      // Check if it's an object with a 'message' property
      else if (
        error.error &&
        typeof error.error === 'object' &&
        'message' in error.error
      ) {
        errorMessage = (error.error as any).message; // Cast to any to access message property
      }
      // Check if it's an object with a 'error' property (common in Spring validation errors)
      else if (
        error.error &&
        typeof error.error === 'object' &&
        'error' in error.error
      ) {
        errorMessage = (error.error as any).error; // For cases like Spring's default error structure
      }
      // Fallback for other server errors (e.g., 500 with no specific message)
      else {
        errorMessage = `Server error: ${error.status} ${
          error.statusText || ''
        }`;
      }
    }

    console.error('API error:', errorMessage);
    return throwError(() => new Error(errorMessage)); // Re-throw with the extracted message
  }
}

export type { Plan };
