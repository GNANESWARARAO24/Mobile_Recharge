import { Component, OnInit } from '@angular/core';
import { ApiService, Plan } from '../../api.service'; // Adjust path
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-plan-list',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './plan-list.component.html',
  styleUrls: ['./plan-list.component.css'],
})
export class PlanListComponent implements OnInit {
  plans: Plan[] = [];
  errorMessage: string = '';

  constructor(private apiService: ApiService, private router: Router) {}

  navigateToAdminDashboard(): void {
    this.router.navigate(['/admin/admin-dashboard']); // Use the correct path to your admin dashboard
  }

  ngOnInit(): void {
    this.loadPlans();
  }

  loadPlans(): void {
    this.apiService.getAllPlansForAdmin().subscribe({
      next: (plans) => {
        this.plans = plans;
        this.errorMessage = '';
      },
      error: (error) => {
        this.errorMessage = 'Failed to load plans.';
        console.error(error);
      },
    });
  }

  editPlan(planId: number): void {
    this.router.navigate(['/admin/plans/edit', planId]);
  }

  deletePlan(planId: number): void {
    if (confirm('Are you sure you want to delete this plan?')) {
      this.apiService.deletePlan(planId).subscribe({
        next: () => {
          this.loadPlans(); // Reload the plan list after deletion
          this.errorMessage = '';
        },
        error: (error) => {
          this.errorMessage = 'Failed to delete plan.';
          console.error(error);
        },
      });
    }
  }

  addPlan(): void {
    this.router.navigate(['/admin/plans/create']);
  }
}
