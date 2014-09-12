app.factory('interestsService', function($rootScope, $http, transformHttp, $timeout, $location, userService, localStorageService,
        networkService, loaderService, popupMessagesService) {
    return {
        checkForDifferenceSubInterests: function(mainInterestID, perfomDiffCheck) {
            var detectDiff = false;
            var mainID = parseInt(mainInterestID);

            if (perfomDiffCheck === true)
            {
                $.each($rootScope.checked, function(interest_id, isChecked) {
                    if ($rootScope.diffChecked[interest_id] !== isChecked)
                    {
                        detectDiff = true;
                        $rootScope.diffChecked[interest_id] = isChecked;
                    }
                });
            }
            else
            {
                detectDiff = true;
            }

            //make update if detect differences
            if (detectDiff === true)
            {
                var dataSend = {
                    'mainInterestID': mainID,
                    'subInterests': ''
                };

                $.each($rootScope.checked, function(interest_id, isChecked) {
                    if (isChecked === true || isChecked === 1)
                    {
                        if (dataSend.subInterests !== '')
                        {
                            dataSend.subInterests += ',' + interest_id;
                        }
                        else
                        {
                            dataSend.subInterests += interest_id;
                        }
                    }
                });

                //update user interests
                $http({
                    url: $rootScope.apiUrl + 'user/step/4/' + localStorageService.get('user_id') + '/' + localStorageService.get('token'),
                    method: "POST",
                    transformRequest: transformHttp,
                    data: dataSend
                })
                        .success(function(result) {
                            if (result.type === 'error')
                            {
                                //show error
                                popupMessagesService.error(result.msg);
                            }
                            else
                            {
                                //set passed interests
                                var passedMainInterests = localStorageService.get('passedMainInterests');

                                //set new passed
                                passedMainInterests[mainID] = true;

                                //set to local storage new passed interests
                                localStorageService.set('passedMainInterests', passedMainInterests);
                            }
                        })
                        .error(function() {
                            //show popup
                            userService.showExpiredUserTokenPopup();
                        });
            }
        },
        getSubInterests: function(mainInterestID) {
            var mainID = parseInt(mainInterestID);
            var subInterests = [];
            var i = 0;

            $.each($rootScope.subInterests, function(key, value) {
                $.each(value, function(keyLoop2, valueLoop2) {
                    if (valueLoop2.base.id === mainID)
                    {
                        $.each(valueLoop2.sub_interests, function(keySubInterest, valueSubInterest) {
                            subInterests[i] = {
                                'main_interest_id': valueLoop2.base.id,
                                'id': valueSubInterest.id,
                                'title': valueSubInterest.title,
                                'checked': valueSubInterest.checked
                            };

                            //set checked
                            $rootScope.checked[valueSubInterest.id] = (valueSubInterest.checked === true || valueSubInterest.checked === 1 ? true : false);
                            $rootScope.diffChecked[valueSubInterest.id] = (valueSubInterest.checked === true || valueSubInterest.checked === 1 ? true : false);

                            i++;
                        });
                    }
                });
            });

            //return sub interest
            return subInterests;
        },
        getCountSelectedSubInterests: function(mainInterestID) {
            var mainID = parseInt(mainInterestID);
            var checked = 0;

            $.each($rootScope.subInterests, function(key, value) {
                $.each(value, function(keyLoop2, valueLoop2) {
                    if (valueLoop2.base.id === mainID)
                    {
                        $.each(valueLoop2.sub_interests, function(keySubInterest, valueSubInterest) {
                            if (valueSubInterest.checked === true || valueSubInterest.checked === 1)
                            {
                                checked++;
                            }
                        });
                    }
                });
            });
            return checked;
        },
        loadSubInterests: function() {
            $http({
                url: $rootScope.apiUrl + 'interests/sub-interests/' + localStorageService.get('user_id') + '/' + localStorageService.get('token'),
                method: "GET",
                transformRequest: transformHttp
            })
                    .success(function(result) {
                        if (result.type === 'error')
                        {
                            //show error
                            popupMessagesService.error(result.msg);
                        }
                        else
                        {
                            $rootScope.subInterests = result;
                        }
                    })
                    .error(function(error) {
                        //hide loader
                        loaderService.hide();

                        //show error
                        popupMessagesService.error('В момента се работи по системата. Моля, опитайте по-късно.');

                        console.log(error);
                    });
        },
        updateMainInterests: function(form) {
            //check for existing netowrk connection
            networkService.turnOnNetwork();

            //show laoder
            loaderService.show();

            var newForm = {'main_interests': []};
            var i = 0;

            $.each(form, function(key, value) {
                if (value === 1 || value === true)
                {
                    newForm.main_interests[i] = parseInt(key);
                    i++;
                }
            });

            //make request
            $timeout(function() {
                $http({
                    url: $rootScope.apiUrl + 'user/step/3/' + localStorageService.get('user_id') + '/' + localStorageService.get('token'),
                    method: "POST",
                    transformRequest: transformHttp,
                    data: newForm
                })
                        .success(function(result) {
                            //hide loader
                            loaderService.hide();

                            if (result.type === 'error')
                            {
                                //show error
                                popupMessagesService.error(result.msg);
                            }
                            else
                            {
                                //show success message
                                popupMessagesService.customPopup(
                                        'Интереси',
                                        'Вашите интереси бяха запазени успешно.',
                                        [
                                            {
                                                text: 'Разбрах',
                                                type: 'button-positive',
                                                onTap: function(e) {
                                                    $location.path('/app/user/sub/interests');
                                                }
                                            }
                                        ]);
                            }
                        })
                        .error(function(error) {
                            //hide loader
                            loaderService.hide();

                            //show error
                            popupMessagesService.error('В момента се работи по системата. Моля, опитайте по-късно.');

                            console.log(error);
                        });
            }, 1400);
        }

    }
});