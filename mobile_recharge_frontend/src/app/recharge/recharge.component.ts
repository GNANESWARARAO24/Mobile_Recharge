import {
  Component,
  OnInit,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../api.service';
import { Plan, Subscriber } from '../models/models.module'; // Assuming models.module.ts exports these
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recharge',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './recharge.component.html',
  styleUrls: ['./recharge.component.css'],
})
export class RechargeComponent implements OnInit, AfterViewInit {
  rechargeForm: FormGroup;
  plans: Plan[] = [];
  subscriber: Subscriber | null = null;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  isInitialized = false; // Guard for stable rendering

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.rechargeForm = this.fb.group({
      mobileNumber: [
        '',
        [Validators.required, Validators.pattern('^[0-9]{10}$')],
      ],
      planId: ['', Validators.required],
      paymentMethod: ['', Validators.required],
      paymentDetails: [''],
    });

    // Dynamically update paymentDetails validators
    this.rechargeForm.get('paymentMethod')?.valueChanges.subscribe((value) => {
      const paymentDetailsControl = this.rechargeForm.get('paymentDetails');
      if (value === 'UPI') {
        paymentDetailsControl?.setValidators([
          Validators.required,
          Validators.pattern('[a-zA-Z0-9]+@[a-zA-Z]+'),
        ]);
      } else {
        paymentDetailsControl?.clearValidators();
      }
      paymentDetailsControl?.updateValueAndValidity({ emitEvent: false }); // Avoid triggering valueChanges
    });
  }

  ngOnInit(): void {
    this.subscriber = history.state.subscriber;
    this.apiService.getPlans().subscribe({
      next: (plans) => {
        this.plans = plans;
        this.rechargeForm.get('planId')?.setValue('');
        setTimeout(() => {
          this.isInitialized = true;
          this.cdr.detectChanges();
        }, 0);
      },
      error: (err) => {
        this.errorMessage =
          err.message || 'Failed to load plans. Please try again.';
        this.isInitialized = true;
        this.cdr.detectChanges();
      },
    });
  }

  ngAfterViewInit(): void {
    if (this.subscriber) {
      setTimeout(() => {
        if (this.subscriber?.mobileNumber) {
          this.rechargeForm.patchValue({
            mobileNumber: this.subscriber.mobileNumber,
          });
        }
        this.cdr.detectChanges();
      }, 0);
    }
  }
  onSubmit(): void {
    if (this.rechargeForm.valid) {
      const request = this.rechargeForm.value;
      if (request.paymentMethod !== 'UPI') {
        delete request.paymentDetails;
      }
      this.apiService.recharge(request).subscribe({
        next: (response) => {
          this.successMessage = `Recharge successful! Transaction ID: ${response.transactionId}`;
          this.cdr.detectChanges();
          setTimeout(() => this.router.navigate(['/']), 3000);
        },
        error: (err) => {
          console.error('API Error:', err); // Log the full error
          this.errorMessage =
            err.message || 'Recharge failed. Please try again.';
          this.cdr.detectChanges();
        },
      });
    }
  }
}
