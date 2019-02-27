import { Injectable } from '@angular/core';
import * as Web3 from 'web3';
declare let require: any;
declare let window: any;
import $ from "jquery";
import { BOOL_TYPE } from '@angular/compiler/src/output/output_ast';
import { promise } from 'protractor';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

let tokenAbi = require('./hlbcontract.json');


@Injectable({
  providedIn: 'root'
})
export class 
Web3codeService {
public account: string = null;
public balance:number;
public  _web3: any;

public _tokenContract: any;
public _tokenContractAddress: string = "0xb2ee73f29f6130967aa9769f742ae1287be2e988";

   constructor(private router:Router,private spinner: NgxSpinnerService) {
      if (typeof window.web3 !== 'undefined') {
        this._web3 = new Web3(window.web3.currentProvider);
        this.getAccount();
        this._tokenContract = this._web3.eth.contract(tokenAbi).at(this._tokenContractAddress);
      }
    }

    public metamask(){
      if (typeof window.web3 == 'undefined') {
        return false;
      }
      else{
        this.getAccount().then(access =>{
            if (access == null){
              return false;
            }
            else{
              return true;
            }
        });
      }
    }

    public async getAccount(): Promise<string> {
      if (this.account == null) {
        this.account = await new Promise((resolve, reject) => {
          this._web3.eth.getAccounts((err, accs) => {
            if (err != null) {
              this.router.navigate(['metamask']);
              return;
            }
            if (accs.length === 0) {
              this.router.navigate(['metamask']);
              return;
            }
            resolve(accs[0]);
          })
        }) as string;
        this._web3.eth.defaultAccount = this.account;
      }
      return Promise.resolve(this.account);
    }
   
    public async getUserBalance(): Promise<number> {
      let account = await this.getAccount();
    
      return new Promise((resolve, reject) => {
        let _web3 = this._web3;
        this._web3.eth.getBalance(account,function(err,result){
            if(err != null) {
              reject(err);
            }
            resolve(_web3.fromWei(result));
        })
      }) as Promise<number>;
    }

    public async hash(a): Promise<boolean> {
      let meta = this;
      return new Promise((resolve, reject) => {
   
        var accountInterval = setInterval(function()
        {
          meta._web3.eth.getTransactionReceipt(a,function(err,result){
            if(err != null) {
            reject(err);
            }
   
            if(result !== null)
            {
              clearInterval(accountInterval);
              if(result.status == 0x1)
              {
                resolve(true);
              }
              else
              {           
                resolve(false);
              }
            }
          })
        },100)
      }) as Promise<boolean>;
    }


  public async check_admin(): Promise<boolean> {                                       //checking admin
    let account:string = '';
    let meta = this;
    await meta.getAccount().then(address => this.account = address);  
  return new Promise((resolve, reject) => {
    this._tokenContract.admin.call(function(err,result) {
      if(err != null) {
        reject(err);
      }
      let key_admin:boolean = false;
      if (result === meta.account)
      {
        key_admin = true;
      }
      resolve(key_admin);
    });
  }) as Promise<boolean>;
  }

  public async bet_ether(a,chc,amt): Promise<boolean> {                              //bet by ether
    let meta = this;
    let account:string = '';
    await this.getAccount().then(address => this.account = address);      
  return new Promise((resolve, reject) => {
    meta.spinner.show();
  this._tokenContract.betting(a,chc,0,{from:account,value:this._web3.toWei(amt,'ether'),gas: 600000},function(err,result) 
  {  
    if(err) 
    {
      resolve(result)
      reject(err);
      
    }
    else if(result == true) 
     {
       meta.spinner.hide();
     }
     else
     {
      meta.hash(result).then((res) =>
       {
         console.log("result : "+ res );  
         if (res == false)
         swal("Bet Expired")
         meta.spinner.hide();
       })
     }        
    
  });
  }) as Promise<boolean>;
  }

  
  public async bet_token(a,chc,amt): Promise<boolean> {                               //bet by tokens
   let meta=this; 
   let account:string = '';
      await this.getAccount().then(address => this.account = address);

  return new Promise((resolve, reject) => {
    meta.spinner.show();
  this._tokenContract.betting(a,chc,this._web3.toWei(amt,'ether'),{from:account,value:0,gas: 600000},function(err,result) 
  {  
    if(err) 
    {
      resolve(result)
      reject(err);
    }
    else if(result == true) 
     {
       meta.spinner.hide();
     }
     else
     {
      meta.hash(result).then((res) =>
       {
         console.log("result : "+ res );  
         meta.spinner.hide();
       })
     }        
    
  });
  }) as Promise<boolean>;
  }

  public async increase_ether(bid,amt): Promise<boolean> {                               //increase betted ETher
  let meta=this;
  let account:string = '';
      await this.getAccount().then(address => this.account = address);     
  return new Promise((resolve, reject) => {
    meta.spinner.show();
  this._tokenContract.increase(bid,0,{from:account,value:this._web3.toWei(amt,'ether'),gas: 600000},function(err,result) 
  {  
    if(err) 
    {
      resolve(result);
      reject(err);
    }
    else if(result == true) 
     {
       meta.spinner.hide();
     }
     else
     {
      meta.hash(result).then((res) =>
       {
         console.log("result : "+ res );  
         meta.spinner.hide();
       })
     }        
  });
  }) as Promise<boolean>;
  }

  public async increase_token(bid,amt): Promise<boolean> {     
    let meta=this;
    let account:string = '';
      await this.getAccount().then(address => this.account = address);  
  return new Promise((resolve, reject) => {
    meta.spinner.show();
  this._tokenContract.increase(bid,this._web3.toWei(amt,'ether'),{from:account,value:0,gas: 600000},function(err,result) 
  {  
    if(err) 
    {
      resolve(result);
      reject(err);
    }
    else if(result == true) 
     {
       meta.spinner.hide();
     }
     else
     {
      meta.hash(result).then((res) =>
       {
         console.log("result : "+ res );  
         meta.spinner.hide();
       })
     }        
  });
  }) as Promise<boolean>;
  }
    

  public async decrease_ether(bid,amt): Promise<boolean> {                               //decrease betted ETher
  let meta=this;
  let account:string = '';
      await this.getAccount().then(address => this.account = address);     
  return new Promise((resolve, reject) => {
    meta.spinner.show();
   let option:boolean =false;
  this._tokenContract.decrease(bid,option,this._web3.toWei(amt,'ether'),{from:account,value:0,gas: 600000},function(err,result) 
  {  
    if(err) 
    {
      resolve(result)
      reject(err);
    }
    else if(result == true) 
     {
       meta.spinner.hide();
     }
     else
     {
      meta.hash(result).then((res) =>
       {
         console.log("result : "+ res );  
         meta.spinner.hide();
       })
     }        
  });
  }) as Promise<boolean>;
  }

  public async decrease_token(bid,amt): Promise<boolean> {     
    let meta=this;                          //decrease betted token
    let account:string = '';
      await this.getAccount().then(address => this.account = address);  
  return new Promise((resolve, reject) => {
    meta.spinner.show();
    let option:boolean =true;
    this._tokenContract.decrease(bid,option,this._web3.toWei(amt,'ether'),{from:account,value:0,gas: 600000},function(err,result) 
  {  
    if(err) 
    {
      resolve(result)
      reject(err);
    }
    else if(result == true) 
     {
       meta.spinner.hide();
     }
     else
     {
      meta.hash(result).then((res) =>
       {
         console.log("result : "+ res );  
         meta.spinner.hide();
       })
     }        
  });
  }) as Promise<boolean>;
  }
    
  
  public async cancel_bet(bid): Promise<boolean> {     
    let meta=this;                                            //Cancelling the bet
    let account:string = '';
    meta.spinner.show()
    await this.getAccount().then(address => this.account = address);  
  return new Promise((resolve, reject) => {
    meta.spinner.show();
  this._tokenContract.trader_cancel_bet_and_widthdraw(bid,{from:account,gas: 600000},function(err,result) 
  {  
    if(err) 
    {
      meta.spinner.hide();
      resolve(result)
      reject(err);

    }
    else if(result == true) 
     {
       meta.spinner.hide();
     }
     else
     {
      meta.hash(result).then((res) =>
       {
         console.log("result : "+ res );  
         meta.spinner.hide();
       })
     }        
  });
  }) as Promise<boolean>;
  }


  public async stake(): Promise<number> {
    let meta=this;
    let account = await this.getAccount();
  
    return new Promise((resolve, reject) => {
      
      meta._tokenContract.broker_map.call(account, function (err, result) {
        resolve(meta._web3.fromWei(result[0],'ether'));

      });

    }) as Promise<number>;
  }

  public async Token(): Promise<number>
   {
     let meta=this;
    let account = await this.getAccount();
  
    return new Promise((resolve, reject) => {
      let _web3 = this._web3;
      meta._tokenContract.broker_map.call(account, function (err, result) {
        if(err != null) 
        {
          reject(err);
        }

        // console.log("a",result[1]);
        
        resolve(meta._web3.fromWei(result[1],'ether'));
      });
    }) as Promise<number>;
  }
  
  public async check_bro(): Promise<boolean> {
    let meta = this;
    let account:string = '';
    await meta.getAccount().then(address => this.account = address);  
    return new Promise((resolve, reject) => {
      meta._tokenContract.broker_map.call(this.account,function(err,result)
    {   
          if(err != null) 
          {
            reject(err);
          }
          let key_broker = false;

          if(result[2]==true)
        {
          key_broker = true;
        }
        resolve(key_broker);
    });
    }) as Promise<boolean>;
  }
  
  
  public async add_bro(amount): Promise<number> {
    let meta=this;
    let account:string = '';
   await this.getAccount().then(address => this.account = address);
   return new Promise((resolve, reject) => {
     meta.spinner.show();
  this._tokenContract.add_broker({from:account,value:this._web3.toWei(amount,'ether'),gas: 600000},function(err,result)
   {  
    if(err) 
    {
      reject(err);
    }
    else if(result == true) 
     {
       meta.spinner.hide();
     }
     else
     {
      meta.hash(result).then((res) =>
       {
         console.log("result : "+ res );  
         meta.spinner.hide();
       })
     }        
  });
  }) as Promise<number>;
  }
  
  public async withdraw_from_staked_ether(ether): Promise<number> {
    let meta=this;
   let account:string = '';
   await this.getAccount().then(address => this.account = address);
   return new Promise((resolve, reject) => {
    meta.spinner.show();
  let option:boolean =false;
  this._tokenContract.broker_withdraw_from_stake(option,this._web3.toWei(ether,'ether'),{from:account,value:0,gas: 600000},function(err,result)
   {  
    if(err) 
    {
      reject(err);
    }
    else if(result == true) 
     {
       meta.spinner.hide();
     }
     else
     {
      meta.hash(result).then((res) =>
       {
         console.log("result : "+ res );  
         meta.spinner.hide();
       })
     }     
  });
  }) as Promise<number>;
  }


  public async  withdraw_from_staked_token(token): Promise<number> {
    let meta=this;
    let account:string = '';
    await this.getAccount().then(address => this.account = address);
    return new Promise((resolve, reject) => {
      meta.spinner.show();
     let option:boolean =true;
   this._tokenContract.broker_withdraw_from_stake(option,this._web3.toWei(token,'ether'),{from:account,value:0,gas: 600000},function(err,result)
    {  
      if(err) 
      {
        reject(err);
      }
      else if(result == true) 
       {
         meta.spinner.hide();
       }
       else
       {
        meta.hash(result).then((res) =>
         {
           console.log("result : "+ res );  
           meta.spinner.hide();
         })
       }     
   });
   }) as Promise<number>;
   }
   
  
  
  public async a_s_e(ether): Promise<number> {
    let meta=this;
    return new Promise((resolve,reject) => {
      meta.spinner.show();
      this._tokenContract.add_stake(0,{from:this._web3.eth.defaultAccount,value:this._web3.toWei(ether,'ether'),gas: 600000},function (err, result)
       {
        if(err) 
        {
          reject(err);
        }
        else if(result == true) 
         {
           meta.spinner.hide();
         }
         else
         {
          meta.hash(result).then((res) =>
           {
             console.log("result : "+ res );  
             meta.spinner.hide();
           })
         }  
        resolve(result);
      });
    }) as Promise<number>;
  }

  public async a_s_t(token): Promise<number> {
    let meta=this;
    return new Promise((resolve,reject) => {
      meta.spinner.show();
      this._tokenContract.add_stake(this._web3.toWei(token,'ether'),{from:this._web3.eth.defaultAccount,value:0,gas: 600000},function (err, result)
      {
        if(err) 
      {
        reject(err);
      }
      else if(result == true) 
       {
         meta.spinner.hide();
       }
       else
       {
        meta.hash(result).then((res) =>
         {
           console.log("result : "+ res );  
           meta.spinner.hide();
         })
       }  
        resolve(result);
      });
    }) as Promise<number>;
  }

  public async getToken(not): Promise<number> {
    // console.log(this._web3.eth.defaultAccount);
    let meta =this;
    return new Promise((resolve, reject) => {
      meta.spinner.show();

     this._tokenContract.token_transaction(0,{from:this._web3.eth.defaultAccount,value:this._web3.toWei(not,'ether'),gas: 600000},function(err,result) //purchase token
     {
      if(err) 
      {
        reject(err);
      }
      else if(result == true) 
       {
         meta.spinner.hide();
       }
       else
       {
        meta.hash(result).then((res) =>
         {
           console.log("result : "+ res );  
           meta.spinner.hide();
         })
       }        
      
     });
   }) as Promise<number>;
 }

 public async exchange_token(not): Promise<number> {
  let meta =this;
  let account:string = '';
  await this.getAccount().then(address => this.account = address);
        
            
return new Promise((resolve, reject) => {
  meta.spinner.show();

this._tokenContract.token_transaction(this._web3.toWei(not,'ether'),{from:account,value:0,gas: 600000},function(err,result) //exchange token 
{
  if(err) 
  {
    reject(err);
  }
  else if(result == true) 
   {
     meta.spinner.hide();
   }
   else
   {
    meta.hash(result).then((res) =>
     {
       console.log("result : "+ res );  
       meta.spinner.hide();
     })
//  resolve(this._web3.fromWei(result));  
}
})
}) as Promise<number>;
}

  
public async creat_bt(name,price,time): Promise<number> {
  let meta = this;
  let account:string = '';
  await this.getAccount().then(address => this.account = address);
  return new Promise((resolve,reject) => {
    meta.spinner.show();
   return meta._tokenContract.broker_set_game(this._web3.toAscii(name),(price*1000),time,{from:this.account,gas: 600000},function (err,result)
    {
    if(err) 
    {
    
      meta.spinner.hide()
      reject(err);
    }
    else if(result == true) 
     {
       meta.spinner.hide();
     }
     else
     {
      meta.hash(result).then((res) =>
       {
         console.log("result : "+ res );  
         meta.spinner.hide();
       })
     }   

    })  
  }) as Promise<number>;
 
 
}

public async set_result(gid,res): Promise<boolean> {
  let meta = this;
  let account:string = '';
  await this.getAccount().then(address => this.account = address);
  return new Promise((resolve,reject) => {
    meta.spinner.show();
   return meta._tokenContract.admin_setting_result_and_distribute_money(gid,res,{from:account,gas: 600000},function (err,result) {
    if(err) 
    {
      reject(err);
    }
    else if(result == true) 
     {
       meta.spinner.hide();
     }
     else
     {
      meta.hash(result).then((res) =>
       {
         console.log("result : "+ res ); 
         if(res == false)
         {
           swal("Sorry!...The Bet id Not Expired")
         }

         meta.spinner.hide();
       })
     }   
     resolve(result);
    });
  }) as Promise<boolean>;
 
}


public async get_total_game(): Promise<number[]> {
  
  return new Promise((resolve, reject) => {
    
    this._tokenContract.game_id.call(function (error,result) {
      if(error){    
        reject(error); 
      } 
        const arr:number[] = [];
        // console.log(result);
        
        for(var i=1;i<= result.toNumber();i++){
            arr.push(i);
        }
        resolve(arr);
      
    });
  })as Promise<number[]>;
}

public async game_set_map(gid):Promise<object>{
  return new Promise((resolve, reject) => {
    let _web3 = this._web3;
    this._tokenContract.game_set_map.call(gid,function (error,result) {
      if(error){    
        reject(error); 
      } 
      result[0] = _web3.toAscii(result[0])
      resolve(result);
    });
  })as Promise<object>;
}


public async  no_of_gamers(gid):Promise<number[]>{
  return new Promise((resolve, reject) => {
    let _web3 = this._web3;
    this._tokenContract.length_of_game_set_map.call(gid,function (error,result) {
      if(error){    
        reject(error); 
      } 
      const arr:number[] = [];
        for(var i=0;i< result.toNumber();i++){
            arr.push(i);
        }
        // console.log(result.toNumber());
        
        resolve(arr);
    });
  })as Promise<number[]>;
}
public async get_gamer_address(gid,index):Promise<string>{
  return new Promise((resolve, reject) => {
    let _web3 = this._web3;
    this._tokenContract.get_game_set_map_value.call(gid,index,function (error,result) {
      if(error){    
        reject(error); 
      } 
      resolve(result);
    });
  })as Promise<string>;
}

public async game_details(address,id):Promise<object>{
  return new Promise((resolve, reject) => {
    let _web3 = this._web3;
    this._tokenContract.betting_map.call(address,id,function (error,result) {
      if(error){    
        reject(error); 
      } 

      result[1] = result[1].toNumber()
      result[2] = result[2].toNumber()
      
       resolve(result);
    });
  })as Promise<object>;
}

public async broker_de_registration(): Promise<boolean> {
  let meta = this;
  let account:string = '';
  await this.getAccount().then(address => this.account = address);
  
  return new Promise((resolve, reject) => {
    
    this._tokenContract.broker_de_registration({from:account,gas: 600000},function (error,result) {
      if(error){    
        reject(error); 
      }else
      {
          console.log("Success");
          
      }     
              
        resolve(result);
      
    });
  })as Promise<boolean>;
}




}

  