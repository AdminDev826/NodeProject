var selectedMemberID;

_onTeam_Members_Load = () => {
    
    $.ajax({
        url:  '/dashboard/settings/team/getEditableDataSource',
        type: 'POST',
        success: _onSuccess_GetEditableDataSource 
    });
    
    $('#team_member_inviteForm').submit(() => {_onSubmit_InviteForm();}); 
    $("#team_member_inviteForm").bind('ajax:complete', function() { 
        console.log("Complete");
    });
    
    $('.member-profile-btn-deactivate').on('click', _onClick_Deactivate_Member);
    $('.member-profile-btn-activate').on('click', _onClick_Activate_Member);
    $('.member-profile-btn-delete').on('click', _onClick_Delete_Member);
}

_onClick_Delete_Member = (e) => {
    selectedMemberID = $(event.target).parent().closest('li').attr('data-id');
    
    $.ajax({
        url: '/dashboard/settings/team/deleteMember',
        type: 'POST',
        data: {userID: selectedMemberID},
        success: (res) => {
            console.log(res);
            if (res.result == 0) {
                location.reload(true);
            }
        }
    });
}

_onClick_Deactivate_Member = (e) => {
    selectedMemberID = $(event.target).parent().closest('li').attr('data-id');

    $.ajax({
        url: '/dashboard/settings/team/deactivateMember', 
        type: 'POST',
        data: {userID: selectedMemberID},
        success: (res) => {
            if (res.result == 0) {
                location.reload(true);
            }
        }
    });
}

_onClick_Activate_Member = (e) => {
    selectedMemberID = $(event.target).parent().closest('li').attr('data-id');

    $.ajax({
        url: '/dashboard/settings/team/activateMember',
        type: 'POST',
        data: {userID: selectedMemberID},
        success: (res) => {
            if (res.result == 0) {
                location.reload(true);
            }
        }
    });
}

_onSuccess_GetEditableDataSource = (res) => {
    if (res.result == 0) 
        initEditable_Team_Members(res.data_source);
}

initEditable_Team_Members = (data_source) => {
    $.fn.editableform.buttons =
        '<button type="submit" class="btn btn-primary btn-sm editable-submit">' +
        '<i class="icon md-check"></i>' +
        '</button>' +
        '<button type="button" class="btn btn-default btn-sm editable-cancel">' +
        '<i class="icon md-close"></i>' +
        '</button>';

    $.fn.editabletypes.datefield.defaults.inputclass = "form-control input-sm";

    //defaults
    $.fn.editable.defaults.url = '/dashboard/settings/team/setUserType';

    $.fn.editable.defaults.mode = 'inline';
    $('.member-profile-position').editable({
        source: data_source,
        display: function(value, sourceData) {
            
            elem = $.grep(sourceData, function(o) {
                return o.value == value;
            });
            
            if (elem.length) {
                $(this).text(elem[elem.length - 1].text).css("color", "white");
            } else {
                $(this).empty();
            }
        }
    });
}

_onSubmit_InviteForm = () => {
    var firstName   = $('#team_member_inviteForm_firstName').val();
    var lastName    = $('#team_member_inviteForm_lastName').val();
    var email       = $('#team_member_inviteForm_email').val();
    var userType    = $('#team_member_inviteForm_userType').val();

    $.ajax({
        url: $('#team_member_inviteForm').attr('action'),
        type: $('#team_member_inviteForm').attr('method'),
        data: {firstName: firstName, lastName: lastName, email: email, userType: userType},
        success: _onSuccess_InviteForm
    });

    $("#inviteMemberFormModal").modal('toggle');
    waitingDialog.show('', {dialogSize: 'sm'});
    event.preventDefault();
}

_onSuccess_InviteForm = (res) => {
    console.log("_onSuccess_InviteForm", res);
    waitingDialog.hide();

    $('#team_member_inviteForm_firstName').val("");
    $('#team_member_inviteForm_lastName').val("");
    $('#team_member_inviteForm_email').val("");

    if (res.result == 0) {
        console.log("_onSuccess_InviteForm", res);

        location.reload(true);
    } else {
        toastr.options.positionClass = 'toast-top-full-width';
        toastr.error(res.message);
    }
}