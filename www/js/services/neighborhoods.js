app.factory('neighborhoodsService', function($rootScope, $http, transformHttp, localStorageService) {
    return {
        get: function() {
            $http({
                url: $rootScope.apiUrl + 'neighborhoods/' + localStorageService.get('user_id') + '/' + localStorageService.get('token'),
                method: "GET",
                transformRequest: transformHttp
            })
                    .success(function(result) {
                        $rootScope.neighborhoods = result;
                    });
        }
    }
});