import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-layout.component.html',
  styleUrls: ['./user-layout.component.css']
})
export class UserLayoutComponent implements OnInit {
  userName: string = '';
  mobileNumber: string = '';

  constructor(private router: Router) {}

  ngOnInit() {
    const subscriber = localStorage.getItem('subscriber');
    if (subscriber) {
      const data = JSON.parse(subscriber);
      this.userName = data.name || 'User';
      this.mobileNumber = data.mobileNumber || '';
    }
  }

  logout() {
    localStorage.removeItem('subscriber');
    this.router.navigate(['/mobile-validation']);
  }
}
