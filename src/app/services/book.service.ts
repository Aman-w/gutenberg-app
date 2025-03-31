import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private baseUrl = 'http://skunkworks.ignitesol.com:8000/books';

  constructor(private http: HttpClient) { }

  public getBooks(category: string, searchQuery: string = '', nextPageUrl: string | null = null): Observable<any> {
    let url: string;
    if (nextPageUrl) {
      url = nextPageUrl;
    } else {
      url = `${this.baseUrl}/?category=${category}`;
      if (searchQuery) {
        url += `&search=${searchQuery}`;
      }
    }
    url = url.replace('http://localhost:8005', 'http://skunkworks.ignitesol.com:8000');
    return this.http.get<any>(url);
  }

  public searchBooks(category: string, query: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}?topic=${category}&search=${query}`).pipe(
      map(response => ({
        results: response.results.filter((book: any) => book.formats['image/jpeg'])
      }))
    );
  }
}
