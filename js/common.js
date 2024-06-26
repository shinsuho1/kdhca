/* ================================ common ================================ */
let url = location.href.split('/')[(location.href.split('/').length - 2)];
let html = document.querySelector("html"),
    body = document.querySelector("body"),
    header = document.querySelector("header"),
    footer = document.querySelector("footer"),
    menuicon = document.querySelector(".menuicon"),
    header_gnb = document.querySelector("header .header-wrap #gnb"),
    header_blur = document.querySelector(".header_blur");

document.querySelector(".fax_copy").addEventListener("click", function(e) {
    e.preventDefault();
    let text = document.querySelector(".fax_copy").textContent.trim().replace(/[^0-9]/g,"");
    window.navigator.clipboard.writeText(text).then(() => {
        alert("복사되었습니다.");
    });
});


window.addEventListener("load", function () {
    setTimeout(() => {
        window.scrollTo({ top: 0 })
    }, 50);
});

window.addEventListener("DOMContentLoaded", function () {
    $(".menuicon").on("click", function (e) {
        $(".header-wrap .gnb-wrap").addClass("active");
    });

    $(".gnb-wrap .close").on("click", function (e) {
        $(".header-wrap .gnb-wrap").removeClass("active");
    });

    $("#tab-menu .menu>span").on("click", function (e) {
        e.preventDefault();
        $(this).parent().toggleClass("active");
        $(this).siblings().stop().slideToggle();
    });

    $("#gnb>li>a").off("click").click(function (e) {
        if (window.innerWidth <= 1024 && ($(this).siblings(".sub-menu").length > 0)) {
            e.preventDefault();
            $(this).toggleClass("active");
            $(".sub-menu").stop().slideUp();
            $(this).siblings(".sub-menu").stop().slideToggle();
        }
    });

    $(".header-wrap #gnb").off("mouseenter").mouseenter(function (e) {
        if (window.innerWidth > 1024) {
            $("header").addClass("hover");
            $(".header_blur").addClass("on");
        }
    });

    $("header").off("mouseleave").mouseleave(function (e) {
        if (window.innerWidth > 1024) {
            $("header").removeClass("hover");
            $(".header_blur").removeClass("on");
        }
    });

    if (window.scrollY > 0) {
        header.classList.add("bg");
    }

    if (url == "main") {
        $('#mainPage').fullpage({
            navigation: false,
            autoScrolling: true,
            scrollOverflow: true,
            scrollHorizontally: true,
            fadingEffect: true,
            slideSelector: '.slide',
            keyboardScrolling: false,
            'onLeave': function (index, nextIndex, direction) {
                if (index == 1 && direction == "down") {
                    header.classList.add("bg");
                } else if (index == 2 && direction == "up") {
                    header.classList.remove("bg");
                }
                if (index < 5 && direction == "down") {
                    document.querySelectorAll("#mainPage .section")[index].classList.add("load");
                }
            }
        });

        document.querySelector(".page-arrow").addEventListener("click", () => {
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
            navigation: {
                nextEl: ".main_slide_btns .next",
                prevEl: ".main_slide_btns .prev",
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
            speed: 8000,
            breakpoints: {
                1700: {
                    slidesPerView: 8,
                    spaceBetween: 60,
                },
                1340: {
                    slidesPerView: 6,
                    spaceBetween: 40,
                },
                1024: {
                    slidesPerView: 6,
                    spaceBetween: 30,
                },
                767: {
                    slidesPerView: 5,
                    spaceBetween: 20,
                },
                450: {
                    slidesPerView: 4,
                    spaceBetween: 15,
                },
                0: {
                    slidesPerView: 3,
                    spaceBetween: 10,
                }
            },
            on: {
                resize: function (el) {
                    setTimeout(() => {
                        el.autoplay.running == true;
                        el.autoplay.paused == true;
                        el.autoplay.start();
                    }, 100);
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
    if (url == "account") {
        header.classList.add("bg");
        $(".password_label .icon-svg").on("click", function () {
            if (!$(this).parent().hasClass("active")) {
                $(this).siblings().attr("type", "text");
            } else {
                $(this).siblings().attr("type", "password");
            }
            $(this).parent().toggleClass("active");
        });
    }
    if (url == "information" && document.querySelector(".member")) {
        let member_list = document.querySelectorAll(".member .s01 .content .box ul>li>a");
        let pop_element = this.document.querySelector(".pop.information-member");
        member_list.forEach((el, index) => {
            el.innerHTML += `<div class="member-name"><span>${el.querySelector("img").getAttribute("alt")}</span></div>`;
            el.addEventListener("click", function (e) {
                e.preventDefault();
                // let img = pop_element.querySelector(".img-wrap img"),
                //     name = pop_element.querySelector(".text .name"),
                //     link = pop_element.querySelector(".link a");
                //     img.src = el.querySelector(".img-wrap img").getAttribute("src");
                //     img.alt = el.querySelector(".img-wrap img").getAttribute("alt");
                //     link.href = el.getAttribute("href");
                //     name.textContent = el.querySelector(".img-wrap img").getAttribute("alt");

                // pop_element.classList.add("active");
                // body.classList.add("stop_scroll");
            });
        });
        // document.querySelector(".pop .close").addEventListener("click",function(e){
        //     pop_element.classList.remove("active");
        // body.classList.remove("stop_scroll");
        // });    
    };
    if (url != "main" && url != "account") {
        let lastScroll = 0;
        window.addEventListener("scroll", () => {
            if (window.innerWidth <= 1024 && header_gnb.classList.contains("active")) return false;
            let scrollTop = window.scrollY;
            if (scrollTop > 0) {
                header.classList.add("bg");
            } else {
                header.classList.remove("bg");
            }
            lastScroll = scrollTop;

        });
    }

    if (window.innerWidth <= 1024) {
        if (header_gnb.classList.contains("pc")) header_gnb.classList.remove("pc");
        header_gnb.classList.add("mo");
    } else {
        if (header_gnb.classList.contains("mo")) header_gnb.classList.remove("mo");
        header_gnb.classList.add("pc");
    }

    if (url == "cs_center" && !document.querySelector("#subPage.detail")) {
        let cs_center_table = document.querySelector(".cs_table"),
            table_length = document.querySelectorAll(".cs_table tbody tr").length,
            table_number = document.querySelectorAll(".cs_table tbody tr td").length;
        if (!cs_center_table || !table_length || table_length <= 0 || !table_number || table_number <= 0) {
            if (cs_center_table) cs_center_table.style.display = "none";
            document.querySelector(".no_data").style.display = "flex";
        }
    }

    window.addEventListener("resize", () => {
        if (window.innerWidth <= 1024) {
            if (header_gnb.classList.contains("pc")) header_gnb.classList.remove("pc");
            header_gnb.classList.add("mo");
        } else {
            if (header_gnb.classList.contains("mo")) header_gnb.classList.remove("mo");
            header_gnb.classList.add("pc");
        }
    });
});

/* ================================ contact ================================ */
function contactCheck(el) {
    if (!el.value.trim().length > 0 || el.value.trim().length == 0) {
        el.focus();
        return false;
    }
    return true;
}

if (document.querySelector("#subPage.account.change_password")) {
    document.querySelector("label.submit a").addEventListener("click", function (e) {
        e.preventDefault();
        let memberId = document.querySelector("input.memberId_input"),
            nowPass = document.querySelector("input.nowPass_input"),
            newPass = document.querySelector("input.newPass_input"),
            newPassCheck = document.querySelector("input.newPassCheck_input");

        if (!contactCheck(memberId)) {
            alert("회원사 아이디를 입력해주세요.");
            return false;
        }

        if (!contactCheck(nowPass)) {
            alert("현재 비밀번호를 입력해주세요.");
            return false;
        }

        if (!contactCheck(newPass)) {
            alert("새 비밀번호를 입력해주세요.");
            return false;
        }

        if (!contactCheck(newPassCheck)) {
            alert("새 비밀번호 확인을 입력해주세요.");
            return false;
        }

        if (!contactCheck(memberId)) {
            alert("회원사 아이디를 입력해주세요.");
            return false;
        }

        if (nowPass.value == newPass.value) {
            newPass.focus();
            alert("현재 비밀번호와 새 비밀번호가 같습니다.");
            return false;
        }
        if (newPass.value != newPassCheck.value) {
            newPassCheck.focus();
            alert("비밀번호가 일치하지 않습니다.");
            return false;
        }

        document.querySelector("form").submit();
    });
}

if (document.querySelector("#subPage.account.login")) {
    let input_id = document.querySelector(".input_id"),
        input_password = document.querySelector(".input_password");

    document.querySelector(".submit a").addEventListener("click", function (e) {
        e.preventDefault();
        if (!contactCheck(input_id)) {
            alert("아이디를 입력해주세요");
            return false;
        }

        if (!contactCheck(input_password)) {
            alert("비밀번호를 입력해주세요.");
            return false;
        }
        document.querySelector("form").submit();
    });
}