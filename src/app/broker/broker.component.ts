import { Component, OnInit, Type, OnDestroy } from '@angular/core';
import { Web3codeService } from '../services/web3code.service';
import { Router } from '@angular/router';
import $ from 'jquery';
import {CalendarModule} from 'primeng/calendar';

declare let window: any;
import * as Web3 from 'web3';

@Component({
  selector: 'app-user',
  templateUrl: './broker.component.html',
   styleUrls: ['./broker.component.scss']
})
export class BrokerComponent implements OnInit, OnDestroy{
  public account:string;
  public address:string;
  public balance:number;
  public ether:number;
  public token:number;
  total_game = [];

  public  _web3: any;
  public id1: any;
  public id2: any;
  
  date1: DateTimeFormat;
  b: string;


   constructor(private wcs:Web3codeService, private router: Router)
     {  
      $("#broker").addClass("active");
      $("#admin").removeClass("active");
      $("#user").removeClass("active");

      // console.log(typeof window.web3);
      wcs.stake().then(ether => this.ether = ether);
      wcs.Token().then(token => this.token = token);
    }
  cb(_name,pric)
  {
    if (_name=="" || pric=="")
    {
      var abc=pric*1000;
  
     swal("Please Fill all the Fields");
    }
    else
    { 
  let name :any = this._web3.fromAscii(_name);
  var price=pric;
  // console.log(this.date1); 
  var a :any =this.date1;
  var b :any=new Date(a);
  var c:number =Math.round(b);
  var d:any =c/1000.0;
  var expiry_time:number=parseInt(d);

      var date=new Date().toLocaleString();
      var w :any=new Date(date);
      var x:number =Math.round(w);
      var y:any =x/1000.0;
      var Curr_time:number=parseInt(y);
      // console.log(Curr_time);
      // alert("NOw"+Curr_time)
    
      if(Curr_time > expiry_time)
      {
        swal("Select the Expiry time in Future");
      }
      else
      {
      this.wcs.creat_bt(name,price,expiry_time);
      }
  }
}
 gt(n)
 {
  if (n=="")
  {
   swal("Enter Number of Tokens");
  }
  else
  {
  var not = n/1000;
  this.wcs.getToken(not);
  }
 }
 et(tkn)
 {
  if (tkn=="")
  {
   swal("Enter Number of Tokens");
  }
  else
  {
  this.wcs.exchange_token(tkn);
  }
 }
 add_eth(eth)
 {
  if (eth=="")
  {
   swal("Enter Number of Ether");
  }
  else
  {
  this.wcs.a_s_e(eth);
 }
}
 add_tkn(tokens)
 {
  if (tokens=="")
  {
   swal("Enter Number of Tokens");
  }
  else
  {
   
 this.wcs.a_s_t(tokens);
  }
 }
 withdraw_ether(ether)
 {
  if (ether=="")
  {
   swal("Enter Number of Ether");
  }
  else
  { 
     this.wcs.withdraw_from_staked_ether(ether);
  }
 }
withdraw_token(token)
{
  if (token=="")
  {
   swal("Enter Number of Tokens");
  }
  else
  { 
  this.wcs.withdraw_from_staked_token(token);
}
}

deregister()
{
  this.wcs.broker_de_registration();
}

tablework(){
  this.total_game = [];
    this.wcs.get_total_game().then(game =>{
      game.forEach(item => {
        let w_obj = {};
        this.wcs.game_set_map(item).then(obj => {
          if(obj[3] == this.account){
            this.wcs.no_of_gamers(item).then(no_game => {
              if (no_game.length !== 0){
                  no_game.forEach(items => {
                    this.wcs.get_gamer_address(item,items).then(obj1 => {
                      this.wcs.game_details(obj1,item).then(obj2 => {
                        if(w_obj[item+"__eth_value"] == undefined){
                          w_obj["id"] = item;
                          w_obj["stock_name"] =obj[0];
                          w_obj["strike_price"] = obj[1]/1000;
                          var tm = new Date(obj[2].toNumber()*1000);
                          var etime= tm.toString();
                          w_obj["expiry_time"] = etime; 
                          w_obj["no_of_bets"] = no_game.length;                  
                          w_obj["eth_value"] = obj2[1]/1000000000000000000;
                          w_obj["token_value"] =obj2[2]/1000000000000000000;
                          w_obj[item+"__eth_value"] = obj2[1]/1000000000000000000;
                          w_obj[item+"__token_value"] = obj2[2]/1000000000000000000;
                          w_obj["status"] = obj[4];
                        }
                        else
                        {
                          w_obj["eth_value"] = w_obj["eth_value"] + obj2[1]/1000000000000000000;
                          w_obj["token_value"] = w_obj["token_value"] +  obj2[2]/1000000000000000000;
                          w_obj[item+"__eth_value"] = w_obj[item+"__eth_value"] + obj2[1]/1000000000000000000;
                          w_obj[item+"__token_value"] = w_obj[item+"__token_value"] +  obj2[2]/1000000000000000000;
                        }
                        
                        this.total_game.push(w_obj)       
                      })
                    })
                  })
                } else {
                  w_obj["id"] = item;
                  w_obj["stock_name"] = obj[0];
                  w_obj["strike_price"] = obj[1]/1000;
                  var tm = new Date(obj[2].toNumber()*1000);
                  var etime= tm.toString();
                  w_obj["expiry_time"] = etime; 
                  w_obj["no_of_bets"] = 0;                  
                  w_obj["eth_value"] = 0;
                  w_obj["token_value"] = 0;
                  w_obj["status"] = obj[4];

                  this.total_game.push(w_obj)   
                  // w_obj='';
                      
                }
            })
          }
        });
      });
    })      
}


  ngOnInit() 
  { 
    
      let meta = this;
      meta.tablework();
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
                       window.location.reload(true);                   }
               }
           } else {
               meta.router.navigate(['metamask']);
           }
          }, 200);
       });

       meta.id2 = setInterval(function() {
        meta.wcs.getUserBalance().then(balance => this.balance = balance);
        meta.tablework();
        meta.wcs.stake().then(ether => meta.ether = ether);
        meta.wcs.Token().then(token => meta.token = token);
    }, 20000);
       
  }
  ngOnDestroy() {
    if (this.id1) {
      clearInterval(this.id1);
    }
    if (this.id2) {
        clearInterval(this.id2);
      }
  }
}
