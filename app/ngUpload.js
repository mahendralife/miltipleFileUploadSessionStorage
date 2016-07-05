/*
	multiple file upload system with angularJS
author: mahendra.life@hotmail.com
        mahendrasingh.co.in
*/
"use sctrict"
var app=angular.module('ngUpload',[]);
app.directive('ngFileupload', ['$parse','$timeout','$rootScope', function ($parse,$timeout,$rootScope) {
            return {
               restrict: 'A',
               require: 'ngModel',
               link: function(scope, element, attrs,ngModel) {
                //difine vairables
                var model = $parse(attrs.ngFileupload);
                var modelSetter = model.assign;
                var $fileType;
                var $fileSize;
                var files=[];
                var filetypeValidity=false;
                var filesizeValidity=false;
                var tempArray=[];
                var error={};
                var boolean=false;
                var count=0, total=0, sizecount=0;
                //check file type
                if(attrs.filetype)
                {
                  $fileType=attrs.filetype.replace(/'/g, "").replace(/"/g, "").split(",");
                }
                 //check file type
                if(attrs.filesize)
                {
                  $fileSize=attrs.filesize;
                }
                //process to add image on local variables

                function processImages(value){
                  var data;

        var fileinfo= {"name":value.name,"size":value.size,"type":value.type,"modifyDate":value.lastModifiedDate};

                  var reader = new FileReader();
                  reader.readAsDataURL(value);
                  reader.onload=function(e){
                  data=e.target.result;
                  var temp={"data":fileinfo,"image":data};
                  tempArray.push(temp);
                  scope.$apply(tempArray);

                  //store file in loacal session
                  if(attrs.storage){
                    if(sessionStorage[attrs.storage]){
                        var fileStorage=[];
                        var Files=JSON.parse(sessionStorage[attrs.storage]);
                        angular.forEach(Files, function(value, index){
                            fileStorage.push(value);
                        });
                        fileStorage.push(temp);
                        sessionStorage[attrs.storage]=JSON.stringify(fileStorage);
                          $rootScope.$broadcast(attrs.storage,"changed");
                        console.log(JSON.stringify(fileStorage));
                    }
                    else {
                            sessionStorage[attrs.storage]=JSON.stringify(tempArray);
                            $rootScope.$broadcast(attrs.storage,"changed");
                    }
                  }
                  }
                }
                //on file selection change
               element.bind('change', function($event){

               //push file list is array
                count=0; total=0;sizecount=0;
                error={};
                angular.forEach(element[0].files, function(value,index){
                  //if file type and size is not define, the system accept any type of file and any size
                  if(!$fileType && !$fileSize)
                  {
                    processImages(value);
                  }
                  //both define file size and type
                  else if($fileType && $fileSize)
                   {
                      if($fileType.indexOf(value.type)>=0 && $fileSize > value.size)
                      {
                        processImages(value);
                      }
                      else
                      {
                       if($fileType.indexOf(value.type)==-1)
                        {
                            count++;
                        }
                        if($fileSize < value.size){
                          sizecount++;
                        }
                      }
                   }
                   else if(!$fileType && $fileSize)
                   {
                        if($fileSize > value.size)
                        {
                            processImages(value);
                        }
                        else if($fileSize < value.size)
                        {
                            sizecount++;
                        }

                   }
                   else if($fileType && !$fileSize)
                   {

                        if($fileType.indexOf(value.type)>=0)
                        {
                            processImages(value);
                        }
                        else if($fileType.indexOf(value.type)==-1)
                        {
                            count++;
                        }

                   }
                   ngModel.$setValidity('required', true);
                    total++;
                    });

                    //set error message structure {"typeError":0,"total":1,"sizeError":0}
                    var model1 = $parse(attrs.fileError);
                    var modelSetter1 = model1.assign;
                    error.typeError=count;
                    error.total=total;
                    error.sizeError=sizecount;
                    scope.$apply(function(){modelSetter1(scope, error);});
                    files=tempArray;
                    //apply scope
                    scope.$apply(function(){modelSetter(scope, files);});
                    $event.target.value="";

                  });
               }
            };
 }]);



//services for upload file
app.factory('fileUpload', ['$http','$timeout', function ($http,$timeout) {
        var services={};

           var progress=0;
        services.uploadFileToUrl = function(files, uploadUrl,callback){
        	var response={};

        	if(files!=""){

               var $data = new FormData();
                        //push data on form object
                     		angular.forEach(files,function(value,key){
              	   			$data.append('file['+key+']', value.data);
                      });


                var $request={
                  url:uploadUrl,
                  data:$data,
                  method:"POST",
                  headers: {'Content-Type': undefined},
                  uploadEventHandlers:
                  {
                    progress: progress
                  }
                };

                $http($request).then(success,error);

                function success(response){

                callback(response.data);
               };

               function error(response){
                callback(response);
               };
               function progress(e){
                if(e.lengthComputable)
                {
                  console.log("loaded:"+ e.loaded);
                  console.log("total:"+ e.total);
                  console.log("cal:"+ e.loaded*100);
                  var percentage = Math.round((e.loaded * 100) / e.total);
                  progress=percentage;
                  angular.element(document.querySelector(".progress-bar")).css("width",progress+"%");
                  angular.element(document.querySelector(".progress-bar")).text(progress+"%");
                }
               }
               }

            };

            services.remove=function(data,index, storage){
                if(data){
                  var storageData=JSON.parse(sessionStorage[storage]);
                  data.splice(index,1);
                  storageData.splice(index,1);
                  sessionStorage[storage]=JSON.stringify(storageData);

                  return true;
                }
                else
                {
                  return false;
                }

            };
            services.uploadSignle=function(data,index,uploadUrl, callback){
                var response={};
                var data=data[index];
                var url=uploadUrl;
                services.uploadFileToUrl(data, url,function(response){
                 callback(response);

              });


            }
            return services;
         }]);
