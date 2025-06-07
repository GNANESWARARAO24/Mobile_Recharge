import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Required for NgIf, NgFor, date pipe
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms'; // Required for reactive forms
import { ApiService } from '../../api.service'; // Adjust path if api.service.ts is not directly in src/app/

@Component({
  selector: 'app-admin-dashboard',
  standalone: true, // This component is a standalone component
  imports: [
    CommonModule, // Provides directives like *ngIf, *ngFor
    ReactiveFormsModule, // Provides form handling capabilities (FormGroup, Validators etc.)
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'], // Or .css if you are using plain CSS
})
export class AdminDashboardComponent implements OnInit {
  // --- Dashboard Summary Data ---
  planCount: number = 0;
  subscribersCount: number = 0;

  // --- Expiring Subscribers Data ---
  // Using 'any[]' for simplicity, ideally define an interface for Subscriber
  expiringSubscribers: any[] = [];

  // --- Recharge History Search & Results ---
  historyForm!: FormGroup; // Declares the form group for search
  rechargeHistory: any[] = []; // Stores the fetched recharge history, using 'any[]' for simplicity
  errorMessage: string | null = null; // To display error messages to the user

  constructor(
    private fb: FormBuilder, // Injects FormBuilder to create form groups
    private apiService: ApiService // Injects your custom ApiService for backend calls // private router: Router        // Router is not directly used in this view, but often useful in dashboards
  ) {}

  ngOnInit(): void {
    // Initialize the history search form with validators
    this.historyForm = this.fb.group({
      // Mobile number must be required and follow a 10-digit numeric pattern
      mobileNumber: [
        '',
        [Validators.required, Validators.pattern('^[0-9]{10}$')],
      ],
    });

    // Fetch initial dashboard data when the component loads
    this.fetchDashboardSummary();
    this.fetchExpiringSubscribers();
  }

  /**
   * Fetches the total count of plans and subscribers from the API.
   */
  fetchDashboardSummary(): void {
    // Call the ApiService to get the total number of plans
    this.apiService.getPlanCountForAdmin().subscribe({
      next: (count: number) => {
        this.planCount = count; // Update planCount with data from API
      },
      error: (err: any) => {
        // Log the error and potentially display a user-friendly message
        console.error('Error fetching total plans:', err);
        // Optionally: this.errorMessage = 'Failed to load plan count.';
      },
    });

    // Call the ApiService to get the total number of subscribers
    this.apiService.getSubscribersCountForAdmin().subscribe({
      next: (count: number) => {
        this.subscribersCount = count; // Update subscribersCount with data from API
      },
      error: (err: any) => {
        // Log the error
        console.error('Error fetching total subscribers:', err);
        // Optionally: this.errorMessage = 'Failed to load subscriber count.';
      },
    });

    // --- MOCK DATA FOR LOCAL TESTING (Uncomment and use if backend is not ready) ---
    // setTimeout(() => {
    //   this.planCount = 15;
    //   this.subscribersCount = 250;
    // }, 500);
    // --- END MOCK DATA ---
  }

  /**
   * Fetches a list of subscribers whose plans are expiring soon.
   */
  fetchExpiringSubscribers(): void {
    // Call the ApiService to get data on expiring subscribers
    this.apiService.getExpiringSubscribers().subscribe({
      next: (data: any[]) => {
        this.expiringSubscribers = data; // Assign fetched data to the component property
      },
      error: (err: any) => {
        // Log the error
        console.error('Error fetching expiring subscribers:', err);
        // Optionally: this.errorMessage = 'Could not load expiring subscribers data.';
      },
    });

    // --- MOCK DATA FOR LOCAL TESTING (Uncomment and use if backend is not ready) ---
    // setTimeout(() => {
    //   this.expiringSubscribers = [
    //     { mobileNumber: '9876543210', name: 'Alice Smith', planExpiry: new Date('2025-06-15') },
    //     { mobileNumber: '9988776655', name: 'Bob Johnson', planExpiry: new Date('2025-06-20') },
    //     { mobileNumber: '9123456789', name: 'Charlie Brown', planExpiry: new Date('2025-06-25') }
    //   ];
    // }, 700);
    // --- END MOCK DATA ---
  }

  /**
   * Handles the form submission for searching recharge history by mobile number.
   */
  onHistorySubmit(): void {
    this.errorMessage = null; // Clear any previous error messages
    this.rechargeHistory = []; // Clear previous search results

    if (this.historyForm.valid) {
      const mobileNumber = this.historyForm.value.mobileNumber;

      // Call the ApiService to get recharge history for the provided mobile number
      this.apiService.getRechargeHistory(mobileNumber).subscribe({
        next: (data: any[]) => {
          if (data && data.length > 0) {
            this.rechargeHistory = data; // Assign fetched history data
          } else {
            // If API returns an empty array, display a specific message
            this.errorMessage =
              'No recharge history found for this mobile number.';
          }
        },
        error: (err: { status: number }) => {
          // Comprehensive error handling for API call
          console.error('Error fetching recharge history:', err);
          if (err.status === 404) {
            this.errorMessage =
              'Mobile number not found or no history available.';
          } else if (err.status === 400) {
            // Bad request, e.g., malformed mobile number if backend validates
            this.errorMessage = 'Invalid mobile number format provided.';
          } else if (err.status === 401 || err.status === 403) {
            // Unauthorized/Forbidden
            this.errorMessage =
              'You are not authorized to view this history. Please login again.';
            // Potentially redirect to login: this.router.navigate(['/admin-login']);
          } else {
            this.errorMessage =
              'Failed to fetch recharge history. Please try again.';
          }
        },
      });

      // --- MOCK DATA FOR LOCAL TESTING (Uncomment and use if backend is not ready) ---
      // setTimeout(() => {
      //   if (mobileNumber === '9876543210') {
      //     this.rechargeHistory = [
      //       { plan: { name: 'Basic Plan' }, amount: 299, rechargeDate: new Date('2025-05-01') },
      //       { plan: { name: 'Premium Plan' }, amount: 599, rechargeDate: new Date('2025-04-01') }
      //     ];
      //     this.errorMessage = null; // Clear error if data is found
      //   } else {
      //     this.rechargeHistory = [];
      //     this.errorMessage = 'No recharge history found for this mobile number.';
      //   }
      // }, 1000);
      // --- END MOCK DATA ---
    } else {
      // If form is invalid before API call (e.g., empty field)
      this.errorMessage = 'Please enter a valid 10-digit mobile number.';
    }
  }
}
