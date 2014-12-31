// This is a basic app.js from an angular app integrating with a rails backend.
// Contains a router and adjustments to $httpProvider for Rails CSRF security

(function(root) {
  root.achillesShield = angular.module('achillesShield', ['templates', 'ngRoute', 'ngResource']);

  root.achillesShield.config(['$routeProvider',
    function($routeProvider) {
      $routeProvider
        .when('/users/:id', {
          templateUrl: 'user_show_view.html',
          controller: 'userCtrl'
        })
        .when('/drawings/new', {
          templateUrl: "drawing_new_view.html",
          controller: "drawingCtrl"
        })
        .when('/drawings/:id', {
          templateUrl: "drawing_show_view.html",
          controller: 'drawingCtrl'
        })
        .otherwise({
          templateUrl: 'error404.html',
          controller: 'homeCtrl'
        });
    }
  ]);

  // rails CSRF security
  root.achillesShield.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.headers.common['X-CSRF-Token'] =
      $('meta[name=csrf-token]').attr('content');
  }]);
})(this);