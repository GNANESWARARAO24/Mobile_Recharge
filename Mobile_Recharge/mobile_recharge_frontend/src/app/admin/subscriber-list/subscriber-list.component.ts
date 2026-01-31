// subscriber-list.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../../api.service';
import { Subscriber } from '../../models/models.module';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-subscriber-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './subscriber-list.component.html',
  styleUrls: ['./subscriber-list.component.css'],
})
export class SubscriberListComponent implements OnInit, OnDestroy {
  subscribers: Subscriber[] = [];
  filteredSubscribers: Subscriber[] = [];
  errorMessage: string = '';
  searchText: string = '';
  private searchSubject = new Subject<string>();

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSubscribers();
    
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(searchText => {
      this.performSearch(searchText);
    });
  }

  ngOnDestroy(): void {
    this.searchSubject.complete();
  }

  loadSubscribers(): void {
    this.apiService.getAllSubscribersForAdmin().subscribe({
      next: (subscribers) => {
        this.subscribers = subscribers;
        this.filteredSubscribers = subscribers;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load subscribers.';
        console.error(error);
      },
    });
  }

  searchSubscribers(): void {
    this.searchSubject.next(this.searchText);
  }

  private performSearch(search: string): void {
    search = search.toLowerCase().trim();
    if (!search) {
      this.filteredSubscribers = this.subscribers;
      return;
    }
    this.filteredSubscribers = this.subscribers.filter(sub => 
      sub.name.toLowerCase().includes(search) ||
      sub.mobileNumber.includes(search) ||
      sub.email.toLowerCase().includes(search)
    );
  }

  addSubscriber(): void {
    this.router.navigate(['/admin/subscribers/add']);
  }

  viewSubscriber(subscriberId: number): void {
    const subscriber = this.subscribers.find(s => s.id === subscriberId);
    if (subscriber) {
      this.router.navigate(['/admin/recharge-history'], { 
        queryParams: { mobileNumber: subscriber.mobileNumber }
      });
    }
  }
}
