/**
 * Created by createc on 2017/8/10.
 */
var swiperV = new Swiper('.swiper-container-v', {
    pagination: '.swiper-pagination-v',
    noSwipingClass : 'stop-swiping',
    paginationClickable: true,
});

$(window).ready(function() {
    $('#page').turn({
        display: 'single',
        acceleration: true,
        gradients: !$.isTouch,
        elevation:50,
        when: {
            turned: function(e, page) {
                /*console.log('Current view: ', $(this).turn('view'));*/
            }
        }
    });
});
//微信禁止下拉显示

var eventlistener_handler = function(e){
    e.preventDefault();     // 阻止浏览器默认动作(网页滚动)
};

var touchInit = function(){
    document.body.addEventListener("touchmove",eventlistener_handler, false);
};
touchInit();

var pageNext = function () {
    $('#page').turn('next');
    getIntegral(apiUrl,'11021','打开活动链接获取积分',1);
}

//获取url参数
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if ( r != null ){
        return decodeURI(r[2]);
    }else{
        return null;
    }
}

//提示阅读加积分
function integralAdd() {
    var M = {}
    // 判断是否已存在，如果已存在则直接显示
    if(M.dialog2){
        return M.dialog2.show();
    }
    M.dialog2 = jqueryAlert({
        'content' : '阅读可获得20积分！',
        'modal'   : true,
        'buttons' :{
            '确定' : function(){
                M.dialog2.close();
            }
        }
    })
}
integralAdd();

function CurentTime() {
    var now = new Date();
    var year = now.getFullYear();       //年
    var month = now.getMonth() + 1;     //月
    var day = now.getDate();            //日
    var hh = now.getHours();            //时
    var mm = now.getMinutes();          //分
    var ss = now.getSeconds();           //秒
    var clock = year + "-";
    if(month < 10)
        clock += "0";
    clock += month + "-";
    if(day < 10)
        clock += "0";
    clock += day + " ";
    if(hh < 10)
        clock += "0";
    clock += hh + ":";
    if (mm < 10) clock += '0';
    clock += mm + ":";
    if (ss < 10) clock += '0';
    clock += ss;
    return(clock);
}


//获取sign,参数对象,密匙
function signKey(obj,key) {
    var keys = Object.keys(obj);
    var newKeys = keys.sort();
    var newObjectArray = [];
    for(x in newKeys){
        var attr = newKeys[x];
        console.log(attr);
        if(obj[attr] === '' || obj[attr] === null || obj[attr] === undefined || obj[attr] === 'sign'){
            continue;
        }
        var val = attr + '=' +obj[attr];
        newObjectArray.push(val);
    }
    var str = newObjectArray.join('&');
    str += key;
    str = md5(str).toUpperCase();
    return str;
}

var myDate = new Date();

var memberFlag = false;
function member() {
    var obj = {};
    obj.openid = getQueryString('openid');
    // obj.member_uni_id = 'o3o4zxPMqVE6v1U-ewf5S2Y22eYI';
    obj.timestamp = myDate.getTime();
    obj.appid = getQueryString('appId');
    obj.state = 'wx';
    obj.sign = signKey(obj,'2AF0D0FD2B0640A3849684AB544265B9');
    $.ajax({
        url: 'http://nivea.sweetmartmarketing.com/crmSrv/member/checkMemberInfoByWMC.do',
        type: 'POST',
        data: obj,
//        dataType: "json",
        success: function (data) {
            var D = JSON.parse(data);
            if(D['status'] == '2'){
                memberFlag = true;
            }
            if(D['status'] == '1'){
                memberFlag = false;
            }
        }
    })
}

member()//查询是否是会员


//获取积分参数
function getIntegral(url,num,rem,flag) {
    var obj = {};
    obj.member_uni_id = getQueryString('openid');
    // obj.member_uni_id = 'o3o4zxPMqVE6v1U-eazXn5S2YeYI';
    obj.timestamp = myDate.getTime();
    obj.transaction_type_id = num;
    obj.transaction_time = CurentTime();
    obj.channel = '2';
    obj.remark = rem;
    obj.sign = signKey(obj,'2AF0D0FD2B0640A3849684AB544265B9');
    $.ajax({
        url:url,
        type:'POST',
        data:obj,
//        dataType: "json",
        success:function(data){
            var M = {};
            if(M.dialog3){
                return M.dialog1.show();
            }

            var D = JSON.parse(data);
            if(memberFlag){
                var jsonAlert= {
                    'content' : '',
                    'modal'   : true,
                    'buttons' :{
                        '确定' : function(){
                            M.dialog3.close();
                        },
                        '会员中心' : function(){
                            window.location.href='https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx36310fe660ca89bd&redirect_uri=http%3A%2F%2Fnivea.sweetmartmarketing.com%2FcrmSrv%2Fwx%2FzexWxNvy%3fappid%3dwx36310fe660ca89bd&response_type=code&scope=snsapi_userinfo&state=wx&component_appid=wx757dd6d09794aee2#wechat_redirect';
                        }
                    }
                }
            }else{
                var jsonAlert= {
                    'content' : '',
                    'modal'   : true,
                    'buttons' :{
                        '确定' : function(){
                            M.dialog3.close();
                        },
                        '加入会员' : function(){
                            window.location.href='https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx36310fe660ca89bd&redirect_uri=http%3A%2F%2Fnivea.sweetmartmarketing.com%2FcrmSrv%2Fwx%2FzexWxNvy%3fappid%3dwx36310fe660ca89bd&response_type=code&scope=snsapi_userinfo&state=wx&component_appid=wx757dd6d09794aee2#wechat_redirect';
                        }
                    }
                }
            }
            if(D['code'] == '40027'){
                if(flag == 1){
                    jsonAlert.content = '您已获得积分，不再增加！';
                    M.dialog3 = jqueryAlert(jsonAlert);
                }
                if(flag == 2){
                    jsonAlert.content = '您已获得分享积分，每日限1次！';
                    M.dialog3 = jqueryAlert(jsonAlert);
                }
            }
            //区别是否是会员的文案
            function content() {
                if(memberFlag){
                    if(flag == 1){
                        jsonAlert.content = '获得20积分，点击查看！';
                        M.dialog3 = jqueryAlert(jsonAlert);
                    }
                    if(flag == 2){
                        jsonAlert.content = '分享获得积分30积分，点击查看！';
                        M.dialog3 = jqueryAlert(jsonAlert);
                    }
                }else{
                    if(flag == 1){
                        jsonAlert.content = '获得20积分，加入会员查看！';
                        M.dialog3 = jqueryAlert(jsonAlert);
                    }
                    if(flag == 2){
                        jsonAlert.content = '分享获得积分30积分，加入会员查看！';
                        M.dialog3 = jqueryAlert(jsonAlert);
                    }
                }
            }
            if(D['code'] == '40029'){
                content();
            }
            if(D['code'] == '200'){
                content();
            }
        }
    })
}

var apiUrl = 'http://nivea.sweetmartmarketing.com/crmSrv/transaction/saveTransactionOnline.do';



//微信api操作
var url = window.location.href;
var appid;
var timestamp;
var nonceStr;
var signature;
$.ajax({
    url:'http://nivea.watchinga.net/api/jsconfigure',
    type:'POST',
    async: false,
    data:{url:url},
    dataType: "json",
    success:function(data){
        appid = data['appId'];
        timestamp = data['timestamp'];
        nonceStr = data['nonceStr'];
        signature = data['signature'];
    }
})

wx.config({
    debug: false,
    appId: appid,
    timestamp: timestamp,
    nonceStr: nonceStr,
    signature: signature,
    jsApiList: [
        // 所有要调用的 API 都要加到这个列表中,,,,,
        "onMenuShareTimeline",
        "onMenuShareAppMessage",
        "checkJsApi",
        "chooseImage",
        "uploadImage",
    ]
});
wx.ready(function () {
    wx.onMenuShareTimeline({
        title: 'nieva', // 分享标题
        link: "http://nivea.watchinga.net/crm/nieva3cs/index.html", // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: 'http://nivea.watchinga.net/crm/xndrc/img/logo.png', // 分享图标
        success: function () {
            getIntegral(apiUrl,'11022','内容分享获取积分',2);
            _hmt.push(['_trackEvent', '分享', '朋友圈', 'literature']);
        }
    });
    wx.onMenuShareAppMessage({
        title: 'nieva', // 分享标题
        desc: 'nieva', // 分享描述
        link: "http://nivea.watchinga.net/crm/nieva3cs/index.html", // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: 'http://nivea.watchinga.net/crm/xndrc/img/logo.png', // 分享图标
        type: '', // 分享类型,music、video或link，不填默认为link
        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        success: function () {
            getIntegral(apiUrl,'11022','内容分享获取积分',2);
            _hmt.push(['_trackEvent', '分享', '朋友', 'literature']);
        },
        cancel: function () {

        }
    });
})