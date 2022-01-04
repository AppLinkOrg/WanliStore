//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    wx.getSystemInfo({
      success: e => {
       
        this.globalData.StatusBar = e.statusBarHeight;
        this.globalData.model = e.platform;
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
        var ww = e.windowWidth;
        var hh = e.windowHeight;
        this.globalData.ww = ww;
        this.globalData.hh = hh;
      }
    })
  },
  globalData: {
    userInfo: null
  },
})