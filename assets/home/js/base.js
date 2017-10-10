function setCookie(name, value, min, domain) {
    var _cookie = name + "=" + escape(value);
    if (min) {
        var exp = new Date;
        exp.setTime(exp.getTime() + min * 60 * 1e3);
        _cookie += ";expires=" + exp.toGMTString()
    }
    if (domain) {
        _cookie += ";domain=" + escape(domain);
        _cookie += ";path=/"
    }
    document.cookie = _cookie
}

function getCookie(name) {
    var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
    if (arr != null) {
        return unescape(arr[2])
    }
    return null
}

var browser = {
    versions: function () {
        var u = navigator.userAgent, app = navigator.appVersion;
        return {
            trident: u.indexOf("Trident") > -1,
            presto: u.indexOf("Presto") > -1,
            webKit: u.indexOf("AppleWebKit") > -1,
            gecko: u.indexOf("Gecko") > -1 && u.indexOf("KHTML") === -1,
            mobile: !!u.match(/AppleWebKit.*Mobile.*/),
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
            android: u.indexOf("Android") > -1,
            iPhone: u.indexOf("iPhone") > -1,
            iPad: u.indexOf("iPad") > -1,
            webApp: u.indexOf("Safari") === -1
        }
    }(), language: (navigator.browserLanguage || navigator.language).toLowerCase()
};
var isIos = browser.versions.iPhone || browser.versions.ios || browser.versions.iPad;
var switchMobile = {
    UA: navigator.userAgent, addClass: function () {
        var _this = this;
        document.body.className = "xmbbs_mobile";
        if (!this._isMobile) {
            document.body.className = "xmbbs_desktop_mobile"
        }
    }, initBtn: function () {
        var _this = this;
        _this.$desktopBtn = $("#J_switchDesktop");
        _this.$mobileBtn = $("#J_switchMobile");
        _this.$desktopBtn.on("click.mobile", function (e) {
            e.preventDefault();
            if (!_this.$desktopBtn.hasClass("disable")) {
                setCookie("_disableMobile", 1, 60 * 24, "xiaomi.cn");
                location.reload()
            }
        });
        _this.$mobileBtn.on("click.mobile", function (e) {
            e.preventDefault();
            if (!_this.$mobileBtn.hasClass("disable")) {
                setCookie("_disableMobile", 0, 60 * 24, "xiaomi.cn");
                location.reload()
            }
        });
        if (_this._isMobile) {
            _this.$mobileBtn.addClass("disable")
        } else {
            _this.$desktopBtn.addClass("disable")
        }
    }, checkMobile: function () {
        var _this = this, _disableMobile = parseInt(getCookie("_disableMobile"));
        if (_this.UA.indexOf("Android") > -1 || _this.UA.indexOf("iPhone") > -1 || _this.UA.indexOf("iPod") > -1 || _this.UA.indexOf("Symbian") > -1) {
            if (!_disableMobile) {
                _this._isMobile = 1;
                setCookie("_disableMobile", 0, 60 * 24, "xiaomi.cn")
            } else {
                _this._isMobile = 0
            }
            _this.addClass()
        } else {
            document.body.className = "xmbbs_desktop"
        }
    }, init: function () {
        var _this = this;
        _this.checkMobile()
    }
};
var xmbbsMobile = {};
var hosturl = "";
$(function () {
    switchMobile.initBtn();
    xmbbs = {
        userHover: function () {
            $(".user_wrap").find(".user_con").on({
                mouseenter: function () {
                    $(this).show()
                }, mouseleave: function () {
                    $(this).hide()
                }
            }).end().find(".user").on({
                mouseenter: function () {
                    $(this).next().show()
                }
            })
        }, closeClick: function () {
            $("body").delegate(".modal_full,.close", "click", function () {
                $(".modal_full").remove()
            })
        }, readShow: function () {
            $(".theme_list").hover(function () {
                $(this).find(".digest").find(".read").show()
            }, function () {
                $(this).find(".digest").find(".read").hide()
            })
        }, getHost: function (url) {
            var host = "null";
            if (typeof url == "undefined" || null == url) url = window.location.href;
            var regex = /.*\:\/\/([^\/]*).*/;
            var match = url.match(regex);
            if (typeof match != "undefined" && null != match) host = match[1];
            return host
        }, checkbrower: function () {
            var brower = navigator.userAgent;
            if (brower.indexOf("MSIE") > 0) {
                if (brower.indexOf("MSIE 6.0") > 0 || brower.indexOf("MSIE 7.0") > 0 || brower.indexOf("MSIE 8.0") > 0) {
                    $("body").addClass("ie8reduce")
                }
            }
        }, fixfooter: function () {
            setTimeout(function () {
                var h_footer = $(".footer").outerHeight(false);
                var h_header = $(".head_wrap").outerHeight(true);
                var h_container = $(".container_wrap").outerHeight(true);
                var h_window = $(window).height();
                if (h_window > h_footer + h_header + h_container || $(".simpleFooter").length == 1) {
                    $(".main").css({"padding-bottom": 0})
                }
            }, 500)
        }, plateHover: function () {
            var o = $(".sidebarplate"), oBtn = o.find("span"), oUl = o.find("ul");
            oBtn.on("mouseover", function () {
                var index = $(this).index();
                oBtn.removeClass("on").eq(index).addClass("on");
                oUl.removeClass("on").eq(index).addClass("on")
            })
        }, init: function () {
            var _t = this;
            _t.userHover();
            _t.closeClick();
            _t.readShow();
            _t.url = "http://" + _t.getHost(window.location.href);
            _t.checkbrower();
            _t.fixfooter();
            _t.plateHover()
        }, url: ""
    };
    xmbbs.init();
    hosturl = xmbbs.url;
    if (switchMobile._isMobile) {
        var headerMenu = {
            $headerMenu: $(".header_menu"),
            $headerMenuToggle: $('<span class="header_menu_toggle"><i></i></span>'),
            init: function () {
                this.$headerMenu.find("span").on({
                    click: function () {
                        var $list = $(this).next(".header_menu_list, .header_more_list");
                        if ($list.filter(":visible").length > 0) {
                            $list.slideUp("fast")
                        } else {
                            $list.slideDown("fast")
                        }
                    }
                });
                this.$headerMenuToggle.find("i").on("click.xmbbs", function () {
                    $(".header_menu").toggleClass("show")
                });
                this.$headerMenu.before(this.$headerMenuToggle)
            }
        };
        var scrollBannerBottom = {
            $bannerBottom: $(".bannerBottom"), check: function () {
                if (document.body.scrollTop > document.body.scrollHeight - document.body.offsetHeight - 200) {
                    this.$bannerBottom.hide()
                } else {
                    this.$bannerBottom.show()
                }
            }, init: function () {
                var _this = this;
                $(window).on("scroll", function () {
                    _this.check()
                })
            }
        };
        var mobileSplash = {
            $hostplate: $(".hostplate"),
            $mobileSplashTemplate: $("#mobileSplashTemplate"),
            init: function () {
                if (this.$hostplate.length > 0 && this.$mobileSplashTemplate.length > 0) {
                    var _this = this;
                    if (location.href.split("#")[1] !== "splash") {
                        $("body").append(_this.$mobileSplashTemplate.html());
                        _this.$splash = $(".mobile_splash");
                        _this.$splashClose = _this.$splash.find(".splash_close");
                        _this.$splashClose.on("click.splash", function (e) {
                            e.preventDefault();
                            _this.$splash.remove()
                        })
                    }
                }
            }
        };
        var testApp = {
            testApp: function (e) {
                e.preventDefault();
                var t = 1e3, hasApp = true;
                var t1 = Date.now();
                var ifr = document.createElement("iframe");
                ifr.setAttribute("src", "xmbbsapp://bbs.xiaomi.cn/#plugin/xmbbsapp");
                ifr.setAttribute("style", "display:none");
                document.body.appendChild(ifr);
                setTimeout(function () {
                    var t2 = Date.now();
                    if (!t1 || t2 - t1 < t + 100) {
                        hasApp = false
                    }
                }, t);
                setTimeout(function () {
                    if (!hasApp) {
                        location.href = "http://api.xiaomi.cn/bbsapp/download?channel=mobile"
                    }
                    document.body.removeChild(ifr)
                }, t * 2)
            }, init: function () {
                this.$downloadM = $(".download_m");
                if (isIos) {
                    this.$downloadM.attr("href", "https://itunes.apple.com/cn/app/xiao-mi-she-qu-zui-quan-xiao/id1104874691?mt=8")
                } else {
                    this.$downloadM.on("click", this.testApp)
                }
            }
        };
        $.extend(xmbbsMobile, {scrollBannerBottom: scrollBannerBottom, testApp: testApp});
        xmbbsMobile.scrollBannerBottom.init();
        xmbbsMobile.testApp.init()
    }
});