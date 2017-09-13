$(document).ready(function(){
    $("#saveMonitorModal").on("shown.bs.modal", function(){
        init_Save_Monitor_Form_Values();
        init_Save_Monitor_Form(); 
        init_Save_Monitor_Form_Event_Handler();
    });
});
 
init_Save_Monitor_Form = () => {
    // init_Save_Monitor_Form_Validators(); 
    validate_Save_Monitor_Form();
    $("#timezone").val(moment.parseZone(new Date()).format("Z").replace(":", ","));
}

init_Save_Monitor_Form_Event_Handler = () => {
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
    isAreaValid(getLocations(), function(isValid, shapes){
        if (!isValid) {
            $("#saveMonitorModal").modal("toggle");
            showMessage("Area of the shape cannot be greater than 78.5 square kilometres.", "warning");
            return;
        }
        var param = {
            name            : $("#saveMonitorForm #name").val(),
            timezone        : $("#saveMonitorForm #timezone").val(),
            // locations       : $("#saveMonitorForm #locations").val(),
            locations       : getLocations(),
            currentDataType : $("#saveMonitorForm input[name=currentDataType]").val(),
            keywords        : $("#saveMonitorForm #keywords").val(),
            ttUsernames     : $("#saveMonitorForm #ttUsernames").val(),
            igUsernames     : $("#saveMonitorForm #igUsernames").val(),
            mID             : mID
        };

        $.ajax({
            url: "/apps/locations/saveMonitor",
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
    });
}

function createLiveMonitor(callback){
    isAreaValid(getLocations(), function(isValid, shapes){
        if (!isValid) {
            showMessage("Area of the shape cannot be greater than 78.5 square kilometres.", "warning");
            callback(false, null);
        } else if (shapes.length <= 0) {
            showMessage("Please draw overlays to monitor.", "warning");
            callback(false, null);
        } else {
            $.ajax({
                url: "/apps/locations/createLiveMonitor",
                data: {locations: getLocations()},
                type: "POST",
                success: (res) => {
                    if (!res.success) {
                        callback(false, null);
                    } else {
                        callback(true, res.data.mid);
                    }
                }
            });
        }
    });
}

function startLiveMonitor(mID){
    var host = location.hostname;
    var port = "4848";
    var wss = new WebSocket("ws://" + host + ":" + port + "/api/v1/monitor/live?mid=" + mID);
    wss.onopen = function(evt){
        console.log("onopen");
    }
    wss.onerror = function(evt){
        console.log("onerror");
    }
    wss.onmessage = function(evt){
        var data = JSON.parse(evt.data);
        processData(data);
    }
}

function pauseMonitor(mID) {
    $.ajax({
        url: "/apps/locations/pauseMonitor",
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
        url: "/apps/locations/resumeMonitor",
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
        url: "/apps/locations/deleteData",
        data: {mID: mID},
        type: "POST",
        success: (res) => {
            if (res.success) {
                location.href = "/dashboard";
            }
        }
    });
}

init_Save_Monitor_Form_Values = () => {
    var mID = getParameterByName("mID"); 
    if (mID) {
        getMonitor(mID, function(data) {
            $("#saveMonitorForm #name").val(data.title);
        });
    } else {    
        $("#saveMonitorForm #name").val("");
        $("#saveMonitorForm #timezone").val("");
        $("#saveMonitorForm #locations").val("");
        $("#saveMonitorForm input[name=currentDataType]").val("0");
        $("#saveMonitorForm #keywords").val("");
        $("#saveMonitorForm #ttUsernames").val("");
        $("#saveMonitorForm #igUsernames").val("");
    }
}

validate_Save_Monitor_Form = () => {
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