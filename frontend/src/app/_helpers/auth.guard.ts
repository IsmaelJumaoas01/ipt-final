import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { environment } from '../../environments/environment';
import { Observable, of } from 'rxjs';
import { map, catchError, take } from 'rxjs/operators';

import { AccountService } from '../_services';

@Injectable({ providedIn: 'root' })
export class AuthGuard {
    constructor(
        private router: Router,
        private accountService: AccountService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        const account = this.accountService.accountValue;
        
        // If using fake backend, auto-login as admin if not logged in
        if (!account && environment.useFakeBackend) {
            // If localStorage already has the token but account is not set in service
            if (localStorage.getItem('currentUser')) {
                // Try to refresh the token first
                return this.accountService.refreshToken().pipe(
                    map(() => {
                        return this.checkRoleAccess(route, state);
                    }),
                    catchError(() => {
                        // If refresh fails, try to log in again
                        return this.autoLoginWithFakeBackend(route, state);
                    })
                );
            } else {
                // No token, just do a fresh login
                return this.autoLoginWithFakeBackend(route, state);
            }
        }
        
        // Otherwise, redirect to login if not logged in
        if (!account) {
            this.router.navigate(['/account/login'], { queryParams: { returnUrl: state.url } });
            return false;
        }
        
        return this.checkRoleAccess(route, state);
    }

    private checkRoleAccess(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const account = this.accountService.accountValue;
        if (!account) return false;
        
        // Check if route has required roles
        if (route.data?.roles && !route.data.roles.includes(account.role)) {
            console.log(`Access denied: User role ${account.role} not allowed for route ${state.url}`);
            this.router.navigate(['/']);
            return false;
        }
        
        return true;
    }

    private autoLoginWithFakeBackend(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.accountService.login('admin@example.com', 'admin').pipe(
            map(() => {
                console.log('Auto-login successful with fake backend');
                return this.checkRoleAccess(route, state);
            }),
            catchError(error => {
                console.error('Auto-login failed:', error);
                this.router.navigate(['/account/login']);
                return of(false);
            }),
            take(1) // Complete after first emission
        );
    }
}