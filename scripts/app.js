/**
*
* write by @snhasani - Sunday 19 April 2015
*
**/


(function(window, document, undefined) {

    /*===================================
    =            Model            =
    ===================================*/

    var model = {
        cache: null,
        init : function() {
            this.cache = octopus.getCache('cats');

            if (this.cache) {
                console.log('is cached');
                this.currentCat.prop = this.cache['1'];
                octopus.syncCats(this.cache);
            } else {
                console.log('is not cached');
                this.currentCat.prop = this.cats['1'];
                octopus.setCache('cats', this.cats);
            }
        },
        currentCat: {
            isClicked: false,
            prop: null
        },
        cats: {
            1: {
                name: 'Tabby',
                imgSrc: 'assets/img/cats/cat_picture1.jpg',
                clickCount: 0,
                id: 1
            },
            2: {
                name: 'Tiger',
                imgSrc: 'assets/img/cats/cat_picture3.jpeg',
                clickCount: 0,
                id: 2
            },
            3: {
                name: 'Scaredy',
                imgSrc: 'assets/img/cats/cat_picture2.jpeg',
                clickCount: 0,
                id: 3
            },
            4: {
                name: 'Shadow',
                imgSrc: 'assets/img/cats/cat_picture4.jpeg',
                clickCount: 0,
                id: 4
            },
            5: {
                name: 'Sleepy',
                imgSrc: 'assets/img/cats/cat_picture5.jpeg',
                clickCount: 0,
                id: 5
            }
        }
    };

    /*-----  End of Model  ------*/


    /*============================
    =            Views            =
    ============================*/

    var catView = {
        init: function() {
            this.catModelContainer =
                document.getElementsByClassName('cat-model');
            this.catTemplate =
                document.getElementById('cat-tpl').innerHTML;

            this.render();
        },

        render: function() {
            var currentCat = octopus.getCurrentCat().prop;
            this.catModelContainer[0].innerHTML = '';
            this.catModelContainer[0].innerHTML =
                utils.twt(this.catTemplate, currentCat);

            document.getElementsByClassName('cat-model__image')[0]
                .addEventListener('click', function(evt) {
                    octopus.incrementClickCounter();
                });
        }
    }

    var catsListView = {
        init: function() {
            this.catsListContainer =
                document.getElementsByClassName('cats-list');
            this.render();
        },

        render: function() {
            var cat, elem, i;

            var cats = octopus.getCats();

            this.catsListContainer[0].innerHTML = '';

            for (cat in cats) {
                cat = cats[cat];
                liElem = document.createElement('li');
                imgElem = document.createElement('img');
                imgElem.setAttribute('src', cat.imgSrc);
                liElem.appendChild(imgElem);

                imgElem.addEventListener('click', (function(catCopy) {
                    return function() {
                        var currentCat = octopus.getCurrentCat();
                        if (currentCat.isClicked) {
                            var cache = octopus.getCache('cats');
                            cache[currentCat.prop.id]
                                .clickCount = currentCat.prop.clickCount;
                            octopus.setCache('cats', cache);
                            console.log('counter is cached');
                        }
                        octopus.setCurrentCat(catCopy);
                        octopus.resetCurrentCatClickStatus();
                        catView.render();
                    };
                })(cat));

                this.catsListContainer[0].appendChild(liElem);
            }
        }
    };

    /*-----  End of Views  ------*/


    /*===============================
    =            Octopus            =
    ===============================*/

    var octopus = {
        init: function() {
            model.init();

            catsListView.init();
            catView.init();
        },

        getCats: function() {
            return model.cats;
        },

        getCurrentCat: function() {
            return model.currentCat;
        },

        setCurrentCat: function(cat) {
            model.currentCat.prop = cat;
        },

        incrementClickCounter: function() {
            if (model.currentCat.isClicked === false) {
                model.currentCat.isClicked = true;
            }
            model.currentCat.prop.clickCount++;
            catView.render();
        },

        resetCurrentCatClickStatus : function() {
            model.currentCat.isClicked = false;
        },

        isClicked: function() {
            return model.currentCat.isClicked;
        },

        getCache: function(item) {
            return JSON.parse(window.localStorage.getItem(item));
        },

        setCache: function(item, value) {
            window.localStorage.setItem(item, JSON.stringify(value));
        },

        syncCats : function(cats) {
            model.cats = cats;
        }

    };

    /*-----  End of Octopus  ------*/


    /*=============================
    =            Utils            =
    =============================*/

    var utils = {
        twt : function(t, d) {
            var s = t;
            for(var p in d) {
                s = s.replace(new RegExp('{'+p+'}','g'), d[p]);
            }
            return s;
        }
    }

    /*-----  End of Utils  ------*/





    if (window.addEventListener) {
        window.addEventListener('DOMContentLoaded', octopus.init(), null);
    }

})(window, document);
