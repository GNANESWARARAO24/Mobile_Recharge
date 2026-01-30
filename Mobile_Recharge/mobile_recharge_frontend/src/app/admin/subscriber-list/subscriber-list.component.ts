// subscriber-list.component.ts
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';
import { Subscriber } from '../../models/models.module';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // <--- ADD THIS IMPORT

@Component({
  selector: 'app-subscriber-list',
  standalone: true,
  imports: [CommonModule], // If you plan to use RouterModule, you'd add it here too: [CommonModule, RouterModule]
  templateUrl: './subscriber-list.component.html',
  styleUrls: ['./subscriber-list.component.css'],
})
export class SubscriberListComponent implements OnInit {
  subscribers: Subscriber[] = [];
  errorMessage: string = '';
  // router: any; // <--- REMOVE THIS LINE, it's not needed when injected properly

  constructor(
    private apiService: ApiService,
    private router: Router // <--- ADD THIS INJECTION
  ) {}

  ngOnInit(): void {
    this.loadSubscribers();
  }

  loadSubscribers(): void {
    this.apiService.getAllSubscribersForAdmin().subscribe({
      next: (subscribers) => {
        this.subscribers = subscribers;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load subscribers.';
        console.error(error);
      },
    });
  }

  getDataUsagePercent(subscriber: Subscriber): number {
    if (!subscriber.dataTotal || subscriber.dataTotal === 0) return 0;
    return (subscriber.dataUsed / subscriber.dataTotal) * 100;
  }

  updateDataUsage(subscriber: Subscriber, event: any): void {
    const newDataUsed = parseFloat(event.target.value);
    if (isNaN(newDataUsed) || newDataUsed < 0 || newDataUsed > subscriber.dataTotal) {
      event.target.value = subscriber.dataUsed;
      return;
    }

    this.apiService.updateDataUsage(subscriber.mobileNumber, newDataUsed).subscribe({
      next: (updatedSubscriber) => {
        subscriber.dataUsed = updatedSubscriber.dataUsed;
      },
      error: (error) => {
        this.errorMessage = 'Failed to update data usage.';
        console.error(error);
        event.target.value = subscriber.dataUsed;
      },
    });
  }

  simulateDailyConsumption(): void {
    this.apiService.simulateDailyConsumption().subscribe({
      next: () => {
        this.loadSubscribers();
      },
      error: (error) => {
        this.errorMessage = 'Failed to simulate daily consumption.';
        console.error(error);
      },
    });
  }

  addSubscriber(): void {
    // This line will now work correctly!
    this.router.navigate(['/admin/subscribers/add']);
  }

  // If you add the view, edit, and delete buttons to this component,
  // you'll also need to implement these methods here:

  // viewSubscriber(subscriberId: number): void {
  //   this.router.navigate(['/admin/subscribers/view', subscriberId]);
  // }

  // editSubscriber(subscriberId: number): void {
  //   this.router.navigate(['/admin/subscribers/edit', subscriberId]);
  // }

  // deleteSubscriber(subscriberId: number): void {
  //   if (confirm('Are you sure you want to delete this subscriber?')) {
  //     this.apiService.deleteSubscriber(subscriberId).subscribe({
  //       next: () => this.loadSubscribers(),
  //       error: (error) => {
  //         this.errorMessage = 'Failed to delete subscriber.';
  //         console.error(error);
  //       },
  //     });
  //   }
  // }
}
