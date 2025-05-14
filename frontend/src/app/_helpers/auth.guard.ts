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
        // Define all account routes that should bypass authentication
        const accountRoutes = [
            '/account/',
            '/register',
            '/verify-email',
            '/reset-password',
            '/forgot-password'
        ];
        
        // Special handling for the root route - allow guest access
        if (state.url === '/') {
            return true;
        }
        
        // Check if current URL is an account route
        const isCurrentRouteAccountRoute = accountRoutes.some(route => state.url.includes(route));

        // Check for account route flags in localStorage
        const hasAccountRouteFlag = localStorage.getItem('isAccountRoute') === 'true';
        const hasReloadFlag = localStorage.getItem('accountRouteReload') !== null;
        const lastAccountRoute = localStorage.getItem('lastAccountRoute');
        
        console.log(`AuthGuard: Route: ${state.url}, isAccountRoute: ${isCurrentRouteAccountRoute}, hasFlag: ${hasAccountRouteFlag}`);
        
        // Allow access if the current route is an account route
        if (isCurrentRouteAccountRoute) {
            console.log('AuthGuard: Allowing direct access to account route:', state.url);
            localStorage.setItem('isAccountRoute', 'true');
            localStorage.setItem('lastAccountRoute', state.url);
            return true;
        }
        
        // Also allow access if account route flag is set (important for reloads)
        if (hasAccountRouteFlag) {
            console.log('AuthGuard: Found account route flag, allowing access');
            
            // If we have a saved account route and the current URL doesn't match,
            // this might be a reload with a wrong URL - redirect to the last account route
            if (lastAccountRoute && !state.url.includes(lastAccountRoute)) {
                console.log('AuthGuard: URL mismatch during reload, redirecting to:', lastAccountRoute);
                
                // Get any saved query parameters
                const queryParams = localStorage.getItem('accountRouteParams') || '';
                
                // Navigate to the correct route
                this.router.navigateByUrl(lastAccountRoute + queryParams);
                return false;
            }
            
            return true;
        }
        
        // Standard flow for non-account routes
        const account = this.accountService.accountValue;
        console.log('AuthGuard: Standard check for route:', state.url, 'Account:', account ? 'Authenticated' : 'Not authenticated');
        
        // If not logged in, redirect to login page
        if (!account) {
            // Only auto-login with fake backend
            if (environment.useFakeBackend) {
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
            } else {
                console.log('AuthGuard: Redirecting to login page, return URL:', state.url);
                
                // Set a flag indicating this is a redirect to login (not a direct login access)
                localStorage.setItem('redirectToLogin', 'true');
                localStorage.removeItem('isAccountRoute');
                
                this.router.navigate(['/account/login'], { queryParams: { returnUrl: state.url } });
                return false;
            }
        }
        
        // User is logged in, check role access
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