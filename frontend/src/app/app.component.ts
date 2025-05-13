import { Component } from '@angular/core';
import { environment } from '../environments/environment';
import { Router } from '@angular/router';

import { AccountService } from './_services';
import { Account, Role } from './_models';

@Component({ 
    selector: 'app-root', 
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.less']
})
export class AppComponent {
    title = 'user-management-system';
    Role = Role;
    account: Account | null = null;
    showModal = false;

    constructor(
        private accountService: AccountService,
        private router: Router
    ) {
        this.accountService.account.subscribe(x => {
            this.account = x;
            
            // If using fake backend but no account is set, auto-login as admin
            if (environment.useFakeBackend && !x) {
                this.autoLoginWithFakeBackend();
            }
        });
        
        // Auto-login as admin if using fake backend and not already logged in
        if (environment.useFakeBackend) {
            this.autoLoginWithFakeBackend();
        }
    }
    
    private autoLoginWithFakeBackend() {
        // Only login if not already logged in
        if (!this.account && !localStorage.getItem('currentUser')) {
            this.accountService.login('admin@example.com', 'admin').subscribe({
                next: () => {
                    // Navigate to home/admin dashboard after login
                    this.router.navigate(['/']);
                }
            });
        }
    }

    logout() {
        // If using fake backend, prevent actual logout
        if (environment.useFakeBackend) {
            // Just redirect to home instead of logging out
            this.router.navigate(['/']);
            return;
        }
        
        this.accountService.logout();
    }

    showDetails() {
        this.showModal = true;
    }

    closeModal() {
        this.showModal = false;
    }
}