import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface MenuItem {
  label: string;
  path: string;
  // rolesNeeded: AuthRoleEnum[];
}

@Component({
  selector: 'ber-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
})
export class NavComponent {
  @Input() environmentType?: 'local' | 'staging';
  @Input() logoUrl?: string;
  @Input() applicationTitle: string = 'Bereikbaarheid';
  @Input() menuItems: MenuItem[] = [];
  @Input() isLoggedIn: boolean = false;

  @Output() logIn = new EventEmitter<void>();

  isMenuOpen = signal(false);
}
