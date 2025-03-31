import { Routes } from '@angular/router';
import { CategoryComponent } from './components/category/category.component';
import { BookListComponent } from './components/book-list/book-list.component';

export const routes: Routes = [
  { path: '', component: CategoryComponent },
  { path: 'books/:category', component: BookListComponent }
];
