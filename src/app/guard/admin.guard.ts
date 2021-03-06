import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Web3codeService } from '../services/web3code.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private wcs:Web3codeService,private router:Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      return this.wcs.check_admin().then(admin => {
        console.log(admin);
       
        
        if (!admin){
          this.router.navigate(["user"]);
          return false;
        }
        else
        {
          // alert("TRuuueee")
          return true;
        }
        
      });
  }
}
