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
import { Plan, Subscriber } from '../models/models.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recharge',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './recharge.component.html',
  styleUrls: ['./recharge.component.css'],
})
export class RechargeComponent implements OnInit, AfterViewInit {
  rechargeForm!: FormGroup;
  plans: Plan[] = [];
  subscriber: Subscriber | null = null;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  isInitialized = false;
  selectedPlan: Plan | null = null;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // ✅ Get subscriber and selected plan from sessionStorage
    const sessionSubscriber = sessionStorage.getItem('subscriber');
    const sessionPlan = sessionStorage.getItem('selectedPlan');

    this.subscriber = sessionSubscriber ? JSON.parse(sessionSubscriber) : null;
    this.selectedPlan = sessionPlan ? JSON.parse(sessionPlan) : null;

    // Initialize form
    this.rechargeForm = this.fb.group({
      subscriberId: [this.subscriber?.id || '', Validators.required],
      planId: ['', Validators.required],
      mobileNumber: [this.subscriber?.mobileNumber || ''],
      paymentMethod: ['', Validators.required],
      paymentDetails: [''],
      cardNumber: [''],
      expiry: [''],
      cvv: [''],
    });

    if (!this.subscriber || !this.selectedPlan) {
      alert('Missing recharge data. Please try again.');
      this.router.navigate(['/categories']);
      return;
    }

    // Load plans and find plan ID
    this.apiService.getPlans().subscribe({
      next: (plans) => {
        this.plans = plans;

        const found = plans.find(
          (p) =>
            p.price === this.selectedPlan?.price &&
            p.dataPerDay === this.selectedPlan?.dataPerDay
        );
        if (found) {
          this.rechargeForm.patchValue({ planId: found.id });
        }

        this.isInitialized = true;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to load plans.';
        this.isInitialized = true;
        this.cdr.detectChanges();
      },
    });

    // Payment method handling (unchanged)
    this.rechargeForm.get('paymentMethod')?.valueChanges.subscribe((method) => {
      if (method === 'UPI') {
        this.rechargeForm
          .get('paymentDetails')
          ?.setValidators([
            Validators.required,
            Validators.pattern('[a-zA-Z0-9]+@[a-zA-Z]+'),
          ]);
        this.rechargeForm.get('cardNumber')?.clearValidators();
        this.rechargeForm.get('expiry')?.clearValidators();
        this.rechargeForm.get('cvv')?.clearValidators();
      } else if (method === 'Card') {
        this.rechargeForm.get('paymentDetails')?.clearValidators();
        this.rechargeForm
          .get('cardNumber')
          ?.setValidators([
            Validators.required,
            Validators.pattern('^[0-9]{16}$'),
          ]);
        this.rechargeForm
          .get('expiry')
          ?.setValidators([
            Validators.required,
            Validators.pattern('^(0[1-9]|1[0-2])\\/([0-9]{2})$'),
          ]);
        this.rechargeForm
          .get('cvv')
          ?.setValidators([
            Validators.required,
            Validators.pattern('^[0-9]{3}$'),
          ]);
      } else {
        this.rechargeForm.get('paymentDetails')?.clearValidators();
        this.rechargeForm.get('cardNumber')?.clearValidators();
        this.rechargeForm.get('expiry')?.clearValidators();
        this.rechargeForm.get('cvv')?.clearValidators();
      }

      this.rechargeForm.get('paymentDetails')?.updateValueAndValidity();
      this.rechargeForm.get('cardNumber')?.updateValueAndValidity();
      this.rechargeForm.get('expiry')?.updateValueAndValidity();
      this.rechargeForm.get('cvv')?.updateValueAndValidity();
    });
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
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
          this.errorMessage = null;

          // ✅ Clear form or reset selected plan if needed
          this.rechargeForm.reset({
            subscriberId: this.subscriber?.id || '',
            planId: this.rechargeForm.value.planId, // keep the plan
            mobileNumber: this.subscriber?.mobileNumber || '',
          });

          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('API Error:', err);
          this.errorMessage =
            err.message || 'Recharge failed. Please try again.';
          this.successMessage = null;
          this.cdr.detectChanges();
        },
      });
    }
  }
}
