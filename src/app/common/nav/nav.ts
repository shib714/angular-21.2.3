import { TitleCasePipe } from '@angular/common';
import { Component, DOCUMENT, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Theme } from '../theme';
import { CartService } from '../../components/shopping-cart/cart/cart.service';
import { MatBadgeModule } from '@angular/material/badge';

@Component({
  selector: 'app-nav',
  imports: [RouterLink,
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
    TitleCasePipe, 
    MatBadgeModule],
  templateUrl: './nav.html',
  styleUrl: './nav.scss'
})
export class Nav {
  private document = inject(DOCUMENT);
  protected themeService = inject(Theme);
  protected cartService = inject(CartService);  
  cartItems = this.cartService.cartItems;

  onThemeChange(event: MatSlideToggleChange) {
    this.document.body.classList.toggle('dark');
  }

}
