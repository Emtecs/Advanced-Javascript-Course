(function () {
    'use strict';
    let app = angular.module("myApp", []);
    app.controller("myCtrl", function($scope) {

        $scope.table = [];
        $scope.newPerson = {};
        $scope.clearList = function myFunc() {
            $scope.table = [];
        };
        $scope.listBMI= function() {
            $scope.newPerson.bmi = ($scope.newPerson.weight / Math.pow($scope.newPerson.height / 100, 2)).toFixed(2);

            switch (true) {
                case $scope.newPerson.bmi <=18.5:
                    $scope.newPerson.bmiType = 'underweight';
                    $scope.newPerson.bmiText = 'are Underweight';
                    $scope.newPerson.bmiTip = 'Being underweight is also unhealthy! You must eat more food.';
                    break;
                case $scope.newPerson.bmi > 18.5 && $scope.newPerson.bmi <= 24.9:
                    $scope.newPerson.bmiType = 'normal';
                    $scope.newPerson.bmiText = 'have Normal weight';
                    $scope.newPerson.bmiTip = 'Good work! Keep eating healthy and exercising!';
                    break;
                case $scope.newPerson.bmi >=25 && $scope.newPerson.bmi < 29.9:
                    $scope.newPerson.bmiType = 'overweight';
                    $scope.newPerson.bmiText = 'are Overweight';
                    $scope.newPerson.bmiTip = 'It is a bit worrisome. Try to do more exercise and watch what You eat.';
                    break;
                case $scope.newPerson.bmi > 30:
                    $scope.newPerson.bmiType = 'obesity';
                    $scope.newPerson.bmiText = 'are Obese';
                    $scope.newPerson.bmiTip = 'That is very unhealthy! Fix your eating habits and start exercising!';
                    break;
            }
            $scope.table.push($scope.newPerson);
            $scope.newPerson = {};
            console.log($scope.table);
        };
    });

})();