var isAvailable_GroupName = true;
var selectedGroupID;

_onGroups_Load = () => {
    $('#groups_group_name_validate_message').css('display', 'none');

    $(".dd-nodrag").on("mousedown", function(event) { // mousedown prevent nestable click
        event.preventDefault();
        return false;
    });

    $(".dd-nodrag").on("click", function(event) { // click event
        event.preventDefault();
        return false;
    });

    $('#groups_createGroupForm_groupName').on('keypress', (e) => {
        if (e.which == 32) {
            return false;
        }
    });

    $('#groups_createGroupForm_groupName').on('keyup', (e) => {
        $.ajax({
            url: '/dashboard/settings/team/checkGroupNameAvailable',
            type: 'POST',
            data: {groupName: $('#groups_createGroupForm_groupName').val()},
            success: (res) => {
                if (res.result == 0) {
                    isAvailable_GroupName = true;
                    $('#groups_group_name_validate_message').css('display', 'none');
                } else if (res.result == 2) {
                    isAvailable_GroupName = false;
                    $('#groups_group_name_validate_message').css('display', '');
                    $('#groups_group_name_validate_message p').text(res.message);
                }
            }
        });
        
    });
    
    $('#createGroupFormModal').on('hidden.bs.modal', function () {
        $('#groups_createGroupForm_groupName').val("");
        $('#groups_group_name_validate_message').css('display', 'none');
    });

    $('.groups-group-item-btn-edit').on('click', _onClick_Edit_Group);
    $('.groups-group-item-btn-delete').on('click', _onClick_Delete_Group);

    $('#groups_createGroupForm').submit(() => {_onSubmit_CreatGroupForm();});
    $('#groups_editGroupForm').submit(() => {_onSubmit_EditGroupForm();});
    
}

_onClick_Edit_Group = (e) => {

    selectedGroupID = $(event.target).parent().closest('li').attr('data-id');

    $('#editGroupFormModal').find('*').each(function() {
        if ($(this).attr('class') == 'selectable-item') {
            $(this).prop('checked', false);
        }
    });

    $.ajax({
        url: '/dashboard/settings/team/getUsersByGroupId',
        type: 'POST',
        data: {groupID: selectedGroupID},
        success: (res) => {
            $('#editGroupFormModal').modal('toggle');

            if (res.result == 0) {
                for (var i = 0; i < res.users.length; i++) {
                    $('#editGroupFormModal').find('#' + res.users[i]._id).prop('checked', true);
                }
            }
        }
    });
}

_onClick_Delete_Group = () => {
    selectedGroupID = $(event.target).parent().closest('li').attr('data-id');
    $.ajax({
        url: '/dashboard/settings/team/deleteGroup',
        type: 'POST',
        data: {groupID: selectedGroupID},
        success: (res) => {
            if (res.result == 0) {
                $('#' + selectedGroupID).remove();
            }
        }
    });
}

_onSubmit_EditGroupForm = () => {
    var userIDs = [];

    $('#editGroupFormModal').find('*').each(function() {
        if ($(this).attr('class') == 'selectable-item') {

            if ($(this).prop('checked')) {
                console.log($(this).attr('id'));
                userIDs.push($(this).attr('id'));
            }
        }
    });

    $.ajax({
        url: $('#groups_editGroupForm').attr('action'),
        type: 'POST',
        data: {groupID: selectedGroupID, userIDs: JSON.stringify(userIDs)},
        success: (res) => {
            waitingDialog.hide();
            if (res.result == 0) {
                location.reload(true);
            }
        }
    });

    $('#editGroupFormModal').modal('toggle');
    waitingDialog.show('', {dialogSize: 'sm'});
    event.preventDefault();
}

_onSubmit_CreatGroupForm = () => {
    if (!isAvailable_GroupName) return;

    var groupName = $('#groups_createGroupForm_groupName').val();
    $.ajax({
        url: $('#groups_createGroupForm').attr('action'),
        type: $('#groups_createGroupForm').attr('method'),
        data: {groupName: groupName},
        success: (res) => {
            waitingDialog.hide();
            if (res.result == 0) {
                location.reload(true);
            }
        }
    });
    
    $('#createGroupFormModal').modal('toggle');
    waitingDialog.show('', {dialogSize: 'sm'});
    event.preventDefault();

}

