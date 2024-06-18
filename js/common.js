/* ================================ common ================================ */
let url = location.href.split('/')[(location.href.split('/').length - 2)];
let html = document.querySelector("html"),
    body = document.querySelector("body"),
    header = document.querySelector("header"),
    footer = document.querySelector("footer"),
    menuicon = document.querySelector(".menuicon"),
    header_gnb = document.querySelector("header .header-wrap #gnb")
    header_blur = document.querySelector(".header_blur");
$(".menuicon").on("click", function () {
    $(".header-wrap .gnb-wrap").addClass("active");
});
$(".gnb-wrap .close").on("click",function(){
    $(".header-wrap .gnb-wrap").removeClass("active");
});


$("#tab-menu .menu>span").on("click", function (e) {
    e.preventDefault();
    $(this).parent().toggleClass("active");
    $(this).siblings().stop().slideToggle();
});



window.addEventListener("DOMContentLoaded", function () {

    if (window.innerWidth <= 1024) {
        if (header_gnb.classList.contains("pc")) {
            $(".header-wrap #gnb").off("mouseenter");
            $("header").off("mouseleave");
            header_gnb.classList.remove("pc");
        }
        header_gnb.classList.add("mo");
        $("#gnb.mo>li>a").on("click",function(e){
            e.preventDefault();
            $(this).toggleClass("active")
            $(this).siblings().stop().slideToggle();
        });
    } else {
        if (header_gnb.classList.contains("mo")) {
            $("#gnb.mo>li>a").off("click");
            header_gnb.classList.remove("mo");
        }
        header_gnb.classList.add("pc");
        $(".header-wrap #gnb").on("mouseenter",function(){
            $("header").addClass("hover");
            $("header_blur").addClass("on");
        });
        $("header").on("mouseleave",function(){
            $("header").removeClass("hover");
            $("header_blur").removeClass("on");
        });
    }

    window.addEventListener("resize", () => {
        if (window.innerWidth <= 1024) {
            if (header_gnb.classList.contains("pc")) {
                $(".header-wrap #gnb").off("mouseenter");
                $("header").off("mouseleave");    
                header_gnb.classList.remove("pc");
            }
            header_gnb.classList.add("mo");
            $("#gnb.mo>li>a").on("click",function(e){
                e.preventDefault();
                $(this).toggleClass("active")
                $(this).siblings().stop().slideToggle();
            });
        } else {
            if (header_gnb.classList.contains("mo")) {
                $("#gnb.mo>li>a").off("click");
                header_gnb.classList.remove("mo");
            }
            header_gnb.classList.add("pc");
            $(".header-wrap #gnb").on("mouseenter",function(){
                $("header").addClass("hover");
                $("header_blur").addClass("on");
            });
            $("header").on("mouseleave",function(){
                $("header").removeClass("hover");
                $("header_blur").removeClass("on");
            });
        }
    });
    if (document.querySelector("#mainPage")) {
        $('#mainPage').fullpage({
            navigation: false,
            autoScrolling: true,
            scrollOverflow: true,
            scrollHorizontally: true,
            fadingEffect: true,
            slideSelector: '.slide',
            keyboardScrolling: false,
            // responsiveWidth: 1340,
            'onLeave': function (index, nextIndex, direction) {
                if (index == 1 && direction == "down") {
                    header.classList.add("bg");
                } else if (index == 2 && direction == "up") {
                    header.classList.remove("bg");
                }
                if(index < 5 && direction == "down"){
                    document.querySelectorAll("#mainPage .section")[index].classList.add("load");
                }
            }
        });

        document.querySelector(".page-arrow").addEventListener("click",()=>{
            $.fn.fullpage.moveTo(2, 1);

        });

        var main_slide = new Swiper(".main_slide", {
            effect: "fade",
            loop: true,
            autoplay: {
                delay: 5000,
            },
            speed: 1000,
            pagination: {
                el: ".swiper-pagination",
                type: "fraction",
            },
        });

        var main_s04_banner = new Swiper("#mainPage .s04 .swiper", {
            loop: true,
            touchRatio: 0,
            watchSlidesProgress: true,
            autoplay: {
                delay: 0,
                disableOnInteraction: true,
            },
            spaceBetween: 60,
            speed: 8000,
            breakpoints: {
                1600: {
                    slidesPerView: 8,
                },
                1340: {
                    slidesPerView: 7,
                    spaceBetween: 40,
                },
                1024: {
                    slidesPerView: 7,
                    spaceBetween: 30,
                },
                767: {
                    slidesPerView: 5,
                    spaceBetween: 20,
                },
                450: {
                    slidesPerView: 4,
                },
                0: {
                    slidesPerView: 3,
                }
            }
        });
        let main_bis = document.querySelector("#mainPage .s02 ul"),
            min_bis_li = document.querySelectorAll("#mainPage .s02 li");
        min_bis_li.forEach((el, index) => {
            el.addEventListener("mouseenter", function () {
                main_bis.querySelector(".active").classList.remove("active");
                el.classList.add("active");
                document.querySelector(".s02 .bg").style.backgroundImage = `url(../images/main/business_bg0${index + 1}.png)`;
            });
        });
    }

    if (url != "main") {
        let lastScroll = 0;
        window.addEventListener("scroll", () => {
            if (window.innerWidth <= 1024 && header_gnb.classList.contains("active")) return false;
            let scrollTop = window.scrollY;
            if(scrollTop > 0){
                header.classList.add("bg");
            }else{
                header.classList.remove("bg");
            }
            lastScroll = scrollTop;

        });
    }
    if(document.querySelector("#subPage.information.member")){
        document.querySelectorAll(".content .box ul li a").forEach((el,index)=>{
            el.innerHTML += `<div class="member-name"><span>${el.querySelector("img").getAttribute("alt")}</span></div>`
        });
    }

});


$("#gnb.mo>li>a").on("click", function (e) {
    e.preventDefault();
    $(this).siblings(".sub-menu").stop().slideToggle();
});








/* ================================ contact ================================ */

