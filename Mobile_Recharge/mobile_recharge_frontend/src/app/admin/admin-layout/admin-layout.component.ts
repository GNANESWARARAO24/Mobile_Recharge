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
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('adminToken');
      this.router.navigate(['/admin/login']);
    }
  }
}
