import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-blank-layout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blank-layout.component.html',
  styleUrls: ['./blank-layout.component.css'],
})
export class BlankLayoutComponent {}
