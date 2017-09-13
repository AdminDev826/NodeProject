$(document).ready(() => {

    _onSettings_Loaded();

    $("#changePasswordForm").submit(() => {
        _onSubmit_ChangePasswordForm();
    });

    $("#nameForm").submit(() => {
        _onSubmit_NameForm();
    });

    $("#tagForm").submit(() => {
        _onSubmit_TagForm();
    });

    $("#emailForm").submit(() => {
        _onSubmit_EmailForm();
    });
    
});

_onSettings_Loaded = () => {
    _onAccount_Load();
    _onTeam_Load();
    _onPlan_Load();
}