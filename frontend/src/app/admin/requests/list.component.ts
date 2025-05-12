import { Component, OnInit } from '@angular/core';
import { RequestService } from '../../_services/request.service';
import { AccountService } from '../../_services/account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-request-list',
  templateUrl: './list.component.html'
})
export class ListComponent implements OnInit {
  requests: any[] = [];

  constructor(
    private requestService: RequestService,
    private accountService: AccountService,
    private router: Router
  ) {}

  ngOnInit() {
    this.requestService.getAll().subscribe(data => this.requests = data);
  }

  account() {
    return this.accountService.accountValue;
  }

  edit(requestId: number) {
    this.router.navigate(['/requests/edit', requestId]);
  }

  delete(requestId: number) {
    this.requestService.delete(requestId).subscribe(() => {
      this.requests = this.requests.filter(r => r.id !== requestId);
    });
  }

  add() {
    this.router.navigate(['/requests/add']);
  }
} 