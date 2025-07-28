import { Routes } from '@angular/router';
import { MobileValidationComponent } from './mobile-validation/mobile-validation.component';
import { AdminLoginComponent } from './admin-login/admin-login.component'; // Assuming admin-login is directly in app/
import { AdminLayoutComponent } from './admin/admin-layout/admin-layout.component';

// --- CORRECTED PATH FOR ADMIN DASHBOARD COMPONENT ---
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
// --- END CORRECTION ---

import { PlanListComponent } from './admin/plan-list/plan-list.component';
import { CreatePlanComponent } from './admin/create-plan/create-plan.component';
import { EditPlanComponent } from './admin/edit-plan/edit-plan.component';
import { AddSubscriberComponent } from './admin/add-subscriber/add-subscriber.component';
import { SubscriberListComponent } from './admin/subscriber-list/subscriber-list.component';
import { RechargeComponent } from './recharge/recharge.component'; // Assuming recharge is directly in app/
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component'; // Assuming layouts/main-layout/ is correct
import { BlankLayoutComponent } from './layouts/blank-layout/blank-layout.component';

// You will also need to import your AuthGuard here to protect the admin routes
// import { AuthGuard } from './guards/auth.guard'; // <-- Uncomment/Add this line

export const routes: Routes = [
  // Routes for general user (with MainLayoutComponent)
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'mobile-validation', pathMatch: 'full' }, // Default route for main layout
      { path: 'mobile-validation', component: MobileValidationComponent },
      // Consider if 'admin-login' should be here or outside MainLayout for simpler access
      { path: 'admin-login', component: AdminLoginComponent },
      // Recharge component within main layout
      // Add other user-facing routes here
    ],
  },
  {
    path: '',
    component: BlankLayoutComponent,
    children: [
      {
        path: 'categories',
        loadComponent: () =>
          import('./categories/categories.component').then(
            (m) => m.CategoriesComponent
          ),
      },
      { path: 'recharge', component: RechargeComponent },
    ],
  },
  // Admin section (with AdminLayoutComponent)
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      // Optional: Make dashboard the default child of '/admin'
      { path: '', redirectTo: 'admin-dashboard', pathMatch: 'full' },
      {
        path: 'admin-dashboard', // Path for admin dashboard
        component: AdminDashboardComponent,
      },
      { path: 'plans', component: PlanListComponent },
      { path: 'plans/create', component: CreatePlanComponent },
      { path: 'plans/edit/:id', component: EditPlanComponent },
      { path: 'subscribers/add', component: AddSubscriberComponent },
      { path: 'subscribers', component: SubscriberListComponent },
      // If 'recharge' is specifically an admin-initiated function in this layout
      // { path: 'recharge', component: RechargeComponent },
    ],
  },
  // Fallback for any unmatched routes - redirects to the default home path
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
