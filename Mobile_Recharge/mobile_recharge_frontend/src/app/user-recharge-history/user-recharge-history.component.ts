import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { Subscriber } from '../models/models.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-recharge-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-recharge-history.component.html',
  styleUrls: ['./user-recharge-history.component.css'],
})
export class UserRechargeHistoryComponent implements OnInit {
  subscriber: Subscriber | null = null;
  recharges: any[] = [];

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.subscriber = history.state.subscriber;
    if (!this.subscriber) {
      this.router.navigate(['/']);
      return;
    }
    this.loadRechargeHistory();
  }

  loadRechargeHistory(): void {
    if (this.subscriber?.mobileNumber) {
      this.apiService.getUserRechargeHistory(this.subscriber.mobileNumber).subscribe({
        next: (data) => {
          this.recharges = data;
        },
        error: (err) => console.error('Failed to load recharge history', err),
      });
    }
  }

  logout(): void {
    if (confirm('Are you sure you want to logout?')) {
      this.router.navigate(['/']);
    }
  }

  goToPlans(): void {
    this.router.navigate(['/user/plan-selection'], { state: { subscriber: this.subscriber } });
  }

  rechargeAgain(plan: any): void {
    this.router.navigate(['/user/payment'], { state: { plan, subscriber: this.subscriber } });
  }
}
