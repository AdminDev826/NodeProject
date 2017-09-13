function initToolbarComponent(){

}

function initToolbarEventHandler(){
    $(".btn-toolbar-filter").click();
    $(".btn-toolbar-save").click(function(){
        $("#saveMonitorModal").modal("toggle");
    });
}