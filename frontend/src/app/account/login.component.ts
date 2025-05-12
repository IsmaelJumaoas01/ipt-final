import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService } from '../_services';

@Component({ selector: 'app-login', templateUrl: 'login.component.html' })
export class LoginComponent implements OnInit {
  form!: UntypedFormGroup;
  loading = false;
  submitted = false;
  error = '';

  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  get f() { return this.form.controls; }

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
          // Always redirect to root route - admin dashboard for admins, home for others
          this.router.navigateByUrl('/');
        },
        error: error => {
          this.error = error;
          this.loading = false;
        }
      });
  }
}