/*
 Version : 0.0.4.5
 Created On : 15.10.2015
 Last Edited : 15.10.2015
 */
(function() {
    /* //////////////////////////////// Commonly required function ////////////////////////// */
    var Debugger = function () { };
    Debugger.log = function (message) {
        try {
            if(debugRequired) console.log(message);
        } catch (exception) {}
    };

    // Get the cookie value by using cookie name
    var getCookie = function(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1);
            if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
        }
        return undefined;
    };

    /* //////////////////////////////// Common variable declaration Starts Here ////////////////////////// */
    var jqueryLink = '//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js',
        touchSwipe = 'http://d3clqjla00sltp.cloudfront.net/swipeHandler.js',
        impressionLink = 'http://54.251.188.125/pm-c/v1/',
        cookie = getCookie('_pm'),
        unique = (cookie) ? 0 : 1,
        affiliateId = '',
        activateAutoScrolling = false,
        autoScrollingInterval = 2000,
        autoScrollInterval = {},
        addBuyNowButton = true,
        putGTMStatus = false,

        eventName = 'koimoiWebEventTrigger',
        PM_IP_DL = [],
        campaignId = 'Komoi.com_web_1',
        GTM_TAG = "<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='//www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','PM_IP_DL','GTM-NW3QB8');<\/script>";

    /* /////////////////////////////////// All image selection /////////////////////////////////////// */
    var minWidthSupport = 320,
        maxWidthSupport = 760,
        minHeightRequired= 150,
        minWidthPercentage = 0.7;

    var d = document,
        w = window,
        $,
        $imageHolder = ['body img'],
        $isMobile = !!((/android|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()))),
        $onceCalled = false,
        $isDocumentReady = false,
        allImageData,
        maxAdShow = 2,
        adCounter = 0,
        webOrMobile = true, // True for web, False for mobile
        debugRequired = true,
        ecommImage = {
            'amazon': 'http://sanjivb.com/wp-content/uploads/2013/07/Amazon-logo-small.jpg',
            'flipkart': 'http://cdn.techgyd.com/fp.png',
            'paytm': 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQm4mQRZ5_bKhoyKcUpsaprQBVBtJ5KP8T6pWCYyBsL39ZIbykP'
        };

    /* //////////////////////////////// main list of functions ////////////////////////// */
    var pushEvent = function(dataObject){
        var tempObject = {
            event: eventName,
            koimoiWebClickAction: dataObject.clickAction,
            koimoiWebClickCategory: dataObject.clickCategory,
            koimoiWebClickLabel: dataObject.clickLabel
        };
        Debugger.log(tempObject);
        // Data layer push on click to open it in large page
        PM_IP_DL.push(tempObject);
    };

    var typeofMouseClick = function(t) {
        var $html = $('html'),
            isTranslated = ($html.hasClass('translated-ltr') || $html.hasClass('translated-rtl')) ? " : _Translated" : "";

        if(t === 2) return "*MiddleClick" + isTranslated;
        if(t === 3) return "*RightClick" + isTranslated;
        return "*LeftClick" + isTranslated;
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
        var tempObject = [], allImages = ($imageHolder.length != 0) ? findImagesTheSpecifiedHolder() : [], parser = d.createElement('a');
        if(allImages.length > 0) {
            for(var i=0; i < allImages.length; i++){
                var $this = $(allImages[i]),
                    $width = $this.width(),
                    $height = $this.height(),
                    $src = $this.attr('src') || $this.attr('data-src'),
                    $referrer = window.location.href,
                    $pathname;

                // formatting the image source
                parser.href = $src;
                $pathname = (parser.pathname.charAt(0)=='/') ? parser.pathname : '/'+ parser.pathname;
                $src = $.trim(parser.protocol+ '//' +parser.hostname+$pathname).replace(/\/$/,'').replace(/\/$/,'');

                // Formatting the referrer
                parser.href = $referrer;
                $pathname = (parser.pathname.charAt(0)=='/') ? parser.pathname : '/'+ parser.pathname;
                $referrer = $.trim(parser.protocol+ '//' +parser.hostname+$pathname).replace(/\/$/,'').replace(/\/$/,'');

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
        var l = w.location.href;
        return l.replace(w.location.protocol + '//' + w.location.host +'/', '').split('/')[0];
    };

    var putCss = function() {
        var head = d.head || d.getElementsByTagName('head')[0],
            style = d.createElement('style'),
            css,
            link = d.createElement('link');

        link.href = '//fonts.googleapis.com/css?family=Nunito:300';
        link.rel = 'stylesheet';
        link.type = 'text/css';
        head.appendChild(link);

        css = '._processedImageAd{position:relative !important;height:120px !important;width:100% !important;z-index:2147483640 !important;cursor:auto;background-color:#ffffff !important;padding:10px 0 !important;}._processedImageAd .headingAndLogoContainer{text-align:left;display:block;position: relative;}._processedImageAd .headingAndLogoContainer .title, ._processedImageAd .headingAndLogoContainer img.logo{float:left;}._processedImageAd .headingAndLogoContainer .title{font-size:12px;color: #717171;font-family:\'Roboto\';text-align: left;margin-left:15px;margin:-8px 0 0 15px;padding:0;}._processedImageAd .headingAndLogoContainer img.logo{height:18px;margin-top:-5px;margin-left:11px;}._processedImageAd #imageSetPanel{clear:both;display:block !important;height:100% !important;/*margin:0 35px !important;*/margin:0 !important;white-space:nowrap !important;overflow:hidden;padding:0 !important;}._processedImageAd #imageSetPanel>li{border-right:1px solid #ccc;display:inline-block !important;list-style:none !important;width:210px;height:100%;margin:0 5px !important;background:#fff;max-height:218px;z-index:2147483644 !important;position:relative;}._processedImageAd #imageSetPanel>li:first-child{margin-left:0 !important;}._processedImageAd #imageSetPanel>li:last-child{margin-right:0 !important;border-right:0;}._processedImageAd #imageSetPanel>li img{display:inline-block;float:left;width:auto;height:auto;max-height:100%;max-width:40%;vertical-align:middle;}._processedImageAd #imageSetPanel>li .smallInfo{float:left;width:60%;height:100%;font-family:\'Roboto\',sans-serif;white-space: pre-wrap !important;}._processedImageAd #imageSetPanel>li .smallInfo span{display:block;text-align:left;padding:0 5px;font-size:13px;color:#717171;}._processedImageAd #imageSetPanel>li .smallInfo span:first-child{font-size:13px;white-space:nowrap;overflow:hidden;}._processedImageAd #imageSetPanel>li .smallInfo span.productName{color:#0000FF;font-size:12px;max-height:23px;overflow:hidden;line-height:1;margin:5px 0;}a._buy_now {display:block;text-align:center;padding:5px;color:#ffffff !important;background-color:#59B127;border:1px solid #48961B;}._processedImageAd span.arrow{position: absolute !important;top: 35% !important;background-color: #E5E5E5 !important;font-size: 48px !important;cursor: pointer !important;z-index: 2147483648 !important;width: 28px !important;height: 55px !important;opacity: 0.85 !important;box-shadow: 0px 0px 4px #000;background-image: url(\'http://d3clqjla00sltp.cloudfront.net/image/arrow.png\');background-size: 25px 215px;}._processedImageAd span.arrow.right{right:-1px !important;left:initial !important;background-position: 4px 86px;}._processedImageAd span.arrow.left{left:-1px;right:initial !important;background-position:5px 138px;}._processedImageAd ._cross{position:absolute;top:0;right:0;display:block;width:100%;}._processedImageAd ._cross a{text-decoration:underline;font-size:13px;padding:5px 10px;display:block;background-color:rgba(255,255,255,0.8);float:right;font-family:\'Nunito\',sans-serif;border-right:1px solid #ccc;line-height:1.2;color:#000;font-weight:300;}._processedImageAd ._cross span.times{font-size: 20px;line-height:1.3;background-color:rgba(255,255,255,0.8);float:right;display:block;width:25px;height:25px;text-align:center;vertical-align: baseline;cursor:pointer;color:#C7C7C7;font-weight:300;}';

        style.type = 'text/css';
        if (style.styleSheet) style.styleSheet.cssText = css;
        else style.appendChild(d.createTextNode(css));
        head.appendChild(style);
    };

    var putGTM = function(callback){
        //$('head').append($(GTM_TAG));
        setTimeout(function(){
            callback(true);
        }, 1000);
    };

    var bindEventsAndTriggerAnalytics = function(container){
        var adUnit = '$'+ container.attr('data-r') +' : ~'+ container.attr('data-iu') +' : @'+ container.attr('data-s') +' : *Click',
            atfOrBtf = (parseInt(container.attr('data-atf')) == 1) ? 'ATF' : 'BTF';

        // Arrow click event binding
        container.find('span.arrow').mousedown(function(e){
            var $isLeft = $(this).hasClass('left'), $scrollDirection = ($isLeft) ? 'Left' : 'Right';
            var $selector = $(this).parent().find("ul#imageSetPanel"), $liWidth = $selector.find('li').eq(0).width();

            try{ var key = $selector.attr('data-timer'); window.clearInterval(autoScrollInterval[key]); }catch(e){}
            if(($selector.find('li').length * $liWidth) > $selector.parent().width()){
                $selector.animate({
                    'scrollLeft' : ($(this).hasClass('left')) ? $selector.scrollLeft() - ($liWidth + 10) : $selector.scrollLeft() + ($liWidth + 10)
                }, 500);
            }

            pushEvent({
                'clickAction': '#'+ campaignId +' : ~Arrow : @'+ $scrollDirection +' : $'+ atfOrBtf,
                'clickCategory': adUnit,
                'clickLabel': typeofMouseClick(e.which) +' : $Web'
            });
        });

        // Close Button Event Bind
        container.find('._cross .times').mousedown(function(e){
            if(e.which == 1){
                $(this).closest('._processedImageAd').remove();
                $('body').css({'overflow':''});
            }

            pushEvent({
                'clickAction': '#'+ campaignId +' : ~Close : $'+ atfOrBtf,
                'clickCategory': adUnit,
                'clickLabel': typeofMouseClick(e.which) +' : $Web'
            });
        });

        // Buy now click event bind
        container.find('li a._buy_now').mousedown(function(e){
            var closestLi = $(this).closest('li'),
                gender = (parseInt(closestLi.attr('data-gender')) == 0) ? 'Woman' : 'Man',
                dressType = closestLi.attr('data-dress-type'),
                amazonLink = closestLi.attr('data-al');

            pushEvent({
                'clickAction': '#'+ campaignId +' : ~Buy Now : @'+ dressType +' : ^'+ gender +' : $'+ atfOrBtf,
                'clickCategory': adUnit,
                'clickLabel': '@'+ amazonLink +' : '+ typeofMouseClick(e.which) +' : $Web'
            });
        });

        // Unit Click event bind
        container.find('li').mousedown(function(e){
            if(!$(e.target).hasClass('_buy_now')) {
                var closestLi = $(this),
                    gender = (parseInt(closestLi.attr('data-gender')) == 0) ? 'Woman' : 'Man',
                    dressType = closestLi.attr('data-dress-type'),
                    amazonLink = closestLi.attr('data-al');

                pushEvent({
                    'clickAction': '#'+ campaignId +' : ~Unit Click : @'+ dressType +' : ^'+ gender +' : $'+ atfOrBtf,
                    'clickCategory': adUnit,
                    'clickLabel': '@'+ amazonLink +' : '+ typeofMouseClick(e.which) +' : $Web'
                });
            }
        });
    };

    var putHtmlAndBindEvents = function(dataObjects){
        console.log(dataObjects);
        var heading = (dataObjects.receivedData.meta.message !== null) ? dataObjects.receivedData.meta.message : 'Recommended Products for you from', imageLink = (ecommImage[dataObjects.receivedData.meta.ecommerce]) ? ecommImage[dataObjects.receivedData.meta.ecommerce] : 'http://sanjivb.com/wp-content/uploads/2013/07/Amazon-logo-small.jpg', $html = '<div class="headingAndLogoContainer"><h5 class="title">'+ heading +' </h5><img src="'+ imageLink +'" class="logo"/></div>',
            i,
            $htmlContainer = $('<div class="_processedImageAd" data-attr="not-done" data-atf="'+ dataObjects.atf +'" data-iu="'+ $.trim(dataObjects.src) +'" data-s="'+ dataObjects.section +'" data-r="'+ dataObjects.referrer +'"></div>'),
            price,
            param;
        $html += '<ul id="imageSetPanel">';

        if(!$isMobile){
            for(i=0; i<dataObjects.receivedData.data.length; i++) {
                price = ($.trim(dataObjects.receivedData.data[i]['discountPrice']) != "") ? dataObjects.receivedData.data[i]['discountPrice'] : dataObjects.receivedData.data[i]['price'];
                param = {
                    s: dataObjects.section,
                    g: (dataObjects.receivedData.data[i].gender == 'man') ? 1 : 0,
                    c: dataObjects.receivedData.data[i].category,
                    iu: $.trim(dataObjects.src),
                    al: dataObjects.receivedData.data[i].link + affiliateId
                };
                if(!addBuyNowButton){
                    $html += '<li data-price="'+ dataObjects.receivedData.data[i].price +'" data-discount-price="'+ dataObjects.receivedData.data[i].discountPrice +'" data-al="'+ dataObjects.receivedData.data[i].link +'" data-gender="'+ param.g +'" data-dress-type="'+ param.c +'"><a href="'+ clickLink +'?'+ $.param(param) +'" target="_blank"><img src="'+ dataObjects.receivedData.data[i].imagepath +'"><div class="smallInfo"><span>'+ dataObjects.receivedData.data[i].brand +'</span><span class="prdctName">'+ dataObjects.receivedData.data[i].name +'</span><span>Price: '+ price +'</span></div></a></li>';
                }
                else {
                    $html += '<li data-price="' + dataObjects.receivedData.data[i].price + '" data-discount-price="' + dataObjects.receivedData.data[i].discountPrice + '" data-al="'+ dataObjects.receivedData.data[i].link +'" data-gender="'+ dataObjects.receivedData.data[i].gender +'" data-dress-type="'+ param.c +'"><img src="' + dataObjects.receivedData.data[i].imagepath + '"><div class="smallInfo"><span>' + dataObjects.receivedData.data[i].brand + '</span><span class="prdctName">' + dataObjects.receivedData.data[i].name + '</span><span>Price: ' + price + '</span><span><a href="'+ dataObjects.receivedData.data[i].link +'" class="_buy_now" target="_blank">Buy Now</a></span></div></li>';
                }
            }
            $html += '</ul><span class="_cross"><span class="times">&times;</span></span><span class="arrow left"></span><span class="arrow right"></span>';

            $htmlContainer.append($html);
            dataObjects.containerDiv.append($htmlContainer);

            if(activateAutoScrolling){
                var $selector = $htmlContainer.find("ul#imageSetPanel"), $li = $selector.find('li'), $liWidth = $li.eq(0).width(), $selectorWidth = $selector.width(), tempInterval = window.setInterval(function(){
                    $selector.animate({
                        'scrollLeft' : (((($liWidth + 10) * $li.length) - $selectorWidth) > $selector.scrollLeft()) ? $selector.scrollLeft() + ($liWidth + 10) : 0
                    }, 500);
                }, autoScrollingInterval), key;

                while(1){
                    key = Math.floor(Math.random() * 10000);
                    key = 't-'+ key;
                    if(!(key in autoScrollInterval)) break;
                }
                $selector.attr('data-timer', key);
                autoScrollInterval[key] = tempInterval;
            }
        }

        //bindEventsAndTriggerAnalytics($htmlContainer);
    };

    var getSimilarImagesFromAPI = function(){

        if(allImageData.length > 0){
            var currentObject = allImageData[0];
            var param = {
                'iu': currentObject.src,
                'u': unique,
                'a': ((currentObject.position.top + (currentObject.height/2)) < w.innerHeight) ? 1 : 0,
                's': getSection(),
                'wm': webOrMobile,
                'r': currentObject.referrer
            };
            if(adCounter==maxAdShow) return;
            doNetWorkCall(impressionLink, param, function(receivedData){
                Debugger.log(receivedData);
                if(receivedData.result != 'np' && receivedData.result != 'error' && receivedData.length != 0){
                    if(!putGTMStatus){
                        putGTM(function(){
                            PM_IP_DL = window.PM_IP_DL || [];
                        });
                        putGTMStatus = true;
                    }
                    currentObject.receivedData = receivedData;
                    currentObject.atf = param.a;
                    currentObject.section = param.s;

                    putHtmlAndBindEvents(currentObject);

                    allImageData.splice(0, 1);
                    adCounter++;
                    if(unique) unique = 0;
                    if(allImageData.length != 0) getSimilarImagesFromAPI();
                }
                else{
                    allImageData.splice(0, 1);
                    if(unique) unique = 0;
                    if(allImageData.length != 0) getSimilarImagesFromAPI();
                }
            });
        }
        else Debugger.log('Log : No suitable image found !!')
    };

    var secondsUntilMidnight = function() {
        var midnight = new Date();
        midnight.setHours( 24 );
        midnight.setMinutes( 0 );
        midnight.setSeconds( 0 );
        midnight.setMilliseconds( 0 );
        return (midnight.getTime() - new Date().getTime()) / 1000;
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

    // After deciding which jQuery to use this function get called
    var initialize = function(){
        Debugger.log('Log : Initialize function called !!');
        if ($isMobile) return;

        if(!$onceCalled) {
            $onceCalled = true;
            $ = $ || window.jQuery || window.$;
            if (unique) setCookie('_pm', getUniqueId(), Math.round(secondsUntilMidnight()));

            $(document).ready(function () {
                console.log(2);
                if (w.location.origin + '/' != w.location.href && !$isDocumentReady) {
                    $isDocumentReady = true;
                    findSuitableImages(function (imageData) {
                        if (imageData.length != 0) {
                            putCss();
                            allImageData = imageData;
                            getSimilarImagesFromAPI();
                        }
                        else Debugger.log('Log : No image found to show proper ad')
                    });
                }
                else Debugger.log('Log : Homepage so no ad.')
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