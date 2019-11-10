import { AuthGuard } from './guards/auth.guard';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/tabs/tabs.module').then(m => m.TabsPageModule), canActivate : [AuthGuard]
  },
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },
  { path: 'creditos', loadChildren: './pages/creditos/creditos.module#CreditosPageModule' },
  { path: 'adduser', loadChildren: './pages/adduser/adduser.module#AdduserPageModule' },
  { path: 'comerce', loadChildren: './pages/comerce/comerce.module#ComercePageModule' }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
