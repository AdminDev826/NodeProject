function initSaveComponent(){
    if (!getParameterByName("mID")) {
        $(".pause-monitor").css("display", "none");
        $(".resume-monitor").css("display", "none");
        $(".delete-monitor").css("display", "none");
    } else {
        $(".btn-search").css("display", "none");
        $(".btn-default-location").css("display", "none");
        getMonitor(getParameterByName("mID"), function(data){
            if (data.status == "A") {
                $(".pause-monitor").css("display", "");
                $(".resume-monitor").css("display", "none");
            } else if (data.status == "P") {
                $(".pause-monitor").css("display", "none");
                $(".resume-monitor").css("display", "");
            }
        });
    }

    $("#saveMonitorModal").on("shown.bs.modal", function(){
        initFormValues();
        initValidator();
        initSaveEventHandler();
    });
}

function initSaveEventHandler(){
    $(".pause-monitor").unbind("click").bind("click", function(event){
        pauseMonitor(getParameterByName("mID"));
    });
    $(".resume-monitor").unbind("click").bind("click", function(event){
        resumeMonitor(getParameterByName("mID"));
    });
    $(".delete-monitor").unbind("click").bind("click", function(event){
        deleteMonitor(getParameterByName("mID"));
    });
    $("#saveMonitorForm").unbind("submit").bind("submit", function(event){
        event.preventDefault();
        if (!$("#saveMonitorForm").data("formValidation").isValid()) return;
        saveMonitor(getParameterByName("mID"));
    });
}

function saveMonitor(mID) {
    var param = {
        name            : $("#saveMonitorForm #name").val(),
        timezone        : $("#saveMonitorForm #timezone").val(),
        currentDataType : $("#saveMonitorForm input[name=currentDataType]").val(),
        keywords        : $("#saveMonitorForm #keywords").val(),
        ttUsernames     : $("#saveMonitorForm #ttUsernames").val(),
        igUsernames     : $("#saveMonitorForm #igUsernames").val(),
        mID             : mID
    };

    $.ajax({
        url: "/apps/keywords/saveMonitor",
        data: param,
        type: "POST",
        success: (res) => {
            if (res.success) {
                $("#saveMonitorModal").modal("toggle");
                location.href = "/dashboard";
            } else {
                showMessage(res.message, "warning");
            }
        }
    });
}

function pauseMonitor(mID) {
    $.ajax({
        url: "/apps/keywords/pauseMonitor",
        data: {mID: mID},
        type: "POST",
        success: (res) => {
            if (res.success) {
                location.href = "/dashboard";
            }
        }
    });
}

function resumeMonitor(mID) {
    $.ajax({
        url: "/apps/keywords/resumeMonitor",
        data: {mID: mID},
        type: "POST",
        success: (res) => {
            if (res.success) {
                location.href = "/dashboard";
            }
        }
    });
}

function deleteMonitor(mID) {
    $.ajax({
        url: "/apps/keywords/deleteData",
        data: {mID: mID},
        type: "POST",
        success: (res) => {
            if (res.success) {
                location.href = "/dashboard";
            }
        }
    });
}

function initFormValues() {
    var mID = getParameterByName("mID");
    if (mID) {
        getMonitor(mID, function(data){
            $("#saveMonitorForm #name").val(data.title);
        });
    } else {
        $("#saveMonitorForm #name").val("");
        $("#saveMonitorForm #timezone").val(moment.parseZone(new Date()).format("Z").replace(":", ","));
        $("#saveMonitorForm input[name=currentDataType]").val("0");
        // $("#saveMonitorForm #keywords").val("");
        $("#saveMonitorForm #ttUsernames").val("");
        $("#saveMonitorForm #igUsernames").val("");
    }
}

function initValidator() {
    $('#saveMonitorForm').formValidation({
        framework: "bootstrap4",
        autoFocus: true,
        err: {
            clazz: 'text-help'
        },
        fields: {
            name: {
                validators: {
                    notEmpty: {
                        message: 'Please enter the monitor name'
                    }
                }
            }
        }
    });
}


