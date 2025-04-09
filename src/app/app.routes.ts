import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';

export const routes: Routes = [
    { path: 'Tracking/shipment-summary', redirectTo: 'shipment-summary', pathMatch: 'full' },
    { path: '', component: LoginComponent },
    { path: 'login', component: LoginComponent },
    { path: 'shipment-summary', loadComponent: () => import('./pages/shipment-summary/shipment-summary.component').then(m => m.ShipmentSummaryComponent) },
    { path: 'shipment-summary-guest', loadComponent: () => import('./pages/shipment-summary-guest/shipment-summary-guest.component').then(m => m.ShipmentSummaryGuestComponent) },
    {
        path: 'shipment-list', loadComponent: () => import('./pages/shipment-list/shipment-list.component').then(m => m.ShipmentListComponent),

    },

];
