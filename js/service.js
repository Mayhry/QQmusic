var myService = angular.module("myService",[]);
myService.service("$load",["$http",function($http){
	this.getData = function(url,params,callback,callbacke){
		$http.get(url,{
			params:params
		}).success(function(data){
			if(data && data.showapi_res_code == 0){
				if(params.topid){
					data.showapi_res_body.kindid = params.topid;
					data.showapi_res_body.rank = params.rank;
				}
				callback(data.showapi_res_body);
			}
		}).error(function(data){
			callbacke(data);
		});
	}
}])