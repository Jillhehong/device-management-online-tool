// (function() {
// "use strict";
//
// angular.module('common')
// .factory('checkloginInterceptor', checkloginInterceptor);
//
//     checkloginInterceptor.$inject = ['$location', '$q'];
// /**
//  * Tracks when a request begins and finishes. When a
//  * request starts, a progress event is emitted to allow
//  * listeners to determine when a request has been initiated.
//  * When the response completes or a response error occurs,
//  * we assume the request has ended and emit a finish event.
//  */
// function checkloginInterceptor($location, $q) {
//
//
//   return {
//       response: function(response) {
//           //do some success
//           return response;
//           },
//       responseError: function(response){
//           if(response.status == 401){
//               $location.url('/login');
//               return $q.reject(response);
//           }
//       }
//
//     }
//
//
// }
//
// })();
