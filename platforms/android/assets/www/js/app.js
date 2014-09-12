angular.module('starter', ['ionic', 'starter.controllers', 'LocalStorageModule'])

        .run(function($ionicPlatform, $rootScope, $location, $ionicModal, $state, userService) {
            $ionicPlatform.ready(function() {
                $rootScope.apiUrl = 'http://insofia.today/api/';
                
                //informations boxes
                $rootScope.informationModals = function(page) {                    
                    //create modal
                    $ionicModal.fromTemplateUrl('templates/user/information_modals/' + page + '.html', {
                        scope: $rootScope,
                        animation: 'slide-in-up'
                    }).then(function(modal) {
                        $rootScope.informationModal = modal;

                        //show modal
                        $rootScope.informationModal.show();
                    });

                    //make function to close modal
                    $rootScope.closeInformationModal = function() {
                        $rootScope.informationModal.hide();
                    };
                };

                //auth checking
                var authCheck = function(event, next) {
                    if (next.auth === true)
                    {
                        if (userService.isLoggedUser() == true)
                        {
                            //is user logged correctly
                            userService.validLoggedUser(userService);
                        }
                        else
                        {
                            $location.path('/no_side/login');
                        }
                    }
                    else if (next.auth === false)
                    {
                        if (userService.isLoggedUser() == true)
                        {
                            //is user logged correctly
                            userService.validLoggedUser(userService);

                            $location.path('/app/user/profile');
                        }
                    }
                };

                $rootScope.$on('$stateChangeSuccess', function(event, next) {
                    authCheck(event, next);
                });

                //define menu items
                $rootScope.menuItems = [
                    {
                        'title': 'Профил',
                        'locationPath': '#/app/user/profile/edit',
                        'icon': 'ion-person-stalker',
                        'background': '#d90015'
                    },
                    {
                        'title': 'Локация',
                        'locationPath': '#/app/user/location',
                        'icon': 'ion-location',
                        'background': '#e3241b'
                    },
                    {
                        'title': 'Интереси',
                        'locationPath': '#/app/user/main/interests',
                        'icon': 'ion-ios7-star',
                        'background': '#df4018'
                    },
                    {
                        'title': 'Покани',
                        'locationPath': '#/app/user/invites',
                        'icon': 'ion-android-mail',
                        'background': '#e25f19'
                    },
                    {
                        'title': 'Известия',
                        'locationPath': '#/app/user/notifications',
                        'icon': 'ion-ios7-bell',
                        'background': '#f2851b'
                    },
                    {
                        'title': 'За inSofia Today',
                        'locationPath': '#/no_side/about-insofia-today',
                        'icon': 'ion-android-note',
                        'background': '#ea811c'
                    },
                    {
                        'title': 'Изход',
                        'locationPath': '#/app/user/logout',
                        'icon': 'ion-log-out',
                        'background': '#e68f1b'
                    },
                ];

                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)
                if (window.cordova && window.cordova.plugins.Keyboard) {
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                }
                if (window.StatusBar) {
                    // org.apache.cordova.statusbar required
                    StatusBar.styleDefault();
                }
            });
        })

        .config(function($stateProvider, $urlRouterProvider, $httpProvider) {
            //http provider config
            $httpProvider.defaults.headers.common = {};
            $httpProvider.defaults.headers.post = {};
            $httpProvider.defaults.headers.put = {};
            $httpProvider.defaults.headers.patch = {};
            $httpProvider.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

            $stateProvider

                    .state('app', {
                        url: "/app",
                        abstract: true,
                        templateUrl: "templates/menu.html",
                        controller: 'AppCtrl'
                    })

                    .state('no_side', {
                        url: "/no_side",
                        abstract: true,
                        templateUrl: "templates/menu_2.html",
//                        controller: 'AppCtrl'
                    })

                    .state('no_side.home', {
                        url: "/home",
                        views: {
                            'menuContent': {
                                controller: 'HomeCtrl',
                                templateUrl: "templates/home.html"
                            }
                        },
                        auth: false
                    })
                    .state('no_side.login', {
                        url: "/login",
                        views: {
                            'menuContent': {
                                controller: 'LoginCtrl',
                                templateUrl: "templates/auth/login.html"
                            }
                        },
                        auth: false
                    })
                    .state('no_side.register', {
                        url: "/register",
                        views: {
                            'menuContent': {
                                controller: 'RegisterCtrl',
                                templateUrl: "templates/auth/register.html"
                            }
                        },
                        auth: false
                    })
                    .state('no_side.reset-password', {
                        url: "/reset-password",
                        views: {
                            'menuContent': {
                                controller: 'ResetPasswordCtrl',
                                templateUrl: "templates/auth/reset-password.html"
                            }
                        },
                        auth: false
                    })
                    .state('no_side.about-insofia-today', {
                        url: "/about-insofia-today",
                        views: {
                            'menuContent': {
                                controller: 'WhatIsInsofiaCtrl',
                                templateUrl: "templates/pages/what-is-insofia.html"
                            }
                        },
                        auth: true
                    })
                    .state('no_side.wizard-complete', {
                        url: "/wizard-complete",
                        views: {
                            'menuContent': {
                                templateUrl: "templates/pages/wizard-complete.html"
                            }
                        },
                        auth: true
                    })
                    .state('app.userprofile', {
                        url: "/user/profile",
                        views: {
                            'menuContent': {
                                controller: 'ProfileCtrl',
                                templateUrl: "templates/user/profile.html"
                            }
                        },
                        auth: true
                    })
                    .state('app.userinvites', {
                        url: "/user/invites",
                        views: {
                            'menuContent': {
                                controller: 'InvitesCtrl',
                                templateUrl: "templates/user/invites.html"
                            }
                        },
                        auth: true
                    })
                    .state('app.userprofileedit', {
                        url: "/user/profile/edit",
                        views: {
                            'menuContent': {
                                controller: 'ProfileEditCtrl',
                                templateUrl: "templates/user/forms/edit_profile.html"
                            }
                        },
                        auth: true
                    })
                    .state('app.userlocation', {
                        url: "/user/location",
                        views: {
                            'menuContent': {
                                controller: 'LocationCtrl',
                                templateUrl: "templates/user/forms/location.html"
                            }
                        },
                        auth: true
                    })
                    .state('app.usernotifications', {
                        url: "/user/notifications",
                        views: {
                            'menuContent': {
                                controller: 'NotificationsCtrl',
                                templateUrl: "templates/user/forms/notifications.html"
                            }
                        },
                        auth: true
                    })
                    .state('app.usermaininterests', {
                        url: "/user/main/interests",
                        views: {
                            'menuContent': {
                                controller: 'MainInterestsCtrl',
                                templateUrl: "templates/user/forms/interests/main.html"
                            }
                        },
                        auth: true
                    })
                    .state('app.usersubinterests', {
                        url: "/user/sub/interests",
                        views: {
                            'menuContent': {
                                controller: 'SubInterestsCtrl',
                                templateUrl: "templates/user/forms/interests/sub.html"
                            }
                        },
                        auth: true
                    })
                    .state('app.userlogout', {
                        url: "/user/logout",
                        views: {
                            'menuContent': {
                                controller: 'LogoutCtrl',
                                templateUrl: "templates/user/logout.html"
                            }
                        },
                        auth: true
                    })

            // if none of the above states are matched, use this as the fallback
            $urlRouterProvider.otherwise('/no_side/home');
        });

