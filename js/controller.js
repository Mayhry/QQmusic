var myCtrl = angular.module("myCtrl",[]);

myCtrl.controller("topCtrl",["$scope","$http","$load","$ionicLoading",function($scope,$http,$load,$ionicLoading){
	$ionicLoading.show({
		template:"<ion-spinner icon='android'></ion-spinner>"
	})
	var idList = [3,4,5,6,16,17,18,19,23,26];
	var rankList = ["欧美","新歌","内地","港台","韩国","日本",
		"民谣","摇滚","销量","热歌"]
	var count = 0;
	 $scope.kindList = [];
	for(var i=0;i<idList.length;i++){
		$load.getData("http://route.showapi.com/213-4",{
			"showapi_appid": 28412,
			"showapi_sign":"8a9c106876ed447fbdd159836bfdecfc",
			"topid":idList[i],
			"rank":rankList[i]
		},function(data){
			$scope.kindList.push(data);
			if(count == 8){
				$ionicLoading.hide();
			}
			count++;
		},function(data){
			count++;
		})
	}
}])

myCtrl.controller("top1Ctrl",["$scope","$http","$load","$sce","$ionicLoading","$stateParams",
	function($scope,$http,$load,$sce,$ionicLoading,$stateParams){
	$scope.kind = $stateParams.type;
	$ionicLoading.show({
		template:"<ion-spinner icon='android'></ion-spinner>"
	})
	$load.getData("http://route.showapi.com/213-4",{
			"showapi_appid": 28412,
			"showapi_sign":"8a9c106876ed447fbdd159836bfdecfc",
			"topid":$stateParams.id
		},function(data){
			$scope.items = data.pagebean.songlist;
			$ionicLoading.hide();
		})
}])
myCtrl.controller("searchCtrl",["$scope","$load",function($scope,$load){
	$scope.shistoryList = localStorage.getItem("s-song-history")?JSON.parse(localStorage.getItem("s-song-history")):[];
	$scope.song = {
		songname:""			//绑定搜索输入框
	};
	$scope.songs = [];		//搜索到的歌曲数组
	$scope.isSongL = true;	//搜索出来的歌曲列表隐藏
	$scope.getMes = function(){
		if(!$scope.song.songname.trim()){
			return;
		}
		$scope.isSsl = true;
		$scope.isSongL = false;
		$load.getData("http://route.showapi.com/213-1",{
			"showapi_appid": 28412,
			"showapi_sign":"8a9c106876ed447fbdd159836bfdecfc",
			"keyword":$scope.song.songname
		},function(data){
			$scope.songs = data.pagebean.contentlist;
		})
		if($scope.shistoryList.indexOf($scope.song.songname) ==-1){
			$scope.shistoryList.push($scope.song.songname);
			localStorage.setItem("s-song-history",JSON.stringify($scope.shistoryList));
		}
	}
	$scope.isCancel = true;		//取消按钮隐藏
	$scope.isSsl = true;			//搜索历史隐藏
	$scope.focus = function(){
		$scope.isCancel = false;
		$scope.isSongL  = true;	
		if($scope.shistoryList.length>0){
			$scope.isSsl = false;
		}
	}
	//点击取消
	$scope.clearTxt = function(){
		$scope.isCancel = true;
		$scope.isSsl = true;
		$scope.isSongL = true;
		document.querySelector(".search-txt").value = "";
	}
	//删除某条搜索历史
	$scope.del = function(i){
		$scope.shistoryList.splice(i,1);
		if($scope.shistoryList.length<1){
			$scope.isSsl = true;
		}
		localStorage.setItem("s-song-history",JSON.stringify($scope.shistoryList));
	}
	//清空所有搜索历史
	$scope.clearAll = function(){
		$scope.shistoryList=[];
		$scope.isSsl = true;
		localStorage.setItem("s-song-history",JSON.stringify($scope.shistoryList));
	}
	//点击某条搜索历史
	$scope.tClick = function(i){
		$scope.song.songname = $scope.shistoryList[i];
		$scope.getMes();
	}
}])






