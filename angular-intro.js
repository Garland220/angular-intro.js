var ngIntroModule = angular.module('angular-intro', []);


var ngIntroService = (function () {
    function ngIntroService() {
        this.intro = introJs();
    }
    ngIntroService.prototype.addListener = function (name, cb) {
        if (angular.isFunction(cb))
            notifyList[name] = cb;
    };
    ngIntroService.prototype.removeListener = function (name) {
        delete notifyList[name];
    };
    ngIntroService.prototype.notifyListeners = function (status) {
        for (var key in notifyList) {
            if (notifyList.hasOwnProperty(key)) {
                if (angular.isFunction(notifyList[key]))
                    notifyList[key](status);
            }
        }
    };
    ngIntroService.prototype.setOptions = function (options) {
        return this.intro.setOptions(options);
    };
    ngIntroService.prototype.start = function (step) {
        if (typeof (step) === 'number') {
            this.intro.goToStep(step).start();
        }
        else {
            this.intro.start();
        }
        this.notifyListeners(introStatus.open);
        return this.intro;
    };
    ngIntroService.prototype.exit = function () {
        this.notifyListeners(introStatus.closed);
        return this.intro.exit();
    };
    ngIntroService.prototype.clear = function (cb) {
        if (typeof (this.intro) !== 'undefined')
            this.intro.exit();
        this.intro = introJs();
        this.notifyListeners(introStatus.closed);
        if (angular.isFunction(cb))
            cb();
        return this.intro;
    };
    ngIntroService.prototype.goToStepNumber = function (stepId) {
        return this.intro.goToStepNumber(stepId);
    };
    ngIntroService.prototype.addHints = function () {
        return this.intro.addHints();
    };
    ngIntroService.prototype.showHint = function (hintIndex) {
        return this.intro.showHint(hintIndex);
    };
    ngIntroService.prototype.showHints = function () {
        return this.intro.showHints();
    };
    ngIntroService.prototype.hideHint = function (hintIndex) {
        return this.intro.hideHint(hintIndex);
    };
    ngIntroService.prototype.hideHints = function () {
        return this.intro.hideHints();
    };
    ngIntroService.prototype.removeHint = function (stepId) {
        return this.intro.removeHint(stepId);
    };
    ngIntroService.prototype.removeHints = function () {
        return this.intro.removeHints();
    };
    ngIntroService.prototype.previous = function () {
        this.notifyListeners(introStatus.open);
        return this.intro.previousStep();
    };
    ngIntroService.prototype.next = function () {
        this.notifyListeners(introStatus.open);
        return this.intro.nextStep();
    };
    ngIntroService.prototype.refresh = function () {
        return this.intro.refresh();
    };
    ngIntroService.prototype.onComplete = function (cb) {
        var _this = this;
        return this.intro.oncomplete(function () {
            if (angular.isFunction(cb))
                cb();
            _this.notifyListeners(introStatus.closed);
        });
    };
    ngIntroService.prototype.onExit = function (cb) {
        var _this = this;
        return this.intro.onexit(function () {
            _this.notifyListeners(introStatus.closed);
            if (angular.isFunction(cb))
                cb();
        });
    };
    ngIntroService.prototype.onBeforeChange = function (cb) {
        return this.intro.onbeforechange(function (targetElement) {
            if (angular.isFunction(cb))
                cb(targetElement);
        });
    };
    ngIntroService.prototype.onChange = function (cb) {
        return this.intro.onchange(function (targetElement) {
            if (angular.isFunction(cb))
                cb(targetElement);
        });
    };
    ngIntroService.prototype.onAfterChange = function (cb) {
        return this.intro.onafterchange(function (targetElement) {
            if (angular.isFunction(cb))
                cb(targetElement);
        });
    };
    ngIntroService.prototype.onHintClick = function (cb) {
        return this.intro.onhintclick(function () {
            if (angular.isFunction(cb))
                cb();
        });
    };
    ngIntroService.prototype.onHintClose = function (cb) {
        return this.intro.onhintclose(function () {
            if (angular.isFunction(cb))
                cb();
        });
    };
    ngIntroService.prototype.onHintsAdded = function (cb) {
        return this.intro.onhintclose(function () {
            if (angular.isFunction(cb))
                cb();
        });
    };
    return ngIntroService;
}());
ngIntroModule.service('ngIntroService', ngIntroService);


ngIntroModule.directive('ngIntroOptions', ['$timeout', '$parse', function ($timeout, $parse) {

    var notifyList = {};
    var introStatus = {
        open: 'open',
        closed: 'closed'
    };
    this.destroy = [];

    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            if (scope.ngIntroOncomplete) {
                ngIntroService.onComplete(scope.ngIntroOncomplete);
            }
            if (scope.ngIntroOnexit) {
                ngIntroService.onExit(scope.ngIntroOnexit);
            }
            if (scope.ngIntroOnbeforechange) {
                ngIntroService.onBeforeChange(scope.ngIntroOnbeforechange);
            }
            if (scope.ngIntroOnchange) {
                ngIntroService.onChange(scope.ngIntroOnchange);
            }
            if (scope.ngIntroOnafterchange) {
                ngIntroService.onAfterChange(scope.ngIntroOnafterchange);
            }
            scope.ngIntroMethod = function (step) {
                ngIntroService.setOptions(scope.ngIntroOptions);
                ngIntroService.start(step);
            };
            scope.ngIntroHintsMethod = function (step) {
                ngIntroService.setOptions(scope.ngIntroOptions);
                ngIntroService.start(step);
                if (scope.ngIntroOnhintsadded) {
                    ngIntroService.onHintsAdded(scope.ngIntroOnbeforechange);
                }
                if (scope.ngIntroOnhintclick) {
                    ngIntroService.onHintClick(scope.ngIntroOnbeforechange);
                }
                if (scope.ngIntroOnhintclose) {
                    ngIntroService.onHintClick(scope.ngIntroOnbeforechange);
                }
                ngIntroService.addHints();
            };
            scope.ngIntroShowHint = function (id) {
                ngIntroService.showHint(id);
            };
            scope.ngIntroShowHints = function () {
                ngIntroService.showHints();
            };
            scope.ngIntroHideHint = function (id) {
                ngIntroService.hideHint(id);
            };
            scope.ngIntroHideHints = function () {
                ngIntroService.hideHints();
            };
            scope.ngIntroNextMethod = function () {
                ngIntroService.next();
            };
            scope.ngIntroPreviousMethod = function () {
                ngIntroService.previous();
            };
            scope.ngIntroExitMethod = function (callback) {
                ngIntroService.exit();
                if (angular.isFunction(callback))
                    callback();
            };
            scope.ngIntroRefreshMethod = function () {
                ngIntroService.refresh();
            };
            var autoStartWatch = scope.$watch('ngIntroAutostart', function () {
                if (scope.ngIntroAutostart) {
                    $timeout(function () {
                        scope.ngIntroMethod();
                    });
                }
                autoStartWatch();
            });
            this.destroy.push(scope.$on('$locationChangeStart', function () {
                ngIntroService.exit();
            }));
            this.destroy.push(scope.$on('$locationChangeSuccess', function () {
                ngIntroService.exit();
            }));
            if (scope.ngIntroAutorefresh) {
                this.destroy.push(scope.$watch(function () {
                    ngIntroService.refresh();
                }));
            }
            this.destroy.push(scope.$on('$destroy', function () {
                ngIntroService.exit();
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
