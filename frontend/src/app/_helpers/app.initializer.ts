import { AccountService } from '../_services';
import { environment } from '../../environments/environment';

export function appInitializer(accountService: AccountService) {
    return () => new Promise<void>(resolve => {
        // For fake backend, always perform a fresh login regardless of stored token
        // This ensures we have a valid token every time
        if (environment.useFakeBackend) {
            console.log('Using fake backend - auto-login with admin credentials');
            // Remove any potentially invalid tokens first
            localStorage.removeItem('currentUser');
            // Then login with admin credentials
            accountService.login('admin@example.com', 'admin').subscribe({
                next: () => {
                    console.log('Fake backend auto-login successful');
                    resolve();
                },
                error: () => {
                    console.error('Fake backend auto-login failed');
                    resolve();
                }
            });
            return;
        }
        
        // For real backend, try to use refresh token if available
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            try {
                accountService.refreshToken().subscribe({
                    next: () => {
                        console.log('Token refreshed successfully');
                        resolve();
                    },
                    error: () => {
                        // Remove invalid token
                        localStorage.removeItem('currentUser');
                        resolve();
                    }
                });
            } catch {
                // If there's any issue with the stored user, remove it
                localStorage.removeItem('currentUser');
                resolve();
            }
        } else {
            // No stored user, resolve immediately
            resolve();
        }
    });
}