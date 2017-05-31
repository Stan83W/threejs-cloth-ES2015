import TextureLoader from 'three';
import MainScene from './scenes/main.js';
import Cloth from './models/cloth';
import ClothView from './views/cloth.js';
/* globals $:false */
var width = $(window).width(),
    height = $(window).height(),
    $body,
    $container,
    $sitetitle,
    $projectText,
    $projectContent,
    $flag,
    content,
    controller,
    scene,
    $projectText,
    $projectContent,
    clothView,
    isMobile = false,
    $root = '/racheldejoode';
$(function() {
    var app = {
        init: function() {
            $(window).resize(function(event) {
                app.sizeSet();
            });
            $(document).ready(function($) {
                $body = $('body');
                $container = $('#container');
                $sitetitle = $('#site-title');
                $projectText = $('#project-text');
                $projectContent = $('#project-content');
                $flag = $('#flag');
                app.sizeSet();
                app.layoutBlog();
                app.indexSelect();
                $body.on('click', '[data-target]', function(e) {
                    $el = $(this);
                    url = $el.attr('href');
                    e.preventDefault();
                    $body.addClass('loading');
                    setTimeout(function() {
                        window.location = url;
                    }, 100);
                });
                $(window).load(function() {
                    $body.addClass('loaded');
                    app.sizeSet();
                });
                window.onpageshow = function(event) {
                    setTimeout(function() {
                        $body.removeClass('loading').addClass('loaded');
                    }, 150);
                };
            });
        },
        sizeSet: function() {
            width = $(window).width();
            height = $(window).height();
            if (width <= 1024) isMobile = true;
            if (isMobile) {
                if (width >= 1024) {
                    isMobile = false;
                }
            }
            if (!isMobile) {
                $('.scroller').slimScroll({
                    height: 'auto',
                    size: '0px',
                    position: 'right',
                    color: '#000',
                    alwaysVisible: false,
                    distance: '0px',
                    railVisible: false,
                    railOpacity: 0,
                    wheelStep: 10,
                    allowPageScroll: false,
                    disableFadeOut: true
                });
            } else {
                $('.scroller').slimScroll({
                    destroy: true
                }).attr('style', '');
            }
            //app.destroyOnScroll();
            if (!isMobile) {
                if ($projectText.height() <= height) {
                    if (scene) {
                        scene.destroy(true);
                    }
                    $projectText.addClass('fixed');
                    $projectContent.addClass('fixed');
                    $projectContent.css('margin-top', $('#project-text').height() + 35);
                } else {
                    resetDescription();
                    controller = new ScrollMagic.Controller({
                        globalSceneOptions: {
                            triggerHook: 'onEnter'
                        }
                    });
                    scene = new ScrollMagic.Scene({
                        triggerElement: "#project-content",
                        duration: $projectText.outerHeight()
                    }).setPin("#project-text", {
                        pushFollowers: false
                    }).addTo(controller);
                }
            } else {
                resetDescription();
            }

            function resetDescription() {
                if (scene) {
                    scene.destroy(true);
                }
                $projectText.removeClass('fixed');
                $projectContent.removeClass('fixed').attr('style', '');
            }
        },
        indexSelect: function() {
            if (!isMobile && $('#container .inner').hasClass('home')) {
                var mainScene = new MainScene();
                var cloth = new Cloth(10, 13);
                clothView = new ClothView(cloth, '');
                mainScene.scene.add(clothView.mesh);

                function animate() {
                    window.requestAnimationFrame(animate);
                    const time = Date.now();
                    cloth.simulate(time, clothView.geometry);
                    clothView.update();
                    mainScene.render();
                }
                animate();
                $(document).on({
                    mouseenter: function() {
                        if (!isMobile) {
                            var $el = $(this);
                            var id = $el.data('id');
                            var flag = $el.data('flag');
                            $sitetitle.addClass('hide');
                            $('[data-id=' + id + ']').addClass('active');
                            $flag.removeClass('hide');
                            clothView.updateTexture(flag);
                        }
                    },
                    mouseleave: function() {
                        if (!isMobile) {
                            $sitetitle.removeClass('hide');
                            $('[data-id]').removeClass('active');
                            $flag.addClass('hide');
                        }
                    }
                }, ".project-link a");
            }
        },
        destroyOnScroll: function() {
            var destroyer = new ScrollMagic.Controller({
                globalSceneOptions: {
                    triggerHook: 'onLeave'
                }
            });
            var images = document.getElementsByClassName('content');
            for (var i = images.length - 1; i >= 0; i--) {
                new ScrollMagic.Scene({
                    triggerElement: images[i]
                }).setClassToggle(images[i], "destroy").addTo(destroyer);
            }
        },
        layoutBlog: function() {
            var $blog = $('.blog').masonry({
                columnWidth: '.grid-sizer',
                gutter: '.gutter-sizer',
                itemSelector: '.article',
                transitionDuration: 0
            });
            $blog.css('opacity', 0);
            $blog.imagesLoaded().progress(function() {
                $blog.masonry('layout');
                $blog.css('opacity', 1);
            });
        },
        loadContent: function(url, target) {
            $body.addClass('loading');
            setTimeout(function() {
                $body.scrollTop(0);
                $(target).load(url + ' #container .inner', function(response) {
                    if (content.type == "page") {
                        $body.addClass('page');
                    } else {
                        $body.removeClass('page');
                    }
                    setTimeout(function() {
                        if ($('#container .inner').hasClass('project')) {}
                        $body.removeClass('loading').addClass('loaded');
                    }, 100);
                });
            }, 200);
        },
        deferImages: function() {
            var imgDefer = document.getElementsByTagName('img');
            for (var i = 0; i < imgDefer.length; i++) {
                if (imgDefer[i].getAttribute('data-src')) {
                    imgDefer[i].setAttribute('src', imgDefer[i].getAttribute('data-src'));
                }
            }
        }
    };
    app.init();
});