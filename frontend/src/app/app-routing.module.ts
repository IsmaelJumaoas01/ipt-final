import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { UsersComponent } from './users/users.component';
import { AuthGuard } from './_helpers';
import { Role } from './_models';
import { OverviewComponent } from './admin/overview.component';
import { SubnavComponent } from './admin/subnav.component';
import { LayoutComponent as AdminLayoutComponent } from './admin/layout.component';

const accountModule = () => import('./account/account.module').then(x => x.AccountModule);
const adminModule = () => import('./admin/admin.module').then(x => x.AdminModule);
const profileModule = () => import('./profile/profile.module').then(x => x.ProfileModule);

const routes: Routes = [
    { 
        path: '', 
        component: AdminLayoutComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Admin] },
        children: [
            { path: '', component: OverviewComponent },
            { path: 'accounts', loadChildren: () => import('./admin/accounts/accounts.module').then(x => x.AccountsModule) },
            { path: 'employees', loadChildren: () => import('./admin/employees/employees.module').then(x => x.EmployeesModule) },
            { path: 'departments', loadChildren: () => import('./admin/departments/departments.module').then(x => x.DepartmentsModule) },
            { path: 'requests', loadChildren: () => import('./admin/requests/requests.module').then(x => x.RequestsModule) },
            { path: 'workflows', loadChildren: () => import('./admin/workflows/workflows.module').then(x => x.WorkflowsModule) }
        ]
    },
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'users', component: UsersComponent, canActivate: [AuthGuard], data: { roles: [Role.Admin] } },
    { path: 'account', loadChildren: accountModule },
    { path: 'profile', loadChildren: profileModule, canActivate: [AuthGuard] },
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }