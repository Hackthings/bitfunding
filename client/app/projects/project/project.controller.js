'use strict';

angular.module('bitCrowdFundsApp')
  .controller('ProjectCtrl', function ($scope, $http, $routeParams, ProjectRes, Auth, $location) {
    var currentUser = Auth.getCurrentUser();
    $scope.currentProject =  false;
    $scope.resContrib = '';
    $scope.projectName = '';

    $scope.init = function() {
        ProjectRes.get({name: $routeParams.projectName}).
            $promise.then(function(datas) {
                $scope.currentProject = datas;
                $scope.projectName = $routeParams.projectName;
            }, function(err){
                $location.path('/projects');
        });
    };

    $scope.contribute = function()
    {
        var repl = $scope.contribAmount.replace(',', '.');
        var contribSatoshi = parseFloat(repl*100000000);
    	$http.post('api/projects/'+$scope.currentProject.slug+'/contrib', {userId: currentUser._id, userName: currentUser.name, amount: contribSatoshi})
    	.success(function(data, status, headers, config)
    	{
    		$scope.resContrib = 'You just contributed '+$scope.contribAmount+' BTC to ' + $scope.projectName;
    		$scope.currentProject = data;
    	}).error(function(data, status, headers, config)
    	{
    		$scope.resContrib = 'Something wrong happend : ' + data;
    	});
    };
  });
