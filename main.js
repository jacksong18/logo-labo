var appUserId = "";
var chatBoxInited = false;
var isValidateEmail = false;

function StringToHash(str) {
    var hash = 0, i, chr;
    if (str.length === 0) return hash;
    for (i = 0; i < str.length; i++) {
      chr   = str.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
}
var qaArray = new Array(
    {
        question: '納品するまではどのくらいかかります？',
        answer: 'お客様のフィードバックによりますが、通常は２−３日で完成できます。'
    },
    {
        question: 'お金はいつ払いますか？',
        answer: 'お客様が成果物に満足したあと、お金を請求します。お客様が満足するまで何度も修正できますのでご安心ください。'
    },
    {
        question: 'こんな安い値段で品質は保証できるの？',
        answer: '当サイトは薄利多売を方針にして、宣伝費用などのコストを最低限にして、安い値段で高品質なデザインをお客様に提供する目標になります。'
    }
);

var chatBoxInitHtml = 'こんにちは、当サイトにご訪問ありがとうございます。<br>何かお困りことはありますでしょうか？<br>以下のリストに<u><b>クリック</b></u>してください。<br>';

var i;
for (i = 0; i < qaArray.length; i++) {
    chatBoxInitHtml += '<div class="chat-option chat-ask-option">' + qaArray[i].question + '</div>';
    qaArray[i] = {
        hash: StringToHash(qaArray[i].question),
        question: qaArray[i].question,
        answer: qaArray[i].answer
    }
}
chatBoxInitHtml += '<div class="chat-option chat-form-option">問題解決できず、お問い合わせメールお送りします。</div>';
chatBoxInitHtml = '<div class="chat-answer chat-bubble chat-bubble-left">' + chatBoxInitHtml + '</div>';
chatBoxInitHtml += '<div class="step-clear"></div>';
function findAnswer($question) {
    var hash = StringToHash($question);
    for (i = 0; i < qaArray.length; i++) {
        if (hash == qaArray[i].hash) {
            return qaArray[i].answer;
        }
    }
}
var spHeaderHtml = '\
<div class="nav">\
    <ul>\
        <li class="logo tab tab-home tab-selected" style="width: 180px;"><img src="logo.png"></li>\
        <li class="start btn">無料提案申込</li>\
    </ul>\
</div>\
<div class="nav2">\
    <ul>\
        <li class="tab2 tab-case">作品例</li>\
        <li class="tab2 tab-flow">ご利用方法</li>\
        <li class="tab2 tab-price">料金システム</li>\
        <li class="tab2 tab-ask">お問い合わせ</li>\
    </ul>\
</div>';
var planSelectHtml = '\
<select class="plan-select-box">\
    <option class="plan-select-option" disabled selected>プランを選択してください</option>\
    <option class="plan-select-option" name="form_plan" value="basic">基本プラン</option>\
    <option class="plan-select-option" name="form_plan" value="standard">標準プラン</option>\
    <option class="plan-select-option" name="form_plan" value="premium">プレミアムプラン</option>\
</select>\
';
var contentPriceHtml = '\
<div class="plan-list">\
    <ul>\
        <li class="plan-list-selected">基本プラン</li>\
        <li>標準プラン</li>\
        <li>プレミアムプラン</li>\
    </ul>\
</div>\
<div class="tb tb-plan tb-plan-basic">\
    <div class="tr">\
        <div class="td td-name">費用</div>\
        <div class="td td-price">5000円</div>\
    </div>\
    <div class="tr">\
        <div class="td td-name">向けるお客様</div>\
        <div class="td td-customer">部活・サークル・イベント等費用を抑えたい方向け</div>\
    </div>\
    <div class="tr">\
        <div class="td td-name">提供するサービス</div>\
        <div class="td td-service">\
            <ul>\
                <li>デザイン案をご覧頂いてからのお支払い</li>\
                <li>ご満足頂けるまで提案を何度でも修正可能です</li>\
                <li>ロゴのみ提供します</li>\
                <li>成果物は当サイトの宣伝のため公開します</li>\
            </ul>\
        </div>\
    </div>\
</div>\
';
var tdPriceBasicHtml = '5000円';
var tdPriceStandardHtml = '8000円';
var tdPricePremiumHtml = '15000円';
var tdCustomerBasicHtml = '部活・サークル・イベント等費用を抑えたい方向け';
var tdCustomerStandardHtml = '趣味・個人事業等個人のお客様向け';
var tdCustomerPremiumHtml = '法人のお客様向け';
var tdServiceBasicHtml = '\
            <ul>\
                <li>デザイン案をご覧頂いてからのお支払い</li>\
                <li>ご満足頂けるまで提案を何度でも修正可能です</li>\
                <li>ロゴのみ提供します</li>\
                <li>成果物は当サイトの宣伝のため公開します</li>\
            </ul>\
';
var tdServiceStandardHtml = '\
            <ul>\
                <li>デザイン案をご覧頂いてからのお支払い</li>\
                <li>ご満足頂けるまで提案を何度でも修正可能です</li>\
                <li>ロゴおよび特定の場合に使用する時調整したロゴと背景を提供します</li>\
                <li>お客様の承認いただかない限り成果物は公開しません</li>\
            </ul>\
';
var tdServicePremiumHtml = '\
            <ul>\
                <li>デザイン案をご覧頂いてからのお支払い</li>\
                <li>ご満足頂けるまで提案を何度でも修正可能です</li>\
                <li>ロゴおよびお客様の望む使用ケースに応じる調整したロゴと背景を提供します</li>\
                <li>お客様の承認いただかない限り成果物は公開しません</li>\
            </ul>\
';
$(function() {
    if (window.matchMedia('(max-device-width: 480px)').matches) {
        $('.fixed-header').html(spHeaderHtml);
        $('.pic-bg img').attr('src', 'design-bg-sp.jpg');
        $('.plan-select').html(planSelectHtml);
        $('.content-price').html(contentPriceHtml);
        var dh = 880 * $('.pic-bg img').width() / 480 - ($(window).height() - 120);
        $('.pic-bg img').css('margin-bottom', '-' + Math.floor(dh).toString() + 'px');
        $('body').on('click', '.tab2', function(){
            $('.tab2').removeClass('tab2-selected');
            $(this).addClass('tab2-selected');
        });
        $('.chat-btn-open').click(function(){
            $('.chat-box').css('height', ($(window).height() - 120).toString() + 'px');
            $('.chat-content').css('height', ($(window).height() - 120 - 40).toString() + 'px');
        });
        $('.content-price').on('click', '.plan-list ul li', function(){
            var plan = $(this).html();
            $('.plan-list ul li').removeClass('plan-list-selected');
            $(this).addClass('plan-list-selected');
            if ('基本プラン' == plan) {
                $('.td-price').html(tdPriceBasicHtml);
                $('.td-customer').html(tdCustomerBasicHtml);
                $('.td-service').html(tdServiceBasicHtml);
                return;
            }
            if ('標準プラン' == plan) {
                $('.td-price').html(tdPriceStandardHtml);
                $('.td-customer').html(tdCustomerStandardHtml);
                $('.td-service').html(tdServiceStandardHtml);
                return;
            }
            if ('プレミアムプラン' == plan) {
                $('.td-price').html(tdPricePremiumHtml);
                $('.td-customer').html(tdCustomerPremiumHtml);
                $('.td-service').html(tdServicePremiumHtml);
                return;
            }
        });

        $('.chat-title').click(function(){
            $('.chat-btn-close').trigger('click');
        });
        $(".tab-home").click(function(){
            $(".content").addClass("hidden");
            $(".content-home").removeClass("hidden");
            $('.tab2').removeClass('tab2-selected');
            $(window).scrollTop(0);
            $('body').addClass("no-overflow");
            if ($(".chat-btn-open").hasClass("hidden")) {
                $('.chat-btn-close').trigger('click');
            }
        });
        $(".tab-case").click(function(){
            $(".content").addClass("hidden");
            $(".content-case").removeClass("hidden");
            $('body').removeClass("no-overflow");
            if ($(".chat-btn-open").hasClass("hidden")) {
                $('.chat-btn-close').trigger('click');
            }
        });
        $(".tab-flow").click(function(){
            $(".content").addClass("hidden");
            $(".content-flow").removeClass("hidden");
            $('body').removeClass("no-overflow");
            if ($(".chat-btn-open").hasClass("hidden")) {
                $('.chat-btn-close').trigger('click');
            }
        });
        $(".tab-price").click(function(){
            $(".content").addClass("hidden");
            $(".content-price").removeClass("hidden");
            $('body').removeClass("no-overflow");
            if ($(".chat-btn-open").hasClass("hidden")) {
                $('.chat-btn-close').trigger('click');
            }
        });
        $(".tab-ask").click(function(){
            $(".content").addClass("hidden");
            $(".content-ask").removeClass("hidden");
            $('body').removeClass("no-overflow");
            if ($(".chat-btn-open").hasClass("hidden")) {
                $('.chat-btn-close').trigger('click');
            }
        });
        $('.chat-box').on('click', '.chat-form-option', function(){
            $(".tab").removeClass("tab-selected");
            $(".tab-ask").addClass("tab-selected");
            $(".content").addClass("hidden");
            $(".content-ask").removeClass("hidden");
            $('.chat-box').addClass('hidden');
            $('.chat-btn-open').removeClass('hidden');
        });
        $(".start").click(function(){
            $(".tab").removeClass("tab-selected");
            $(".content").addClass("hidden");
            $('.tab2').removeClass('tab2-selected');
            $(".content-form").removeClass("hidden");
            $('body').removeClass("no-overflow");
            $('.chat-btn-close').trigger('click');
        });
    } else {
        $('.pic-bg img').attr('src', 'design-bg-pc.jpg');
        $('.chat').css('right', $('body').offset().left.toString() + 'px');
        $(".tab").click(function(){
            $(".tab").removeClass("tab-selected");
            $(this).addClass("tab-selected");
        });
        
        $(".tab-home").click(function(){
            $(".content").addClass("hidden");
            $(".content-home").removeClass("hidden");
            $(window).scrollTop(0);
            $('body').addClass("no-overflow");
            if ($(".chat-btn-open").hasClass("hidden")) {
                $('.chat-btn-close').trigger('click');
            }
        });
        $(".tab-ask").click(function(){
            $(".content").addClass("hidden");
            $(".content-ask").removeClass("hidden");
            if ($(".chat-box").hasClass("hidden")) {
                $('.chat-btn-open').trigger('click');
            }
        });
        var func_switch_tab = function(tab_name){
            $(".tab-" + tab_name).click(function(){
                $(".content").addClass("hidden");
                $(".content-" + tab_name).removeClass("hidden");
                $('body').removeClass("no-overflow");
                if ($(".chat-btn-open").hasClass("hidden")) {
                    $('.chat-btn-close').trigger('click');
                }
            });
        }
        func_switch_tab('case');
        func_switch_tab('flow');
        func_switch_tab('price');
        $('.chat-box').on('click', '.chat-form-option', function(){
            $(".tab-ask").trigger("click");
            $('.chat-btn-close').trigger('click');
        });
        $(".start").click(function(){
            $(".tab").removeClass("tab-selected");
            $(".content").addClass("hidden");
            $(".content-form").removeClass("hidden");
            $('body').removeClass("no-overflow");
            if ($(".chat-btn-open").hasClass("hidden")) {
                $('.chat-btn-close').trigger('click');
            }
        });
    }

    var func_send_msg = function(msg){
        var html1 = '<div class="chat-ask chat-bubble chat-bubble-right">' + msg + '</div>';
        html1 = html1 + '<div class="step-clear"></div>';
        $('.chat-content').html($('.chat-content').html() + html1);

        var answer = findAnswer(msg);
        var html2 = '<div class="chat-answer chat-bubble chat-bubble-left">' + answer + '<div class="chat-option chat-form-option">問題解決できず、お問い合わせメールお送りします。</div></div>';
        html2 = html2 + '<div class="step-clear"></div>';
        $('.chat-content').html($('.chat-content').html() + html2);
        $('.chat-content').animate({scrollTop: $('.chat-answer:last').offset().top}, 100);
    };
    function validateEmail($email) {
        var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        return $email.length > 0 && emailReg.test($email);
    }
    function showInvalidateEmailCaution($email_selector) {
        var email = $email_selector.val();
        var invalidEmailTxt = $email_selector.parent().find('.invalid-email-txt');
        isValidateEmail = validateEmail(email);
        if (!isValidateEmail) {
            invalidEmailTxt.removeClass('invisible');
        } else {
            if (!invalidEmailTxt.hasClass('invisible')) {
                invalidEmailTxt.addClass('invisible');
            }
        }
    }
    $('[type="email"]').blur(function(){
        showInvalidateEmailCaution($(this));
    });

    $('.chat-box').on('click', '.chat-ask-option', function(){
        var msg = $(this).html();
        func_send_msg(msg);
    });
    $('.chat-btn-close').click(function(){
        $('.chat-box').addClass('hidden');
        $('.chat-btn-open').removeClass('hidden');
    });
    $('.chat-btn-clear').click(function(){
        $('.chat-content').html(chatBoxInitHtml);
    });
    $('.chat-btn-send').click(function(){
        func_send_msg($('.chat-btn-msg').val());
        $('.chat-btn-msg').val('');
    });
    $('.chat-btn-open').click(function(){
        $('.chat-box').removeClass('hidden');
        $(this).addClass('hidden');
        if(chatBoxInited){
            return false;
        }
        $('.chat-content').html(chatBoxInitHtml);
        chatBoxInited = true;
    });
    function validateRealEmail($email){
        $.ajax({
            url: 'php/validateemail.php',
            type: 'get',
            data: {
                email: $email
            },
            success: function(data){
                console.log(data);
            }
        });
    }
    $('.btn-send-question').click(function(){
        var email_selector = $('#form_email_ask');
        var email = email_selector.val();
        if(!validateEmail(email)){
            showInvalidateEmailCaution(email_selector);
            email_selector.focus();
            return false;
        }
        $('.input-submit').prop( "disabled", true);
        $('.lds-default').removeClass('hidden');
        $('.popup').removeClass('fade-out');
        var txt = $('#form_ask_content').val();

        $.ajax({
            url: 'php/mail.php',
            type: 'post',
            data: {
                handle: 'question',
                email: email,
                txt: txt
            },
            success: function(data){
                $('.input-submit').prop( "disabled", false);
                $('.lds-default').addClass('hidden');
                $('.popup').addClass('fade-out');
            }
        });
    });
    $('.btn-send-request').click(function(){
        var email_selector = $('#form_email');
        var email = email_selector.val();
        if(!validateEmail(email)){
            showInvalidateEmailCaution(email_selector);
            email_selector.focus();
            return false;
        }
        $('.input-submit').prop( "disabled", true);
        $('.lds-default').removeClass('hidden');
        $('.popup').removeClass('fade-out');

        var formData = new FormData();
        formData.append('handle', 'request');
        formData.append('email', $('#form_email').val());
        formData.append('plan', $('[name="form_plan"]:checked').val());
        formData.append('background', $('#form_background').val());
        formData.append('request', $('#form_request').val());
        formData.append('file', $('#form_upload_pic')[0].files[0]);
        
        $.ajax({
            url: 'php/mail.php',
            type: 'post',
            cache: false,
            processData: false,
            contentType: false,
            data: formData,
            success: function(data){
                $('.input-submit').prop( "disabled", false);
                $('.lds-default').addClass('hidden');
                $('.popup').addClass('fade-out');
            }
        });
    });
});