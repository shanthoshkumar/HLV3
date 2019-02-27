import { Component, OnInit } from '@angular/core';
import { Web3codeService } from '../services/web3code.service';
import { BrokerGuard } from '../guard/broker.guard';



import $ from "jquery";
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public account:string;
  public balance:number;

  
  constructor(private wcs:Web3codeService)
    {
      wcs.getAccount().then(account => this.account = account); 
      wcs.getUserBalance().then(balance => this.balance = balance);
     }


  ngOnInit() 
  {
    
  }

}
