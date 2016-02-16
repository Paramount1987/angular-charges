var arrChart = [];

var app = angular.module('ChargeApp',[]);	

app.controller('ChargeAppCtrl', function($scope,$filter){
	$scope.charges = [{label: 'доход 1', value: 60, color: "#008000", status: true}, {label: 'доход 2', value: 40, color: "#008000", status: true}, {label: 'доход 3', value: 30, color: "#008000",status: true},{label: 'доход 4', value: 100, color: "#008000",status: true}];
	$scope.costs = [{label: 'расход 1', value: 160, color: "#ff0000", status: true}];
	$scope.reverseByMoneyCharge = false;
	$scope.reverseByMoneyCost = false;
	

	$scope.createChart = function(){

		arrChart = $scope.costs.concat($scope.charges);
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
		for(var i = 0; i < $scope.charges.length; i++){
				$scope.totalSum += $scope.charges[i].status? $scope.charges[i].value : 0; 
		}
	};
	$scope.compoteTotalCost = function(){
		for(var i = 0; i < $scope.costs.length; i++){
				$scope.totalCost += $scope.costs[i].status? $scope.costs[i].value : 0; 	
		}
	};

	$scope.getTotalSum = function(index){		
		$scope.totalSum = 0;
		$scope.compoteTotalSum();

		PieChart.segments[index + $scope.costs.length].fillColor = $scope.charges[index].status? "#008000" : "#8AC18A";
		PieChart.update();
	};
	$scope.getTotalCost = function(index){
		$scope.totalCost = 0;
		$scope.compoteTotalCost();

		PieChart.segments[index].fillColor = $scope.costs[index].status? "#ff0000" : "#FFBDBD";
		PieChart.update();
		
	};
	$scope.removeCharge = function(index){
		PieChart.removeData(index + $scope.costs.length);
		$scope.charges.splice(index,1);
		$scope.getTotalSum();
	};
	$scope.removeCost = function(index){
		PieChart.removeData(index);
		$scope.costs.splice(index,1);
		$scope.getTotalCost();
	};
	$scope.valueEdit = function(event,index,obj){

		var input = document.createElement('input');
		input.setAttribute('type','number');
		input.setAttribute('class','td-input-item');
		input.setAttribute('data-index',index);
		input.value = obj.value;
		event.currentTarget.appendChild(input);
		input.focus();

	input.onblur = function(){
			$scope.charges[this.getAttribute('data-index')].value = this.value;
			this.parentNode.removeChild(this);
		};

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

	};

	$scope.initApp();
	$scope.createChart();

});

/////////////////////////////////////////////////////Add charge
app.controller('AddChargeCtrl', function($scope){

	$scope.addCharge = function(){
		$scope.charges.push({label: $scope.labelCharge, value: $scope.valueCharge, status: true,color: "#008000"});
		PieChart.addData({label: $scope.labelCharge, value: $scope.valueCharge, status: true,color: "#008000"});
		$scope.labelCharge = "";
		$scope.valueCharge = "";
		$scope.getTotalSum();//total sum
	};
});
//////////////////////////////////////////////////////Add Cost
app.controller('AddCostCtrl', function($scope){

	$scope.addCost = function(){
		$scope.costs.push({label: $scope.labelCost, value: $scope.valueCost, status: true,color: "#ff0000"});
		PieChart.addData({label: $scope.labelCost, value: $scope.valueCost, status: true,color: "#ff0000"});
		$scope.labelCost = "";
		$scope.valueCost = "";
		$scope.getTotalCost();//total sum
	};
});
////////////////////////////////////////////

