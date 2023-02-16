import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import Containers
import { DefaultLayoutComponent } from './containers';
import { AuthGuardGuard } from './service/seguridad/auth-guard.guard';
import { LoginComponent } from './view/login/login/login.component';


export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login'
    }
  },
  {
    path: '',
    component: LoginComponent,
    canActivate:[AuthGuardGuard],
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'principal',
    component: DefaultLayoutComponent,
    data: {
      title: 'Escritorio'
    },
    children: [
      {
        path: '',
        loadChildren: () => import('./view/principal/principal.module').then(m => m.PrincipalModule),
        canActivate:[AuthGuardGuard]
      }
    ]
    },
  { path: '**', component: LoginComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, { useHash: true }) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}


// imports: [
//   CommonModule,
//   BrowserModule,
//   RouterModule.forRoot(routes,{
//     useHash: true
// relativeLinkResolution: 'legacy'
//   })
// ],