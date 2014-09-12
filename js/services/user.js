app.factory('userService', function($rootScope, $http, transformHttp, $timeout, $location, localStorageService,
        networkService, loaderService, popupMessagesService, wizardService) {
    return {
        logoutUser: function() {
            //show loader
            loaderService.show();

            //make request
            $timeout(function() {
                $http({
                    url: $rootScope.apiUrl + 'logout/' + localStorageService.get('user_id') + '/' + localStorageService.get('token'),
                    method: "POST",
                    transformRequest: transformHttp
                })
                        .success(function(result) {
                            if (result.type === 'success')
                            {
                                //hide loader
                                loaderService.hide();

                                //destroy user session
                                localStorageService.clearAll();

                                //do not show popup again
                                localStorageService.set('popupExpiredShow', 'false');

                                //show success message
                                var popup = popupMessagesService.customPopup(
                                        'Профил',
                                        'Вие успешно излязохте от своя профил.',
                                        [
                                            {
                                                text: 'към началната страница?',
                                                type: 'button-positive',
                                                onTap: function(e) {
                                                    $location.path('/no_side/home');
                                                }
                                            }
                                        ]
                                        );

                                popup.then(function(res) {
                                    $location.path('/no_side/home');
                                });
                            }
                        });
            }, 1400);
        },
        showExpiredUserTokenPopup: function() {
            if (localStorageService.get('popupExpiredShow') !== 'false')
            {
//                //show success message
//                var popup = popupMessagesService.customPopup(
//                        'Изтекла сесия',
//                        'Вашата потребителска сесия е изтекла.',
//                        [
//                            {
//                                text: 'към страницата за вход',
//                                type: 'button-positive',
//                                onTap: function(e) {
//                                    $location.path('/no_side/login');
//                                }
//                            }
//                        ]
//                        );
//
//                popup.then(function(res) {
//                    $location.path('/no_side/login');
//                });
                $location.path('/no_side/login');

                //do not show popup again
                localStorageService.set('popupExpiredShow', 'false');
            }

        },
        validLoggedUser: function(userService) {
            $http({
                url: $rootScope.apiUrl + 'user/data/' + localStorageService.get('user_id') + '/' + localStorageService.get('token'),
                method: "GET",
                transformRequest: transformHttp
            })
                    .success(function(result) {
                        if (result.type === 'error' && result.invalid_token === 1)
                        {
                            //destroy user session
                            localStorageService.clearAll();

                            //show popup
                            userService.showExpiredUserTokenPopup();
                        }
                        else
                        {
                            //set user data in local storage
                            localStorageService.set('userData', result);
                        }
                    })
                    .error(function(error) {
                        //destroy user session
                        localStorageService.clearAll();

                        //show popup
                        userService.showExpiredUserTokenPopup();
                    });
        },
        isLoggedUser: function() {
            var usr_id = parseInt(localStorageService.get('user_id'));
            var token = localStorageService.get('token');

            return (usr_id > 0 && token !== null);
        },
        loginUser: function(form) {
            //check for existing netowrk connection
            networkService.turnOnNetwork();

            //show laoder
            loaderService.show();

            //make request
            $timeout(function() {
                $http({
                    url: $rootScope.apiUrl + 'login',
                    method: "POST",
                    transformRequest: transformHttp,
                    data: form
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
                                //create session
                                localStorageService.set('user_id', result.user_id);
                                localStorageService.set('token', result.token);

                                //set permission to show expired popup
                                localStorageService.set('popupExpiredShow', 'true');

                                //perfom checks for loaction
                                if (result.age === 0)
                                {
                                    //redirect to page "about insofia"
                                    $location.path('/no_side/about-insofia-today');
                                }
                                else
                                {
                                    //redirect to page "user profile"
                                    $location.path('/app/user/profile');
                                }
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
        },
        resetUserPassword: function(form) {
            //check for existing netowrk connection
            networkService.turnOnNetwork();

            //show laoder
            loaderService.show();

            //make request
            $timeout(function() {
                $http({
                    url: $rootScope.apiUrl + 'reset-password',
                    method: "POST",
                    transformRequest: transformHttp,
                    data: form
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
                                        'Нова парола',
                                        'Новата Ви парола е изпратена успешно на посочения от Вас E-Mail адрес.',
                                        [
                                            {
                                                text: 'към страницата за вход?',
                                                type: 'button-positive',
                                                onTap: function(e) {
                                                    $location.path('/no_side/login');
                                                }
                                            }
                                        ]
                                        );

                                //clear form
                                $rootScope.resetData = {};
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
        },
        createUser: function(form, userService) {
            //check for existing netowrk connection
            networkService.turnOnNetwork();

            //show laoder
            loaderService.show();

            //make request
            $timeout(function() {
                $http({
                    url: $rootScope.apiUrl + 'register',
                    method: "POST",
                    transformRequest: transformHttp,
                    data: form
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
                                        'Нов профил',
                                        'Вашия нов профил е регистриран успешно.',
                                        [
                                            {
                                                text: 'автоматичен вход?',
                                                type: 'button-positive',
                                                onTap: function(e) {
                                                    userService.loginUser(form);
                                                }
                                            }
                                        ]
                                        );

                                //clear form
                                $rootScope.registerData = {};
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
        },
        updateUser: function(form) {
            //check for existing netowrk connection
            networkService.turnOnNetwork();

            //show laoder
            loaderService.show();

            //make request
            $timeout(function() {
                $http({
                    url: $rootScope.apiUrl + 'user/step/1/' + localStorageService.get('user_id') + '/' + localStorageService.get('token'),
                    method: "POST",
                    transformRequest: transformHttp,
                    data: form
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
                                popupMessagesService.success(
                                        'Профил',
                                        'Вашия профил е обновен успешно.',
                                        wizardService.getLocationPathNextStep('profile', '', true)
                                        );
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
        },
        updateNeighborhoods: function(form) {
            //check for existing netowrk connection
            networkService.turnOnNetwork();

            //show laoder
            loaderService.show();

            //make request
            $timeout(function() {
                $http({
                    url: $rootScope.apiUrl + 'user/step/2/' + localStorageService.get('user_id') + '/' + localStorageService.get('token'),
                    method: "POST",
                    transformRequest: transformHttp,
                    data: {
                        'living': form.living_neighborhood_id,
                        'working': form.working_neighborhood_id,
                        'learning': form.learning_neighborhood_id
                    }
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
                                popupMessagesService.success(
                                        'Локация',
                                        'Вашите локации бяха успешно запазени.',
                                        wizardService.getLocationPathNextStep('location', '', true)
                                        );
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
        },
        updateNotifications: function(form) {
            //check for existing netowrk connection
            networkService.turnOnNetwork();

            //show laoder
            loaderService.show();

            //make request
            $timeout(function() {
                $http({
                    url: $rootScope.apiUrl + 'notifications/' + localStorageService.get('user_id') + '/' + localStorageService.get('token'),
                    method: "POST",
                    transformRequest: transformHttp,
                    data: {
                        'invite': (form.invite === true || form.invite === 1 ? 1 : 0),
                        'objects_interests': (form.objects_interests === true || form.objects_interests === 1 ? 1 : 0),
                        'news_insofia': (form.news_insofia === true || form.news_insofia === 1 ? 1 : 0),
                        'new_msg': (form.new_msg === true || form.new_msg === 1 ? 1 : 0)
                    }
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
                                popupMessagesService.success('Известия', 'Вашите настройки за известия бяха успешно променени.');
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