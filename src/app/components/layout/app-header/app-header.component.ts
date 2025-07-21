import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { getLogoPath } from '../../../config/assets.config';
@Component({
  selector: 'app-app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule
  ],
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss']
})
export class AppHeaderComponent {
  
  @Input() showUserDropdown: boolean = false;
  @Input() showSearch: boolean = false;
  @Input() userName: string = '';
  @Input() isLoading: boolean = false;
  @Input() logoPath: string = getLogoPath();
  @Input() useLogoImage: boolean = true;
  
  logoError: boolean = false;
  
  /**
   * Get only the first name from the full name
   */
  getFirstName(): string {
    if (!this.userName || this.userName.trim() === '') {
      return '';
    }
    return this.userName.split(' ')[0];
  }

  /**
   * Handle user dropdown menu open
   */
  onUserMenuOpen(): void {
    // TODO: Implement user menu logic

  }
  
  /**
   * Handle logo image loading error
   */
  onLogoError(): void {
    this.logoError = true;
  }
  
  /**
   * Handle search icon click
   */
  onSearchClick(): void {
    // TODO: Implement search functionality

  }
  
  /**
   * Handle user menu item selection
   */
  onUserMenuItemSelect(action: string): void {
    // TODO: Implement user menu actions

  }
} 