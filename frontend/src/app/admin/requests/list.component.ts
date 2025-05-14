import { Component, OnInit } from '@angular/core';
import { RequestService } from '../../_services/request.service';
import { AccountService } from '../../_services/account.service';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-request-list',
  templateUrl: './list.component.html'
})
export class ListComponent implements OnInit {
  requests: any[] = [];
  loading = false;

  constructor(
    private requestService: RequestService,
    private accountService: AccountService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loading = true;
    this.requestService.getAll().pipe(first()).subscribe({
      next: data => {
        this.requests = data;
        console.log('Loaded requests:', this.requests);
        this.loading = false;
      },
      error: error => {
        console.error('Error loading requests:', error);
        this.loading = false;
      }
    });
  }

  account() {
    return this.accountService.accountValue;
  }

  edit(requestId: number) {
    this.router.navigate(['/requests/edit', requestId]);
  }

  delete(requestId: number) {
    if (confirm('Are you sure you want to delete this request?')) {
      this.requestService.delete(requestId).subscribe({
        next: () => {
          this.requests = this.requests.filter(r => r.id !== requestId);
        },
        error: error => {
          console.error('Error deleting request:', error);
        }
      });
    }
  }

  add() {
    this.router.navigate(['/requests/add']);
  }
} 