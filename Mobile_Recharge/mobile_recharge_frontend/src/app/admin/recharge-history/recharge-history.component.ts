import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-recharge-history',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './recharge-history.component.html',
  styleUrls: ['./recharge-history.component.css'],
})
export class RechargeHistoryComponent implements OnInit {
  historyForm!: FormGroup;
  rechargeHistory: any[] = [];
  errorMessage: string | null = null;
  isLoading: boolean = false;
  sortColumn: string = 'rechargeDate';
  sortDirection: 'asc' | 'desc' = 'desc';
  totalAmount: number = 0;
  totalRecharges: number = 0;
  avgAmount: number = 0;

  constructor(
    private fb: FormBuilder, 
    private apiService: ApiService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.historyForm = this.fb.group({
      mobileNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      startDate: [''],
      endDate: [''],
    });

    this.route.queryParams.subscribe(params => {
      if (params['mobileNumber']) {
        this.historyForm.patchValue({ mobileNumber: params['mobileNumber'] });
        this.onHistorySubmit();
      }
    });
  }

  onHistorySubmit(): void {
    this.errorMessage = null;
    this.rechargeHistory = [];

    if (this.historyForm.valid) {
      this.isLoading = true;
      const { mobileNumber, startDate, endDate } = this.historyForm.value;

      this.apiService.getRechargeHistory(mobileNumber, startDate, endDate, this.sortColumn, this.sortDirection).subscribe({
        next: (data: any[]) => {
          this.isLoading = false;
          if (data && data.length > 0) {
            this.rechargeHistory = data;
            this.calculateStats();
          } else {
            this.errorMessage = 'No recharge history found for this mobile number.';
          }
        },
        error: (err: { status: number }) => {
          this.isLoading = false;
          if (err.status === 404) {
            this.errorMessage = 'Mobile number not found or no history available.';
          } else if (err.status === 400) {
            this.errorMessage = 'Invalid mobile number format provided.';
          } else if (err.status === 401 || err.status === 403) {
            this.errorMessage = 'You are not authorized. Please login again.';
          } else {
            this.errorMessage = 'Failed to fetch recharge history. Please try again.';
          }
        },
      });
    } else {
      this.errorMessage = 'Please enter a valid 10-digit mobile number.';
    }
  }

  sortBy(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'desc';
    }
    this.onHistorySubmit();
  }

  calculateStats(): void {
    this.totalRecharges = this.rechargeHistory.length;
    this.totalAmount = this.rechargeHistory.reduce((sum, r) => sum + r.amount, 0);
    this.avgAmount = this.totalRecharges > 0 ? this.totalAmount / this.totalRecharges : 0;
  }

  exportToCSV(): void {
    if (this.rechargeHistory.length === 0) return;

    const headers = ['Plan Name', 'Amount', 'Payment Method', 'Status', 'Recharge Date'];
    const rows = this.rechargeHistory.map(r => [
      r.plan.name,
      r.amount,
      r.paymentMethod,
      r.status,
      new Date(r.rechargeDate).toLocaleString()
    ]);

    let csv = headers.join(',') + '\n';
    rows.forEach(row => {
      csv += row.join(',') + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recharge_history_${this.historyForm.value.mobileNumber}_${new Date().getTime()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  clearFilters(): void {
    this.historyForm.patchValue({
      startDate: '',
      endDate: ''
    });
    this.onHistorySubmit();
  }
}
