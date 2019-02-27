import { Component, OnInit , OnDestroy } from '@angular/core';
import { Web3codeService } from '../services/web3code.service';
import { Router } from '@angular/router';
import * as Web3 from 'web3';
declare let window: any;


@Component({
  selector: 'app-add-broker',
  templateUrl: './add-broker.component.html',
  styleUrls: ['./add-broker.component.scss']
})
export class AddBrokerComponent implements OnInit {

  public  _web3: any;
  public id1: any;
  public id2: any;
  public id3: any;

  public balance:number;
  public account:string;

  constructor(private wcs:Web3codeService,private router:Router) {}

  register(amount)
  {
    if (amount=="")
     {
      swal("This Field must be filled out");
      }
    else  if(amount>=0.1)
    {
    this.wcs.add_bro(amount);
    }
    else   if(amount<0.1)
    {
      swal("Enter atleast 0.1 ether ")
    }
  }

  ngOnInit() 
  {
      let meta = this;
      meta.wcs.getUserBalance().then(balance => meta.balance = balance);
      meta.wcs.getAccount().then(acc => { 
          this.account = acc;
          meta.id1 = setInterval(function() {
           if (typeof window.web3 !== 'undefined') {
               meta._web3 = new Web3(window.web3.currentProvider);
               if (meta._web3.eth.accounts[0] !== meta.account) {
                   meta.account = meta._web3.eth.accounts[0];
                   if (meta._web3.eth.accounts[0] === undefined) {
                       meta.router.navigate(['metamask']);
                       clearInterval(this.interval);
                   } else {
                       window.location.reload(true);
                      //  alert('Address Change Detected Please Refresh Page');
                   }
               }
           } else {
               meta.router.navigate(['metamask']);
           }
          }, 200);
       });

       meta.id2 = setInterval(function() {
        meta.wcs.getUserBalance().then(balance => this.balance = balance);
    }, 20000);

    meta.id3 = setInterval(function() {
      meta.wcs.check_bro().then(res => {
        if (res){
          meta.router.navigate(['broker']);
        }
      });
  }, 200);
       
  }

  ngOnDestroy() {
    if (this.id1) {
      clearInterval(this.id1);
    }
    if (this.id2) {
      clearInterval(this.id2);
    }
    if (this.id3) {
      clearInterval(this.id3);
    }
  }
}
