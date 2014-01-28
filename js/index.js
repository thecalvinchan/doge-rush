angular.module('alexShibe',['ngRoute','ngCookies']);

angular.module('alexShibe').config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/', {
            templateUrl: 'views/game.html',
            controller: 'ShibeController'
        }).
        when('/game-over', {
            templateUrl: 'views/game-over.html',
            controller: 'ToTheMoonController'
        }).
        otherwise({
            redirectTo: '/'
        });
    }
]);

angular.module('alexShibe').factory('shibeImages', [ 
    function() {
        var srcImages = ['img/ben.jpg','img/khe.jpg','img/maurice.jpg','img/bryce.jpg','img/eren.jpg','img/matt.jpg','img/ray.jpg','img/alex.jpg'];
        var images = [];
        for (var i=0;i<srcImages.length;i++) {
            var img = new Image;
            img.src = srcImages[i]
            images.push(img);
        }
        var shibe = new Image;
        shibe.src = 'img/doge.jpg';
        images.push(shibe);
        var bowl = new Image;
        bowl.src = 'img/bowl.jpg';
        images.push(bowl);
        return images;
    }
]);

angular.module('alexShibe').controller('ToTheMoonController', ['$scope','$cookieStore','$location',
    function($scope,$cookieStore,$location) {
        $scope.score = $cookieStore.get('doge-score');
        $scope.share = function() {
            FB.login(function(response) {
                if (response.authResponse) {
                    FB.ui(
                      {
                       method: 'feed',
                       name: 'DogeRush',
                       caption: 'Just rushed with Doge',
                       description: (
                          'Just play 4 Doge Pts. \n' +
                          'Doge Score eez ' + $scope.score
                       ),
                       link: 'http://thealexpark.com',
                       picture: 'http://thealexpark.com/img/alex_full.jpg'
                      },
                      function(response) {
                        if (response && response.post_id) {
                          alert('Doge liek FB.');
                        } else {
                          alert('Doge no liek FB.');
                        }
                      }
                    );
                } else {
                    alert("Wai you no liek Doge?");
                }
            });
        };
    }
]);

angular.module('alexShibe').controller('ShibeController', ['$scope','$cookieStore','$location','shibeImages',
    function($scope,$cookieStore,$location,shibeImages) {
        $scope.shibeImages = shibeImages;
        $scope.score = 0;
        var ctx = document.getElementById('wowShibe').getContext('2d');
        var activeImages = [];
        var dogeBowl = {
            src : $scope.shibeImages[$scope.shibeImages.length-1],
            x : ctx.canvas.width/2 - 40,
            y : ctx.canvas.height-50
        };
        window.addEventListener("keydown", function(key) {
            switch(key.keyCode) {
                case 37:
                console.log("left");
                dogeBowl.x-=30;
                break;
                case 39:
                console.log("right");
                dogeBowl.x+=30;
                break;
            }    
        },true);
        $scope.start = function() {
            ctx.drawImage(dogeBowl.src,dogeBowl.x,dogeBowl.y);
            setInterval(function() {
                if (Math.random()>0.8) {
                    var fuccboi = Math.floor(Math.random()*$scope.shibeImages.length-1);
                    var shibeObj = {
                        type : 'fuccboi',
                        src : $scope.shibeImages[fuccboi],
                        x : 20 + Math.floor(Math.random()*ctx.canvas.width-20),
                        y : 0,
                    };  
                    ctx.drawImage(shibeObj.src,shibeObj.x,shibeObj.y);
                    activeImages.push(shibeObj);
                } else {
                    var shibeObj = {
                        type : 'shibe',
                        src : $scope.shibeImages[$scope.shibeImages.length-2],
                        x : 20 + Math.floor(Math.random()*ctx.canvas.width-20),
                        y : 0,
                    };  
                    ctx.drawImage(shibeObj.src,shibeObj.x,shibeObj.y);
                    activeImages.push(shibeObj);
                }
                console.log(activeImages);
            },700);
            setInterval(function() {
                ctx.clearRect(0,0, ctx.canvas.width, ctx.canvas.height);
                for(var i=0;i<activeImages.length;i++) {
                    if (activeImages[i].y > 720) {
                        activeImages.splice(i,1);
                        continue;
                    }
                    if (Math.abs(dogeBowl.y - activeImages[i].y) <= 50 && Math.abs(dogeBowl.x - activeImages[i].x) <= 25) {
                        if (activeImages[i].type == 'shibe') {
                            $scope.$apply(function() {
                                $scope.score += 20;
                            });
                        } else {
                            $scope.$apply(function() {
                                $scope.score -= 10;
                            });
                        }
                        activeImages.splice(i,1);
                        continue;
                    }
                    activeImages[i].y += 5;
                    ctx.drawImage(activeImages[i].src,activeImages[i].x,activeImages[i].y);
                }
                ctx.drawImage(dogeBowl.src,dogeBowl.x,dogeBowl.y);
            },1000/40);
            setTimeout(function(){
                $cookieStore.put('doge-score',$scope.score);
                $location.path('/game-over');
            },60000);
        }
    }
]);

