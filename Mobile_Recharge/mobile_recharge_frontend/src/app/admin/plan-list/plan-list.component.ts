import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService, Plan } from '../../api.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-plan-list',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './plan-list.component.html',
  styleUrls: ['./plan-list.component.css'],
})
export class PlanListComponent implements OnInit, OnDestroy {
  plans: Plan[] = [];
  filteredPlans: Plan[] = [];
  errorMessage: string = '';
  searchText: string = '';
  private searchSubject = new Subject<string>();

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.loadPlans();
    
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(searchText => {
      this.performSearch(searchText);
    });
  }

  ngOnDestroy(): void {
    this.searchSubject.complete();
  }

  loadPlans(): void {
    this.apiService.getAllPlansForAdmin().subscribe({
      next: (plans) => {
        this.plans = plans;
        this.filteredPlans = plans;
        this.errorMessage = '';
      },
      error: (error) => {
        this.errorMessage = 'Failed to load plans.';
        console.error(error);
      },
    });
  }

  searchPlans(): void {
    this.searchSubject.next(this.searchText);
  }

  private performSearch(search: string): void {
    search = search.toLowerCase().trim();
    if (!search) {
      this.filteredPlans = this.plans;
      return;
    }
    this.filteredPlans = this.plans.filter(plan => 
      plan.name.toLowerCase().includes(search) ||
      plan.category.toLowerCase().includes(search) ||
      plan.price.toString().includes(search)
    );
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
