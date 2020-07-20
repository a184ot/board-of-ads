import * as reg from './registration.js'; // Needed for field validation in password reset form

$(window).scroll(function () {
    if ($(this).scrollTop() > 1) {
        $("header").addClass("active");
    } else {
        $("header").removeClass("active");
    }
});

$(document).ready(function () {

    user_avatar_canvas.findAndDrawAvatars();

    if (localStorage.getItem('locale') == null) {
        localStorage.setItem("locale", "ru");
        $(".dropdown-toggle").html(
            '<img src="images/header/ru.svg" width="30">');
    } else {
        if (localStorage.getItem("locale") == "ru") {
            $(".dropdown-toggle").html(
                '<img src="images/header/ru.svg" width="30">');
        } else {
            $(".dropdown-toggle").html(
                '<img src="images/header/en.svg" width="30">');
        }
    }

    // Check for password reset token to conditionally render change password modal
    if ($("#passwordResetToken").length && $("#passwordResetToken").val().length !== 0) {
        $("#modal-pass-change").modal("show");
    }

    // Check for error messages when restoring password to conditionally render error message modal
    if ($("#passwordResetErrorMessage").length && $("#passwordResetErrorMessage")[0].innerText.length !== 0) {
        $("#modal-pass-change-error").modal("show");
    }

    $.ajax({
        url: '/rest/categories',
        type: 'get',
        dataType: 'json',
        success: function (data) {
            $("#header_category_list").empty();
            for (var i in data.subCategories) {
                if (i == 0) {
                    $("#header_category_list").append(
                        "<li class='nav-item nav_category'><span class='all_category'  onclick='openAllCategories()'>еще...</span>\n"
                        +
                        "     <ul class='navbar-nav' id='moreCategories'></ul>"
                        +
                        "</li>"
                    );
                }
                if (i < 5) {
                    $("#header_category_list").prepend(
                        "<li class='nav-item '>\n" +
                        "     <a class='nav-link text-primary' href='#'>"
                        + data.subCategories[i].name + "</a>\n" +
                        "</li>"
                    );
                }
                $("#moreCategories").append(
                    '<div>\n' +
                    '       <div class="top-rubricator-blockTitle">\n' +
                    '           <a href="">' + data.subCategories[i].name
                    + '</a>\n' +
                    '       </div>\n' +
                    '       <ul class="sub_categories navbar-nav"></ul>\n' +
                    '   </div>'
                );
                $("#findFromCategory").append(
                    '<option class="bgOption">' + data.subCategories[i].name
                    + '</option>'
                );
                for (var r in data.subCategories[i].subCategories) {
                    var fsd = data.subCategories[i].subCategories[r].name;
                    $(".sub_categories:eq(" + i + ")").append(
                        '<li class="nav-item"><a href="">' + fsd + '</a></li>'
                    );
                    $("#findFromCategory").append(
                        '<option>' + fsd + '</option>'
                    );
                }
            }
        }
    });

});

function openAllCategories() {
    $("#moreCategories").toggleClass("on-off");
    $(".bg_black_header").toggleClass("on-off");
}

$(".bg_black_header").click(function () {
    $("#moreCategories").removeClass("on-off");
    $(".bg_black_header").removeClass("on-off");
    $(".search").removeClass("on_search");
});
$(".open_search").click(function () {
    $(".search").toggleClass("on_search");
    $(".bg_black_header").toggleClass("on-off");
});
$("#menuToggle").click(function () {
    $("header").toggleClass("open_header");
    $("#menuToggle").toggleClass("open_header");
});
$(".locale_ru").click(function () {
    localStorage.setItem("locale", "ru");
});
$(".locale_en").click(function () {
    localStorage.setItem("locale", "en");
});

$('#modal-reg-1').on('shown.bs.modal', function () {
    $('#spanIncorrectLoginPass').slideUp(0);
})

$('#modal-reg-3').on('shown.bs.modal', function () {
    $('#reset-email-sent-letter-message').hide();
    $('#user-not-found-message').hide();
})

$('#modal-pass-change').on('shown.bs.modal', function () {
    $('#pass-reset-not-equal-passwords-message').hide();
    $('#pass-reset-weak-password-message').hide();
})

if (document.getElementById("frmLoginInputEmail")) {
    document.getElementById("frmLoginInputEmail").addEventListener("keyup",
        function (event) {
            if (event.key === "Enter") {
                event.preventDefault();
                document.getElementById("btnLogin").click();
            }
        });
}

if (document.getElementById("frmLoginInputPassword")) {
    document.getElementById("frmLoginInputPassword").addEventListener("keyup",
        function (event) {
            if (event.key === "Enter") {
                event.preventDefault();
                document.getElementById("btnLogin").click();
            }
        });
}

$("#btnLogin").click(function () {
    $.ajax({
        url: "/login",
        type: 'POST',
        data: $("#formLogin").serialize()
    })
    .done(function () {
        window.location.href = '/';
    })
    .fail(function () {
        $('#spanIncorrectLoginPass').slideDown();
        $('#spanIncorrectLoginPass').delay(3000).slideUp();
    })
});

// Saving password after reset
$("#btn-modal-pass-change").click(function (event) {
    event.preventDefault();

    $('#pass-reset-not-equal-passwords-message').hide();
    $('#pass-reset-weak-password-message').hide();

    const password = $('#pass-reset-form-password').val();
    const passwordConfirm = $('#pass-reset-form-passwordConfirm').val();
    let allowSaveFlag = true;

    // Password validation in analogue to registration form
    if (reg.passwordEquals(password, passwordConfirm) !== true) {
        $('#pass-reset-not-equal-passwords-message').slideDown();
        allowSaveFlag = false;
    }

    if ((reg.summator(password) < 2) || password.length < 5) {
        $('#pass-reset-weak-password-message').slideDown();
        allowSaveFlag = false;
    }

    if (allowSaveFlag === true) {
        $.ajax({
            url: "/reset/savePassword",
            type: 'POST',
            data: $("#form-modal-pass-change").serialize()
        })
        .done(function () {
            window.location.href = '/';
        })
    }
});

window.onload = function() {
    if(sessionStorage.getItem('loaded') === 'true') {
        let curUrl = '/' + window.location.href.split('/').pop();
        $(".navbar-nav").find(".active").removeClass("active");
        $("#top-nav-bar .navbar-nav .nav-item").has("a[href=\"" + curUrl + "\"]").addClass("active");
    } else {
        sessionStorage.setItem('loaded', 'true');
    }
};

let userId = $('#userId').text();  //нужно взять id user-a с header и сделать запрос
$(document).ready(function getUnreadMessage() {
    if (userId != "") {
        $.ajax({
            type: 'GET',
            url: '/rest/messages/unreadCount/' + userId,
            data: $(this).serialize(),
            dataType: 'json',
            success: function (data) {
                let interval;
                if (data !== 0) {
                    $('.message_count').html(data);
                }
                interval = setTimeout(getUnreadMessage, 20000);
            }
        });
    }
});
