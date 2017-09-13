Event = () => {
}

Event.events = {};

//-- Account--//
Event.events['ChangeName']          = {id: '0-0',   event: 'ChangeName',                description: 'Name changed to '};
Event.events['ChangeTag']           = {id: '0-1',   event: 'ChangeTag',                 description: 'Tag changed to '};
Event.events['ChangeEmail']         = {id: '0-2',   event: 'ChangeEmail',               description: 'Email changed to '};
Event.events['ChangeLanguage']      = {id: '0-3',   event: 'ChangeLanguage',            description: 'Language changed to '};
Event.events['ChangeDateFormat']    = {id: '0-4',   event: 'ChangeDateFormat',          description: 'DateFormat changed to '};
Event.events['ChangeTimezone']      = {id: '0-5',   event: 'ChangeTimezone',            description: 'Timezone changed to '};
Event.events['DeactivateAccount']   = {id: '0-6',   event: 'DeactivateAccount',         description: 'Account deactivated'};
Event.events['ChangePassword']      = {id: '0-7',   event: 'ChangePassword',            description: 'Password changed'};
Event.events['Login']               = {id: '0-8',   event: 'Login',                     description: 'Login'};
Event.events['Logout']              = {id: '0-9',   event: 'Logout',                    description: 'Logout'};
Event.events['Join']                = {id: '0-10',   event: 'Join',                      description: 'Joined to account'};
//--Team--//
Event.events['InviteMember']        = {id: '1-0',   event: 'InviteMember',              description: 'New member invited - '};
Event.events['CreateGroup']         = {id: '1-1',   event: 'CreateGroup',               description: 'New group created - '};
Event.events['DeleteGroup']         = {id: '1-2',   event: 'DeleteGroup',               description: 'Group deleted - '};
Event.events['AssignMembersToGroup']= {id: '1-3',   event: 'AssignMembersToGroup',      description: 'Members - '};
Event.events['SetUserType']         = {id: '1-4',   event: 'SetUserType',               description: 'Set user role - '};
Event.events['DeactivateMember']    = {id: '1-5',   event: 'DeactivateMember',          description: 'Member deactivated - '};
Event.events['ActivateMember']      = {id: '1-6',   event: 'ActivateMember',            description: 'Member activated - '};
Event.events['DeleteMember']        = {id: '1-7',   event: 'DeleteMember',              description: 'Member removed - '};
//--Billing--//
Event.events['ChangePlan']          = {id: '2-0',   event: 'ChangePlan',                description: 'Plan changed to '};
Event.events['UpdateBilling']       = {id: '2-1',   event: 'UpdateBilling',             description: 'Billing updated'};


Event.getEventByType = (type) => {
    for (var key in Event.events) {
        if (key = type) {
            return (Event.events[key]);
        }
    }
}

Event.getEventById = (id) => {
    for (var key in Event.events) {
        if (Event.events[key].id == id) {
            return (Event.events[key]);
        }
    }
} 

Event.getEventsByDescription = (subString) => {
    var ret = [];
    for (var key in Event.events) {
        if (Event.events[key].description.includes(subString)) {
            ret.push(Event.events[key].id);
        }
    }

    return ret;
}

Event.getAllEvents = () => {
    var ret = [];

    for (var key in Event.events) {
        ret.push(Event.events[key]);    
    }

    return ret;
}

module.exports = Event;