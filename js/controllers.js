'use strict';

var app = angular.module('fireApp'); 

app.constant('fbUrl', 'https://20160128.firebaseio.com/'); 

app.controller('mainCtrl', function($scope, List, fbAuth, fbRef){
  fbAuth.$onAuth(function(authData){
    console.log("authData;", authData);
    $scope.auth = authData; 
    $scope.list = List; 

    var handle = 'Troll'; 
    var email = 'Troll'; 
    if (authData) {
      fbRef.once("value", function(snapshot) {
        handle = authData.password.email; 
        email = authData.password.email; 
        if (snapshot.val().profiles && snapshot.val().profiles[authData.uid] && snapshot.val().profiles[authData.uid].handle) {
          handle = snapshot.val().profiles[authData.uid].handle;
          console.log("handle:", snapshot.val().profiles[authData.uid].handle); 
        };
        $scope.add = function(message) {
          $scope.list.$add({
            message: message,
            time: Date.now(),
            handle: handle, 
            email: email
          }); 
          $scope.message = ''; 
        };
      })
    } else {

      $scope.add = function(message) {
      $scope.list.$add({
        message: message,
        time: Date.now(),
        handle: handle, 
        email: email
      }); 
      $scope.message = ''; 
    };

    };

  })
});

app.controller('userCtrl', function($scope, $state, Auth) {
  
  console.log('userCtrl');
  console.log('$state.current:', $state.current);

  $scope.state = $state.current.name.split('.')[1]; 
  // console.log($scope.state, "BJs state");
  $scope.submit = function() {
    // console.log($scope.user);
    
    if ($scope.state === 'login') {
      Auth.login($scope.user)
      .then(function() {
        $state.go('home'); 
      }, function() {
        $scope.user.password = ''; 
        alert('Invalid email or password.');
      });
    } else {
      if ($scope.user.password !== $scope.user.password2) {
        $scope.user.password = $scope.user.password2 = ''; 
        return alert('Passwords must match'); 
      }

      Auth.register({
        email: $scope.user.email, 
        password: $scope.user.password
      })

      .then(function(authData) {
        console.log('authData:', authData);
        $state.go('home');
      }, function(err) {
        alert('error in console');
        console.error(err);
      });
    }
  }

});


app.controller('profileCtrl', function($scope, Profile, fbAuth) {
  console.log("profileCtrl");
  fbAuth.$onAuth(function(authData){
    console.log("authData;", authData);
    $scope.authData = authData; 

    if (!Profile(authData.uid)) {
      $scope.profile = Profile.create(authData.uid);
      $scope.profile.$save(); 
    } else {
      $scope.profile = Profile(authData.uid);
      $scope.profile.$save(); 
    }

    // $scope.placeholder = $scope.profile.handle; 
    $scope.updateprofile = function(updateObj) {
      $scope.profile.handle = updateObj.handle || $scope.profile.handle || ''; 
      $scope.profile.first = updateObj.first || $scope.profile.first || ''; 
      $scope.profile.last = updateObj.last || $scope.profile.last || ''; 
      $scope.profile.$save();  
    }; 

    $scope.edit = false; 
  });
})


app.controller('navCtrl', function($scope, $state, Auth, fbAuth) {
  fbAuth.$onAuth(function(authData){
    console.log("authData;", authData);
    $scope.authData = authData; 
  })

  $scope.logout = function() {
    Auth.logout();
    $state.go('home'); 
  };
});