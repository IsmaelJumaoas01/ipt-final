import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';

import { RequestService } from '../../_services/request.service';
import { AlertService } from '../../_services/alert.service';

@Component({ templateUrl: './add-edit.component.html' })
export class AddEditComponent implements OnInit {
    id?: number;
    request: any = { items: [{ name: '', quantity: 1 }] };
    employees: any[] = [];
    workflows: any[] = [];
    loading = false;
    submitted = false;
    errorMessage: string = '';

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private requestService: RequestService,
        private alertService: AlertService
    ) {}

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
        
        // Load employees and workflows for dropdowns
        this.requestService.getEmployees().subscribe(employees => this.employees = employees);
        this.requestService.getWorkflows().subscribe(workflows => this.workflows = workflows);

        if (this.id) {
            this.requestService.getById(this.id)
                .pipe(first())
                .subscribe(x => this.request = x);
        }

        if (!this.request.items) this.request.items = [{ name: '', quantity: 1 }];
    }

    onSubmit() {
        this.submitted = true;
        this.loading = true;

        // Always set status to 'pending' when creating a new request
        if (!this.id) {
            this.request.status = 'pending';
            delete this.request.workflowId;
            delete this.request.description;
        }

        if (this.id) {
            this.updateRequest();
        } else {
            this.createRequest();
        }
    }

    private createRequest() {
        this.requestService.create(this.request)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Request created successfully', { keepAfterRouteChange: true });
                    this.router.navigate(['../'], { relativeTo: this.route });
                },
                error: error => {
                    this.errorMessage = error.error?.message || 'An error occurred while creating the request';
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
    }

    private updateRequest() {
        this.requestService.update(this.id!, this.request)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Update successful', { keepAfterRouteChange: true });
                    this.router.navigate(['../'], { relativeTo: this.route });
                },
                error: error => {
                    this.errorMessage = error.error?.message || 'An error occurred while updating the request';
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
    }

    addItem() {
        if (!this.request.items) this.request.items = [];
        this.request.items.push({ name: '', quantity: 1 });
    }

    removeItem(index: number) {
        this.request.items.splice(index, 1);
    }
} 