import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();


Page({
  data: {
    is_show:false,
    submitData:{
      passage2:'',
      passage3:''
    }
  },
  //事件处理函数




  onLoad(options) {
    const self = this;
    self.data.id = options.id;
    self.data.order_id = options.order_id;
    
    self.getOrderData()
  },

  getMainData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      thirdapp_id:getApp().globalData.thirdapp_id,
      id: self.data.orderData.passage1  
  	}
    const callback = (res)=>{
	  if(res.info.data.length>0){
	  	self.data.mainData = res.info.data[0]
	  }else{
	  	api.showToast('很遗憾，您未中奖','none')
	  }
      self.setData({
        web_mainData:self.data.mainData,
      });
      console.log(self.data.mainData)
    };
    api.skuGet(postData,callback);
  },


  getOrderData(){
  	const self = this;
  	const postData = {};
  	postData.tokenFuncName='getProjectToken';
  	postData.searchItem = {
  		id:self.data.order_id
  	};
  	const callback  = (res)=>{
  	  if(res.info.data.length>0){
  	  	self.data.orderData = res.info.data[0]
  	  };
  	  self.setData({
  	  	web_orderData:self.data.orderData
  	  })
  	  self.getMainData();
  	};
  	api.orderGet(postData,callback)
  },

  orderUpdate(e){
    const self = this;
    const postData = {};
    postData.tokenFuncName='getProjectToken';
    postData.data = api.cloneForm(self.data.submitData);
    postData.searchItem = {};
    postData.searchItem.id = self.data.order_id;
    const callback  = (res)=>{
	 	if(res.solely_code==100000){
		  api.showToast('领取成功','none');
		  setTimeout(function(){
		    api.pathTo('/pages/index/index','nav');
	      },500); 
	 	}
    };
    api.orderUpdate(postData,callback);
  },

   changeBind(e){
    const self = this;
    api.fillChange(e,self,'submitData');
    console.log(self.data.submitData);
    self.setData({
      web_submitData:self.data.submitData,
    });  
  },

  submit(){
    const self = this;
    var phone = self.data.submitData.passage2;
    const pass = api.checkComplete(self.data.submitData);
    if(pass){
      if(phone.trim().length != 11 || !/^1[3|4|5|6|7|8|9]\d{9}$/.test(phone)){
        api.showToast('手机格式不正确','fail')
      }else{
        self.orderUpdate() 
      }
    }else{
      api.showToast('请补全信息','fail');
    };
  },

  mask:function(e){
    this.setData({
      is_show:false,
    })
  },


  reward:function(e){
  	this.setData({
	  is_show:true,
	})
  },


  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },


  intoPathRedirect(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'redi');
  },

})

  