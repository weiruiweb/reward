import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../utils/token.js';
const token = new Token();


Page({
  data: {
    arrayData: null,
    dialogData: null,
    isDialogShow: false,
    isScroll: true,
    mainData:[],
  },
  //事件处理函数
 
  onLoad(options) {
    const self = this;

    wx.showLoading();
    token.getProjectToken();
    
    self.getMainData()
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
      wx.hideLoading();
      console.log(self.data.mainData)
    };
    api.productGet(postData,callback);
  },

   addOrder(){
    const self = this;
    if(!self.data.order_id){
      const postData = {
        tokenFuncName:'getProjectToken',
        product:[
          {id:self.data.mainData.id,count:1}
        ],
        pay:{score:self.data.mainData.price},
        data:{
        	passage1:self.data.mainData.sku[0].id
        },
        type:1
      };
      const callback = (res)=>{
        if(res&&res.solely_code==100000){
        	self.data.order_id = res.info.id;
        	if(self.data.mainData.title=='即时中奖'){
				setTimeout(function(){
		          api.pathTo('/pages/rewardEnd/rewardEnd?id='+self.data.mainData.sku[0].id+'&&order_id='+self.data.order_id,'redi');
		        },800)	        		
        	}else if(self.data.mainData.title=='延时中奖'){
        		setTimeout(function(){
		          api.pathTo('/pages/countDown/countDown?id='+self.data.mainData.sku[0].id+'&&order_id='+self.data.order_id,'redi');
		        },800)
        	}
        };   
      };
      api.addOrder(postData,callback);
    }else{
      api.showToast('您已经参加过活动','none')
    }   
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



  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },


  intoPathRedirect(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'redi');
  }, 


})

  