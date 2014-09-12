var app = angular.module('starter.controllers', [])

        .controller('AppCtrl', function($scope) {
        })

        .controller('HomeCtrl', function($scope) {
        })

        .controller('ProfileCtrl', function($scope) {
        })

        .controller('InvitesCtrl', function($scope) {
        })

        .controller('WhatIsInsofiaCtrl', function($scope, wizardService) {
            $scope.startLocationPath = function(defaultLocationPath) {
                return wizardService.getLocationPathNextStep('presentation', defaultLocationPath);
            };
        })

        .controller('ProfileEditCtrl', function($rootScope, $scope, $http, $timeout, transformHttp, userService, localStorageService, loaderService) {
            //show loader
            loaderService.show();

            //
            $scope.sexLabelClicked = function(mark, unmark) {
                $('i.' + unmark).css('color', '#000');
                $('i.' + mark).css('color', '#ed7420');
            };

            //contain form data
            $scope.form = {};

            //load currently seted data    
            $timeout(function() {
                $http({
                    url: $rootScope.apiUrl + 'user/data/' + localStorageService.get('user_id') + '/' + localStorageService.get('token'),
                    method: "GET",
                    transformRequest: transformHttp
                })
                        .success(function(result) {
                            //load data in form
                            $scope.form = {
                                'sex': result.sex,
                                'birthday': result.date_of_birth,
                                'phone': result.phone,
                                'alternative_email': result.alternative_email
                            };

                            //check sex
                            if (result.sex === 1)
                            {
                                $scope.sexLabelClicked('ion-man', 'ion-woman');
                            }
                            else if (result.sex === 2)
                            {
                                $scope.sexLabelClicked('ion-woman', 'ion-man');
                            }

                            //hide loader
                            loaderService.hide();
                        })
                        .error(function() {
                            //hide loader
                            loaderService.hide();

                            //show popup
                            userService.showExpiredUserTokenPopup();
                        });
            }, 1000);

            //grab submit event
            $scope.doForm = function() {
                userService.updateUser($scope.form);
            };
        })

        .controller('LocationCtrl', function($rootScope, $scope, $ionicModal, $http, $timeout, transformHttp, userService, localStorageService, loaderService, neighborhoodsService) {
            //show loader
            loaderService.show();

            //load neighborhoods
            neighborhoodsService.get();

            //contain form data
            $rootScope.form = {};

            $rootScope.bindNegihborhoodName = function(id, formKey) {
                var neigh = $rootScope.neighborhoods;

                if (typeof neigh !== 'undefined')
                {
                    var detectID = parseInt(id);

                    $.each(neigh, function(key, value) {
                        if (value.id == detectID)
                        {
                            $rootScope.form[formKey] = value.title;
                        }
                    });
                }
            };

            //set form watch
//            $rootScope.$watchCollection('form', function(newValue, oldValue) {
//                $rootScope.bindNegihborhoodName(newValue.living_neighborhood_id, 'neigh_living');
//                $rootScope.bindNegihborhoodName(newValue.learning_neighborhood_id, 'neigh_learning');
//                $rootScope.bindNegihborhoodName(newValue.working_neighborhood_id, 'neigh_working');
//            });

            //neighborhoods modal
            $scope.openNeighborhoodModal = function(name) {
                //create modal
                $ionicModal.fromTemplateUrl('templates/user/information_modals/neighborhoods_' + name + '.html', {
                    scope: $rootScope,
                    animation: 'slide-in-up'
                }).then(function(modal) {
                    $rootScope.neighborhoodModal = modal;

                    //show modal
                    $rootScope.neighborhoodModal.show();
                });

                //make function to close modal
                $rootScope.closeNeighborhoodModal = function() {
                    $rootScope.neighborhoodModal.hide();
                };
            };

            //load currently seted data    
            $timeout(function() {
                $http({
                    url: $rootScope.apiUrl + 'user/data/' + localStorageService.get('user_id') + '/' + localStorageService.get('token'),
                    method: "GET",
                    transformRequest: transformHttp
                })
                        .success(function(result) {
                            //set data
                            $rootScope.form = {
                                'living_neighborhood_id': result.living_neighborhood_id,
                                'working_neighborhood_id': result.working_neighborhood_id,
                                'learning_neighborhood_id': result.learning_neighborhood_id,
                            };

                            //hide loader
                            loaderService.hide();
                        })
                        .error(function() {
                            //hide loader
                            loaderService.hide();

                            //show popup
                            userService.showExpiredUserTokenPopup();
                        });
            }, 1000);

            //grab submit event
            $scope.doForm = function() {
                userService.updateNeighborhoods($rootScope.form);
            };
        })

        .controller('NotificationsCtrl', function($rootScope, $scope, $http, $timeout, transformHttp, userService, localStorageService, loaderService) {
            //show loader
            loaderService.show();

            //contain form data
            $scope.form = {};

            //load currently seted data    
            $timeout(function() {
                $http({
                    url: $rootScope.apiUrl + 'notifications/' + localStorageService.get('user_id') + '/' + localStorageService.get('token'),
                    method: "GET",
                    transformRequest: transformHttp
                })
                        .success(function(result) {
                            //load data in form
                            $scope.form = result;

                            //hide loader
                            loaderService.hide();
                        })
                        .error(function() {
                            //hide loader
                            loaderService.hide();

                            //show popup
                            userService.showExpiredUserTokenPopup();
                        });
            }, 1000);

            //grab submit event
            $scope.doForm = function() {
                userService.updateNotifications($scope.form);
            };
        })

        .controller('MainInterestsCtrl', function($rootScope, $scope, $http, $timeout, transformHttp, userService,
                interestsService, localStorageService, loaderService) {
            //show loader
            loaderService.show();

            //contain form data
            $scope.form = {};
            $scope.newForm = {};

            $scope.loadMainInterests = function() {
                $timeout(function() {
                    $http({
                        url: $rootScope.apiUrl + 'interests/main-interests/' + localStorageService.get('user_id') + '/' + localStorageService.get('token'),
                        method: "GET",
                        transformRequest: transformHttp
                    })
                            .success(function(result) {
                                //load data in form
                                $scope.form = result;

                                $.each(result, function(key, value) {
                                    $scope.newForm[value.id] = (value.checked === true ? 1 : 0);
                                });

                                //hide loader
                                loaderService.hide();
                            })
                            .error(function() {
                                //hide loader
                                loaderService.hide();

                                //show popup
                                userService.showExpiredUserTokenPopup();
                            })
                            .finally(function() {
                                // Stop the ion-refresher from spinning
                                $scope.$broadcast('scroll.refreshComplete');
                            });
                    ;
                }, 1000);
            };

            //timeout
            $scope.loadMainInterests();

            //grab submit event
            $scope.doForm = function() {
                //clear past setted main interests
                var passedMainInterests = {};

                $.each($scope.newForm, function(key, value) {
                    if (value === 1 || value === true)
                    {
                        passedMainInterests[parseInt(key)] = false;
                    }
                });

                localStorageService.set('passedMainInterests', passedMainInterests);

                //update main interests
                interestsService.updateMainInterests($scope.newForm);
            };
        })

        .controller('SubInterestsCtrl', function($rootScope, $scope, $http, $timeout, $ionicModal, $location, transformHttp, userService,
                interestsService, localStorageService, loaderService) {

            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                event.preventDefault();
                console.log('$stateChangeStart');
            });

            //contain form data
            $scope.mainInterests = {};

            //make function to count sub interests
            $scope.countSelectedSubInterests = function(id) {
                return interestsService.getCountSelectedSubInterests(id);
            };

            //make modal function
            $scope.openSubInterestModal = function(id) {
                var mainID = parseInt(id);

                //show loader
                loaderService.show();

                //load sub interest
                $rootScope.checked = {};
                $rootScope.diffChecked = {}
                $rootScope.subInterestModal = interestsService.getSubInterests(mainID);

                $rootScope.updateSubInterests = function() {
                    interestsService.checkForDifferenceSubInterests(mainID, true);
                };

                //create modal
                $ionicModal.fromTemplateUrl('templates/user/information_modals/subInterests.html', {
                    scope: $rootScope,
                    animation: 'slide-in-left'
                }).then(function(modal) {
                    $rootScope.subInterestsModal = modal;

                    //show modal
                    $rootScope.subInterestsModal.show();

                    //hide loader
                    loaderService.hide();
                });

                //make function to close modal
                $rootScope.closeSubInterestsModal = function() {
                    //set passed interests
                    var passedMainInterests = localStorageService.get('passedMainInterests');

                    //set new passed
                    passedMainInterests[mainID] = true;

                    //set to local storage new passed interests
                    localStorageService.set('passedMainInterests', passedMainInterests);

                    //reload main interest
                    $scope.loadMainInterests();

                    //hide modal
                    $rootScope.subInterestsModal.hide();
                };
            };

            var openNextModal = function() {
                var userData = localStorageService.get('userData');
                var wizardComplete = userData.wizard_complete;
                var passedMainInterests = localStorageService.get('passedMainInterests');

                if (wizardComplete !== 1)
                {
                    var founded = false;

                    $.each(passedMainInterests, function(mainInterestID, isPassed) {
                        var mainID = parseInt(mainInterestID);

                        if (founded === false && mainID > 0 && isPassed === false)
                        {
                            //open modal
                            $scope.openSubInterestModal(mainID);

                            //set founded
                            founded = true;
                        }
                    });

                    if (founded === false)
                    {
                        $location.path('/no_side/wizard-complete');
                    }
                }
            };

            //load main interests
            $scope.loadMainInterests = function(noLoader) {
                if (noLoader !== true)
                {
                    //show loader
                    loaderService.show();
                }

                //Load sub interest
                interestsService.loadSubInterests();

                $timeout(function() {
                    $http({
                        url: $rootScope.apiUrl + 'interests/main-interests/' + localStorageService.get('user_id') + '/' + localStorageService.get('token'),
                        method: "GET",
                        transformRequest: transformHttp
                    })
                            .success(function(result) {
                                $.each(result, function(key, value) {
                                    if (value.checked === 1 || value.checked === true)
                                    {
                                        //load data in form
                                        $scope.mainInterests[key] = value;
                                    }
                                });

                                //hide loader
                                loaderService.hide();

                                //open modal
                                openNextModal();
                            })
                            .error(function() {
                                //hide loader
                                loaderService.hide();

                                //show popup
                                userService.showExpiredUserTokenPopup();
                            })
                            .finally(function() {
                                // Stop the ion-refresher from spinning
                                $scope.$broadcast('scroll.refreshComplete');
                            });
                    ;
                }, 1000);
            };

            //timeout
            $scope.loadMainInterests();
        })

        .controller('LogoutCtrl', function(userService) {
            userService.logoutUser();
        })

        .controller('LoginCtrl', function($scope, userService) {
            $scope.loginData = {};

            $scope.doLogin = function() {
                userService.loginUser($scope.loginData);
            };
        })

        .controller('RegisterCtrl', function($rootScope, $scope, userService) {
            $rootScope.registerData = {};

            $scope.doRegister = function() {
                userService.createUser($rootScope.registerData, userService);
            };
        })

        .controller('ResetPasswordCtrl', function($rootScope, $scope, userService) {
            $rootScope.resetData = {};

            $scope.doReset = function() {
                userService.resetUserPassword($rootScope.resetData);
            };
        });