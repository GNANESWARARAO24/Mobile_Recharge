import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { Plan, Subscriber } from '../models/models.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-plan-selection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './plan-selection.component.html',
  styleUrls: ['./plan-selection.component.css'],
})
export class PlanSelectionComponent implements OnInit {
  plans: Plan[] = [];
  filteredPlans: Plan[] = [];
  categories: string[] = ['Popular', 'Validity', 'Data', 'Unlimited', 'Special'];
  selectedCategory: string = 'Popular';
  subscriber: Subscriber | null = null;
  selectedPlanId: number | null = null;

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.subscriber = history.state.subscriber;
    if (!this.subscriber) {
      this.router.navigate(['/']);
      return;
    }
    this.apiService.getPlans().subscribe({
      next: (plans) => {
        this.plans = plans;
        this.filterPlansByCategory('Popular');
      },
      error: (err) => console.error('Failed to load plans', err),
    });
  }

  filterPlansByCategory(category: string): void {
    this.selectedCategory = category;
    this.filteredPlans = this.plans.filter(plan => plan.category === category);
  }

  selectPlan(planId: number): void {
    const selectedPlan = this.plans.find(p => p.id === planId);
    this.router.navigate(['/user/payment'], { 
      state: { plan: selectedPlan, subscriber: this.subscriber } 
    });
  }

  logout(): void {
    if (confirm('Are you sure you want to logout?')) {
      this.router.navigate(['/']);
    }
  }

  goToHistory(): void {
    this.router.navigate(['/user/recharge-history'], { state: { subscriber: this.subscriber } });
  }
}
