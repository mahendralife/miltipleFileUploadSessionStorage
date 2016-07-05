'use strict'
var app=angular.module('fileupload',['ngUpload']);
app.run(function($rootScope){
   $rootScope.header="header.html";
});

 app.controller('myCtrl', ['$scope', 'fileUpload','$log','$timeout', function($scope, fileUpload,$log,$timeout){
 	$log.info("home controller reday to work");
 	$scope.filetype=['image/png','image/jpeg','image/gif'];
 	$scope.myFile={};
   $scope.loader=0;
 	var uploadUrl = "server/submit.php";

$scope.$on('file', function(value,args){

    $scope.myFileViwer=JSON.parse(sessionStorage['file']);
    $scope.$apply();


})

if(sessionStorage['file']){
  $scope.myFileViwer=JSON.parse(sessionStorage['file']);
}

 	            $scope.uploadFile = function(){
               	var file = $scope.myFile;
 	 	//alert(JSON.stringify(file))
              // console.log('file is ' );


               fileUpload.uploadFileToUrl(file, uploadUrl,function(response){
               	$log.info(response)

               });
            };

         $scope.removeFile=function(index){
         		fileUpload.remove($scope.myFileViwer,index,"file");

         }

         $scope.uploadSignle=function(index){
         		var status=fileUpload.uploadSignle($scope.myFile, index, uploadUrl ,function(response){
         			$log.info(response);
         		});

         }
         }]);
