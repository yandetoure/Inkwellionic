import { Component, OnInit } from '@angular/core';
import { BookService, BookSummary } from '../services/book.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

interface Category {
  id: number;
  name: string;
  icon?: string;
}

interface CategoryWithBooks {
  category: Category;
  books: BookSummary[];
}

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page implements OnInit {
  categoriesWithBooks: CategoryWithBooks[] = [];
  recommendedBooks: BookSummary[] = [];
  allBooks: BookSummary[] = [];

  constructor(
    private readonly booksApi: BookService,
    private readonly http: HttpClient
  ) {}

  ngOnInit(): void {
    // Charger toutes les catégories
    this.http.get<Category[]>(`${environment.apiUrl}/categories`).subscribe((categories) => {
      // Prendre les 4 premières catégories
      const selectedCategories = categories.slice(0, 4);
      
      // Charger les livres pour chaque catégorie
      selectedCategories.forEach((category) => {
        this.http
          .get<{ category: Category; books: BookSummary[] }>(
            `${environment.apiUrl}/categories/${category.name}`
          )
          .subscribe((response) => {
            this.categoriesWithBooks.push({
              category: response.category,
              books: response.books.slice(0, 5), // Limiter à 5 livres par catégorie pour le slide
            });
          });
      });
    });

    // Charger les livres recommandés (par exemple, les mieux notés)
    this.booksApi.getBooks().subscribe((res) => {
      this.allBooks = Array.isArray(res) ? res : [];
      // Les 6 livres les mieux notés comme recommandés
      this.recommendedBooks = this.allBooks
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 6);
    });
  }
}
