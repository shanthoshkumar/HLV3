import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AppComponent } from './app.component';
import { HeaderComponent} from './header/header.component';
import { UserComponent } from './user/user.component';
import { BrokerComponent } from './broker/broker.component';
import { Web3codeService } from './services/web3code.service';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { AdminComponent } from './admin/admin.component';
import { MetamaskErrorComponent } from './metamask-error/metamask-error.component';
import { AddBrokerComponent } from './add-broker/add-broker.component';

import { CalendarModule } from 'primeng/calendar';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    UserComponent,
    BrokerComponent,
    AdminComponent,
    MetamaskErrorComponent, 
    AddBrokerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CalendarModule,
    NgxSpinnerModule,
    BrowserAnimationsModule
  ],
  providers: [Web3codeService],
  bootstrap: [AppComponent]
})
export class AppModule { }