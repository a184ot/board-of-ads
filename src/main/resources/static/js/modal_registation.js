import * as reg from './registration.js';

$(".open-modal-1").click(function () {
    $("#modal-reg-1").modal('show');    //окно входа
});
$("#open-modal-2").click(function () {
    $("#modal-reg-2").modal("show");//окно регистрации
    $('#spanDoubleEmailRegistration').slideUp(0);
});
$("#open-modal-3").click(function () {
    $("#modal-reg-3").modal("show");
});

//всплывает окно login при попытке доступа в авторизованную зону
{setTimeout(function(){
let myAuth = ($(location).attr('href')).indexOf('#?auth=null');
if (myAuth > 0) {
    $("#modal-reg-1").modal('show');
}
},3000);}

function isEmpty(field) {
    if (field.val() === '' || field.val() == null) {
        reg.warningField(field);
        return true;
    }
}

$("#login-reg-form").blur(function () {
    if (isEmpty($("#login-reg-form"))) {
        $(".input-login").attr("title", "Введите email");
    }
}).focus(function () {
    reg.focusedField($("#login-reg-form"));
});

$("#password-reg-form").blur(function () {
    if (isEmpty($("#password-reg-form"))) {
        $(".input-password").attr("title", "Введите пароль");
    }
}).focus(function () {
    reg.focusedField($("#password-reg-form"));
});

$("#password_confirm-reg-form").blur(function () {
    if (isEmpty($("#password_confirm-reg-form"))) {
        $(".input-confirm-password").attr("title", "Подтвердите пароль");
    }
}).focus(function () {
    reg.focusedField($("#password_confirm-reg-form"));
});

$("#first_name-reg-form").blur(function () {
    if (isEmpty($("#first_name-reg-form"))) {
        $(".input-firstName").attr("title", "Введите имя");
    }
}).focus(function () {
    reg.focusedField($("#first_name-reg-form"));
});

$("#last_name-reg-form").blur(function () {
    if (isEmpty($("#last_name-reg-form"))) {
        $(".input-lastName").attr("title", "Введите фамилию");
    }
}).focus(function () {
    reg.focusedField($("#last_name-reg-form"));
});

$("#region").blur(function () {
    if (isEmpty($("#region"))) {
        $("#regionId").attr("title", "Укажите регион");
    }
}).focus(function () {
    reg.focusedField($("#region"));
});

function blurCities() {
    if (isEmpty($("#cities"))) {
        $("#citiesId").attr("title", "Укажите город");
    }
}

function focusCities() {
    reg.focusedField($("#cities"));
}

$("#phone-reg-form").blur(function () {
    if (isEmpty($("#phone-reg-form"))) {
        $(".input-phone").attr("title", "Введите номер телефона");
    }
}).focus(function () {
    reg.focusedField($("#phone-reg-form"));
});

$("#btn-reg").click(function (event) {
    event.preventDefault();

    //begin namor script
    let email = $("#login-reg-form").val();
    let password = $("#password-reg-form").val();
    let password_confirm = $("#password_confirm-reg-form").val();
    let first_name = $('#first_name-reg-form').val();
    let last_name = $('#last_name-reg-form').val();
    let region = $('#regionId').children().val();
    let city = $('#citiesId').children().val();
    let phone = $("#phone-reg-form").val();
    let sum = 0;

    //=============== test 0 -  login is email ========//
    let loginRe = new RegExp("\\w+@\\w+\\.\\w{2,4}");
    if ((reg.checker(email, loginRe) === true) && (email.length > 7)) {
        sum++;  //1
    } else {
        reg.warningField("#login-reg-form");
    }

    //========= test1 - is password's not empty =========//
    if (reg.passwordExist(password) && reg.passwordExist(password_confirm) === true) {
        sum++;  //2
    } else {
        //вдруг один из паролей - пуст....
        reg.warningField("#password-reg-form");
        reg.warningField("#password_confirm-reg-form");
        alert("увы, не введён пароль...");  //!! поменять на нормальный вывод
    }
    //=========== password's equals? =============//
    if (reg.passwordEquals(password, password_confirm) === true) {
        sum++;  //3
    } else {
        reg.warningField("#password-reg-form");
        reg.warningField("#password_confirm-reg-form");
        alert("проверьте совпадение паролей!");
    }
    //=========  password strong? ===============//
    var passwordStrong = reg.summator(password);
    if ((passwordStrong < 2) || (password.length < 5)) {
        reg.warningField("#password-reg-form");
        reg.warningField("#password_confirm-reg-form");
        alert("пожалуйста, используйте более сложный пароль.");
    } else {
        sum++;  //4
    }
    //========== check phone number ============/
    var correctPhone = new RegExp("\\d{10}|(\\d{3}(\\s|-)){2}(\\d{2}(\\s|-)\\d{2})");
    if (reg.checker(phone, correctPhone) === true) {
        sum++;  //5
    } else {
        reg.warningField("#phone-reg-form");
        alert("введите номер телефоне в формате 913-123-45-67");
    }
    //============== check exist public name  ==========//
    if (first_name.length > 3 && last_name.length > 3) {
        sum++;  //6!
    } else {
        alert("попробуйте имя и фамилию более 3 символов!");
        reg.warningField('#first_name-reg-form');
        reg.warningField('#last_name-reg-form');
    }
    //============== check region and city  ==========//
    if (region === 'Регион') {
        alert("Выберите регион");
        reg.warningField('#regionId');
    } else if (city === 'Город') {
        alert("Выберите город");
        reg.warningField('#citiesId');
    } else {
        sum++; //7
    }
    if (sum === 7) {
        reg.save(email, password, first_name, last_name, region, city, phone);
        //$("#modal-reg-2").modal('toggle');
    }
    else {
    }
    //end script
});

document.getElementById('region').addEventListener('change', loadCities);

function loadCities() {
    $("#citiesId").children().remove();
    let regionId = {
        id: this.selectedIndex
    }
    $.ajax({
        url: '/rest/getCities',
        type: 'POST',
        data: JSON.stringify(regionId),
        contentType: "application/json",
        dataType: "json",
        success: function (cities) {
            $("#citiesId").append("<select class='custom-select' style='margin-top: 10px' id='cities'>");
            $("#cities").append($("<option disabled hidden selected></option>").attr("value", 0).attr("label", 'Город'));
            for (let i = 0; i < cities.length; i++) {
                let city_id = cities[i].id;
                let city_name = cities[i].name;
                $("#cities").append($("<option></option>").attr("value", city_id).attr("label", city_name));
            }
            document.getElementById('cities').addEventListener('blur', blurCities);
            document.getElementById('cities').addEventListener('focus', focusCities);
            $("#regionId").append("</select");
        }
    })
}

$("#btn-modal-3").click(function (event) {
    event.preventDefault();
    $('#reset-email-sent-letter-message').hide();
    $('#user-not-found-message').hide();
    let user_2 = $("#form-modal-3").serialize();
    $.ajax({
        url: "/rest/resetPassword",
        data: user_2,
        method: "POST",
        success: function (bool) {
            if (bool) {
                $('#reset-email-sent-letter-message').show();
                $("#btn-modal-3").hide();
            } else {
                $('#user-not-found-message').slideDown();
            }
        }
    });
});
