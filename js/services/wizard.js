app.factory('wizardService', function($rootScope, localStorageService) {
    return {
        getLocationPathNextStep: function(currentStep, defaultLocationPath, useInLocationService) {
            var userData = localStorageService.get('userData');
            var wizardComplete = userData.wizard_complete;

            if (wizardComplete !== 1)
            {
                var locationPaths = {
                    'presentation': '#/app/user/profile/edit',
                    'profile': '#/app/user/location',
                    'location': '#/app/user/main/interests'
                };
                var secondLocationPaths = {
                    'presentation': '/app/user/profile/edit',
                    'profile': '/app/user/location',
                    'location': '/app/user/main/interests'
                };

                if (!$.inArray(currentStep, locationPaths))
                {
                    return defaultLocationPath;
                }
                else
                {
                    if (useInLocationService === true)
                    {
                        return secondLocationPaths[currentStep];
                    }
                    return locationPaths[currentStep];
                }
            }

            return defaultLocationPath;
        }
    }
});