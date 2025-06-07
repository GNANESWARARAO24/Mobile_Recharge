//  create-plan.component.ts
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ApiService } from '../../api.service'; // Adjust path as needed
import { Router, RouterModule } from '@angular/router';
import { NewPlanRequest } from '../../models/models.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-plan',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './create-plan.component.html',
  styleUrls: ['./create-plan.component.css'],
})
export class CreatePlanComponent {
  addPlanForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {
    this.addPlanForm = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(0)]],
      dataPerDay: [''],
      calls: [''],
      sms: [''],
      validityDays: [null, [Validators.required, Validators.min(1)]],
    });
  }
  navigateToAdminDashboard(): void {
    this.router.navigate(['/admin/admin-dashboard']);
  }

  onSubmit(): void {
    if (this.addPlanForm.valid) {
      const newPlanData: NewPlanRequest = this.addPlanForm.value;
      this.apiService.createPlan(newPlanData).subscribe({
        next: () => {
          this.successMessage = 'Plan added successfully!';
          this.errorMessage = '';
          this.addPlanForm.reset();
          this.router.navigate(['/admin/plans']); // Navigate back to plan list
        },
        error: (error: string) => {
          this.errorMessage = error;
          this.successMessage = '';
          console.error('Error adding plan:', error);
        },
      });
    } else {
      this.errorMessage =
        'Please fill in all the required fields for the plan.';
      this.successMessage = '';
    }
  }
}
