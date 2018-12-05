(function () {
    'use strict';
    var app = angular.module('beerApp', []);

    app.controller('beerCtrl', function($scope) {
        $scope.beer = [
            {id: 1, name: 'Alexander Keiths Ipa', type:'Ale', style: 'Lightereeee', strength: 4 , price: 4, quantity: 1 },
            {id: 2, name: 'Alexander Keiths Ipa', type:'Ale', style: 'Lightereeee', strength: 4 , price: 4, quantity: 1 }
        ];
        $scope.cart = [];

        $scope.beerList = [];
        $scope.newBeer = {};

        $scope.createBeer = function () {
            $scope.beerList.push($scope.newBeer);
            $scope.newBeer = {};
            console.log("veikiam?");
        };

        var findItemById = function(items, id) {
            return _.find(items, function(item) {
                return item.id === id;
            });
        };

        $scope.getCost = function(item) {
            return item.quantity * item.price;
        };

        $scope.addItem = function(itemToAdd) {
            var found = findItemById($scope.cart, itemToAdd.id);
            if (found) {
                found.quantity += itemToAdd.quantity;
            }
            else {
                $scope.cart.push(angular.copy(itemToAdd));}
        };
        /* Start Add or remove quantity from cart */
        $scope.plusItem = function(itemToAdd) {
            var found = findItemById($scope.cart, itemToAdd.id);
            if (found) {
                found.quantity += 1;
            }
        };
        $scope.subtractItem = function(itemToAdd) {
            var found = findItemById($scope.cart, itemToAdd.id);
            if (found) {
                if (found.quantity !==0){
                    found.quantity -= 1;
                }else {
                    $scope.removeItem();
                }
            }
        };
        /* End Add or remove quantity from cart */
        $scope.getTotal = function() {
            var total =  _.reduce($scope.cart, function(sum, item) {
                return sum + $scope.getCost(item);
            }, 0);
            return total;
        };
        $scope.clearCart = function() {
            $scope.cart.length = 0;
        };
        $scope.removeItem = function(item) {
            var index = $scope.cart.indexOf(item);
            $scope.cart.splice(index, 1);
        };
    });
    /* start CRUD */
    // ..
    /* end CRUD */
})();