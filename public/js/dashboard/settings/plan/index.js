_onSetPlan_Success = (res) => {
    return res.result == 0;
}

_onPlan_Load = () => {
    if ($("#container_plan") == undefined) { return; }

    formatBillingEndDate();

    initEditable_Plan("_onPlan_Load");

}

formatBillingEndDate = () => {
    var billingEndDate = $(".billing-end-date").text();
    if (billingEndDate.trim() != "...") {
        $(".billing-end-date").text(moment(new Date(billingEndDate)).format('LL'));
    }
}

initEditable_Plan = () => {
    $.fn.editableform.buttons =
        '<button type="submit" class="btn btn-primary btn-sm editable-submit">' +
        '<i class="icon md-check"></i>' +
        '</button>' +
        '<button type="button" class="btn btn-default btn-sm editable-cancel">' +
        '<i class="icon md-close"></i>' +
        '</button>';

    $.fn.editabletypes.datefield.defaults.inputclass = "form-control input-sm";

    //defaults
    $.fn.editable.defaults.url = '/dashboard/settings/plan/setPlan';

    $.fn.editable.defaults.mode = 'inline';
    $('#max_users').editable({
        type: 'text',
        pk: 1,
        name: 'max_users',
        title: 'Max Users',
        success: _onSetPlan_Success
    });

    $('#max_posts').editable({
        type: 'text',
        pk: 1,
        name: 'max_posts',
        title: 'Max Posts',
        success: _onSetPlan_Success
    });

    $('#max_storage').editable({
        type: 'text',
        pk: 1,
        name: 'max_storage',
        title: 'Max Storage',
        success: _onSetPlan_Success
    });

    $('#max_monitors').editable({
        type: 'text',
        pk: 1,
        name: 'max_monitors',
        title: 'Max Monitors',
        success: _onSetPlan_Success
    });

    $('#max_live_searches').editable({
        type: 'text',
        pk: 1,
        name: 'max_live_searches',
        title: 'Max Live Searches',
        success: _onSetPlan_Success
    });

    $('#max_live_searches_per_user').editable({
        type: 'text',
        pk: 1,
        name: 'max_live_searches_per_user',
        title: 'Max Live Searches Per User',
        success: _onSetPlan_Success
    });

    $('#max_monitors_per_user').editable({
        type: 'text',
        pk: 1,
        name: 'max_monitors_per_user',
        title: 'Max Monitors Per User',
        success: _onSetPlan_Success
    });

    $('#max_posts_per_month').editable({
        type: 'text',
        pk: 1,
        name: 'api_limit_month',
        title: 'Max Posts Per Month',
        success: _onSetPlan_Success
    });

}
