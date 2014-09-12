app.factory('loaderService', function($ionicModal, $rootScope) {
            $ionicModal.fromTemplateUrl('templates/modals/loader.html', {
                scope: $rootScope
            }).then(function(modal) {
                $rootScope.loader = modal;
            });

            return {
                show: function() {
                    $rootScope.loader.show();
                },
                hide: function() {
                    $rootScope.loader.hide();
                }
            }
        });