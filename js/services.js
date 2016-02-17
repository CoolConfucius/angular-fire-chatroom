'use strict';

var app = angular.module('fireApp'); 

app.factory('fbRef', function($window, fbUrl){
  return new $window.Firebase(fbUrl); 
});

app.factory('List', function(fbRef, $firebaseArray) {
  var listRef = fbRef.child('list');
  return $firebaseArray(listRef); 
});

app.factory('User', function(fbRef, $firebaseObject) {
  var userRef = fbRef.child('user');
  return $firebaseObject(userRef); 
});

app.factory('fbAuth', function(fbRef, $firebaseAuth) {
  return $firebaseAuth(fbRef); 
})

app.service('Auth', function(fbAuth) {
  this.register = function(userObj) {
    return fbAuth.$createUser(userObj)
    .then(userData => {
      console.log("User " + userData.uid + " created successfully!");
      return fbAuth.$authWithPassword(userObj);
    })
  };

  this.login = function(userObj) {
    return fbAuth.$authWithPassword(userObj);
  };

  this.logout = function() {
    fbAuth.$unauth(); 
  }

}); 



app.factory("Profile", function($firebaseObject, fbRef) {
  
  var profileRef = fbRef.child('profile');
  // create a new service based on $firebaseObject
  var User = $firebaseObject.$extend({
    // these methods exist on the prototype, so we can access the data using `this`
    getFullName: function() {
      return this.firstName + " " + this.lastName;
    }
  });

  var create = function(userId) {
    var ref = fbRef.child('profiles').child(userId); 
    // create an instance of User (the new operator is required)
    return new User(ref);
  }

  return function(userId) {
    var ref = fbRef.child('profiles').child(userId); 
    return User(ref); 
  }
});


// $scope.profile = Profile(authData.uid)
// $scope.profile.firstName = 'Cade'; 
// $scope.profile.$save(); 
// $scope.profile.getFullName()