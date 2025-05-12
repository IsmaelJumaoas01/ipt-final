import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { DepartmentService } from '../../_services/department.service';
import { EmployeeService } from '../../_services/employee.service';

@Component({
  selector: 'app-employee-transfer',
  templateUrl: './transfer.component.html'
})
export class TransferComponent implements OnInit {
  @Input() employee: any;
  @Output() closed = new EventEmitter<boolean>();
  departments: any[] = [];
  departmentId: number | null = null;

  constructor(
    private departmentService: DepartmentService,
    private employeeService: EmployeeService
  ) {}

  ngOnInit() {
    this.departmentService.getAll().subscribe(depts => this.departments = depts);
    this.departmentId = this.employee?.departmentId;
  }

  transfer() {
    if (this.employee && this.departmentId) {
      this.employeeService.transfer(this.employee.id, this.departmentId).subscribe(() => {
        this.closed.emit(true);
      });
    }
  }

  cancel() {
    this.closed.emit(false);
  }
} 