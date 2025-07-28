import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Subscriber } from '../../models/models.module';

@Component({
  selector: 'app-blank-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './blank-layout.component.html',
  styleUrls: ['./blank-layout.component.css'],
})
export class BlankLayoutComponent implements OnInit {
  subscriber: Subscriber | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const sessionSubscriber = sessionStorage.getItem('subscriber');

    try {
      this.subscriber = sessionSubscriber
        ? JSON.parse(sessionSubscriber)
        : null;
      console.log('Parsed subscriber:', this.subscriber);
    } catch (error) {
      console.error('Failed to parse subscriber:', error);
    }

    if (!this.subscriber) {
      this.router.navigate(['/mobile-validation']);
    }
  }

  logout(): void {
    sessionStorage.removeItem('subscriber');
    this.router.navigate(['/mobile-validation']);
  }
}
