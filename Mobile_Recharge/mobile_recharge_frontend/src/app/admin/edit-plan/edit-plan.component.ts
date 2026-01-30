import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ApiService, Plan } from '../../api.service'; // Adjust path
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { UpdatePlanRequest } from '../../models/models.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-plan',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './edit-plan.component.html',
  styleUrls: ['./edit-plan.component.css'],
})
export class EditPlanComponent implements OnInit {
  editPlanForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';
  planId: number = 0; // Store the plan ID

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute // Inject ActivatedRoute
  ) {
    this.editPlanForm = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(0)]],
      dataPerDay: [''],
      calls: [''],
      sms: [''],
      validityDays: [null, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {
    // Get the plan ID from the route
    this.route.params.subscribe((params) => {
      this.planId = +params['id']; // (+) converts string to number
      this.loadPlanDetails();
    });
  }
  navigateToAdminDashboard(): void {
    this.router.navigate(['/admin/admin-dashboard']); // Use the correct path to your admin dashboard
  }

  loadPlanDetails(): void {
    if (this.planId) {
      this.apiService.getPlanByIdForAdmin(this.planId).subscribe({
        next: (plan: Plan) => {
          this.editPlanForm.patchValue(plan); // Populate the form
        },
        error: (error: any) => {
          this.errorMessage = 'Failed to load plan details.';
          console.error(error);
        },
      });
    }
  }

  onSubmit(): void {
    if (this.editPlanForm.valid) {
      const updatedPlanData: UpdatePlanRequest = this.editPlanForm.value;
      // Include the planId in the updatedPlanData object
      updatedPlanData.id = this.planId; // Add this line
      console.log('Data being sent:', updatedPlanData); // Debug log
      this.apiService.updatePlan(this.planId, updatedPlanData).subscribe({
        next: (response) => {
          this.successMessage = 'Plan updated successfully!';
          this.errorMessage = '';
          this.router.navigate(['/admin/plans']);
        },
        error: (error: any) => {
          this.errorMessage = 'Failed to update plan. Please try again.';
          console.error(error);
        },
      });
    } else {
      this.errorMessage = 'Please fill in all the required fields.';
    }
  }
}
