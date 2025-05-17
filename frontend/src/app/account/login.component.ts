import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { environment } from '../../environments/environment';

import { AccountService } from '../_services';
import { Account } from '../_models';

@Component({ selector: 'app-login', templateUrl: 'login.component.html' })
export class LoginComponent implements OnInit {
  form!: UntypedFormGroup;
  loading = false;
  submitted = false;
  error = '';
  returnUrl: string = '/';
  verifiedAccounts: Account[] = [];
  loadingAccounts = false;
  databaseConnected = false;
  checkingConnection = true;
  showVerifiedAccountsModal = false;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService
  ) { }

  ngOnInit() {
    // Clear any redirect flags that might be set
    if (localStorage.getItem('redirectToLogin') !== 'true') {
      // Only clear flags if we're directly accessing the login page
      localStorage.removeItem('isAccountRoute');
      localStorage.removeItem('accountRouteReload');
      localStorage.removeItem('lastAccountRoute');
    } else {
      // Clear the redirect flag after use
      localStorage.removeItem('redirectToLogin');
    }
    
    // Always set the account route flag for the login page
    localStorage.setItem('isAccountRoute', 'true');
    
    // Initialize the form regardless of backend type
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
    
    // Get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    
    // If already logged in, redirect to home
    if (this.accountService.accountValue) {
      this.router.navigate(['/']);
    }

    // Check database connection first
    this.checkDatabaseConnection();
  }

  get f() { return this.form.controls; }

  getRoleBadgeClass(role: string): string {
    // Convert role to lowercase for comparison
    const normalizedRole = role.toLowerCase();
    
    // Get color based on role
    const roleColors = {
        'admin': 'bg-danger',
        'user': 'bg-primary',
        'manager': 'bg-success',
        'supervisor': 'bg-info',
        'employee': 'bg-secondary',
        'hr': 'bg-warning text-dark',
        'finance': 'bg-info text-dark',
        'it': 'bg-purple',
        'support': 'bg-teal'
    };

    // Return the color for the role, or a default color if not found
    return roleColors[normalizedRole] || 'bg-secondary';
  }

  checkDatabaseConnection() {
    this.checkingConnection = true;
    this.accountService.checkConnection()
      .pipe(first())
      .subscribe({
        next: () => {
          console.log('Database connection successful');
          this.databaseConnected = true;
          this.checkingConnection = false;
          // Only load verified accounts if database is connected
          this.loadVerifiedAccounts();
        },
        error: error => {
          console.error('Database connection failed:', error);
          this.databaseConnected = false;
          this.checkingConnection = false;
          this.error = 'Unable to connect to the server. Please try again later.';
        }
      });
  }

  onSubmit() {
    this.submitted = true;
    this.error = '';

    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    this.accountService.login(this.f['email'].value, this.f['password'].value)
      .pipe(first())
      .subscribe({
        next: () => {
          // Clear account route flags on successful login
          localStorage.removeItem('isAccountRoute');
          localStorage.removeItem('accountRouteReload');
          localStorage.removeItem('lastAccountRoute');
          
          // Navigate to the return url
          this.router.navigateByUrl(this.returnUrl);
        },
        error: error => {
          this.error = error;
          this.loading = false;
        }
      });
  }

  openVerifiedAccountsModal() {
    this.showVerifiedAccountsModal = true;
    this.loadVerifiedAccounts();
  }

  closeVerifiedAccountsModal() {
    this.showVerifiedAccountsModal = false;
  }

  loadVerifiedAccounts() {
    console.log('Loading verified accounts...');
    this.loadingAccounts = true;
    this.accountService.getVerifiedAccounts()
      .pipe(first())
      .subscribe({
        next: (accounts) => {
          console.log('Verified accounts loaded:', accounts);
          this.verifiedAccounts = accounts;
          this.loadingAccounts = false;
        },
        error: error => {
          console.error('Error loading verified accounts:', error);
          this.loadingAccounts = false;
          this.error = 'Error loading verified accounts. Please try again.';
        }
      });
  }

  loginWithAccount(account: Account) {
    console.log('Attempting to login with account:', account.email);
    this.loading = true;
    this.error = '';
    
    if (!account.password) {
        this.error = 'Password not available for this account';
        this.loading = false;
        return;
    }
    
    // Use the password directly from the account object
    this.accountService.login(account.email, account.password)
        .pipe(first())
        .subscribe({
            next: () => {
                this.closeVerifiedAccountsModal();
                localStorage.removeItem('isAccountRoute');
                localStorage.removeItem('accountRouteReload');
                localStorage.removeItem('lastAccountRoute');
          this.router.navigateByUrl(this.returnUrl);
        },
        error: error => {
          this.error = error;
          this.loading = false;
        }
      });
  }
}