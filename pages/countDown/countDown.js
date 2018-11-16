import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();


Page({
  data: {

    maxtime: "",
    isHiddenLoading: true,
    isHiddenToast: true,
    dataList: {},
    countDownDay: 0,
    countDownHour: 0,
    countDownMinute: 0,
    countDownSecond: 0,
   
  },
  //事件处理函数
  onLoad: function() {
  	const self = this;
  	self.getMainData()
  },
 
  // 页面渲染完成后 调用
  onReady: function () {
    var totalSecond = self.data.mainData.end_time/1000 - Date.parse(new Date())/1000;
 
    var interval = setInterval(function () {
      // 秒数
      var second = totalSecond;
 
      // 天数位
      var day = Math.floor(second / 3600 / 24);
      var dayStr = day.toString();
      if (dayStr.length == 1) dayStr = '0' + dayStr;
 
      // 小时位
      var hr = Math.floor((second - day * 3600 * 24) / 3600);
      var hrStr = hr.toString();
      if (hrStr.length == 1) hrStr = '0' + hrStr;
 
      // 分钟位
      var min = Math.floor((second - day * 3600 *24 - hr * 3600) / 60);
      var minStr = min.toString();
      if (minStr.length == 1) minStr = '0' + minStr;
 
      // 秒位
      var sec = second - day * 3600 * 24 - hr * 3600 - min*60;
      var secStr = sec.toString();
      if (secStr.length == 1) secStr = '0' + secStr;
 
      this.setData({
        countDownDay: dayStr,
        countDownHour: hrStr,
        countDownMinute: minStr,
        countDownSecond: secStr,
      });
      totalSecond--;
      if (totalSecond < 0) {
        clearInterval(interval);
        wx.showToast({
          title: '活动已结束',
        });
        this.setData({
          countDownDay: '00',
          countDownHour: '00',
          countDownMinute: '00',
          countDownSecond: '00',
        });
      }
    }.bind(this), 1000);
  },

   getMainData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      thirdapp_id:getApp().globalData.thirdapp_id,
      id: self.data.id   
  	}
    const callback = (res)=>{
	  if(res.info.data.length>0){
	  	self.data.mainData = res.info.data[0]
	  }
      console.log(self.data.mainData)
    };
    api.skuGet(postData,callback);
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

  