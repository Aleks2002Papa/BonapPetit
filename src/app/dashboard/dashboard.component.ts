import { Component } from '@angular/core';
import { Router } from '@angular/router';

export interface Card {
  id: number;
  name: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  items: Card[] = [
    { id: 1, name: 'Kategori' },
    { id: 2, name: 'Produkte' },
    // { id: 3, name: 'Shitje' },
    // { id: 4, name: 'Gjendje' },
    { id: 5, name: 'Shpenzime' },
    { id: 6, name: 'Raporte' }]


  constructor(private router: Router) { }

  navigateTo(item: Card) {
    switch (item.id) {
      case 1:
        this.router.navigate(['/category'])

        break;
      case 2:
        this.router.navigate(['/products'])

        break;
      case 3:
        this.router.navigate(['/sales'])

        break;
      case 4:
        this.router.navigate(['/stock'])

        break;
      case 5:
        this.router.navigate(['/expenses'])

        break;
      case 6:
        this.router.navigate(['/reports'])

        break;

      default:
        break;
    }
  }
}
