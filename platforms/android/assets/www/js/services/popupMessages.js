app.factory('popupMessagesService', function($ionicPopup, $location) {
    return {
        error: function(msg, customPath) {
            return $ionicPopup.alert({
                title: 'Беше намерена грешка!',
                template: '<p class="text-center">' + msg + '</p>',
                buttons: [{
                        text: 'Разбрах',
                        type: 'button-positive'
                    }]
            });
        },
        success: function(title, msg, customPath) {
            var alert = $ionicPopup.alert({
                title: title,
                template: '<p class="text-center">' + msg + '</p>',
                buttons: [{
                        text: 'Разбрах',
                        type: 'button-positive',
                        onTap: function(e) {
                            if (customPath !== '')
                            {
                                $location.path(customPath);
                            }
                        }
                    }]
            });

            alert.then(function() {
                if (customPath !== '')
                {
                    $location.path(customPath);
                }
            });

            return alert;
        },
        customPopup: function(title, msg, buttons) {
            return $ionicPopup.alert({
                title: title,
                template: '<p class="text-center">' + msg + '</p>',
                buttons: buttons
            });
        }
    }
});