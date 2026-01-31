import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ApiService, Plan } from '../../api.service';
import { Router, RouterModule } from '@angular/router';
import { Subscriber } from '../../models/models.module';
import { CommonModule } from '@angular/common';
// Adjust path if needed

@Component({
  selector: 'app-add-subscriber',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './add-subscriber.component.html',
  styleUrls: ['./add-subscriber.component.css'],
})
export class AddSubscriberComponent implements OnInit {
  addSubscriberForm: FormGroup;
  plans: Plan[] = [];
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {
    this.addSubscriberForm = this.fb.group({
      mobileNumber: [
        '',
        [Validators.required, Validators.pattern('^[0-9]{10}$')],
      ],
      name: ['', Validators.required],
      email: ['', [Validators.email]],
      currentPlanId: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadPlans();
  }

  loadPlans(): void {
    this.apiService.getAllPlansForAdmin().subscribe({
      next: (plans) => {
        this.plans = plans;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load plans.';
        console.error(error);
      },
    });
  }

  onSubmit(): void {
    if (this.addSubscriberForm.valid) {
      const newSubscriber: Subscriber = this.addSubscriberForm.value;
      this.apiService.addSubscriber(newSubscriber).subscribe({
        next: (subscriber) => {
          this.successMessage = `Subscriber ${subscriber.name} added successfully!`;
          this.errorMessage = '';
          this.addSubscriberForm.reset(); // Optionally reset the form
          // Optionally navigate to a list of subscribers:
          // this.router.navigate(['/admin/subscribers']);
        },
        error: (error) => {
          this.errorMessage =
            'Failed to add subscriber. ' +
            (error.error?.message || error.message);
          console.error(error);
        },
      });
    } else {
      this.errorMessage = 'Please fill in all the required fields correctly.';
    }
  }

  navigateToAdminDashboard(): void {
    this.router.navigate(['/admin/admin-dashboard']);
  }
}
