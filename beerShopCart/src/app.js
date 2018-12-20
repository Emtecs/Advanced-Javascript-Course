(function () {
    'use strict';
    var app = angular.module('beerApp', []);

    app.controller('beerCtrl', function($scope, $http) {

        $scope.cart = [];
        $scope.beerList = [];

        $scope.saving = false;

        $scope.newBeer = {
            name: '',
            type: '',
            style: '',
            strength: '',
            price: null
        };
        $scope.createBeer = function () {
            $scope.newBeer.quantity = 1;
            saveBeerToDB($scope.newBeer);
        };
        $scope.getCost = function(item) {
            return item.quantity * item.price;
        };
        $scope.addItem = function(itemToAdd) {
            let found = findItemByName($scope.cart, itemToAdd.name);
            if (found) {
                found.quantity += itemToAdd.quantity;
            }
            else {
                $scope.cart.push(angular.copy(itemToAdd));}
        };
        /* Start Add or remove quantity from cart */
        $scope.plusItem = function(itemToAdd) {
            let found = findItemByName($scope.cart, itemToAdd.name);
            if (found) {
                found.quantity += 1;
            }
        };
        $scope.subtractItem = function(itemToAdd) {
            let found = findItemByName($scope.cart, itemToAdd.name);
            if (found) {
                if (found.quantity > 1){
                    found.quantity -= 1;
                } else {
                    $scope.removeItem(found);
                }
            }
        };
        /* End Add or remove quantity from cart */
        $scope.getTotal = function() {
            return $scope.cart.reduce(function(sum, item) {
                return sum + $scope.getCost(item);
            }, 0);
        };
        $scope.clearCart = function() {
            $scope.cart = [];
        };
        $scope.removeItem = function(item) {
            let index = $scope.cart.indexOf(item);
            $scope.cart.splice(index, 1);
        };
         /* start EDIT */
        $scope.edit = function(item){
            $scope.editedBeer = item;
            $('#edit_beer_modal').modal('show');
        };

        $scope.updateBeer = function() {
            function success() {
                $scope.editedBeer = null;
                $('#edit_beer_modal').modal('hide');
                alert('Beer is updated. Cheers!');
            }
            function error(response) {
                console.log(response);
            }

            let beerForUpdate = angular.copy($scope.editedBeer);
            delete beerForUpdate._id;

            $http({
                url: "http://localhost:8080/api/beers/" + $scope.editedBeer._id,
                dataType: "json",
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                data: angular.toJson(beerForUpdate)
            }).then(success, error);
        };
        /* end EDIT */
        /* start DELETE */
        $scope.deleteBeer = function(item){
            $scope.toDelBeer = item;
            $('#deleteBeerModal').modal('show');
        };
        $scope.delBeer = function(item) {
            console.log(item);
            console.log($scope.beerList);
            function success() {
                $('#deleteBeerModal').modal('hide');
                console.log('Beer is deleted. Sad. Was it not tasty?..');
                    $scope.beerList.splice(item, 1);
                    console.log (item);
                console.log($scope.beerList);
            }
            function error(response) {
                console.log(response);
            }
            $http({
                url: "http://localhost:8080/api/beers",
                dataType: "json",
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                data: angular.toJson([item._id])
            }).then(success, error);
        };

        /* end DELETE */
        function saveBeerToDB(item) {
            if ($scope.saving) {
                return;
            }
            $scope.saving = true;
            function success(response) {
                console.log(response);
                if (response.data.name === 'success') {
                    $scope.beerList.push($scope.newBeer);
                    $scope.newBeer = {};
                    alert('Beer is created. Happy Tasting!');

                } else if (response.data.name === 'errors') {
                    item.errors = {};
                    for (let i = 0; i < response.data.errors.length; i++) {
                        let errorItem = response.data.errors[i];
                        console.log(errorItem);
                        item.errors[errorItem.prop] = errorItem.error;
                    }
                    console.log(item.errors);
                }
                $scope.saving = false;
            }
            function error(response) {
                console.log(response);
                $scope.saving = false;

            }
            $http({
                url: "http://localhost:8080/api/beers",
                dataType: "json",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                data: JSON.stringify(item)
            }).then(success, error);
        }

        function getBeers(callback) {
            function success(response) {
                callback(response.data);
            }
            function error(response) {
                console.log(response);
            }
            $http.get("http://localhost:8080/api/beers").then(success, error);
        }

        var findItemByName = function(items, name) {
            return _.find(items, function(item) {
                return item.name === name;
            });
        };

        function activate() {
            getBeers(function (BeerArr) {
                $scope.beerList = BeerArr;
                setTimeout(function() {
                    $scope.showPage = true;
                    $scope.$apply();
                });
            });
        }
        activate();
    });
})();