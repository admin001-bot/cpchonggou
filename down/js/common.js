//判断系统
            var browser = {
                versions: function() {
                    var u = navigator.userAgent,
                    app = navigator.appVersion;
                    return {
                        android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1,
                        iPhone: u.indexOf('iPhone') > -1 ,                      
                        iPad: u.indexOf('iPad') > -1,
                        iPod: u.indexOf('iPod') > -1,
                       };
                } (),
                language: (navigator.browserLanguage || navigator.language).toLowerCase()
            }

			//显示按扭
            if (browser.versions.iPhone||browser.versions.iPad||browser.versions.iPod)
            {
				document.getElementById('codo').style.display = 'none';
				document.getElementById('android').style.display = 'none';
				document.getElementById('ios').style.display = 'inline-block';
            }
            else if(browser.versions.android)
            {
				document.getElementById('codo').style.display = 'none';
				document.getElementById('ios').style.display = 'none';
				document.getElementById('android').style.display = 'inline-block';
            }
			else
			{
				document.getElementById('android').style.display = 'inline-block';
				document.getElementById('ios').style.display = 'inline-block';
				document.getElementById('codo').style.display = 'block';
				document.getElementById('city_video').innerHTML="<video poster=\"/down/images/city_video.jpg\" autoplay loop><source src=\"/down/images/video.mp4\" type=\"video/mp4\"></video>";
			}

function down(system){
			//判断微信
			var ua = navigator.userAgent.toLowerCase(); 
			if(ua.match(/MicroMessenger/i)=="micromessenger") {
					showCL("wx_wrapper");
			} else {
					closeCL("wx_wrapper");
					
					if(system=="android")
					{
						window.location.href = "https://www.5mku.com/down/app.apk";
					}
					
					//if (system=="ios")
					//{
					//	 window.location.href="itms-services://?action=download-manifest&url=https://www.5mku.com/down/ipad.plist";
					//}
					//else if(system=="android")
					//{
					//	window.location.href = "https://www.5mku.com/down/app.apk";
					//}
			}
}

//弹出层
function showCL(name) {
    document.getElementById(name).style.display = 'block';
}
function closeCL(name) {
    document.getElementById(name).style.display = 'none';
}