import { Routes } from '@angular/router';
import { UserComponent } from '../user/user.component';
import { BrokerComponent } from '../broker/broker.component';
import { AdminComponent } from '../admin/admin.component';
import {HeaderComponent} from '../header/header.component';
import { BrokerGuard } from '../guard/broker.guard';

import { MetamaskErrorComponent } from '../metamask-error/metamask-error.component';
import { AddBrokerComponent } from '../add-broker/add-broker.component';
import { AdminGuard } from '../guard/admin.guard';

export  const  routes: Routes = [
    { 
      path: 'admin',
      component: AdminComponent,
      canActivate : [AdminGuard]
    },
    { 
      path: 'user',
      component:UserComponent
    },
    { 
      path: 'broker',
      component: BrokerComponent,
      canActivate : [BrokerGuard]
    },
    {
      path: 'metamask',
      component:MetamaskErrorComponent
    },
    {
      path: 'add-broker',
      component:AddBrokerComponent,
    },
     { 
      path: '',
      redirectTo: '/user',
      pathMatch: 'full'
    }
  ];