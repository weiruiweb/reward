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
    mainData:{},
    testData:[],
    loadAllStandard:['getMainData','getArtData'],
    isLoadAll:false,
    newOrderItem:{},
    background: ['/images/banner4.jpg','/images/banner5.jpg','/images/banner6.jpg'],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    circular: true,
    interval: 2000,
    duration: 500,
    previousMargin: 0,
    nextMargin: 0,
    currentId:0,
    swiperIndex:0,

  },
  //事件处理函数
 
  onLoad(options) {

    const self = this;
    wx.showLoading();
    self.getTestData();

  },

  onShow(){
    const self = this;
    wx.removeStorageSync('checkLoadAll');
    wx.removeStorageSync('orderItem');
    self.getArtData();
    self.getMainData();
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
      console.log('getMainDataTest',getApp().globalData.buttonClick)
      if(res.info.data.length>0){
        self.data.mainData = res.info.data[0];
        self.orderItemGet();
      }else{
        self.data.isLoadAll = api.checkLoadAll(self.data.loadAllStandard,'getMainData');
        self.setData({
          web_orderItemNum:-1
        });
      };
    };
    api.productGet(postData,callback);

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
      self.data.isLoadAll = api.checkLoadAll(self.data.loadAllStandard,'getArtData');
      self.setData({
        web_artData:self.data.artData,
      });  
    };
    api.articleGet(postData,callback);
  },

  formSubmit(e){

    const self = this;
    if(e.detail.formId){

      const postData = {};
      postData.tokenFuncName='getProjectToken';
      postData.data = {
        title:e.detail.formId,
        type:9,
        passage1:(new Date()).getTime()/1000+7*86400
      };
      const callback = (res)=>{
        console.log('messageAdd',res);
      };
      api.messageAdd(postData,callback);

    };
    
  },

  getTestData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      thirdapp_id:getApp().globalData.thirdapp_id
    };
    postData.getBefore = {
      article:{
        tableName:'label',
        searchItem:{
          title:['=',['资讯列表']],
          thirdapp_id:['=',[getApp().globalData.thirdapp_id]],
        },
        middleKey:'menu_id',
        key:'id',
        condition:'in',
      },
    };
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.testData.push.apply(self.data.testData,res.info.data);
      };
      self.setData({
        web_testData:self.data.testData,
      });  
    };
    api.articleGet(postData,callback);
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
          status:1,
        },
        condition:'=',
        info:['passage1','id','passage2']
      },
      reward:{
    		tableName:'Sku',
    		middleKey:['order','passage1'],
    		key:'id',
    		searchItem:{
    			status:1,
    		},
    		condition:'=',
  	  }
  	};
  	const callback = (res)=>{
      console.log(res);
  	  if(res.solely_code==100000){
        if(res.info.data.length>0){
          self.data.orderItemData = res.info.data[0];
          self.data.orderItemData.product = self.data.mainData;
          wx.setStorageSync('orderItem',self.data.orderItemData); 
        }
          self.data.isLoadAll = api.checkLoadAll(self.data.loadAllStandard,'getMainData');
          self.setData({
            web_orderItemNum:res.info.data.length
          })  
  	  };
  	};
  	api.orderItemGet(postData,callback)
  },

  addOrder(){

    const self = this;
    self.data.newOrderItem.product = self.data.mainData;
  	const postData = {
      tokenFuncName:'getProjectToken',
      product:[
        {id:self.data.mainData.id,count:1}
      ],
      pay:{score:self.data.mainData.price},
      data:{
        passage1:self.data.mainData.type
      },
      type:1
  	};
  	postData.data.passage1 = self.rewardChoosed();

    const callback = (res)=>{
      if(res&&res.solely_code==100000){
       	self.data.order_id = res.info.id;
        self.data.newOrderItem.order = {id:res.info.id,passage2:'',passage1:self.rewardChoosed()};
        wx.setStorageSync('orderItem',self.data.newOrderItem);
       	self.finalRedirect();
      };
    };
    api.addOrder(postData,callback);

  },

  finalRedirect(){

    if(wx.getStorageSync('orderItem')){
      var orderItem = wx.getStorageSync('orderItem');
      wx.hideLoading();
      self.setData({
        web_buttonClick:false
      });
      if(orderItem.product.type==1||(orderItem.product.type==2&&Date.parse(new Date())>orderItem.product.open_time)){
        api.pathTo('/pages/rewardEnd/rewardEnd','nav');
      }else if(orderItem.product.type==2&&Date.parse(new Date())<orderItem.product.open_time){
        api.pathTo('/pages/countDown/countDown','nav');
      };
    }else{
      wx.hideLoading();
      self.setData({
        web_buttonClick:false
      });
      api.showToast('请抽奖','error');
    };
    
  },


  submit(){

  	const self = this;
    
    if(!self.data.isLoadAll||JSON.stringify(self.data.mainData)=='{}') return;
    if(self.data.orderItemData){
      api.showToast('您已参加过抽奖','error');
      return;
    };
    wx.showLoading();
    if(wx.getStorageSync('orderItem')){
      self.finalRedirect();
      return;
    }else{
      self.setData({
        web_buttonClick:true
      });
      const callback = (user,res) =>{
        self.addOrder();
      };
      api.getAuthSetting(callback); 
    };

  },


  rewardChoosed(){

  	const self = this;
  	var rewardNum = Math.ceil(Math.random()*self.data.mainData.passage1);  
  	var start = 0;
  	var id = 0;
  	var total = 0;
  	for (var i = 0; i < self.data.mainData.sku.length; i++) {
      if(self.data.mainData.sku[i].ratio>0){
        start = self.data.mainData.sku[i].ratio+start;
        total += self.data.mainData.sku[i].stock;

        if(rewardNum<start){
          if(self.data.mainData.sku[i].stock>0){
            id = self.data.mainData.sku[i].id;
            self.data.newOrderItem.reward = [];
            self.data.newOrderItem.reward.push(self.data.mainData.sku[i])
          }else{

            id = -1;
          };
        }
      };
  	};
  	if(total==self.data.mainData.passage1&&id==-1){
  		for (var i = 0; i < self.data.mainData.sku.length; i++) {
  			if(self.data.mainData.sku[i].stock>0){
          console.log(id)
  				id = self.data.mainData.sku[i].id;
           self.data.newOrderItem.reward = [];
          self.data.newOrderItem.reward.push(self.data.mainData.sku[i])
  			};
	  	};
  	}else if(id==-1){
  		id = 0;
      self.data.newOrderItem.reward = []
  	};
  	return id;
    
  },  

  swiperChange(e) {
    const that = this;
    that.setData({
      swiperIndex: e.detail.current,
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

  