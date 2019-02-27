import { Component, OnInit , OnDestroy } from '@angular/core';
import { Web3codeService } from '../services/web3code.service';
import $ from "jquery";

declare let window: any;
import * as Web3 from 'web3';
import { Router } from '@angular/router';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy {

  public  _web3: any;
  public id1: any;
  public id2: any;
  public account:string;
  public balance:number;

  public total_game = [];

  constructor(private wcs:Web3codeService,private router:Router){
    $("#admin").addClass("active");
    $("#broker").removeClass("active");
    $("#user").removeClass("active");
  }


  result(id,option)
    {
      if(id=="" || option =="")
      {
      swal("Please Fill all the Fields");
      }
      else
      {
      this.wcs.set_result(id,option);
      }
    }

    alltablework(){
      this.total_game = [];
        this.wcs.get_total_game().then(game =>{
          game.forEach(item => {
            let w_obj = {};
            this.wcs.game_set_map(item).then(obj => {
                this.wcs.no_of_gamers(item).then(no_game => {
                  if (no_game.length !== 0){
                      no_game.forEach(items => {
                        this.wcs.get_gamer_address(item,items).then(obj1 => {
                          this.wcs.game_details(obj1,item).then(obj2 => {
                            if(w_obj[item+"__eth_value"] == undefined){
                              w_obj["id"] = item;
                              w_obj["stock_name"] = obj[0];
                              w_obj["strike_price"] = obj[1]/1000;
                              var tm = new Date(obj[2].toNumber()*1000);
                              var etime= tm.toString();
                              w_obj["expiry_time"] =etime; 
                              w_obj["no_of_bets"] = no_game.length;                  
                              w_obj["eth_value"] = obj2[1]/1000000000000000000;
                              w_obj["token_value"] =obj2[2]/1000000000000000000;
                              w_obj[item+"__eth_value"] = obj2[1]/1000000000000000000;
                              w_obj[item+"__token_value"] = obj2[2]/1000000000000000000;
                              w_obj["status"] = obj[4];
                            }
                            else{
                              w_obj["eth_value"] = w_obj["eth_value"] + obj2[1]/1000000000000000000; 
                              w_obj["token_value"] = w_obj["token_value"] +  obj2[2]/1000000000000000000;
                              w_obj[item+"__eth_value"] = w_obj[item+"__eth_value"] + obj2[1]/1000000000000000000;     
                              w_obj[item+"__token_value"] = w_obj[item+"__token_value"] +  obj2[2];
                            }
                            this.total_game.push(w_obj)    
                          })
                        })
                      })
                  } else {
                    w_obj["id"] = item;
                    w_obj["stock_name"] = obj[0];
                    w_obj["strike_price"] =obj[1]/1000;
                    var tm = new Date(obj[2].toNumber()*1000);
                    var etime= tm.toString();
                    w_obj["expiry_time"] = etime; 
                    w_obj["no_of_bets"] = 0;                  
                    w_obj["eth_value"] = 0;
                    w_obj["token_value"] = 0;
                    w_obj["status"] = obj[4];
                    this.total_game.push(w_obj)         
                  }
                })
            });
          });
        });
      }
    ngOnInit() 
    {
        let meta = this;
        meta.alltablework();
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
                     }
                      else 
                     {
                      window.location.reload(true);
                     }
                 }
             } else {
                 meta.router.navigate(['metamask']);
             }
            }, 200);
         });
  
         meta.id2 = setInterval(function() {
          meta.wcs.getUserBalance().then(balance => this.balance = balance);
          meta.alltablework();
          window.location.reload(true)     
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
