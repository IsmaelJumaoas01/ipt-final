import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';

import { RequestService } from '../../_services/request.service';
import { AlertService } from '../../_services/alert.service';
import { AccountService } from '../../_services';

@Component({ templateUrl: './add-edit.component.html' })
export class AddEditComponent implements OnInit {
    id?: number;
    request: any = { 
        items: [{ name: '', quantity: 1 }],
        type: 'Equipment',
        status: 'Pending'
    };
    employees: any[] = [];
    workflows: any[] = [];
    loading = false;
    submitted = false;
    errorMessage: string = '';
    isAdmin = false;
    
    // Request type options with proper casing
    requestTypes = [
        { value: 'Equipment', label: 'Equipment Request' },
        { value: 'Expense', label: 'Expense Request' },
        { value: 'Leave', label: 'Leave Request' },
        { value: 'Transfer', label: 'Transfer Request' }
    ];
    
    // Status options
    statusOptions = [
        { value: 'Pending', label: 'Pending' },
        { value: 'Approved', label: 'Approved' },
        { value: 'Rejected', label: 'Rejected' }
    ];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private requestService: RequestService,
        private alertService: AlertService,
        private accountService: AccountService
    ) {
        // Check if user is admin
        this.isAdmin = this.accountService.accountValue?.role === 'Admin';
    }

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
        
        // Load employees and workflows for dropdowns
        this.requestService.getEmployees().subscribe({
            next: (employees) => {
                this.employees = employees;
                console.log('Loaded employees:', employees);
            },
            error: (error) => {
                console.error('Error loading employees:', error);
                this.alertService.error('Failed to load employees');
            }
        });
        
        this.requestService.getWorkflows().subscribe({
            next: (workflows) => this.workflows = workflows,
            error: (error) => {
                console.error('Error loading workflows:', error);
                this.alertService.error('Failed to load workflows');
            }
        });

        if (this.id) {
            this.loading = true;
            this.requestService.getById(this.id)
                .pipe(first())
                .subscribe({
                    next: (request) => {
                        this.request = {
                            type: request.type || 'Equipment',
                            status: request.status || 'Pending',
                            items: request.items?.map((item: any) => ({
                                name: item.name || '',
                                quantity: parseInt(item.quantity) || 1
                            })) || [{ name: '', quantity: 1 }]
                        };
                        this.loading = false;
                    },
                    error: (error) => {
                        console.error('Error loading request:', error);
                        this.alertService.error('Failed to load request details');
                        this.loading = false;
                    }
                });
        }
    }
    
    // Helper function to capitalize first letter
    capitalizeFirstLetter(str: string): string {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    onSubmit() {
        this.submitted = true;
        
        // Basic validation
        if (!this.request.type) {
            this.alertService.error('Please select a request type');
            return;
        }

        // Validate items
        const validItems = this.request.items.filter((item: any) => 
            item.name && item.name.trim() !== '' && 
            item.quantity && parseInt(item.quantity) > 0
        );

        if (validItems.length === 0) {
            this.alertService.error('At least one valid item is required');
            return;
        }

        this.request.items = validItems;
        this.loading = true;

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
                    this.alertService.success('Request created successfully');
                    this.router.navigate(['../'], { relativeTo: this.route });
                },
                error: error => {
                    console.error('Error creating request:', error);
                    this.alertService.error(error.error?.message || 'Failed to create request');
                    this.loading = false;
                }
            });
    }

    private updateRequest() {
        this.requestService.update(this.id!, this.request)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Request updated successfully');
                    this.router.navigate(['../'], { relativeTo: this.route });
                },
                error: error => {
                    console.error('Error updating request:', error);
                    this.alertService.error(error.error?.message || 'Failed to update request');
                    this.loading = false;
                }
            });
    }

    addItem() {
        this.request.items.push({ name: '', quantity: 1 });
    }

    removeItem(index: number) {
        if (this.request.items.length > 1) {
            this.request.items.splice(index, 1);
        }
    }
} 