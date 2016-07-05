"use sctrict";
var app=new angular.module("ngDropzone",['ngDropzone']);
app.run(function($rootScope){
   $rootScope.header="./header.html";
});


app.run(function($log){
  $log.info("App is ready to use");
})

app.controller("dropzone", function ($scope, $rootScope, $log) {
  $log.debug("Home Controller is ready to use.");

})
