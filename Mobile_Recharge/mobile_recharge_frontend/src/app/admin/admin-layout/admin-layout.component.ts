import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
// import { AuthService } from 'path/to/your/auth.service'; // Assuming you have an authentication service

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css'],
  imports: [RouterModule],
})
export class AdminLayoutComponent implements OnInit {
  constructor(
    private router: Router // private authService: AuthService // Inject your authentication service here
  ) {}

  ngOnInit(): void {
    // You might fetch and display user info here if needed (e.g., "Welcome {{userName}}")
  }

  logout(): void {
    console.log('Admin logging out...');
    // --- Implement your actual logout logic here ---
    // 1. Clear authentication token/data from localStorage, sessionStorage, or a service
    localStorage.removeItem('adminToken'); // Example: if you store a token
    // this.authService.clearSession(); // Example: if using an AuthService

    // 2. Redirect to the admin login page or a public home page
    this.router.navigate(['/admin/login']); // Adjust this path to your admin login route
  }
}
