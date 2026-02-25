// 出错时等待 10
exports.errorSleepTime = 10;
// 重启时间间隔，以小时为单位，0为不重启
exports.restartTime = 0;
exports.submit={

	host:'127.0.0.2',
	host:'127.0.0.2',
	path:'/admin778899.php/data/kj'
}
exports.dbinfo={
	host:'127.0.0.1',
	port:'3306',
	user:'root',
	password:'Aa123456',
	database:'xin1986ly'

}

exports.cp = [
{
        title:'幸运飞艇',
        source:'168',
        name:'xyft',
        enable:true,
        timer:'xyft',
	    option: {
            host: "api.81p.net",
            path: '/api?p=xml&t=xyft&token=411741658A393BF7&limit=5',
            timeout: 5000,
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0)"
            }
		}, 
		parse:function(str){
            try{
                str = str.substr(0, 200);	                                                                      	
                var reg = /<row expect="([\d\-]+?)" opencode="([\d\,]+?)" opentime="([\d\:\- ]+?)"/;                   	
                var m;
                if (m = str.match(reg)) {                                                                         	
                    return {                                                                                  	
                        type: 55,                                                                              	
                        time: m[3],                                                                            	
                        number: m[1],                                                                          
                        data: m[2]                                                                             	
                    };                                                                                        	
                }		
            }catch(err){
                throw('幸运飞艇解析数据不正确');
            }
        }
    },
{
        title:'SG飞艇',
        source:'168',
        name:'jsft',
        enable:true,
        timer:'jsft',
        option:getOption(108),
        parse:function(str){
            try{
                var json={};
                if (json = JSON.parse(str)) {
                    return getData(108, json);
                }
            }catch(err){
                throw('168SG飞艇解析数据不正确');
            }
        }
    },
/*
{
        title:'秒速赛车',
        source:'168',
        name:'mspk10',
        enable:true,
        timer:'mspk10',
        option:getOption(72),
        parse:function(str){
            try{
                var json={};
                if (json = JSON.parse(str)) {
                    return getData(72, json);
                }
            }catch(err){
                throw('秒速赛车解析数据不正确');
            }
        }
    },
	*/
/*官方彩*/	
{
        title:'新疆时时彩',
        source:'168',
        name:'xjssc',
        enable:true,
        timer:'ssc-xj',
        option:getOption(120),
        parse:function(str){
            try{
                var json={};
                if (json = JSON.parse(str)) {
                    return getData(120, json);
                }
            }catch(err){
                throw('新疆时时彩解析数据不正确');
            }
        }
    },
	{
        title:'重庆时时彩',
        source:'168',
        name:'cqssc',
        enable:true,
        timer:'ssc-cq',
        option:getOption(1),
        parse:function(str){
            try{
                var json={};
                if (json = JSON.parse(str)) {
                    return getData(1, json);
                }
            }catch(err){
                throw('重庆时时彩解析数据不正确');
            }
        }
    },
{
        title:'重庆七星彩',
        source:'168',
        name:'cqqxc',
        enable:true,
        timer:'qxc-cq',
        option:getOption(82),
        parse:function(str){
            try{
                var json={};
                if (json = JSON.parse(str)) {
                    return getData(82, json);
                }
            }catch(err){
                throw('重庆七星彩解析数据不正确');
            }
        }
    },	
{
        title:'天津时时彩',
        source:'168',
        name:'tjssc',
        enable:true,
        timer:'tjssc',
        option:getOption(119),
        parse:function(str){
            try{
                var json={};
                if (json = JSON.parse(str)) {
                    return getData(119, json);
                }
            }catch(err){
                throw('天津时时彩解析数据不正确');
            }
        }
    },
	{
		title:'广东快乐十分',
        source:'168',
        name:'gdklsf',
        enable:true,
        timer:'gdklsf',
        option:getOption(60),
        parse:function(str){
            try{
                var json={};
                if (json = JSON.parse(str)) {
                    return getData(60, json);
                }
            }catch(err){
                throw('广东快乐十分解析数据不正确');
            }
        }
    },


	
    {
        title:'重庆幸运农场',
        source:'168',
        name:'klsf',
        enable:true,
        timer:'klsf',
        option:getOption(61),
        parse:function(str){
            try{
                var json={};
                if (json = JSON.parse(str)) {
                    return getData(61, json);
                }
            }catch(err){
                throw('重庆幸运农场解析数据不正确');
            }
        }
    },
	{
        title:'北京快乐8',
        source:'168',
        name:'bjk8',
        enable:true,
        timer:'bjk8',

        option:{
            host:"www.opa444.cn",
            timeout:5000,
            path: '/xml/kl8.php',
            headers:{
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0)"
            }
        },
        parse:function(str){
            try{                                                                                              	//
                str=str.substr(0,200);	                                                                      	//
                var reg=/<row expect="([\d\-]+?)" opencode="([\d\,]+?)" opentime="([\d\:\- ]+?)"/;                	//
                var m;                                                                                        	//
                if(m=str.match(reg)){                                                                         	//
                    return {                                                                                  	//
                        type:65,                                                                              	//
                        time:m[3],                                                                            	//
                        number:m[1],                                                                          	//
                        data:m[2]                                                                             	//
                    };                                                                                        	//
                }					                                                                          	//
            }catch(err){                                                                                      	//
                throw('北京快乐8 解析数据不正确');                                                            	//
            }
        }
    }, 
    {

        title:'PC蛋蛋',
        source:'168',
        name:'pcdd',
        enable:true,
        timer:'pcdd',
        option:getOption(66),
        parse:function(str){
            try{
                var json={};
                if (json = JSON.parse(str)) {
                    return getData(66, json);
                }
            }catch(err){
                throw('PC蛋蛋解析数据不正确');
            }
        }
    },
	{
        title:'北京赛车(PK10)',
        source:'168',
        name:'bjpk10',
        enable:true,
        timer:'bjpk10',
        option:getOption(50),
        parse:function(str){
            try{
                var json={};
                if (json = JSON.parse(str)) {
                    return getData(50, json);
                }
            }catch(err){
                throw('北京赛车(PK10)解析数据不正确');
            }
        }
    },
/*11选5*/
{
        title: '巴西11*5 ',
        source: 'BOT',
        name: 'bx11x5',
        enable: true,
        timer: 'bx11x5',
        option: {
            host: "www.opa444.cn",
            path: '/sylot/bx11x5',
            timeout: 5000,
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0)"
            }
        },

        parse: function (str) {
            try {                                                                                              
                str = str.substr(0, 200);	                                                                      	
                var reg = /<row expect="([\d\-]+?)" opencode="([\d\,]+?)" opentime="([\d\:\- ]+?)"/;                   	
                var m;
                if (m = str.match(reg)) {                                                                         	
                    return {                                                                                  	
                        type: 106,                                                                              	
                        time: m[3],                                                                            	
                        number: m[1],                                                                          
                        data: m[2]                                                                             	
                    };                                                                                        	
                }					                                                                          	
            } catch (err) {                                                                                      	
               throw( '巴西11*5解析数据不正确');                                                            	
            }
        }
    },
	
{
        title:'广东11选5',
        source:'168',
        name:'gd11x5',
        enable:true,
        timer:'gd11x5',
        option:getOption(21),
        parse:function(str){
            try{
                var json={};
                if (json = JSON.parse(str)) {
                    return getData(21, json);
                }
            }catch(err){
                throw('广东11选5解析数据不正确');
            }
        }
	},
		 
	{
        title:'上海11选5',
        source:'168',
        name:'sh11x5',
        enable:true,
        timer:'sh11x5',
        option:getOption(117),
        parse:function(str){
            try{
                var json={};
                if (json = JSON.parse(str)) {
                    return getData(117, json);
                }
            }catch(err){
                throw('上海11选5解析数据不正确');
            }
        }
    },
	{
        title:'安徽11选5',
        source:'168',
        name:'ah11x5',
        enable:true,
        timer:'ah11x5',
        option:getOption(118),
        parse:function(str){
            try{
                var json={};
                if (json = JSON.parse(str)) {
                    return getData(118, json);
                }
            }catch(err){
                throw('安徽11选5解析数据不正确');
            }
        }
    },
	
/*快3*/
{
        title: '东京快三',
        source: 'BOT',
        name: 'djk3',
        enable: true,
        timer: 'djk3',
        option: {
            host: "www.opa444.cn",
            timeout: 50000,
            path: '/sylot/djk3',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0)"
            }
        },

        parse: function (str) {
            try {                                                                                              	//
                str = str.substr(0, 200);	                                                                      	//
                var reg = /<row expect="([\d\-]+?)" opencode="([\d\,]+?)" opentime="([\d\:\- ]+?)"/;                    	//
                var m;                                                                                        	//
                if (m = str.match(reg)) {                                                                         	//
                    return {                                                                                  	//
                        type: 105,                                                                              	//
                        time: m[3],                                                                            	//
                        number: m[1],                                                                          	//
                        data: m[2]                                                                             	//
                    };                                                                                        	//
                }					                                                                          	//
            } catch (err) {                                                                                      	//
               throw('东京快三 解析数据不正确');                                                            	//
            }
        }
    },
	{
        title:'江苏快3',
        source:'168',
        name:'jsk3',
        enable:true,
        timer:'jsk3',
        option:getOption(10),
        parse:function(str){
            try{
                var json={};
                if (json = JSON.parse(str)) {
                    return getData(10, json);
                }
            }catch(err){
                throw('江苏快3解析数据不正确');
            }
        }
    },
	{
        title:'广西快3',
        source:'168',
        name:'gxk3',
        enable:true,
        timer:'gxk3',
        option:getOption(114),
        parse:function(str){
            try{
                var json={};
                if (json = JSON.parse(str)) {
                    return getData(114, json);
                }
            }catch(err){
                throw('广西快3解析数据不正确');
            }
        }
    },
 	{
        title:'湖北快三',
        source:'168',
        name:'ahk3',
        enable:true,
        timer:'ahk3',
        option:getOption(115),
        parse:function(str){
            try{
                var json={};
                if (json = JSON.parse(str)) {
                    return getData(115, json);
                }
            }catch(err){
                throw('湖北快三解析数据不正确');
            }
        }
    }, 
{
        title:'吉林快3',
        source:'168',
        name:'jlk3',
        enable:true,
        timer:'jlk3',
        option:getOption(116),
        parse:function(str){
            try{
                var json={};
                if (json = JSON.parse(str)) {
                    return getData(116, json);
                }
            }catch(err){
                throw('吉林快三解析数据不正确');
            }
        }
    },
	
/*系统彩*/	
{
        title: '腾讯分分彩',
        source: 'BOT',
        name: 'txffc',
        enable: true,
        timer: 'txffc',
        option: {
            host: "www.opa444.cn",
           path: '/sylot/txffc',
			
            timeout: 5000,
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0)"
            }
        },

        parse: function (str) {
            try {                                                                                              
                str = str.substr(0, 200);	                                                                      	
                var reg = /<row expect="([\d\-]+?)" opencode="([\d\,]+?)" opentime="([\d\:\- ]+?)"/;                   	
                var m;
                if (m = str.match(reg)) {                                                                         	
                    return {                                                                                  	
                        type: 81,                                                                              	
                        time: m[3],                                                                            	
                        number: m[1],                                                                          
                        data: m[2]                                                                             	
                    };                                                                                        	
                }					                                                                          	
            } catch (err) {                                                                                      	
                throw('腾讯分分彩 解析数据不正确');                                                            	
            }
        }
    },
{
        title: '秒速赛车',
        source: 'BOT',
        name: 'mspk10',
        enable: true,
        timer: 'mspk10',
        option: {
            host: "www.opa444.cn",
            path: '/sylot/msPK10',
            timeout: 5000,
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0)"
            }
        },

        parse: function (str) {
            try {                                                                                              
                str = str.substr(0, 200);	                                                                      	
                var reg = /<row expect="([\d\-]+?)" opencode="([\d\,]+?)" opentime="([\d\:\- ]+?)"/;                   	
                var m;
                if (m = str.match(reg)) {                                                                         	
                    return {                                                                                  	
                        type: 72,                                                                              	
                        time: m[3],                                                                            	
                        number: m[1],                                                                          
                        data: m[2]                                                                             	
                    };                                                                                        	
                }					                                                                          	
            } catch (err) {                                                                                      	
                throw('秒速赛车 解析数据不正确');                                                            	
            }
        }
    },
{
        title: '澳洲幸运10',
        source: 'BOT',
        name: 'xtpk10',
        enable: true,
        timer: 'xtpk10',
        option: {
            host: "www.opa444.cn",
            path: '/sylot/lcpk10',
            timeout: 5000,
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0)"
            }
        },

        parse: function (str) {
            try {                                                                                              
                str = str.substr(0, 200);	                                                                      	
                var reg = /<row expect="([\d\-]+?)" opencode="([\d\,]+?)" opentime="([\d\:\- ]+?)"/;                   	
                var m;
                if (m = str.match(reg)) {                                                                         	
                    return {                                                                                  	
                        type: 51,                                                                              	
                        time: m[3],                                                                            	
                        number: m[1],                                                                          
                        data: m[2]                                                                             	
                    };                                                                                        	
                }					                                                                          	
            } catch (err) {                                                                                      	
                throw('澳洲幸运10 解析数据不正确');                                                            	
            }
        }
    },

{
        title: '秒速飞艇',
        source: 'BOT',
        name: 'msft',
        enable: true,
        timer: 'msft',
        option: {
            host: "www.opa444.cn",
            path: '/sylot/msft',
            timeout: 5000,
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0)"
            }
        },

        parse: function (str) {
            try {                                                                                              
                str = str.substr(0, 200);	                                                                      	
                var reg = /<row expect="([\d\-]+?)" opencode="([\d\,]+?)" opentime="([\d\:\- ]+?)"/;                   	
                var m;
                if (m = str.match(reg)) {                                                                         	
                    return {                                                                                  	
                        type: 52,                                                                              	
                        time: m[3],                                                                            	
                        number: m[1],                                                                          
                        data: m[2]                                                                             	
                    };                                                                                        	
                }					                                                                          	
            } catch (err) {                                                                                      	
                throw('秒速飞艇 解析数据不正确');                                                            	
            }
        }
    },	
{
        title: '秒速时时彩',
        source: 'BOT',
        name: 'msssc',
        enable: true,
        timer: 'msssc',
        option: {
            host: "www.opa444.cn",
            path: '/sylot/msssc',
            timeout: 5000,
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0)"
            }
        },

        parse: function (str) {
            try {                                                                                              
                str = str.substr(0, 200);	                                                                      	
                var reg = /<row expect="([\d\-]+?)" opencode="([\d\,]+?)" opentime="([\d\:\- ]+?)"/;                   	
                var m;
                if (m = str.match(reg)) {                                                                         	
                    return {                                                                                  	
                        type: 73,                                                                              	
                        time: m[3],                                                                            	
                        number: m[1],                                                                          
                        data: m[2]                                                                             	
                    };                                                                                        	
                }					                                                                          	
            } catch (err) {                                                                                      	
                throw('秒速时时彩 解析数据不正确');                                                            	
            }
        }
    },
{
        title: '极速分分彩',
        source: 'BOT',
        name: 'jsffc',
        enable: true,
        timer: 'jsffc',
        option: {
            host: "www.opa444.cn",
            path: '/sylot/jsffc',
            timeout: 5000,
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0)"
            }
        },

        parse: function (str) {
            try {                                                                                              
                str = str.substr(0, 200);	                                                                      	
                var reg = /<row expect="([\d\-]+?)" opencode="([\d\,]+?)" opentime="([\d\:\- ]+?)"/;                   	
                var m;
                if (m = str.match(reg)) {                                                                         	
                    return {                                                                                  	
                        type: 100,                                                                              	
                        time: m[3],                                                                            	
                        number: m[1],                                                                          
                        data: m[2]                                                                             	
                    };                                                                                        	
                }					                                                                          	
            } catch (err) {                                                                                      	
                throw('极速分分彩 解析数据不正确');                                                            	
            }
        }
    },
{
        title: '极速1.5分彩',
        source: 'BOT',
        name: 'rs15',
        enable: true,
        timer: 'rs15',
        option: {
            host: "www.opa444.cn",
            path: '/sylot/rs15',
            timeout: 5000,
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0)"
            }
        },

        parse: function (str) {
            try {                                                                                              
                str = str.substr(0, 200);	                                                                      	
                var reg = /<row expect="([\d\-]+?)" opencode="([\d\,]+?)" opentime="([\d\:\- ]+?)"/;                   	
                var m;
                if (m = str.match(reg)) {                                                                         	
                    return {                                                                                  	
                        type: 101,                                                                              	
                        time: m[3],                                                                            	
                        number: m[1],                                                                          
                        data: m[2]                                                                             	
                    };                                                                                        	
                }					                                                                          	
            } catch (err) {                                                                                      	
               throw('极速1.5分彩 解析数据不正确');                                                            	
            }
        }
    },	
    	{
        title: '丹麦3分彩',
        source: 'BOT',
        name: 'dm3fc',
        enable: true,
        timer: 'dm3fc',
        option: {
            host: "www.opa444.cn",
            path: '/sylot/dm3fc',
            timeout: 5000,
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0)"
            }
        },

        parse: function (str) {
            try {                                                                                              
                str = str.substr(0, 200);	                                                                      	
                var reg = /<row expect="([\d\-]+?)" opencode="([\d\,]+?)" opentime="([\d\:\- ]+?)"/;                   	
                var m;
                if (m = str.match(reg)) {                                                                         	
                    return {                                                                                  	
                        type: 102,                                                                              	
                        time: m[3],                                                                            	
                        number: m[1],                                                                          
                        data: m[2]                                                                             	
                    };                                                                                        	
                }					                                                                          	
            } catch (err) {                                                                                      	
               throw('丹麦3分彩 解析数据不正确');                                                            	
            }
        }
    },
	   {
        title: '重庆时时彩时',
        source: '168',
        name: 'cqssc',
        enable: true,
        timer: 'cqssc',
        option: {
            host: "qt.wqwwv.cn",
            path: '/cq.php',
            timeout: 5000,
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0)"
            }
        },

        parse: function (str) {
            try {                                                                                              
                str = str.substr(0, 200);	                                                                      	
                var reg = /<row expect="([\d\-]+?)" opencode="([\d\,]+?)" opentime="([\d\:\- ]+?)"/;                   	
                var m;
                if (m = str.match(reg)) {                                                                         	
                    return {                                                                                  	
                        type: 1,                                                                              	
                        time: m[3],                                                                            	
                        number: m[1],                                                                          
                        data: m[2]                                                                             	
                    };                                                                                        	
                }					                                                                          	
            } catch (err) {                                                                                      	
               throw('丹麦3分彩 解析数据不正确');                                                            	
            }
        }
    },
	{
        title: '澳洲幸运5',
        source: 'BOT',
        name: 'kl5fc',
        enable: true,
        timer: 'kl5fc',
        option: {
            host: "www.opa444.cn",
            path: '/sylot/kl5fc',
            timeout: 5000,
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0)"
            }
        },

        parse: function (str) {
            try {                                                                                              
                str = str.substr(0, 200);	                                                                      	
                var reg = /<row expect="([\d\-]+?)" opencode="([\d\,]+?)" opentime="([\d\:\- ]+?)"/;                   	
                var m;
                if (m = str.match(reg)) {                                                                         	
                    return {                                                                                  	
                        type: 103,                                                                              	
                        time: m[3],                                                                            	
                        number: m[1],                                                                          
                        data: m[2]                                                                             	
                    };                                                                                        	
                }					                                                                          	
            } catch (err) {                                                                                      	
               throw('澳洲幸运5  解析数据不正确');                                                            	
            }
        }
    },	
	
	{
        title: '澳门时时彩 ',
        source: 'BOT',
        name: 'amssc',
        enable: true,
        timer: 'amssc',
        option: {
            host: "www.opa444.cn",
            path: '/sylot/kl5fc',
            timeout: 5000,
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0)"
            }
        },

        parse: function (str) {
            try {                                                                                              
                str = str.substr(0, 200);	                                                                      	
                var reg = /<row expect="([\d\-]+?)" opencode="([\d\,]+?)" opentime="([\d\:\- ]+?)"/;                   	
                var m;
                if (m = str.match(reg)) {                                                                         	
                    return {                                                                                  	
                        type: 122,                                                                              	
                        time: m[3],                                                                            	
                        number: m[1],                                                                          
                        data: m[2]                                                                             	
                    };                                                                                        	
                }					                                                                          	
            } catch (err) {                                                                                      	
               throw('澳门时时彩 解析数据不正确');                                                            	
            }
        }
    },
	{
        title: '澳洲幸运20 ',
        source: 'BOT',
        name: 'hnkl8',
        enable: true,
        timer: 'hnkl8',
        option: {
            host: "www.opa444.cn",
            path: '/sylot/hnkl8',
            timeout: 5000,
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0)"
            }
        },

        parse: function (str) {
            try {                                                                                              
                str = str.substr(0, 200);	                                                                      	
                var reg = /<row expect="([\d\-]+?)" opencode="([\d\,]+?)" opentime="([\d\:\- ]+?)"/;                   	
                var m;
                if (m = str.match(reg)) {                                                                         	
                    return {                                                                                  	
                        type: 110,                                                                              	
                        time: m[3],                                                                            	
                        number: m[1],                                                                          
                        data: m[2]                                                                             	
                    };                                                                                        	
                }					                                                                          	
            } catch (err) {                                                                                      	
               throw( '澳洲幸运20解析数据不正确');                                                            	
            }
        }
    },
	
	{
        title: '台湾宾果 ',
        source: 'BOT',
        name: 'twbg',
        enable: true,
        timer: 'twbg',
        option: {
            host: "www.opa444.cn",
            path: '/sylot/twbg',
            timeout: 5000,
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0)"
            }
        },

        parse: function (str) {
            try {                                                                                              
                str = str.substr(0, 200);	                                                                      	
                var reg = /<row expect="([\d\-]+?)" opencode="([\d\,]+?)" opentime="([\d\:\- ]+?)"/;                   	
                var m;
                if (m = str.match(reg)) {                                                                         	
                    return {                                                                                  	
                        type: 111,                                                                              	
                        time: m[3],                                                                            	
                        number: m[1],                                                                          
                        data: m[2]                                                                             	
                    };                                                                                        	
                }					                                                                          	
            } catch (err) {                                                                                      	
               throw( '台湾宾果解析数据不正确');                                                            	
            }
        }
    },
	{
        title: '泰国28 ',
        source: 'BOT',
        name: 'tg28',
        enable: true,
        timer: 'tg28',
        option: {
            host: "www.opa444.cn",
            path: '/sylot/tg28',
            timeout: 5000,
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0)"
            }
        },

        parse: function (str) {
            try {                                                                                              
                str = str.substr(0, 200);	                                                                      	
                var reg = /<row expect="([\d\-]+?)" opencode="([\d\,]+?)" opentime="([\d\:\- ]+?)"/;                   	
                var m;
                if (m = str.match(reg)) {                                                                         	
                    return {                                                                                  	
                        type: 112,                                                                              	
                        time: m[3],                                                                            	
                        number: m[1],                                                                          
                        data: m[2]                                                                             	
                    };                                                                                        	
                }					                                                                          	
            } catch (err) {                                                                                      	
               throw( '泰国28解析数据不正确');                                                            	
            }
        }
    },
	{
        title: '越南农场 ',
        source: 'BOT',
        name: 'ynxync',
        enable: true,
        timer: 'ynxync',
        option: {
            host: "www.opa444.cn",
            path: '/sylot/ynxync',
            timeout: 5000,
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0)"
            }
        },

        parse: function (str) {
            try {                                                                                              
                str = str.substr(0, 200);	                                                                      	
                var reg = /<row expect="([\d\-]+?)" opencode="([\d\,]+?)" opentime="([\d\:\- ]+?)"/;                   	
                var m;
                if (m = str.match(reg)) {                                                                         	
                    return {                                                                                  	
                        type: 107,                                                                              	
                        time: m[3],                                                                            	
                        number: m[1],                                                                          
                        data: m[2]                                                                             	
                    };                                                                                        	
                }					                                                                          	
            } catch (err) {                                                                                      	
               throw( '越南农场解析数据不正确');                                                            	
            }
        }
    },
	{
        title: '3分六合彩',
        source: 'BOT',
        name: 'jslhc',
        enable: true,
        timer: 'jslhc',
        option: {
            host: "www.opa444.cn",
            timeout: 50000,
            path: '/sylot/lhc',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0)"
            }
        },

        parse: function (str) {
            try {                                                                                              
                str = str.substr(0, 200);	                                                                      	
                var reg = /<row expect="([\d\-]+?)" opencode="([\d\,]+?)" opentime="([\d\:\- ]+?)"/;                    	
                var m;                                                                                        	
                if (m = str.match(reg)) {                                                                         
                    return {                                                                                
                        type: 113,                                                                              
                        time: m[3],                                                                           
                        number: m[1],                                                                         
                        data: m[2]                                                                             
                    };                                                                                        	
                }					                                                                          
            } catch (err) {                                                                                      
               throw('3分六合彩 解析数据不正确');                                                         
            }
        }
    },
{
        title: '永信赛车',
        source: 'BOT',
        name: 'ldpk10',
        enable: true,
        timer: 'ldpk10',
        option: {
            timeout: 5000,
            host: "www.opa444.cn",
            path: '/sylot/ldpk10',
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0)"
            }
        },

        parse: function (str) {
            try {                                                                                              	//
                str = str.substr(0, 200);	                                                                      	//
                var reg = /<row expect="([\d\-]+?)" opencode="([\d\,]+?)" opentime="([\d\:\- ]+?)"/;                	//
                var m;                                                                                        	//
                if (m = str.match(reg)) {                                                                         	//
                    return {                                                                                  	//
                        type: 104,                                                                              	//
                        time: m[3],                                                                            	//
                        number: m[1],                                                                          	//
                        data: m[2]                                                                             	//
                    };                                                                                        	//
                }					                                                                          	//
            } catch (err) {                                                                                      	//
                throw('永信赛车解析数据不正确');                                                            	//
            }
        }
    },
];

global.log = function (log) {
    var date = new Date();
    console.log('[' + date.toLocaleDateString() + ' ' + date.toLocaleTimeString() + '] ' + log)
}
function getOption(type) {
	var host = "api.api68.com";
    var uri = "";
    switch (type) {
		case 1:
            uri = "/CQShiCai/getBaseCQShiCai.do?lotCode=10060";
            break;
		case 55:
            uri = "/pks/getLotteryPksInfo.do?lotCode=10057";
            break;	
		case 108:
            uri = "/pks/getLotteryPksInfo.do?lotCode=10058";
            break;
		case 82:
            uri = "/CQShiCai/getBaseCQShiCai.do?lotCode=10050";
            break;	
		case 50:
            uri = "/pks/getLotteryPksInfo.do?lotCode=10001";
            break;
		case 58:
            uri = "/pks/getLotteryPksInfo.do?lotCode=10001";
            break;	
		case 59:
            uri = "/pks/getLotteryPksInfo.do?lotCode=10037";
            break;	
		case 72:
            uri = "/pks/getLotteryPksInfo.do?lotCode=10037";
            break;	
        case 120:
            uri = "/CQShiCai/getBaseCQShiCai.do?lotCode=10004";
            break;	
	    case 119:
            uri = "/CQShiCai/getBaseCQShiCai.do?lotCode=10003";
            break;	
		case 116:
            uri = "/lotteryJSFastThree/getBaseJSFastThree.do?lotCode=10027";
            break;	
        case 21:
            uri = "/ElevenFive/getElevenFiveInfo.do?lotCode=10006";
			 break;
		case 117:
            uri = "/ElevenFive/getElevenFiveInfo.do?lotCode=10018";
			 break;
		case 118:
            uri = "/ElevenFive/getElevenFiveInfo.do?lotCode=10017";
			 break;
		case 10:
            uri = "/lotteryJSFastThree/getBaseJSFastThree.do?lotCode=10007";
            break;
		case 114:
            uri = "/lotteryJSFastThree/getBaseJSFastThree.do?lotCode=10026";
            break;
		case 115:
            uri = "/lotteryJSFastThree/getBaseJSFastThree.do?lotCode=10032";
            break;	
		case 116:
            uri = "/lotteryJSFastThree/getBaseJSFastThree.do?lotCode=10027";
            break;	     	
        case 65:
            uri = "/LuckTwenty/getBaseLuckTewnty.do?lotCode=10014";
            break;
        case 66:
            uri = "/LuckTwenty/getPcLucky28.do?&lotCode=";
            break;
		case 60:
            uri = "/klsf/getLotteryInfo.do?lotCode=10005";
            break;
        case 61:
            uri = "/klsf/getLotteryInfo.do?lotCode=10009";
            break;	
        case 70:
            host="1680660.com"
            uri = "/smallSix/findSmallSixInfo.do?lotCode=10048";
            break;
       
    }
    return {
        host: host,
        timeout: 5000,
        path: uri,
        headers: {
            "Content-Type": "application/json;charset=UTF-8",
			"User-Agent": "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; Win64; x64; Trident/4.0)"

        }
    }
}

function getData(type, json) {
    var data = {};
    if (json.errorCode == 0 && json.result.businessCode == 0) {
        data = json.result.data;
        var numbers=data.preDrawIssue.toString();
        if(type==61){
            numbers=numbers.substr(2)
        }
        return {
            type: type,
            time: getNowTime(),
            number: numbers,
            data: data.preDrawCode,
        };
    }
}
function getNowTime() {
    var myDate = new Date();
    var year = myDate.getFullYear();       //年
    var month = myDate.getMonth() + 1;     //月
    var day = myDate.getDate();            //日
    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
    var mytime = year + "-" + month + "-" + day + " " + myDate.toLocaleTimeString();
    return mytime;
}