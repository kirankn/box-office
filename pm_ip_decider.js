(function() {
    var $isMobile = !!((/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()))),
        $desktopAdLink = 'pm_ip_general_web.js',
        $mobileAdLink = 'pm_ip_general_mobile.js',
        $selectedScript = undefined;

    if($isMobile) $selectedScript = $mobileAdLink;
    else $selectedScript = $desktopAdLink;

    var $script = document.createElement('script');
    $script.type = 'text/javascript';
    $script.src = $selectedScript;
    document.getElementsByTagName('head')[0].appendChild($script);
})();
