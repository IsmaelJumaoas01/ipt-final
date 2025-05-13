import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, switchMap, retry, delay } from 'rxjs/operators';

import { AccountService } from '../_services';
import { environment } from '../../environments/environment';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    private isRefreshing = false;
    private retryCount = 0;
    private maxRetries = 2; // Max number of retries for fake backend

    constructor(private accountService: AccountService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            // Add retry logic for fake backend - retry up to 2 times with 500ms delay
            environment.useFakeBackend ? retry({
                count: this.maxRetries,
                delay: 500
            }) : retry(0),
            catchError(err => {
                // Only attempt refresh if this is a 401 error and not a login/refresh request
                if (err.status === 401 && 
                    this.accountService.accountValue && 
                    !environment.useFakeBackend &&
                    !request.url.includes('/authenticate') && 
                    !request.url.includes('/refresh-token') &&
                    !this.isRefreshing) {
                    
                    console.log('Error interceptor: Attempting token refresh due to 401');
                    this.isRefreshing = true;
                    
                    // Try to refresh the token
                    return this.accountService.refreshToken().pipe(
                        switchMap(() => {
                            this.isRefreshing = false;
                            // Clone the original request with the new token
                            const newRequest = request.clone({
                                setHeaders: { 
                                    Authorization: `Bearer ${this.accountService.accountValue?.jwtToken || ''}` 
                                }
                            });
                            return next.handle(newRequest);
                        }),
                        catchError(refreshErr => {
                            this.isRefreshing = false;
                            console.log('Error interceptor: Token refresh failed, logging out');
                            this.accountService.logout();
                            return throwError(refreshErr);
                        })
                    );
                } else if (err.status === 403 && this.accountService.accountValue && !environment.useFakeBackend) {
                    // For 403 errors (forbidden), log out as the user doesn't have permission
                    console.log('Error interceptor: Logging out user due to permission error (403)');
                    this.accountService.logout();
                } else if (environment.useFakeBackend && [401, 403].includes(err.status)) {
                    // If using fake backend and getting auth errors, try to auto-login
                    if (this.retryCount < this.maxRetries) {
                        console.log(`Error interceptor: Auto login attempt with fake backend (attempt ${this.retryCount + 1})`);
                        this.retryCount++;
                        return this.accountService.login('admin@example.com', 'admin').pipe(
                            switchMap(() => {
                                // Clone the original request with the new token
                                const newRequest = request.clone({
                                    setHeaders: { 
                                        Authorization: `Bearer ${this.accountService.accountValue?.jwtToken || ''}` 
                                    }
                                });
                                return next.handle(newRequest);
                            }),
                            catchError(loginErr => {
                                console.error('Auto-login failed:', loginErr);
                                return throwError(err);
                            })
                        );
                    }
                    // Reset retry count
                    this.retryCount = 0;
                }

                const error = (err && err.error && err.error.message) || err.statusText;
                console.error('HTTP Error:', err);
                return throwError(error);
            })
        );
    }
}