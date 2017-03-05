var app = angular.module("myApp",["ionic","myService"]);
app.controller("detCtrl",["$scope","$load","$sce","$ionicScrollDelegate",function($scope,$load,$sce,$ionicScrollDelegate){
	
	//获取的参数信息处理
	var info = location.search.substring(1).split("&");
	$scope.audio = $sce.trustAsResourceUrl(info[1]);
	//获取歌词信息
	$load.getData("http://route.showapi.com/213-2",{
			"showapi_appid": 28412,
			"showapi_sign":"8a9c106876ed447fbdd159836bfdecfc",
			"musicid":info[0]
	},function(data){
		$scope.timeLy = data.lyric;
		parseLyric($scope.timeLy);
	})
	$scope.lyrics = [];
	//歌词解析并截取存储时间戳
	function parseLyric(lrc){
		var lyrics = unescapeHTML(lrc).split("\n");
		var lrcObj = {};var timeList = [];
		for(var i=0;i<lyrics.length;i++){
        		var lyric = lyrics[i];
       		var timeReg = /\[\d*:\d*((\.|\:)\d*)*\]/g;
        		var timeRegExpArr = lyric.match(timeReg);
        		if(lyric.match(/\[ti\:/g)){
        			$scope.songN = lyric.substring(lyric.match(/\[ti\:/)[0].length).replace("]","");
        			if($scope.songN.length>16){
					$("#ti").addClass("scroll-t");
				}
        		}
        		if(lyric.match(/\[ar\:/g)){
        			$scope.singer = lyric.substring(lyric.match(/\[ar\:/)[0].length).replace("]","");
        		}

			if(timeRegExpArr){
        			var lytxt = lyric.substring(timeRegExpArr[0].length);
        			if(!lytxt){continue;}
        			$scope.lyrics.length = timeList.length;
				timeRegExpArr = timeRegExpArr[0].split(":");
				obj = {
	        			min:timeRegExpArr[0].substring(1),
	        			sec:timeRegExpArr[1].substring(0,5)
	        		}
				timeRegExpArr = parseInt(obj.min)*60+parseFloat(obj.sec)-1;
				timeList.push(timeRegExpArr);
				if($scope.lyrics.length != timeList.length){
					$scope.lyrics.push(lytxt);
				}
			}
   		 }
    		return timeList;
	}
	
	function unescapeHTML(lrc){
		var t=document.createElement("div");
		t.innerHTML=lrc+"";
//		console.log(t.innerHTML);
		return t.innerHTML;
	}
	
	//音频变化
	var audio = document.getElementById("audio");
		audio.oncanplay = function(){
			$scope.time ={ 
				ctime:"00:00",
				ttime:""
			};
			//总时长
			$scope.time.ttime = delTime(this.duration);
			$scope.$apply();
		}
		//监听播放状态
		audio.addEventListener("playing",function(){
			$(".p-btn").removeClass("ion-ios-play").addClass("ion-ios-pause");
		})
		audio.addEventListener("pause",function(){
			$(".p-btn").addClass("ion-ios-play").removeClass("ion-ios-pause");
		})
		audio.addEventListener("timeupdate",function(){
			$(".process>span").first().html(delTime(audio.currentTime));
			var scal = -(1-audio.currentTime/audio.duration)*100+"%";
			$(".p-pro").css({"transform":"translateX("+scal+")"});			
			//歌词滚动
			var currT = 	audio.currentTime;
			var timeList = parseLyric($scope.timeLy);
			$("#line-0").css("color","#aaa");
			for(var i=0;i<timeList.length;i++){
				if(i == timeList.length){
					$ionicScrollDelegate.scrollTo(0,i*34,true);
					$("#line-"+(i+1)+"").css("color","lawngreen").siblings().css("color","#aaa");
					return;
				}
				if(currT>(timeList[i]) && currT<timeList[i+1]){
					$ionicScrollDelegate.scrollTo(0,i*34,true);
					$("#line-"+i+"").css("color","#33cd5f").siblings().css("color","#aaa");
					return;
				}
			}
			if(i=timeList.length){
				$ionicScrollDelegate.scrollTo(0,i*34,true);
				$(".lyc>li:last-child").css("color","#33cd5f").siblings().css("color","#aaa");
			}
		})
		
		//处理时间函数
		function delTime(t){
			var min = parseInt(t/60);
			var sec = Math.floor(t%60);
			var newt = (min>9?min:"0"+min) +":"+ (sec>9?sec:"0"+sec);
			return newt;
		}
		//点击播放和暂停
		$scope.clickP = function(){
			if(audio.paused){
				audio.play();
			}else{
				audio.pause();
			}
		}
	$scope.img = info[2];
	//设置背景图片
	document.querySelector("body").style.backgroundImage = "url("+info[2]+")";
}])