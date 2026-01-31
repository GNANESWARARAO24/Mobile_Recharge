import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { Plan, Subscriber } from '../models/models.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
})
export class PaymentComponent implements OnInit {
  paymentForm: FormGroup;
  plan: Plan | null = null;
  subscriber: Subscriber | null = null;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.paymentForm = this.fb.group({
      paymentMethod: ['', Validators.required],
      paymentDetails: [''],
      cardNumber: [''],
      expiry: [''],
      cvv: [''],
    });

    this.paymentForm.get('paymentMethod')?.valueChanges.subscribe((value) => {
      const paymentDetailsControl = this.paymentForm.get('paymentDetails');
      const cardNumberControl = this.paymentForm.get('cardNumber');
      const expiryControl = this.paymentForm.get('expiry');
      const cvvControl = this.paymentForm.get('cvv');

      if (value === 'UPI') {
        paymentDetailsControl?.setValidators([
          Validators.required,
          Validators.pattern('[a-zA-Z0-9]+@[a-zA-Z]+'),
        ]);
        cardNumberControl?.clearValidators();
        expiryControl?.clearValidators();
        cvvControl?.clearValidators();
      } else if (value === 'Card') {
        paymentDetailsControl?.clearValidators();
        cardNumberControl?.setValidators([
          Validators.required,
          Validators.pattern('^[0-9]{16}$'),
        ]);
        expiryControl?.setValidators([
          Validators.required,
          Validators.pattern('^(0[1-9]|1[0-2])\\/[0-9]{2}$'),
        ]);
        cvvControl?.setValidators([
          Validators.required,
          Validators.pattern('^[0-9]{3}$'),
        ]);
      }

      paymentDetailsControl?.updateValueAndValidity({ emitEvent: false });
      cardNumberControl?.updateValueAndValidity({ emitEvent: false });
      expiryControl?.updateValueAndValidity({ emitEvent: false });
      cvvControl?.updateValueAndValidity({ emitEvent: false });
    });
  }

  ngOnInit(): void {
    this.plan = history.state.plan;
    this.subscriber = history.state.subscriber;
    
    if (!this.plan) {
      this.router.navigate(['/recharge']);
    }
  }

  goBack(): void {
    this.router.navigate(['/user/plan-selection'], { state: { subscriber: this.subscriber } });
  }

  onSubmit(): void {
    if (this.paymentForm.valid && this.plan && this.subscriber) {
      const request: any = {
        mobileNumber: this.subscriber.mobileNumber,
        planId: this.plan.id,
        paymentMethod: this.paymentForm.value.paymentMethod,
      };

      if (request.paymentMethod === 'UPI') {
        request.paymentDetails = this.paymentForm.value.paymentDetails;
      } else if (request.paymentMethod === 'Card') {
        request.paymentDetails = `${this.paymentForm.value.cardNumber}|${this.paymentForm.value.expiry}|${this.paymentForm.value.cvv}`;
      }

      this.apiService.recharge(request).subscribe({
        next: (response) => {
          this.successMessage = `Recharge successful! Transaction ID: ${response.transactionId}`;
          this.cdr.detectChanges();
          setTimeout(() => this.router.navigate(['/']), 3000);
        },
        error: (err) => {
          this.errorMessage = err.message || 'Recharge failed. Please try again.';
          this.cdr.detectChanges();
        },
      });
    }
  }
}
