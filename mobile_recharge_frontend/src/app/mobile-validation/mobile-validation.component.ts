import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mobile-validation',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './mobile-validation.component.html',
  styleUrls: ['./mobile-validation.component.css'],
})
export class MobileValidationComponent {
  validationForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {
    this.validationForm = this.fb.group({
      mobileNumber: [
        '',
        [Validators.required, Validators.pattern('^[0-9]{10}$')],
      ],
    });
  }

  onSubmit(): void {
    if (this.validationForm.valid) {
      this.apiService.validateMobile(this.validationForm.value).subscribe({
        next: (subscriber) =>
          this.router.navigate(['/recharge'], { state: { subscriber } }),
        error: (err) => (this.errorMessage = err.message),
      });
    }
  }
}
