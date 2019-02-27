// import { Injectable } from '@angular/core';
// import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
// import { Observable } from 'rxjs';
// import * as Web3 from 'web3'
// declare let window: any;



// @Injectable()
// export class MetaguardGuard implements CanActivate {
//   public  _web3: any;
//   canActivate(
//     next: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
//        if (typeof window.Web3 !== 'undefined') 
//       {
//       this._web3 = new Web3(window.web3.currentProvider);
//       this._web3.version.getNetwork((err, netId) => {
//           if(err)
//           {
//             // reject(err)
//           }
//         else{
//           return true;
//         }

          
//       })
      
       
//   }
// }
