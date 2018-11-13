import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();


Page({
  data: {
    windowHeight: 654,
    maxtime: "",
    isHiddenLoading: true,
    isHiddenToast: true,
    dataList: {},
    countDownDay: 0,
    countDownHour: 0,
    countDownMinute: 0,
    countDownSecond: 0,
    countDownDayTwo: 0,
    countDownHourTwo: 0,
    countDownMinuteTwo: 0,
    countDownSecondTwo: 0,
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo( {
      url: '../logs/logs'
    })
  },
  onLoad: function() {
    this.setData( {
      windowHeight: wx.getStorageSync( 'windowHeight' )
    });
  },
 
  // 页面渲染完成后 调用
  onReady: function () {
    var totalSecond = 1542169444 - Date.parse(new Date())/1000;
 
    var interval = setInterval(function () {
      // 秒数
      var second = totalSecond;
 
      // 天数位
      var day = Math.floor(second / 3600 / 24);
      var dayStr = day.toString();
      console.log(dayStr)
      var dayStrOne = '';
      var dayStrTwo = '';
      if (dayStr.length == 1){
        dayStr = '0' + dayStr; 
        dayStrOne = dayStr.substr(0,1);
        dayStrTwo = dayStr.substr(0,1,1)
      }
 
      // 小时位
      var hr = Math.floor((second - day * 3600 * 24) / 3600);
      var hrStr = hr.toString();
      var hrStrOne = '';
      var hrStrTwo = '';
      if (hrStr.length == 1){
        hrStr = '0' + hrStr;
        hrStrOne = hrStr.substr(0,1);
        hrStrTwo = hrStr.substr(0,1,1)
      }
 
      // 分钟位
      var min = Math.floor((second - day * 3600 *24 - hr * 3600) / 60);
      var minStr = min.toString();
      var minStrOne = '';
      var minStrTwo = '';
      if (minStr.length == 1){
        minStr = '0' + minStr;
        minStrOne = minStr.substr(0,1);
        minStrTwo = minStr.substr(0,1,1)
      }
 
      // 秒位
      var sec = second - day * 3600 * 24 - hr * 3600 - min*60;
      var secStr = sec.toString();
      var secStrOne = '';
      var secStrTwo = '';
      if (secStr.length == 1){
        secStr = '0' + secStr;
      }
      secStrOne = secStr.substr(0,1);
      secStrTwo = secStr.substr(0,1,1);
      
      this.setData({
        countDownDay: dayStrOne,
        countDownHour: hrStrOne,
        countDownMinute: minStrOne,
        countDownSecond: secStrOne,
        countDownDayTwo: dayStrTwo,
        countDownHourTwo: hrStrTwo,
        countDownMinuteTwo: minStrTwo,
        countDownSecondTwo: secStrTwo,
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
 
  //cell事件处理函数
  // bindCellViewTap: function (e) {
  //   var id = e.currentTarget.dataset.id;
  //   wx.navigateTo({
  //     url: '../babyDetail/babyDetail?id=' + id
  //   });
  // }
  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },
  intoPathRedirect(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'redi');
  }, 
})

  