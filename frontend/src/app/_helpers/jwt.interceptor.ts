import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { AccountService } from '../_services';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private accountService: AccountService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get the current account
    const account = this.accountService.accountValue;
    const isLoggedIn = account && account.jwtToken;
    const isApiUrl = request.url.startsWith(environment.apiUrl);
    
    // Skip authentication endpoints - they handle auth separately
    const isAuthEndpoint = 
      request.url.includes('/authenticate') || 
      request.url.includes('/refresh-token') ||
      request.url.includes('/revoke-token');
    
    if (isLoggedIn && isApiUrl && !isAuthEndpoint) {
      // Clone the request with the auth header
      const token = account.jwtToken;
      
      // Log auth token being added for troubleshooting
      console.log(`Adding auth token to request: ${request.url}`);
      
      // Clone the request with the auth header
      request = request.clone({
        setHeaders: { 
          Authorization: `Bearer ${token}` 
        }
      });
      
      // Additional paranoia check for fake backend to ensure token is valid
      if (environment.useFakeBackend && (!token || token === 'undefined')) {
        console.error('JWT token is invalid in fake backend mode - forcing re-login');
        this.accountService.logout();  // This will trigger a re-login via app initializer
      }
    }

    return next.handle(request);
  }
}