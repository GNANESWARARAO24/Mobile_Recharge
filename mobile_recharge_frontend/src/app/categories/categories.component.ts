import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../api.service';
import { Plan } from '../models/models.module';
import { Router } from '@angular/router';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
})
export class CategoriesComponent implements OnInit {
  searchQuery = '';
  plans: Plan[] = [];
  filteredPlans: Plan[] = [];
  loading = false;
  error: string | null = null;
  subscriber: any = null;

  tabs: string[] = ['Popular', 'Validity', 'Data', 'Unlimited', 'Special'];
  selectedTab: string = 'Popular';

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    const sessionUser = sessionStorage.getItem('subscriber');
    this.subscriber = sessionUser ? JSON.parse(sessionUser) : null;

    if (!this.subscriber) {
      alert('User info missing. Please login again.');
      this.router.navigate(['/']);
      return;
    }

    this.fetchPlans();
  }

  fetchPlans() {
    this.loading = true;
    this.error = null;
    this.apiService.getPlans().subscribe({
      next: (plans) => {
        this.plans = plans;
        this.filterPlans();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load plans';
        this.loading = false;
      },
    });
  }

  selectTab(tab: string) {
    this.selectedTab = tab;
    this.filterPlans();
  }

  filterPlans() {
    const tabCategory = this.selectedTab.toLowerCase();
    const q = this.searchQuery.trim().toLowerCase();

    this.filteredPlans = this.plans.filter((plan) => {
      const matchesCategory = plan.category?.toLowerCase() === tabCategory;

      const matchesSearch = q
        ? plan.name?.toLowerCase().includes(q) ||
          plan.category?.toLowerCase().includes(q) ||
          plan.price?.toString().includes(q) ||
          plan.dataPerDay?.toLowerCase().includes(q) ||
          plan.calls?.toLowerCase().includes(q) ||
          plan.sms?.toLowerCase().includes(q) ||
          plan.validityDays?.toString().includes(q)
        : true;

      return matchesCategory && matchesSearch;
    });
  }

  onRecharge(plan: Plan) {
    if (!this.subscriber) {
      alert('User info missing. Please login again.');
      return;
    }

    sessionStorage.setItem('selectedPlan', JSON.stringify(plan));
    sessionStorage.setItem('subscriber', JSON.stringify(this.subscriber));

    this.router.navigate(['/recharge']);
  }
}
