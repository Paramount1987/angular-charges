var arrChart = [];
var costsLength = 0;
var chargeslength = 0;

var app = angular.module('ChargeApp',[]);	

app.controller('ChargeAppCtrl', function($scope,$filter){
	$scope.charges = [{label: 'доход 1', value: 60, color: "#008000", status: true, index: 0}, {label: 'доход 2', value: 30, color: "#008000",status: true, index: 1},{label: 'доход 3', value: 100, color: "#008000",status: true, index: 2}];
	$scope.costs = [{label: 'расход 1', value: 160, color: "#ff0000", status: true,index:3}];

	chargeslength = $scope.charges.length;
	costslength = $scope.costs.length;

	$scope.reverseByMoneyCharge = false;
	$scope.reverseByMoneyCost = false;
	

	$scope.createChart = function(){

		arrChart = $scope.charges.concat($scope.costs);
		var ctx = document.getElementById("chart-area").getContext("2d");	
		window.PieChart = new Chart(ctx).Pie(arrChart, {
				responsive:true
		});
	};
	
	$scope.initApp = function(){
		$scope.totalSum = 0;
		$scope.totalCost = 0;
		$scope.compoteTotalSum();
		$scope.compoteTotalCost();
	};

	$scope.compoteTotalSum = function(){
		$scope.totalSum = 0;
		for(var i = 0; i < $scope.charges.length; i++){
				$scope.totalSum += $scope.charges[i].status? $scope.charges[i].value : 0; 
		}
	};
	$scope.compoteTotalCost = function(){
		$scope.totalCost = 0;
		for(var i = 0; i < $scope.costs.length; i++){
				$scope.totalCost += $scope.costs[i].status? $scope.costs[i].value : 0; 	
		}
	};

	$scope.getTotalSum = function(index,indexSort){		
		$scope.compoteTotalSum();

		if(index === undefined || indexSort === undefined) return;

		PieChart.segments[$filter('searchChartId')(PieChart.segments, index)].fillColor = $scope.charges[indexSort].status? "#008000" : "#8AC18A";
		PieChart.update();

	};
	$scope.getTotalCost = function(index,indexSort){

		$scope.compoteTotalCost();

		if(index === undefined || indexSort === undefined) return;

		PieChart.segments[$filter('searchChartId')(PieChart.segments, index)].fillColor = $scope.costs[indexSort].status? "#ff0000" : "#FFBDBD";
		PieChart.update();
		
	};
	$scope.removeCharge = function(indexSort){
		PieChart.removeData($filter('searchChartId')(PieChart.segments, indexSort));
		$scope.charges.splice(indexSort,1);
		chargeslength = $scope.charges.length;
		$scope.getTotalSum();
	};
	$scope.removeCost = function(indexSort){
		PieChart.removeData($filter('searchChartId')(PieChart.segments, index));
		$scope.costs.splice(indexSort,1);
		costslength = $scope.costs.length;
		$scope.getTotalCost();
	};

	/////////////////////////////////////////////sort
	$scope.sortByMoney = function(value){

		if(value == 'valueCharge'){
			$scope.charges = $filter('orderBy')($scope.charges, 'value',$scope.reverseByMoneyCharge);
			$scope.reverseByMoneyCharge == true ? $scope.reverseByMoneyCharge = false : $scope.reverseByMoneyCharge = true;

		} else if(value == 'valueCost'){
			$scope.costs = $filter('orderBy')($scope.costs, 'value',$scope.reverseByMoneyCost);
			$scope.reverseByMoneyCost == true ? $scope.reverseByMoneyCost = false : $scope.reverseByMoneyCost = true;
		}

		PieChart.destroy();
		arrChart = $scope.charges.concat($scope.costs);
		var ctx = document.getElementById("chart-area").getContext("2d");	
		PieChart = new Chart(ctx).Pie(arrChart, {
				responsive:true
		});

	};

	$scope.initApp();
	$scope.createChart();

});

/////////////////////////////////////////////////////Add charge
app.controller('RemoteChargeCtrl', function($scope,$filter){

	$scope.addCharge = function(){
		$scope.charges.push({label: $scope.labelCharge, value: $scope.valueCharge, status: true,color: "#008000",index: chargeslength + costslength});
		chargeslength = $scope.charges.length;
		PieChart.addData({label: $scope.labelCharge, value: $scope.valueCharge, status: true,color: "#008000"});
		$scope.labelCharge = "";
		$scope.valueCharge = "";
		$scope.getTotalSum();//total sum
	};

	$scope.removeAllCharges = function(){
		PieChart.destroy();
		var ctx = document.getElementById("chart-area").getContext("2d");	
		PieChart = new Chart(ctx).Pie($scope.costs, {
				responsive:true
		});
		
		chargeslength = $scope.charges.length = 0;
		$scope.getTotalSum();//total sum
	};
});
//////////////////////////////////////////////////////Add Cost
app.controller('RemoteCostCtrl', function($scope,$filter){

	$scope.addCost = function(){
		$scope.costs.push({label: $scope.labelCost, value: $scope.valueCost, status: true,color: "#ff0000",index: chargeslength + costslength});
		costslength = $scope.costs.length;
		PieChart.addData({label: $scope.labelCost, value: $scope.valueCost, status: true,color: "#ff0000"});
		$scope.labelCost = "";
		$scope.valueCost = "";
		$scope.getTotalCost();//total sum
	};

	$scope.removeAllCosts = function(){

		PieChart.destroy();
		var ctx = document.getElementById("chart-area").getContext("2d");	
		PieChart = new Chart(ctx).Pie($scope.charges, {
				responsive:true
		});
		
		costslength = $scope.costs.length = 0;
		$scope.getTotalCost();//total sum
	};
});
////////////////////////////////////////////directive
app.directive('editInput',function($filter){
	return {
		restrict: 'E',
		replace: true,
		template: function(elem,attr){
			return	'<input type="number" class="td-input-item transparent"  ng-model="charge.value" />';
		},
		link: function(scope,element,attrs){
				element.bind('change',function(event){
					 // PieChart.segments[$filter('searchChartId')(PieChart.segments, +attrs.index)].value = element.value;
					 // PieChart.update();
					 scope.compoteTotalSum();
		       scope.compoteTotalCost();

				});
				element.bind('blur',function(){
					element.addClass('transparent');
				});
				element.bind('focus',function(){
					element.removeClass("transparent");
				});
		}
	};
});

// app.directive('editTitle',function($filter){
// 	return {
// 		restrict: 'E',
// 		replace: true,
// 		template: function(elem,attr){
// 			var typeValue = attr.ngValue + ".label";
// 			var typeIndex = attr.ngValue + ".index";
// 			return	'<input type="text" class="td-input-item transparent" ng-model="' + typeValue + '" value="{{' + typeValue + '}}" index={{' + typeIndex + '}} />';
// 		},
// 		link: function(scope,element,attrs){
// 				element.on('change',function(event){
// 					 PieChart.segments[$filter('searchChartId')(PieChart.segments, +attrs.index)].label = attrs.value;
// 					 PieChart.update();
// 				});
// 				element.on('blur',function(){
// 					element.addClass('transparent');
// 				});
// 				element.on('focus',function(){
// 					element.removeClass("transparent");
// 				});
// 		}
// 	};
// });
///////////////////////////////////filter by id
app.filter('searchChartId',function(){
	return function(arr,id){
			var i = 0, len = arr.length;
			for(;i < len; i++){
					if(i == id){
						console.log(i);
					return i;
					
				}
			}

	}

});