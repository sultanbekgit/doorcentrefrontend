import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { HomeComponent } from './home/home.component';
import { PlatbandComponent } from './platband/platband.component';
import { FrameComponent } from './frame/frame.component';
import { ExtentionComponent } from './extention/extention.component';
import { CartComponent } from './cart/cart.component';
import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './login/login.component';
// import { AdminFrameComponent } from './admin-frame/admin-frame.component';
import { AdminPlatbandComponent } from './admin-platband/admin-platband.component';
// import { AdminExtensionComponent } from './admin-extension/admin-extension.component';
import { AdminAuthGuard } from './admin-auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'home/platbands', component: PlatbandComponent },
  { path: 'home/frames', component: FrameComponent },
  { path: 'home/extensions', component: ExtentionComponent },
  { path: 'home/cart', component: CartComponent },
  { path: 'home/login', component: LoginComponent },
  { path: 'home/admin', component: AdminComponent, canActivate: [AdminAuthGuard] },
  // { path: 'home/admin/frame', component: AdminFrameComponent, canActivate: [AdminAuthGuard] },
  { path: 'home/admin/platband', component: AdminPlatbandComponent, canActivate: [AdminAuthGuard] },
  // { path: 'home/admin/extension', component: AdminExtensionComponent, canActivate: [AdminAuthGuard] },



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }