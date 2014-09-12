app.factory('networkService', function($ionicPopup) {
    return {
        turnOnNetwork: function() {
            var existsNetwork = true;
            
            if (existsNetwork == false)
            {
                $ionicPopup.alert({
                    title: 'Няма намерена мрежа!',
                    template: '<p class="text-center">Моля, включете Вашия интернет.</p>',
                    buttons: [{
                            text: 'Разбрах',
                            type: 'button-positive'
                        }]
                });
            }

        },
    }
});