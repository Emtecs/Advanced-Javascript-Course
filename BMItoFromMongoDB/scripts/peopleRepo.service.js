(function () {
    'use strict';
    angular.module("myApp").service('peopleRepo', function($http, config) {
        this.mainUrl = config.apiUrls.peopleRepo;
        this.insertPerson = function(person, successCallback, errorCallback) {
            let _this = this;
            $http({
                url: _this.mainUrl + "/api/people",
                dataType: "json",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                data: JSON.stringify(person)
            }).then(successCallback, errorCallback);
        }
    });
})();