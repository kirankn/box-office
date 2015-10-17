(function() {
    /* //////////////////////////////// Commonly required function ////////////////////////// */
    // To not error during consoling in IE8
    var Debugger = function () {
    };
    Debugger.log = function (message) {
        try {
            if(debugRequired) console.log(message);
        } catch (exception) {}
    };

    // Get the cookie value by using cookie name
    var getCookie = function (cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1);
            if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
        }
        return undefined;
    };

    /* //////////////////////////////// Common variable declaration Starts Here ////////////////////////// */
    var jqueryLink = '//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js',
        touchSwipe = '//d3clqjla00sltp.cloudfront.net/swiper.min.js',
        impressionLink = 'http://54.251.188.125/pm-c/v1/',
        cookie = getCookie('_pm'),
        unique = (cookie) ? 0 : 1,
        affiliateId = '',
        addBuyNowButton = false,
        putGTMStatus = false,

        eventName = 'koimoiMobileEventTrigger',
        PM_IP_DL = [],
        campaignId = 'Koimoi.com_mobile_1',
        GTM_TAG = "<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='//www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','PM_IP_DL','GTM-K6TXRQ');<\/script>";

    var minWidthSupport = 320,
        maxWidthSupport = 760,
        minHeightRequired= 150,
        minWidthPercentage = 0.7;

    var d = document,
        w = window,
        $,
        $imageHolder = ['body img'],
        $isMobile = !!((/android|webos|iphone|ipod|ipad|blackberry|iemobile|opera/i.test(navigator.userAgent.toLowerCase()))),
        $isOperaMini = !!((/opera mini/i.test(navigator.userAgent.toLowerCase()))),
        $onceCalled = false,
        $firstTimeChange = false,
        allImageData,
        maxAdShow = 2,
        adCounter = 0,

        webOrMobile = false, // True for web, False for mobile
        debugRequired = true,
        ecommImage = {
            amazon: 'http://sanjivb.com/wp-content/uploads/2013/07/Amazon-logo-small.jpg',
            flipkart: 'http://cdn.techgyd.com/fp.png',
            paytm: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQm4mQRZ5_bKhoyKcUpsaprQBVBtJ5KP8T6pWCYyBsL39ZIbykP'
        };

    /* //////////////////////////////// main list of functions ////////////////////////// */
    var pushEvent = function(dataObject){
        var tempObject = {
            event: eventName,
            koimoiMobileClickAction: dataObject.clickAction,
            koimoiMobileClickCategory: dataObject.clickCategory,
            koimoiMobileClickLabel: dataObject.clickLabel
        };
        Debugger.log(tempObject);
        // Datalayer push on click
        PM_IP_DL.push(tempObject);
    };

    var isTranslated = function() {
        var $html = $('html');
        return ($html.hasClass('translated-ltr') || $html.hasClass('translated-rtl')) ? "_Translated : " : "";
    };

    var findImagesTheSpecifiedHolder = function(callback){
        var tempObject = [];
        for(var i=0; i < $imageHolder.length; i++){
            if($($imageHolder[i]).length != 0){
                tempObject = $($imageHolder[i]);
                break;
            }
        }
        if(typeof(callback) === "function" && callback !== undefined) callback(tempObject);
        else return tempObject;
    };

    var findSuitableImages = function(callback){
        var tempObject = [],
            allImages = ($imageHolder.length != 0) ? findImagesTheSpecifiedHolder() : [],
            parser = d.createElement('a'),
            $referrer = window.location.href;

        parser.href = $referrer;
        $pathname = (parser.pathname.charAt(0)=='/') ? parser.pathname : '/'+ parser.pathname;
        $referrer = $.trim(parser.protocol+ '//' +parser.hostname+$pathname).replace(/\/$/,'').replace(/\/$/,'');

        if(allImages.length > 0) {
            for(var i=0; i < allImages.length; i++){
                var $this = $(allImages[i]),
                    $width = $this.width(),
                    $height = $this.height(),
                    $src = $this.attr('src') || $this.attr('data-src');

                // formatting the image source
                parser.href = $src;
                var $pathname = (parser.pathname.charAt(0)=='/') ? parser.pathname : '/'+ parser.pathname;
                $src = $.trim(parser.protocol+ '//' +parser.hostname+$pathname).replace(/\/$/,'').replace(/\/$/,'');

                console.log(($width >= minWidthSupport && $width <= maxWidthSupport && $height >= minHeightRequired) || ($isMobile && $height >= minHeightRequired && ($width > Math.ceil(w.innerWidth * minWidthPercentage))));
                console.log(($isMobile && $height >= minHeightRequired && ($width > Math.ceil(w.innerWidth * minWidthPercentage))));


                if (($width >= minWidthSupport && $width <= maxWidthSupport && $height >= minHeightRequired) || ($isMobile && $height >= minHeightRequired && ($width > Math.ceil(w.innerWidth * minWidthPercentage)))) {
                    // Mentioning which image format will be passed
                    if(($src.indexOf('.jpg') != -1 || $src.indexOf('.jpeg') != -1 || $src.indexOf('.png') != -1 || $src.indexOf('.bmp') != -1) && $src.indexOf('1.1.1') == -1) {
                        if (!$this.parent().hasClass('_adSenceImagePushContainer')) {
                            var wrapperDiv = d.createElement("div");
                            if (!$isMobile) wrapperDiv.style.cssText = 'height:auto;width:100%;max-width:' + $width + 'px;margin:auto !important;text-align:center;background:transparent;position:relative !important;overflow:hidden !important;padding:0;';
                            else wrapperDiv.style.cssText = 'height:auto;width:100%;margin:auto !important;text-align:center;background:transparent;position:relative !important;overflow:hidden !important;padding:0;';
                            wrapperDiv.setAttribute('class', '_adSenceImagePushContainer');
                            $this[0].parentNode.insertBefore(wrapperDiv, $this[0]);
                            $this[0].parentNode.removeChild($this[0]);
                            wrapperDiv.appendChild($this[0]);
                        }
                        tempObject.push({
                            element: $this,
                            height: $height,
                            width: $width,
                            position: $this.offset(),
                            containerDiv: $this.parent(),
                            src: $src,
                            referrer: $referrer
                        });
                    }
                }
            }
        }
        if(typeof(callback) === "function" && callback !== undefined) callback(tempObject);
        else return tempObject;
    };

    // Do the get JSON GET request to fetch the data from backend
    var doNetWorkCall = function(serverLink, param, callback){
        try{
            $.getJSON(serverLink +'?'+ $.param(param), function( data ) {
                callback(data);
            });
        }
        catch(e){
            callback(undefined);
        }
    };

    var getSection = function(){
        var l = window.location.href;
        return l.replace(window.location.protocol + '//' + window.location.host +'/', '').split('/')[0];
    };

    var putCss = function(){
        var head = d.head || d.getElementsByTagName('head')[0], style = d.createElement('style'), css, link = d.createElement('link');

        link.href = '//fonts.googleapis.com/css?family=Roboto';
        link.rel = 'stylesheet';
        link.type = 'text/css';
        head.appendChild(link);

        if($isMobile){
            css = '._processedImageAd{margin-top: 20px;position: relative !important;left:0 !important;bottom:0 !important;width:100% !important;cursor:auto;background-color:#ffffff !important;padding: 10px 0 0 !important;}._processedImageAd h5.title{float:left;text-align:left;padding:0 0 10px 5px;margin:-1px;font-size:12px;color:#9197a3;background:#fff;font-family:\'Roboto\',sans-serif;}._processedImageAd .headingAndLogoContainer img.logo{height:25px;width:auto;float:left;margin:0 0 0 9px;}._processedImageAd #slideContainer{clear:both;}._processedImageAd #imageSetPanel{display:block !important;height:auto !important;white-space:nowrap !important;background:#fff;}._processedImageAd #imageSetPanel .slide{display:inline-block;list-style:none !important;height:100%;/*margin:0 5px !important;*/max-height:100%;z-index:2147483644 !important;position:relative;background:#f7f7f7;border:1px solid #ccc;-webkit-border-radius:3px;border-radius:3px;font-size:13px;padding:9px 9px 5px;width:150px;}._processedImageAd #imageSetPanel .slide .imageHolder{background:#fff;height:140px;overflow:hidden;border-radius:3px;}._processedImageAd #imageSetPanel a{text-decoration:none !important;}._processedImageAd #imageSetPanel a._buy_now{width:100%;display:block;font-size:14px;font-weight:800;background-color:#59B127;padding: 5px;color:#fff;border:1px solid #48961B;}._processedImageAd #imageSetPanel a._buy_now span.small{font-size:10px;display:initial;color:#ffffff;}._processedImageAd #imageSetPanel .slide img{display:inline-block;width:auto;height:100%;vertical-align:middle;}._processedImageAd #imageSetPanel .slide .smallInfo{position:relative;width:100%;overflow:hidden;font-family:\'Roboto\',sans-serif;}._processedImageAd #imageSetPanel .slide .smallInfo span{text-decoration:none;text-decoration:none;line-height:1.1;display:block;margin:5px 0;color:#383838;overflow:hidden;text-align:center;font-size:12px;}._processedImageAd #imageSetPanel .slide .smallInfo>span:first-child{font-weight:800;font-size:14px;margin-top:10px;}._processedImageAd #imageSetPanel>.slide .smallInfo>span:last-child{color:#8C8C8C;margin-top:3px;padding-top:4px;}._processedImageAd ._cross{position:absolute;top:-20px;right:0;display:block;width:100%;}._processedImageAd ._cross a{text-decoration:underline;font-size:12px;padding:3px 5px;display:block;background-color:rgba(255,255,255,0.8);float:right;font-family:\'Roboto\',sans-serif;border-right:1px solid #ccc;line-height:1.2;color:#000;font-weight:200;}._processedImageAd ._cross span.times{font-size: 20px;line-height:1;background-color:rgba(255,255,255,0.8);float:right;display:block;width:20px;height:20px;text-align:center;vertical-align: baseline;cursor:pointer;color:#000;font-weight:200;}._processedImageAd #imageSetPanel .slide .smallInfo span.prdctName{color:#0000FF;font-size:11px;}';

            if($isOperaMini) css+= '._processedImageAd #imageSetPanel .slide{width: 50%;margin: 0 !important;float: left;border-radius: 0;}._processedImageAd #imageSetPanel .slide .imageHolder{height: 95px;border-radius:0;}._processedImageAd #imageSetPanel .slide .smallInfo>span:first-child{font-size: 10px;}._processedImageAd #imageSetPanel .slide .smallInfo span.prdctName{font-size: 11px;}._processedImageAd #imageSetPanel>.slide .smallInfo>span:last-child{margin-top:0px;padding-top: 0;font-size: 10px;}';

            if(!addBuyNowButton){
                css += '._processedImageAd ._productContainer.hidden{display:none;}._processedImageAd ._productContainer{position:fixed;top:0;left:0;width:100%;height:100%;background-color:#fff;z-index:2147483648;overflow-x:auto;}._processedImageAd ._productContainer ._mainContainer{position:relative;width:100%;height:auto;overflow-y: scroll;padding-bottom:47px;}._processedImageAd ._productContainer ._mainContainer ._headerContainer{display:table;width:100%;padding:5px 0;border-bottom: 1px solid #eee;}._processedImageAd ._productContainer ._mainContainer ._headerContainer *{display:table-cell;vertical-align:middle;}._mainContainer ._headerContainer .back{width:15%;font-size:29px;padding:5px 0 10px;}._mainContainer ._headerContainer .company{font-size:15px;font-weight:bold;text-transform:uppercase;}._mainContainer ._bodyContainer{padding:0 10px;}._mainContainer ._bodyContainer img._bigProductImage{width:auto;margin:auto;height:auto;max-width:100%;}._mainContainer ._bodyContainer ._productName{border-top:1px solid #eee;font-size:14px;text-align:left;padding:5px 10px;}._mainContainer ._bodyContainer ._price{font-size:14px;text-align:left;padding:2px 10px;font-weight:bold;}._mainContainer ._buttonContainer{position:fixed;width:100%;left:0;bottom:0;}._mainContainer ._buttonContainer a{text-decoration:none;display:block;padding:10px;text-transform:uppercase;float:left;color:#fff;vertical-align: middle;}._mainContainer ._buttonContainer a._like{background-color:#223242;width:40%;font-size:33px;padding:9px;}._mainContainer ._buttonContainer a._like span{margin:0 3px;display:inline-block;}._mainContainer ._buttonContainer a._like span._number{font-size:10px;padding:1px 5px;border-radius:50%;background-color: red;vertical-align:top;}._mainContainer ._buttonContainer a._buy_now{background-color:#11DAB0;font-weight:800;width:60%;}';
                css += '._processedImageAd ._imageContainerMain{overflow:hidden;}._processedImageAd ._imageContainerMain ul._image-list{white-space:nowrap;padding:0;margin:0;list-style:none;width:auto;background-color:#fff;}._processedImageAd ._imageContainerMain ul._image-list li{display:inline-block;position:relative;height:auto;width:auto;border:0;vertical-align:middle;background-color:transparent;}._processedImageAd ._bodyContainer span.arrow{position:absolute;top:35%;background-image:url(\'http://d3clqjla00sltp.cloudfront.net/image/arrow.png\');background-size:25px 210px;height:50px;width:25px;}._processedImageAd ._bodyContainer span.arrow.right{right:5px;background-position:4px 82px;}._processedImageAd ._bodyContainer span.arrow.left{left: 5px;background-position:4px 134px;}';
            }
        }

        style.type = 'text/css';
        if (style.styleSheet) style.styleSheet.cssText = css;
        else style.appendChild(d.createTextNode(css));
        head.appendChild(style);
    };

    var putGTM = function(callback){
        $('head').append($(GTM_TAG));
        setTimeout(function(){
            callback(true);
        }, 1000);
    };

    var bindEventsAndTriggerAnalytics = function(container){
        var adUnit = '$'+ container.attr('data-r') +' : ~'+ container.attr('data-iu') +' : @'+ container.attr('data-s') +' : *',
            atfOrBtf = (parseInt(container.attr('data-atf')) == 1) ? 'ATF' : 'BTF';

        if(!$isOperaMini) {
            // Binding swipe handler
            new Swiper(container.find('.swiper-container'), {
                slidesPerView: !!((/ipad/i.test(navigator.userAgent.toLowerCase())))? 3 : 1.5,
                spaceBetween: 5,
                centeredSlides: !((/ipad/i.test(navigator.userAgent.toLowerCase()))),
                onSlideChangeEnd: function (swiper) {
                    var direction = (swiper.snapIndex < swiper.previousIndex) ? 'Right' : 'Left';
                    //pushEvent({
                    //    'clickAction': '#' + campaignId + ' : ~Swipe Normal : @' + direction + ' : $' + atfOrBtf,
                    //    'clickCategory': adUnit + 'Swipe',
                    //    'clickLabel': isTranslated() + '$Mobile'
                    //});
                }
            });

            if(!addBuyNowButton) {
                container.find('.slide').click(function () {
                    var $prdctContainer = container.find('#_productContainer'),
                        $heading = $prdctContainer.find('.company'),
                        $imageListContainer = $prdctContainer.find('div._imageContainerMain'),
                        $productName = $prdctContainer.find('._productName'),
                        $price = $prdctContainer.find('._price'),
                        $buyNow = $prdctContainer.find('._buy_now'),
                        $this = $(this),
                        $otherProduct = $this.parent().find('.slide').not($this),
                        $html = '<div class="swiper-container"><ul class="_image-list swiper-wrapper">',
                        $imgheight = (window.innerHeight - 176) + 'px',
                        imagePath = '';

                    $html += '<li class="swiper-slide" ';
                    Array.prototype.slice.call($this[0].attributes).forEach(function (item) {
                        if (item.name.indexOf('data-') !== -1) {
                            $html += item.name + '="' + item.value + '" ';
                            if (item.name == 'data-image-path') imagePath = item.value;
                        }
                    });
                    $html += '><img src="' + imagePath + '" class="_bigProductImage" style="max-height:' + $imgheight + '"></li>';

                    for (var i = 0; i < $otherProduct.length; i++) {
                        var element = $($otherProduct[i]), obj = element[0].attributes;
                        $html += '<li class="swiper-slide" ';
                        Array.prototype.slice.call(obj).forEach(function (item) {
                            if (item.name.indexOf('data-') !== -1) {
                                $html += item.name + '="' + item.value + '" ';
                                if (item.name == 'data-image-path') imagePath = item.value;
                            }
                        });
                        $html += '><img src="' + imagePath + '" class="_bigProductImage" style="height:' + $imgheight + '"></li>'
                    }
                    $html += '</ul></div>';
                    $imageListContainer.html($html);
                    $heading.text($this.attr('data-brand'));
                    //$image.css({'height': (window.innerHeight - 156)+'px'}).attr('src', $this.attr('data-image-path'));
                    $productName.text($this.attr('data-product-name'));
                    $price.text('Rs. ' + $this.attr('data-price'));
                    $buyNow.attr('href', $this.attr('data-link'));
                    $prdctContainer.removeClass('hidden');

                    // Binding swipe handler
                    new Swiper($prdctContainer.find('.swiper-container'), {
                        slidesPerView: 1,
                        //spaceBetween: 1,
                        centeredSlides: true,
                        loop: true,
                        //initialSlide: 0,
                        onSlideChangeEnd: function (swiper) {
                            var $prdctContainer = container.find('#_productContainer'),
                                $this = $prdctContainer.find('.swiper-container').find('.swiper-slide-active'),
                                $heading = $prdctContainer.find('.company'),
                                $productName = $prdctContainer.find('._productName'),
                                $price = $prdctContainer.find('._price'),
                                $buyNow = $prdctContainer.find('._buy_now');

                            $heading.text($this.attr('data-brand'));
                            $productName.text($this.attr('data-product-name'));
                            $price.text('Rs. ' + $this.attr('data-price'));
                            $buyNow.attr('href', $this.attr('data-link'));

                            var direction = (swiper.snapIndex < swiper.previousIndex) ? 'Right' : 'Left';
                            if(swiper.snapIndex == 1 && swiper.previousIndex == 0){ Debugger.log(swiper.previousIndex); }
                            else{
                                //pushEvent({
                                //    'clickAction': '#' + campaignId + ' : ~Swipe Popup : @' + direction + ' : $' + atfOrBtf,
                                //    'clickCategory': adUnit + 'Swipe',
                                //    'clickLabel': isTranslated() + '$Mobile'
                                //});
                            }
                        }
                    });

                    var parsedParameter = getParamFromHref($this.attr('data-link'));
                    parsedParameter['rf'] = 1;
                    parsedParameter['iu'] = decodeURIComponent(parsedParameter['iu']);
                    parsedParameter['al'] = decodeURIComponent(parsedParameter['al']);

                    doNetWorkCall(interstitialLink, parsedParameter, function (status) {
                        Debugger.log(status);
                    });

                    $buyNow.click(function(){
                        var activeElement = $prdctContainer.find('.swiper-slide-active'),
                            gender = (parseInt(activeElement.attr('data-gender')) == 0) ? 'Woman' : 'Man',
                            dressType = activeElement.attr('data-dress-type'),
                            amazonLink = activeElement.attr('data-al');

                        //pushEvent({
                        //    clickAction: '#'+ campaignId +' : ~Buy Now : @'+ dressType +' : ^'+ gender +' : $'+ atfOrBtf,
                        //    clickCategory: adUnit + 'Click',
                        //    clickLabel: '@'+ amazonLink +' : '+ isTranslated() +'$Mobile'
                        //});
                    });

                    container.find('a._like').click(function(e){
                        var activeElement = $prdctContainer.find('.swiper-slide-active'),
                            gender = (parseInt(activeElement.attr('data-gender')) == 0) ? 'Woman' : 'Man',
                            dressType = activeElement.attr('data-dress-type'),
                            amazonLink = activeElement.attr('data-amazon-link');

                        //pushEvent({
                        //    clickAction: '#'+ campaignId +' : ~Like Click: @'+ dressType +' : ^'+ gender +' : $'+ atfOrBtf,
                        //    clickCategory: adUnit + 'Click',
                        //    clickLabel: '@'+ amazonLink +' : '+ isTranslated() +'$Mobile'
                        //});
                    });

                    // Back button event bind
                    container.find('#_productContainer .back').click(function(){
                        //pushEvent({
                        //    clickAction: '#'+ campaignId +' : ~Close Popup : $'+ atfOrBtf,
                        //    clickCategory: adUnit + 'Click',
                        //    clickLabel: isTranslated() + '$Mobile'
                        //});
                        container.find('#_productContainer').addClass('hidden');
                        if ( window.history && window.history.pushState ) {
                            window.history.pushState('', '', window.location.pathname);
                            $firstTimeChange = false;
                            $(window).unbind('hashchange');
                        } else {
                            window.location.href = window.location.href.replace(/#.*$/, '#');
                            $firstTimeChange = false;
                            $(window).unbind('hashchange');
                        }
                    });

                    // Binding hash change event
                    $(window).bind('hashchange', function(event) {
                        if($firstTimeChange){
                            var hiddenContainer = $('._productContainer.hidden'),
                                productContainer = $('._productContainer'),
                                container = productContainer.not(hiddenContainer).eq(0).closest('._processedImageAd');

                            if(hiddenContainer.length != productContainer.length) {
                                productContainer.addClass('hidden');
                                var adUnit = '$'+ container.attr('data-r') +' : ~'+ container.attr('data-iu') +' : @'+ container.attr('data-s') +' : *',
                                    atfOrBtf = (parseInt(container.attr('data-atf')) == 1) ? 'ATF' : 'BTF';
                                //pushEvent({
                                //    clickAction: '#'+ campaignId +' : ~Close Popup : $'+ atfOrBtf,
                                //    clickCategory: adUnit + 'Back',
                                //    clickLabel: isTranslated() + '$Mobile'
                                //});
                                $firstTimeChange = false;
                                $(window).unbind('hashchange');
                            }
                        }
                        else $firstTimeChange = true;
                    });
                });
            }
        }

        // Slide click event track
        container.find('.slide').click(function(e){
            var slide = $(this),
                gender = (parseInt(slide.attr('data-gender')) == 0) ? 'Woman' : 'Man',
                dressType = slide.attr('data-dress-type'),
                amazonLink = slide.attr('data-al');

            //pushEvent({
            //    clickAction: '#'+ campaignId +' : ~Unit Click : @'+ dressType +' : ^'+ gender +' : $'+ atfOrBtf,
            //    clickCategory: adUnit + 'Click',
            //    clickLabel: '@'+ amazonLink +' : '+ isTranslated() +'$Mobile'
            //});
        });

        // Close Button click track
        container.find('span.times').click(function(){
            //pushEvent({
            //    clickAction: '#'+ campaignId +' : ~Close : $'+ atfOrBtf,
            //    clickCategory: adUnit + 'Click',
            //    clickLabel: isTranslated() + '$Mobile'
            //});

            $(this).closest('._processedImageAd').remove();
            $('body').css({'overflow':''});
        });
    };

    var putHtmlAndBindEvents = function(dataObjects){
        Debugger.log(dataObjects);

        var heading = (dataObjects.receivedData.meta.message !== null && dataObjects.receivedData.meta.message != '') ? dataObjects.receivedData.meta.message : 'Recommended Products for you from',
            imageLink = (ecommImage[dataObjects.receivedData.meta.ecommerce]) ? ecommImage[dataObjects.receivedData.meta.ecommerce] : 'http://sanjivb.com/wp-content/uploads/2013/07/Amazon-logo-small.jpg',
            $html = '<div class="headingAndLogoContainer"><h5 class="title">'+ heading +' </h5><img src="'+ imageLink +'" class="logo"/></div>',
            i,
            $htmlContainer = $('<div class="_processedImageAd" data-attr="not-done" data-atf="'+ dataObjects.atf +'" data-iu="'+ $.trim(dataObjects.src) +'" data-s="'+ dataObjects.section +'" data-r="'+ dataObjects.referrer +'"></div>'),
            price,
            param;

        $html += '<div class="swiper-container" id="slideContainer" ><div class="swiper-wrapper" id="imageSetPanel">';

        if($isMobile){
            for(i=0; i<dataObjects.receivedData.data.length; i++) {
                price = ($.trim(dataObjects.receivedData.data[i].discountPrice) != "") ? dataObjects.receivedData.data[i].discountPrice : dataObjects.receivedData.data[i].price;

                param = {
                    s: dataObjects.section,
                    g: (dataObjects.receivedData.data[i].gender == 'man') ? 1 : 0,
                    c: dataObjects.receivedData.data[i].category,
                    iu: $.trim(dataObjects.src),
                    al: dataObjects.receivedData.data[i].link + affiliateId
                };
                if(addBuyNowButton || $isOperaMini){
                    if(!$isOperaMini) $html += '<div class="slide swiper-slide" data-price="'+ dataObjects.receivedData.data[i].price +'" data-discount-price="'+ dataObjects.receivedData.data[i].discountPrice +'" data-al="'+ dataObjects.receivedData.data[i].link +'" data-gender="'+ param.g +'" data-dress-type="'+ param.c +'"><div class="imageHolder"><img src="'+ dataObjects.receivedData.data[i].imagepath +'"></div><div class="smallInfo"><span>'+ dataObjects.receivedData.data[i].brand +'</span><span class="prdctName">'+ dataObjects.receivedData.data[i].name +'</span><a href="'+ dataObjects.receivedData.data[i].link +'" class="_buy_now" target="_blank">Buy Now <span class="small">(Rs. '+ price +')</span></a></div></div>';

                    else $html += '<div class="slide" data-price="'+ dataObjects.receivedData.data[i].price +'" data-discount-price="'+ dataObjects.receivedData.data[i].discountPrice +'" data-al="'+ dataObjects.receivedData.data[i].link +'" data-gender="'+ param.g +'" data-dress-type="'+ param.c +'"><a href="'+ dataObjects.receivedData.data[i].link +'" target="_blank"><div class="imageHolder"><img src="'+ dataObjects.receivedData.data[i].imagepath +'"></div><div class="smallInfo"><span>'+ dataObjects.receivedData.data[i].brand +'</span><span class="prdctName">'+ dataObjects.receivedData.data[i].name +'</span><span>Price: '+ price +'</span></div></a></div>';

                }
                else $html += '<div class="slide swiper-slide" data-link="'+ dataObjects.receivedData.data[i].link +'" data-image-path="'+ dataObjects.receivedData.data[i].imagepath +'" data-brand="'+ dataObjects.receivedData.data[i].brand +'" data-product-name="'+ dataObjects.receivedData.data[i].name +'" data-price="'+ price +'" data-al="'+ dataObjects.receivedData.data[i].link +'" data-gender="'+ param.g +'" data-dress-type="'+ param.c +'"><a href="#open"><div class="imageHolder"><img src="'+ dataObjects.receivedData.data[i].imagepath +'"></div><div class="smallInfo"><span>'+ dataObjects.receivedData.data[i].brand +'</span><span class="prdctName">'+ dataObjects.receivedData.data[i].name +'</span><a href="javascript:void(0);" class="_buy_now">Buy Now <span class="small">(Rs. '+ price +')</span></a></div></a></div>';


                if($isOperaMini && i==3) break;
            }
            $html += '</div></div>';
            if(!$isOperaMini) $html += '<span class="_cross"><span class="times">&times;</span></span>';
            if(!addBuyNowButton) $html += '<div class="_productContainer hidden" id="_productContainer"><div class="_mainContainer"><div class="_headerContainer"><div class="back"></div><div class="company"></div><div class="back">&times;</div></div><div class="_bodyContainer"><div class="_imageContainerMain"></div><span class="arrow left"></span><span class="arrow right"></span><!--<img src="" class="_bigProductImage">--><div class="_productName"></div><div class="_price"></div></div><div class="_buttonContainer"><a href="javascript:void(0);" class="_like"><span>&#128077;</span><span class="_number">+1</span></a><a href="" target="_blank" class="_buy_now">Buy Now</a></div></div></div>';

            $htmlContainer.append($html);
            dataObjects.containerDiv.append($htmlContainer);

            bindEventsAndTriggerAnalytics($htmlContainer);
        }
        else Debugger.log('Log : Oops! Different ad type not supported in current JS.');
    };

    var getSimilarImagesFromAPI = function(){
        if(allImageData.length > 0){
            var currentObject = allImageData[0];
            var param = {
                iu: currentObject.src,
                u: unique,
                a:((currentObject.position.top + (currentObject.height/2)) < w.innerHeight) ? 1 : 0,
                s: getSection(),
                wm: webOrMobile,
                r: currentObject.referrer
            };
            if(adCounter==maxAdShow) return;
            doNetWorkCall(impressionLink, param, function(receivedData){
                // Debugger.log(receivedData);
                if(receivedData.result != 'np' && receivedData.result != 'error' && receivedData.length != 0){
                    if(!putGTMStatus){
                        //putGTM(function(){
                        //    PM_IP_DL = window.PM_IP_DL || [];
                        //});
                        putGTMStatus = true;
                    }
                    currentObject.receivedData = receivedData;
                    currentObject.atf = param.a;
                    currentObject.section = param.s;

                    putHtmlAndBindEvents(currentObject);
                    allImageData.splice(0, 1);
                    adCounter++;
                    if(unique) unique = 0;
                    if(allImageData.length != 0) getSimilarImagesFromAPI(allImageData);
                }
                else{
                    allImageData.splice(0, 1);
                    if(unique) unique = 0;
                    if(allImageData.length != 0) getSimilarImagesFromAPI(allImageData);
                }
            });
        }
        else Debugger.log('Log : No suitable image found !!');
    };

    // Create unique value for cookie unique user
    var getUniqueId = function() {
        var s4 = function() {
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        };
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    };

    // Set specific cookie by using cookie name, cokie alue and expiry days
    var setCookie = function(cname, cvalue, sec) {
        var exDate = new Date();
        exDate.setTime(exDate.getTime() + parseInt(sec*1000));
        var expires = "expires=" + exDate.toUTCString() + "; path=/";
        document.cookie = cname + "=" + cvalue + "; " + expires;
    };

    var secondsUntilMidnight = function() {
        var midnight = new Date();
        midnight.setHours( 24 );
        midnight.setMinutes( 0 );
        midnight.setSeconds( 0 );
        midnight.setMilliseconds( 0 );
        return (midnight.getTime() - new Date().getTime()) / 1000;
    };

    // After deciding which jQuery to use this function get called
    var initialize = function(){
        Debugger.log('Log : Initialize function called !!');
        if(!$onceCalled){
            $onceCalled = true;
            $ = $ || window.jQuery || window.$;
            if(unique) setCookie('_pm', getUniqueId(), Math.round(secondsUntilMidnight()));

            $(document).ready(function () {
                if (w.location.origin + '/' != w.location.href && $isMobile) {
                    if (!$isMobile) return;
                    findSuitableImages(function (imageData) {
                        if (imageData.length != 0) {
                            putCss();
                            allImageData = imageData;
                            getSimilarImagesFromAPI();
                            if(window.location.hash.indexOf('#open') != -1) window.location.href = window.location.href.replace(/#.*$/, '#');
                        }
                        else Debugger.log('Log : No image found to show proper ad')
                    });
                }
                else Debugger.log('Log : Homepage so no ad.');
            });
        }
    };

    // Create script tag with forwarded link and put under the head section and get back to scriptLoadHandler function
    var loadJS = function(src, callback) {
        var s = document.createElement('script');
        s.src = src;
        s.type = "text/javascript";

        s.onreadystatechange = s.onload = function() {
            var state = s.readyState;
            if (!callback.done && (!state || /loaded|complete/.test(state))) {
                callback.done = true;
                callback(true);
            }
        };
        (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(s);
    };

    // Load jQuery if not present and swipe handler if mobile
    if (window.jQuery === undefined || parseInt(window.jQuery.fn.jquery.split('.').join("")) < 142) {
        loadJS(jqueryLink, function(status){
            if(status){
                if($isMobile) loadJS(touchSwipe, function(status){
                    if(status) initialize();
                });
                else initialize();
            }
        })
    }
    else{
        if($isMobile) loadJS(touchSwipe, function(status){
            if(status) initialize();
        });
        else initialize();
    }
})();
