import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router'; // Import RouterModule here
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet], // Import modules, NOT directives
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'mobile_recharge_frontend';

  ngOnInit(): void {
    console.log('AppComponent initialized!');
  }
}
