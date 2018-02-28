var ngIntroModule = angular.module('angular-intro', []);


var service = function () {
    this.intro = introJs();

    this.addListener = function (name, cb) {
        if (angular.isFunction(cb))
            notifyList[name] = cb;
    };
    this.removeListener = function (name) {
        delete notifyList[name];
    };
    this.notifyListeners = function (status) {
        for (var key in notifyList) {
            if (notifyList.hasOwnProperty(key)) {
                if (angular.isFunction(notifyList[key]))
                    notifyList[key](status);
            }
        }
    };
    this.setOptions = function (options) {
        return this.intro.setOptions(options);
    };
    this.start = function (step) {
        if (typeof (step) === 'number') {
            this.intro.goToStep(step).start();
        }
        else {
            this.intro.start();
        }
        this.notifyListeners(introStatus.open);
        return this.intro;
    };
    this.exit = function () {
        this.notifyListeners(introStatus.closed);
        return this.intro.exit();
    };
    this.clear = function (cb) {
        if (typeof (this.intro) !== 'undefined')
            this.intro.exit();
        this.intro = introJs();
        this.notifyListeners(introStatus.closed);
        if (angular.isFunction(cb))
            cb();
        return this.intro;
    };
    this.goToStepNumber = function (stepId) {
        return this.intro.goToStepNumber(stepId);
    };
    this.addHints = function () {
        return this.intro.addHints();
    };
    this.showHint = function (hintIndex) {
        return this.intro.showHint(hintIndex);
    };
    this.showHints = function () {
        return this.intro.showHints();
    };
    this.hideHint = function (hintIndex) {
        return this.intro.hideHint(hintIndex);
    };
    this.hideHints = function () {
        return this.intro.hideHints();
    };
    this.removeHint = function (stepId) {
        return this.intro.removeHint(stepId);
    };
    this.removeHints = function () {
        return this.intro.removeHints();
    };
    this.previous = function () {
        this.notifyListeners(introStatus.open);
        return this.intro.previousStep();
    };
    this.next = function () {
        this.notifyListeners(introStatus.open);
        return this.intro.nextStep();
    };
    this.refresh = function () {
        return this.intro.refresh();
    };
    this.onComplete = function (cb) {
        var _this = this;
        return this.intro.oncomplete(function () {
            if (angular.isFunction(cb))
                cb();
            _this.notifyListeners(introStatus.closed);
        });
    };
    this.onExit = function (cb) {
        var _this = this;
        return this.intro.onexit(function () {
            _this.notifyListeners(introStatus.closed);
            if (angular.isFunction(cb))
                cb();
        });
    };
    this.onBeforeChange = function (cb) {
        return this.intro.onbeforechange(function (targetElement) {
            if (angular.isFunction(cb))
                cb(targetElement);
        });
    };
    this.onChange = function (cb) {
        return this.intro.onchange(function (targetElement) {
            if (angular.isFunction(cb))
                cb(targetElement);
        });
    };
    this.onAfterChange = function (cb) {
        return this.intro.onafterchange(function (targetElement) {
            if (angular.isFunction(cb))
                cb(targetElement);
        });
    };
    this.onHintClick = function (cb) {
        return this.intro.onhintclick(function () {
            if (angular.isFunction(cb))
                cb();
        });
    };
    this.onHintClose = function (cb) {
        return this.intro.onhintclose(function () {
            if (angular.isFunction(cb))
                cb();
        });
    };
    this.onHintsAdded = function (cb) {
        return this.intro.onhintclose(function () {
            if (angular.isFunction(cb))
                cb();
        });
    };
};

ngIntroModule.service('ngIntroService', service);


ngIntroModule.directive('ngIntroOptions', ['$timeout', '$parse', function ($timeout, $parse) {

    var notifyList = {};
    var introStatus = {
        open: 'open',
        closed: 'closed'
    };

    return {
        restrict: 'A',
        destroy: [],
        intro: introJs(),
        scope: {
            ngIntroMethod: "=",
            ngIntroExitMethod: "=?",
            ngIntroNextMethod: "=?",
            ngIntroPreviousMethod: "=?",
            ngIntroRefreshMethod: "=?",
            ngIntroOptions: "=",
            ngIntroOncomplete: "=",
            ngIntroOnexit: "=",
            ngIntroOnchange: "=",
            ngIntroOnbeforechange: "=",
            ngIntroOnafterchange: "=",
            ngIntroAutostart: "=",
            ngIntroAutorefresh: "=",
            ngIntroHintsMethod: "=?",
            ngIntroOnhintsadded: "=",
            ngIntroOnhintclick: "=?",
            ngIntroOnhintclose: "=?",
            ngIntroShowHint: "=?",
            ngIntroShowHints: "=?",
            ngIntroHideHint: "=?",
            ngIntroHideHints: "=?"
        },
        link: function(scope, element, attrs) {
            if (scope.ngIntroOncomplete) {
                this.intro.oncomplete(scope.ngIntroOncomplete);
            }
            if (scope.ngIntroOnexit) {
                this.intro.onexit(scope.ngIntroOnexit);
            }
            if (scope.ngIntroOnbeforechange) {
                this.intro.onbeforechange(scope.ngIntroOnbeforechange);
            }
            if (scope.ngIntroOnchange) {
                this.intro.onchange(scope.ngIntroOnchange);
            }
            if (scope.ngIntroOnafterchange) {
                this.intro.onafterchange(scope.ngIntroOnafterchange);
            }
            scope.ngIntroMethod = function (step) {
                this.intro.setOptions(scope.ngIntroOptions);
                this.intro.start(step);
            };
            scope.ngIntroHintsMethod = function (step) {
                this.intro.setOptions(scope.ngIntroOptions);
                this.intro.start(step);
                if (scope.ngIntroOnhintsadded) {
                    this.intro.onhintclose(scope.ngIntroOnbeforechange);
                }
                if (scope.ngIntroOnhintclick) {
                    this.intro.onhintclick(scope.ngIntroOnbeforechange);
                }
                if (scope.ngIntroOnhintclose) {
                    this.intro.onhintclose(scope.ngIntroOnbeforechange);
                }
                this.intro.addHints();
            };
            scope.ngIntroShowHint = function (id) {
                this.intro.showHint(id);
            };
            scope.ngIntroShowHints = function () {
                this.intro.showHints();
            };
            scope.ngIntroHideHint = function (id) {
                this.intro.hideHint(id);
            };
            scope.ngIntroHideHints = function () {
                this.intro.hideHints();
            };
            scope.ngIntroNextMethod = function () {
                this.intro.nextStep();
            };
            scope.ngIntroPreviousMethod = function () {
                this.intro.previousStep();
            };
            scope.ngIntroExitMethod = function (callback) {
                this.intro.exit();
                if (angular.isFunction(callback)) {
                    callback();
                }
            };
            scope.ngIntroRefreshMethod = function () {
                this.intro.refresh();
            };
            var autoStartWatch = scope.$watch('ngIntroAutostart', function () {
                if (scope.ngIntroAutostart) {
                    var _this = this;
                    $timeout(function () {
                        // $parse(attrs.ngIntroMethod)(scope)();
                        scope.ngIntroMethod.call(_this);
                    });
                }
                autoStartWatch();
            });
            this.destroy.push(scope.$on('$locationChangeStart', function () {
                this.intro.exit();
            }));
            this.destroy.push(scope.$on('$locationChangeSuccess', function () {
                this.intro.exit();
            }));
            if (scope.ngIntroAutorefresh) {
                this.destroy.push(scope.$watch(function () {
                    this.intro.refresh();
                }));
            }
            this.destroy.push(scope.$on('$destroy', function () {
                this.intro.exit();
            }));
            scope.$on("$destroy", function () {
                clearWatches();
            });
            var clearWatches = function () {
                for (var _i = 0, _a = this.destroy; _i < _a.length; _i++) {
                    var d = _a[_i];
                    d();
                }
            };
        }
    }
}]);


ngIntroModule.directive('ngIntroDisableButton', ['ngIntroService', function (ngIntroService) {
    var id = 0;
    return {
        restrict: "A",
        priority: 1,
        link: function (scope, elm, attrs) {
            var uniqueId = 'disabledBtn' + id++;
            ngIntroService.addListener(uniqueId, function (value) {
                if (value === introStatus.open) {
                    attrs.$set('disabled', 'disabled');
                }
                else {
                    delete attrs.disabled;
                    elm.removeAttr('disabled');
                }
            });
            scope.$on('$destroy', function () {
                ngIntroService.removeListener(uniqueId);
            });
        }
    };
}]);
