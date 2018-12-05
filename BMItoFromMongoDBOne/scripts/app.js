(function () {
    'use strict';
    let app = angular.module("myApp", []);
    app.controller("myCtrl", function($scope, $http) {

        $scope.showPage = false;
        $scope.table = [];
        $scope.newPerson = {};
        $scope.editablePerson = null;
        $scope.clearList = function myFunc() {
            $scope.table = [];
        };
        $scope.listBMI= function() {
           calcBMI($scope.newPerson);
            $scope.table.push($scope.newPerson);
            savePersonToDB($scope.newPerson);
            $scope.newPerson = {};
        };

        function calcBMI(obj) {
            obj.bmi = (obj.weight / Math.pow(obj.height / 100, 2)).toFixed(2);

            switch (true) {
                case obj.bmi <=18.5:
                    obj.bmiType = 'underweight';
                    obj.bmiText = 'are Underweight';
                    obj.bmiTip = 'Being underweight is unhealthy! You must eat more food.';
                    break;
                case obj.bmi > 18.5 && obj.bmi <= 24.9:
                    obj.bmiType = 'normal';
                    obj.bmiText = 'have Normal weight';
                    obj.bmiTip = 'Good work! Keep eating healthy and exercising!';
                    break;
                case obj.bmi >=25 && obj.bmi < 29.9:
                    obj.bmiType = 'overweight';
                    obj.bmiText = 'are Overweight';
                    obj.bmiTip = 'It is a bit worrisome. Try to do more exercise and watch what You eat.';
                    break;
                case obj.bmi > 30:
                    obj.bmiType = 'obesity';
                    obj.bmiText = 'are Obese';
                    obj.bmiTip = 'That is very unhealthy! Fix your eating habits and start exercising!';
                    break;
            }
        }

        function savePersonToDB(person) {
            function success(response) {
                // ...
            }
            function error(response) {
                console.log(response);
            }
            $http({
                url: "http://localhost:8080/api/people",
                dataType: "json",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                data: JSON.stringify(person)
            }).then(success, error);
        }

        /* Start edit person */
        $scope.edit = function(person){
            $scope.editablePerson = person;
            $('#editModal').modal('show');
        };
        /* End edit person */

        $scope.updateExsitingPersonInDB = function() {
            function success(response) {
                $scope.editablePerson = null;
                $('#editModal').modal('hide');
                alert('Yay. Update completed.');
            }
            function error(response) {
                console.log(response);
            }
            calcBMI($scope.editablePerson);
            let preparedPersonObjForUpdate = angular.copy($scope.editablePerson);
            delete preparedPersonObjForUpdate._id;

            $http({
                url: "http://localhost:8080/api/people/" + $scope.editablePerson._id,
                dataType: "json",
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                data: angular.toJson(preparedPersonObjForUpdate)
            }).then(success, error);
        }

        function deletePeopleFromDB(person) {
            function success(response) {
                // ...
            }
            function error(response) {
                console.log(response);
            }
            $http({
                url: "http://localhost:8080/api/people/" + person._id,
                dataType: "json",
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                data: JSON.stringify(person)
            }).then(success, error);
        }

        function getPersons(callback) {
            function success(response) {
                callback(response.data);
                console.log(response);
            }
            function error(response) {
                console.log(response);
            }
            $http.get("http://localhost:8080/api/people").then(success, error);
        }

        function activate() {
            getPersons(function (personsArr) {
                $scope.table = personsArr;
                setTimeout(function() {
                    $scope.showPage = true;
                    $scope.$apply();
                });
            });
        }
        activate();
    });
})();