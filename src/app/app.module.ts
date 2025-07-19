import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { DoorService } from '../services/door.service';

import { DoorComponent } from './door/door.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { PlatbandComponent } from './platband/platband.component';
import { FrameComponent } from './frame/frame.component';
import { ExtentionComponent } from './extention/extention.component';
import { CartComponent } from './cart/cart.component';

import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './login/login.component';
import { AdminPlatbandComponent } from './admin-platband/admin-platband.component';
// import { AdminFrameComponent } from './admin-frame/admin-frame.component';
// import { AdminExtensionComponent } from './admin-extension/admin-extension.component';

@NgModule({
  declarations: [
    AppComponent,
    DoorComponent,
    NavbarComponent,
    HomeComponent,
    HeaderComponent,
    PlatbandComponent,
    FrameComponent,
    ExtentionComponent,
    CartComponent,
    AdminComponent,
    LoginComponent,
    AdminPlatbandComponent
    // AdminFrameComponent,
    // AdminExtensionComponent
  ],
  imports: [
    BrowserAnimationsModule, // Required for animations
    ToastrModule.forRoot({
      timeOut: 2000,
      positionClass: 'toast-top-center', // Position: top-right
      preventDuplicates: true, // Avoid duplicate notifications
      progressBar: true, // Sh
    }),
    RouterModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
  

  ],
  providers: [DoorService],
  bootstrap: [AppComponent]
})
export class AppModule { }
