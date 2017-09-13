var encryptedData;
$(document).ready(() => {
    initComponent();
    initEventHandler();
});

initComponent = () => {
    $(".property-foregroundColor").colorpicker();
    $(".property-backgroundColor").colorpicker();
    $(".property-backgroundColor").val($('.widget').attr('backgroundColor'));
    $(".property-foregroundColor").val($('.widget').attr('foregroundColor'));
    $(".property-fontSize").val($('.widget').attr('fontSize'));
    $(".property-fontFace").val($('.widget').attr('fontFace').toLowerCase());
    $(".property-title").val($('.widget').attr('title'));
    $(".property-showTitleBar").val("false");
    $(".property-showFilterBar").val("true");
    $(".property-showToolbar").val("true");
    $(".property-showFooter").val("false");
    
    $.ajax({
        url: "/dashboard/settings/widgets/getEncryptedData",
        type: "POST",
        success: (res) => {
            if (!res.success) return;

            hash = res.encryptedData;
            $(".usage").val(generateCode({
                backgroundColor : $(".property-backgroundColor").val(),
                foregroundColor : $(".property-foregroundColor").val(),
                fontSize        : $(".property-fontSize").val(),
                fontFace        : $(".property-fontFace").val(),
                title           : $(".property-title").val(),
                showTitleBar    : $(".property-showTitleBar").val(),
                showFilterBar   : $(".property-showFilterBar").val(),
                showToolbar     : $(".property-showToolbar").val(),
                showFooter      : $(".property-showFooter").val(),
                hash            : hash
            }));
        }
    });
}

initEventHandler = () => {
    $(".form-control").on("change", function() {
        $(".widget").AuditTable("backgroundColor",  $(".property-backgroundColor").val());
        $(".widget").AuditTable("foregroundColor",  $(".property-foregroundColor").val());
        $(".widget").AuditTable("fontSize",         $(".property-fontSize").val());
        $(".widget").AuditTable("fontFace",         $(".property-fontFace").val());
        $(".widget").AuditTable("title",            $(".property-title").val());
        $(".widget").AuditTable("showTitleBar",     $(".property-showTitleBar").val());
        $(".widget").AuditTable("showFilterBar",    $(".property-showFilterBar").val());
        $(".widget").AuditTable("showToolbar",      $(".property-showToolbar").val());
        $(".widget").AuditTable("showFooter",       $(".property-showFooter").val());
        
        $(".usage").val(generateCode({
            backgroundColor : $(".property-backgroundColor").val(),
            foregroundColor : $(".property-foregroundColor").val(),
            fontSize        : $(".property-fontSize").val(),
            fontFace        : $(".property-fontFace").val(),
            title           : $(".property-title").val(),
            showTitleBar    : $(".property-showTitleBar").val(),
            showFilterBar   : $(".property-showFilterBar").val(),
            showToolbar     : $(".property-showToolbar").val(),
            showFooter      : $(".property-showFooter").val(),
            encryptedData   : encryptedData
        }));
    });

    $(".generate-code").hover(function() {
        $(this).attr("data-original-title", "Copy to clipboard!");
    }).click(function(){
        $(this).attr("data-original-title", "Copied!");
        $(this).tooltip('show');
        $("textarea").select();
        document.execCommand('copy');
        $("textarea").blur();
    });
}

generateCode = (config) => {
    var url = window.location.href;
    var arr = url.split("/");
    var host= arr[0] + "//" + arr[2];
    var ret = "";
    
    ret += '<script src = "' + host + '/lib/widgets/audit-widget/audit-widget.js"></script>' + '\n';
    ret += '<audit backgroundColor="' + config.backgroundColor + '" ' + '\n' +
                intent(1) + 'foregroundColor="'    + config.foregroundColor + '" ' + '\n' +
                intent(1) + 'fontSize="'           + config.fontSize + '" ' + '\n' +
                intent(1) + 'fontFace="'           + config.fontFace + '" ' + '\n' +
                intent(1) + 'title="'              + config.title + '" ' + '\n' +
                intent(1) + 'showTitleBar="'       + config.showTitleBar + '" ' + '\n' +
                intent(1) + 'showFilterBar="'      + config.showFilterBar + '" ' + '\n' +
                intent(1) + 'showToolbar="'        + config.showToolbar + '" ' + '\n' +
                intent(1) + 'showFooter="'         + config.showFooter + '" ' + '\n' +
                intent(1) + 'hash="'               + config.hash + '"> ' + '\n' +
           '</audit>' + '\n';

    return ret;
}

intent = (num) => {
    var ret = "";
    for (var i=0; i<num; i++) {
        ret += "\t";
    }
    return ret;
}

