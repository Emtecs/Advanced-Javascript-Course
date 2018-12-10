(function () {
    'use strict';
    var app = angular.module('beerApp', []);

    app.controller('beerCtrl', function($scope, $http) {
        $scope.beer = [
            {id: 1, name: 'Alexander Keiths Ipa', type:'Ale', style: 'Lightereeee', strength: 4 , price: 4, quantity: 1 }
        ];
        $scope.cart = [];
        $scope.beerList = [];

        $scope.newBeer = {
            name: '',
            type: '',
            style: '',
            strength: '',
            price: null
        };


        $scope.createBeer = function () {
            $scope.newBeer.quantity = 1;
            $scope.beerList.push($scope.newBeer);
            saveBeerToDB($scope.newBeer);
            $scope.newBeer = {};
        };

        var findItemByName = function(items, name) {
            return _.find(items, function(item) {
                return item.name === name;
            });
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
                }else {
                    $scope.removeItem();
                }
            }
        };
        /* End Add or remove quantity from cart */
        $scope.getTotal = function() {
            let priceTotal =  _.reduce($scope.cart, function(sum, item) {
                return sum + $scope.getCost(item);
            }, 0);
            return priceTotal;
        };
        $scope.clearCart = function() {
            $scope.cart.length = 0;
        };
        $scope.removeItem = function(item) {
            let index = $scope.cart.indexOf(item);
            $scope.cart.splice(index, 1);
        };


        function saveBeerToDB(item) {
            function success(response) {
                alert('Beer is created. Happy Tasting!');
            }
            function error(response) {
                console.log(response);
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
        $scope.deleteBeer = function(item) {
            console.log(item);
            function success(response) {
                alert('Beer is deleted. Sad. Was it not tasty?..');
            }
            function error(response) {
                console.log(response);
            }
            $http({
                url: "http://localhost:8080/api/people/" + item._id,
                dataType: "json",
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                data: JSON.stringify(item)
            }).then(success, error);
        }
        /* end DELETE */






    });
})();