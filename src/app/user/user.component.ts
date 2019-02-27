import { Component, OnInit, OnDestroy } from '@angular/core';
import { Web3codeService } from '../services/web3code.service';
import { Router } from '@angular/router';
import swal from 'sweetalert';
import $ from 'jquery';
import { NgxSpinnerService } from 'ngx-spinner';


import * as Web3 from 'web3';
declare let window: any;

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy {
  public acc:string = null;
  public bal:number;
  balance : number = null;
  public address:string;
  total_game = [];
  user_game = [];
  public  _web3: any;
  public id1: any;
  public id2: any;
  public array =[];
  public a:any
  public b:any;


  constructor(private wcs: Web3codeService, private router: Router,private spinner: NgxSpinnerService) { 
    $("#user").addClass("active");
    $("#admin").removeClass("active");
    $("#broker").removeClass("active");
  }

    gt(number)
   {
        //  this.spinner.show();
      if (number=="")
      {
        swal("Enter Number of Tokens");
      }
      else
      {
      var not = number/1000;
      this.wcs.getToken(not);
      }
    }
    
    et(num)
  {
      if (num=="")
      {
        swal("Enter Number of Tokens");
      }
      else
      {
      this.wcs.exchange_token(num);
      }
   }  

    bt(opt,id,chc,amt)
    {
      if (opt=="" || id=="" || chc=="" || amt=="")
         {
          swal("Please Fill all the Fields");
         }
      else
      {
       
           if(opt==0)
            {
            this.wcs.bet_ether(id,chc,amt).then(res =>{
              if(!res)
              {
              swal("Sorry! Bet Expired")
              }

            });
             }
           else if(opt==1)
            {
            this.wcs.bet_token(id,chc,amt).then(res =>{
              if(!res)
              {
                swal("Sorry! Bet Expired")
              }

            });
           }

} 
    }

    inc(choice,bid,amount)
    {
      if (choice=="" || bid=="" || amount=="")
      {
        swal("Please Fill all the Fields");
      }
      else
      {
            if(choice==0)
         {
           
          this.wcs.increase_ether(bid,amount).then(res =>{
            if(!res)
            {
              swal("Sorry! Unable to Increase bet amount")
            }

          }) ;
         }      
          else if(choice==1)
         {
         
          this.wcs.increase_token(bid,amount).then(rest =>{
            if(!rest)
            {
              swal("Sorry! Unable to Increase bet amount")
            }

          })
        }

           }
 }

    dec(choice,bid,amt)
    {
      if (choice=="" || bid=="" || amt=="")
      {
        swal("Please Fill all the Fields");
      }
      else
      {
        // this.wcs.getAccount().then(address => { 
        //   this.wcs.game_details(address,bid).then(amount => {
        //     if(amount[1]>0 || amount[2]>0)
        //     {
        // this.wcs.game_set_map(bid).then(result =>{
        //   var date=new Date().toLocaleString();
        //  var b :any=new Date(date);
        //  var c:number =Math.round(b);
        //  var d:any =c/1000.0;
        //  var bet_time:number=parseInt(d);
        // //  console.log(bet_time);
        //   if(bet_time+120 <=result[2])
        //    {
        //      swal("Active Bet")
             if(choice==0)
             {
             this.wcs.decrease_ether(bid,amt).then(res =>{
              if(!res)
              {
                swal("Sorry! Unable to decrease bet amount")
              }


             });
             }
             else if(choice==1)
             {
               this.wcs.decrease_token(bid,amt).then(rest =>{
                 if(!rest)
                 {
                  swal("Sorry! Unable to decrease bet amount")

                 }
               })
             }
           }  
        }        
     

    exit(bid)
    {
      if(bid =="")
      {
        swal("Please Enter a Bet id");
      }
      else
      {        
       
        this.wcs.cancel_bet(bid).then(res =>{
         if(!res)
          {
            swal("Sorry! You are not allowed to exit")
          }
       });
    }
                
}
 

    usertablework(){
    this.user_game = [];
    this.wcs.getAccount().then(address => { 
      this.wcs.get_total_game().then(game =>{
        game.forEach(item => {
          let w_obj = {};
          this.wcs.game_details(address,item).then(obj => {
            // console.log(address,item);        
            if((obj[1]>0 || obj[2]>0) && obj[3]==false)
            {
              this.wcs.game_set_map(item).then(result =>{
                        w_obj['id'] = item;
                        w_obj["stock_name"] =result[0];
                        w_obj["strike_price"] = result[1]/1000;
                       var tm = new Date(result[2].toNumber()*1000);
                        var etime= tm.toString();
                        w_obj["expiry_time"] = etime;
                      if(obj[0]==false)
                        {  
                        w_obj["option"] = "low";
                        }
                       else if(obj[0]==true)
                        {
                          w_obj["option"] = "High";
                        }
                        w_obj["status"] = result[4];
                        w_obj["eth_value"] = obj[1]/1000000000000000000;
                        w_obj["token_value"] = obj[2]/1000000000000000000;
                        this.user_game.push(w_obj);
              })
            }
          })
        })
      });
    })
  }


  alltablework(){
  this.total_game = [];
    this.wcs.get_total_game().then(game =>{
      game.forEach(item => {
        let w_obj = {}
        this.wcs.game_set_map(item).then(obj => {
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
                          console.log("Display"+w_obj["no_of_bets"]);  
                          this.array.push(w_obj["id"])   
                          w_obj["eth_value"] = obj2[1]/1000000000000000000
                          w_obj["token_value"] = obj2[2]/1000000000000000000;
                          w_obj[item+"__eth_value"] = obj2[1]/1000000000000000000;
                          w_obj[item+"__token_value"] = obj2[2]/1000000000000000000;
                          w_obj["status"] = obj[4];      
                        }
                        else
                        {                         
                          w_obj["eth_value"] = w_obj["eth_value"] + obj2[1]/1000000000000000000;
                          w_obj["token_value"] = w_obj["token_value"] +  obj2[2]/1000000000000000000;
                          w_obj[item+"__eth_value"] = w_obj[item+"__eth_value"] + obj2[1]/1000000000000000000;
                          w_obj[item+"__token_value"] = w_obj[item+"__token_value"] +  obj2[2]/1000000000000000000

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
                w_obj["expiry_time"] =etime; 
                w_obj["no_of_bets"] = 0;                  
                w_obj["eth_value"] =0;
                w_obj["token_value"] = 0;
                w_obj["status"] = obj[4];
         
                this.total_game.push(w_obj) 
                
              }
            })
        });
      });
    }); 
    
  }


  ngOnInit() {
   let meta = this;
   meta.usertablework();
   meta.alltablework();
   meta.wcs.getUserBalance().then(balance => meta.balance = balance);
   meta.wcs.getAccount().then(acc => { 
       this.acc = acc;
       meta.id1 = setInterval(function() {
        if (typeof window.web3 !== 'undefined') {
            meta._web3 = new Web3(window.web3.currentProvider);
            if (meta._web3.eth.accounts[0] !== meta.acc) {
                meta.acc = meta._web3.eth.accounts[0];
                if (meta._web3.eth.accounts[0] === undefined) {
                    meta.router.navigate(['metamask']);
                    clearInterval(this.interval);
                } else {
                    window.location.reload(true);
                        }
        }
        } else {
            meta.router.navigate(['metamask']);
        }
       }, 200);
    });

    meta.id2 = setInterval(function() {
        meta.wcs.getUserBalance().then(balance => meta.balance = balance);
        meta.usertablework();
        meta.alltablework();
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