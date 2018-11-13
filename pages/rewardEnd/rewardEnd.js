import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();


Page({
  data: {
    is_show:false,
  },
  //事件处理函数
 preventTouchMove:function(e) {

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
  onLoad(options) {
    const self = this;
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

  