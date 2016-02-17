'use strict';

var app = angular.module('fireApp', ['firebase', 'ui.router', 'angularMoment']); 

app.constant('fbUrl', 'https://20160128.firebaseio.com/'); 

app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('home', { url: '/', templateUrl: 'html/home.html', controller: 'mainCtrl' })

    .state('user', { url: '/user', template: '<ui-view/>', abstract: true })
    .state('user.login', { url: '/login', templateUrl: 'html/user.html', controller: 'userCtrl' })
    .state('user.register', { url: '/register', templateUrl: 'html/user.html', controller: 'userCtrl' })

    .state('user.profile', { url: '/profile', templateUrl: 'html/profile.html', controller: 'profileCtrl', 
          onEnter: function($state, fbAuth) {
            console.log('getAuth:', fbAuth.$getAuth);
            if(!fbAuth.$getAuth()) {
              return $state.go('home')
            }
          }})

  $urlRouterProvider.otherwise('/');
});

app.filter('titlecase', function() {
  return function(value) {
    if (typeof value !== 'string') return value; 
    return value[0].toUpperCase() + value.slice(1).toLowerCase(); 
  }
})

