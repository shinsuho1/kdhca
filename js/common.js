/* ================================ common ================================ */
let url = location.href.split('/')[(location.href.split('/').length - 2)];
let html = document.querySelector("html"),
    body = document.querySelector("body"),
    header = document.querySelector("header"),
    footer = document.querySelector("footer"),
    menuicon = document.querySelector(".menuicon"),
    header_gnb = document.querySelector("header .header-wrap #gnb")

$(".menuicon").on("click", function () {
    $(this).toggleClass("active");
    $("#gnb.mo").toggleClass("active");
    $("header").toggleClass("bg");
});

$("#tab-menu .menu>span").on("click", function (e) {
    e.preventDefault();
    $(this).siblings().stop().slideToggle();
});

window.addEventListener("DOMContentLoaded", function () {
    header_gnb.addEventListener("mouseenter", () => {
        header.classList.add("hover");
    });
    header.addEventListener("mouseleave", function () {
        header.classList.remove("hover");
    });


    if (window.innerWidth <= 1024) {
        if (header_gnb.classList.contains("pc")) {
            header_gnb.classList.remove("pc");
        }
        header_gnb.classList.add("mo");
    } else {
        if (header_gnb.classList.contains("mo")) {
            header_gnb.classList.remove("mo");
        }
        header_gnb.classList.add("pc");
    }

    window.addEventListener("resize", () => {
        if (window.innerWidth <= 1024) {
            if (header_gnb.classList.contains("pc")) {
                header_gnb.classList.remove("pc");
            }
            header_gnb.classList.add("mo");
        } else {
            if (header_gnb.classList.contains("mo")) {
                header_gnb.classList.remove("mo");
            }
            header_gnb.classList.add("pc");
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
            }
        });
        var main_slide = new Swiper(".main_slide", {
            effect: "fade",
            loop: true,
            autoplay: {
                delay: 8000,
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
            min_bis_li = document.querySelectorAll("#mainPage .s02 li");;
        min_bis_li.forEach((el, index) => {
            el.addEventListener("mouseenter", function () {
                main_bis.querySelector(".active").classList.remove("active");
                el.classList.add("active");
                document.querySelector(".s02 .bg img").setAttribute("src", `../images/main/business_bg0${index + 1}.png`);
            });
        });
    }

    if (url != "main") {
        let lastScroll = 0;
        window.addEventListener("scroll", () => {
            let scrollTop = window.scrollY;
            if (scrollTop > lastScroll) {
                header.classList.add("bg");
            } else {
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

function contactCheck(el) {
    if (!el.value.trim().length > 0 || el.value.trim().length == 0) {
        el.focus();
        return false;
    }
    return true;
}

const form = document.querySelector(".contact form");
if (form) {
    let f_submit = document.querySelector(".f_submit"),
        input_company = document.querySelector(".input_company_name"),
        input_name = document.querySelector(".input_name"),
        input_tel = document.querySelector(".input_tel"),
        input_email = document.querySelector(".input_email"),
        textarea_detail = document.querySelector(".input_detail"),
        input_privacy = document.querySelector(".input_privacy"),
        file_btn = document.querySelectorAll("input.file_btn"),
        file_name = document.querySelectorAll(".file_name"),
        file_size = document.querySelectorAll(".file_size"),
        num = /[0-9]/,
        email = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;

    form.addEventListener('keydown', function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
        };
    }, true);


    if (file_btn[0]) {
        file_btn.forEach((el, index) => {
            el.addEventListener("change", () => {
                if (el.files[0] == undefined) return false;
                file_name[index].textContent = el.files[0].name;
                if (el.files[0].size >= 1024) {
                    if (el.files[0].size >= (1024 * 1024 * 1024)) {
                        alert("1000MB를 초과하였습니다.");
                        file_name[index].textContent = "";
                        el.value = "";
                    } else {
                        file_name[index].innerHTML += `<span class="file_size">${(el.files[0].size / (1024 * 1024)).toFixed(2)} MB</span>`;
                    }
                } else {
                    file_name[index].innerHTML += `<span class="file_size">${(el.files[0].size / (1024 * 1024)).toFixed(10)} MB</span>`;
                }
            });
        });
    }

    function contactCheck(el) {
        if (el == input_tel && !num.test(el.value)) {
            el.focus();
            return false;
        } else if (el == input_email && !email.test(input_email.value)) {
            el.focus();
            return false;
        } else if (el == input_privacy && !el.checked) {
            el.focus();
            return false;
        } else if (!el.value.trim().length > 0 || el.value.trim().length == 0) {
            el.focus();
            return false;
        }
        return true;
    }

    f_submit.addEventListener("click", () => {
        if (!contactCheck(input_name)) {
            alert("이름을 입력해주세요");
            return false;
        }
        f_submit.disabled = false;
        form.submit();
    });


}
