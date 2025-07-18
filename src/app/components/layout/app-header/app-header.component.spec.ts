import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

import { AppHeaderComponent } from './app-header.component';

describe('AppHeaderComponent', () => {
  let component: AppHeaderComponent;
  let fixture: ComponentFixture<AppHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppHeaderComponent,
        NoopAnimationsModule,
        MatIconModule,
        MatButtonModule,
        MatMenuModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display Pokémon logo', () => {
    const logoElement = fixture.nativeElement.querySelector('.app-header__logo-text');
    expect(logoElement.textContent).toContain('Pokémon');
  });

  it('should show user dropdown when showUserDropdown is true', () => {
    component.showUserDropdown = true;
    component.userName = 'José';
    fixture.detectChanges();

    const userSection = fixture.nativeElement.querySelector('.app-header__user-section');
    expect(userSection).toBeTruthy();
  });

  it('should show search button when showSearch is true', () => {
    component.showSearch = true;
    fixture.detectChanges();

    const searchButton = fixture.nativeElement.querySelector('.app-header__search-btn');
    expect(searchButton).toBeTruthy();
  });

  it('should display user name when provided', () => {
    component.showUserDropdown = true;
    component.userName = 'José';
    fixture.detectChanges();

    const userNameElement = fixture.nativeElement.querySelector('.app-header__user-name');
    expect(userNameElement.textContent).toContain('José');
  });

  it('should call onSearchClick when search button is clicked', () => {
    spyOn(component, 'onSearchClick');
    component.showSearch = true;
    fixture.detectChanges();

    const searchButton = fixture.nativeElement.querySelector('.app-header__search-btn');
    searchButton.click();

    expect(component.onSearchClick).toHaveBeenCalled();
  });

  it('should call onUserMenuOpen when user button is clicked', () => {
    spyOn(component, 'onUserMenuOpen');
    component.showUserDropdown = true;
    fixture.detectChanges();

    const userButton = fixture.nativeElement.querySelector('.app-header__user-btn');
    userButton.click();

    expect(component.onUserMenuOpen).toHaveBeenCalled();
  });
}); 