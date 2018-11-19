import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../utils/token.js';
const token = new Token();


Page({
  data: {
  },
  //事件处理函数
 
  onLoad(options) {
    const self = this;

    wx.showLoading();
    token.getProjectToken();
    self.orderItemGet()
    
  },





  getMainData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
    	start_time:['<',Date.parse(new Date())],
    	end_time:['>',Date.parse(new Date())]
    };
   	postData.getAfter={
      sku:{
        tableName:'sku',
        middleKey:'product_no',
        key:'product_no',
        condition:'=',
        searchItem:{
          status:['in',[1]]
        },
      } 
    };
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.mainData = res.info.data[0];
      };
      self.getArtData();
      console.log(self.data.mainData)
    };
    api.productGet(postData,callback);
  },


  orderItemGet(){
  	const self = this;
  	const postData = {};
  	postData.tokenFuncName='getProjectToken';
  	postData.searchItem = {
  		user_no:wx.getStorageSync('info').user_no,
  		product_id:self.data.mainData.id
  	};
  	postData.getAfter = {
  	  order:{
  		tableName:'order',
		middleKey:'order_no',
		key:'order_no',
		searchItem:{
			status:1
		},
		condition:'=',
		info:['passage1']
  	  }
  	};
  	const callback = (res)=>{
  	  if(res.solely_code==100000){
  		self.data.orderItemData = res.info.data
  	  };
  	  console.log(self.data.orderItemData)
  	  self.setData({
  		web_orderItemNum:self.data.orderItemData.length
  	  })
  	  self.getMainData()
  	};
  	api.orderItemGet(postData,callback)
  },

  addOrder(){
    const self = this;
    if(self.data.orderItemData.length>0){
	  setTimeout(function(){
        api.pathTo('/pages/rewardEnd/rewardEnd?id='+self.data.orderItemData[0].order.passage1,'nav');
      },800)	 	
      return
    };
  	const postData = {
      tokenFuncName:'getProjectToken',
      product:[
        {id:self.data.mainData.id,count:1}
      ],
      pay:{score:self.data.mainData.price},
      data:{},
      type:1
	};
	postData.data.passage1 = self.rewardChoosed();

    const callback = (res)=>{
      if(res&&res.solely_code==100000){
       	self.data.order_id = res.info.id;
       	if(self.data.mainData.title=='即时中奖'){
		  setTimeout(function(){
		    api.pathTo('/pages/rewardEnd/rewardEnd?id='+self.data.order_id,'nav');
		  },800)	        		
       	}else if(self.data.mainData.title=='延时中奖'){
          setTimeout(function(){
		    api.pathTo('/pages/countDown/countDown?id='+self.data.order_id,'nav');
		  },800)
       	}
      };   
    };
    api.addOrder(postData,callback);
  },


  getArtData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      thirdapp_id:getApp().globalData.thirdapp_id
    };
    postData.getBefore = {
      article:{
        tableName:'label',
        searchItem:{
          title:['=',['抽奖说明']],
          thirdapp_id:['=',[getApp().globalData.thirdapp_id]],
        },
        middleKey:'menu_id',
        key:'id',
        condition:'in',
      },
    };
    const callback = (res)=>{
      self.data.artData = {};
      if(res.info.data.length>0){
        self.data.artData = res.info.data[0];
        self.data.artData.content = api.wxParseReturn(res.info.data[0].content).nodes;
      };
      console.log(self.data.artData);
      wx.hideLoading();
      self.setData({
        web_artData:self.data.artData,
      });  
    };
    api.articleGet(postData,callback);
  },


  rewardChoosed(){
  	const self = this;
  	var rewardNum = Math.ceil(Math.random()*self.data.mainData.passage1);  
  	console.log('rewardChoosed',rewardNum);
  	var start = 0;
  	var id = 0;
  	for (var i = 0; i < self.data.mainData.sku.length; i++) {
  		start = self.data.mainData.sku[i].ratio+start;
  		if(rewardNum<start){
  			id = self.data.mainData.sku[i].id
  		};
  	};
  	console.log('rewardChoosed',id)
  	return id;
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

  