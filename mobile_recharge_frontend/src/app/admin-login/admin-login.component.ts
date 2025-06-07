import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router'; // Import RouterModule for routerLink
import { ApiService } from '../api.service';
import { CommonModule } from '@angular/common'; // Import CommonModule

@Component({
  selector: 'app-admin-login',
  standalone: true, // Add this line
  imports: [ReactiveFormsModule, CommonModule, RouterModule], // Import ReactiveFormsModule, CommonModule, RouterModule
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css'],
})
export class AdminLoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.apiService.adminLogin(this.loginForm.value).subscribe({
        next: (token) => {
          console.log('Received token:', token); // Debug log
          this.apiService.setToken(token); // Store raw token
          this.router.navigate(['/admin/admin-dashboard']);
        },
        error: (err) => {
          this.errorMessage = err.message;
          console.error('Login error:', err);
        },
      });
    }
  }
}
