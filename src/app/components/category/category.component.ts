import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category',
  standalone: true,
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
  imports: [CommonModule]
})
export class CategoryComponent {
  public categories = [
    { name: 'FICTION', icon: 'fas fa-flask' },
    { name: 'DRAMA', icon: 'fas fa-head-side-mask' },
    { name: 'HUMOR', icon: 'bi bi-emoji-laughing' },
    { name: 'POLITICS', icon: 'bi bi-bank' },
    { name: 'PHILOSOPHY', icon: 'bi bi-lightbulb' },
    { name: 'HISTORY', icon: 'bi bi-journal-bookmark' },
    { name: 'ADVENTURE', icon: 'fas fa-hiking' }
  ];

  constructor(private router: Router) {}

  public openCategory(category: any) {
    this.router.navigate(['/books', category.name.toLowerCase()]);
  }
}
