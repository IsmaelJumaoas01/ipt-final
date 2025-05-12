import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../_services/employee.service';
import { AccountService } from '../../_services/account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-list',
  templateUrl: './list.component.html'
})
export class ListComponent implements OnInit {
  employees: any[] = [];

  constructor(
    private employeeService: EmployeeService,
    private accountService: AccountService,
    private router: Router
  ) {}

  ngOnInit() {
    this.employeeService.getAll().subscribe(data => this.employees = data);
  }

  account() {
    return this.accountService.accountValue;
  }

  viewRequests(employeeId: number) {
    this.router.navigate(['/requests'], { queryParams: { employeeId } });
  }

  viewWorkflows(employeeId: number) {
    this.router.navigate(['/workflows'], { queryParams: { employeeId } });
  }

  transfer(employee: any) {
    // Implement transfer logic or navigation
  }

  edit(employeeId: number) {
    this.router.navigate(['/employees/edit', employeeId]);
  }

  delete(employeeId: number) {
    this.employeeService.delete(employeeId).subscribe(() => {
      this.employees = this.employees.filter(e => e.id !== employeeId);
    });
  }

  add() {
    this.router.navigate(['/employees/add']);
  }
} 