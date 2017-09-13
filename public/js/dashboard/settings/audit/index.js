var table;
var loadIndex=0;
var scrollHeight, aValue, tfValue, ttValue, eValue, dValue;
var dp;

$(document).ready(() => {
    initComponent();
    initTable();
    initSocketConnection();
});

initComponent = () => {
    $('.panel-body').css('height', ($('.page-aside').height() - 60) + 'px');      
    $("#audit_time_from").datetimepicker({
        format: 'YYYY-MM-DD HH:mm'
    }).on('dp.change', function(ev) {
        tfValue = ev.target.value;
        table.fnClearTable();
        loadIndex = 0;
        loadData();
    });

    $("#audit_time_to").datetimepicker({
        format: 'YYYY-MM-DD HH:mm'
    }).on('dp.change', function(ev) {
        ttValue = ev.target.value;
        table.fnClearTable();
        loadIndex = 0;
        loadData();
    });

    $(".vcenter").css('vertical-align', 'middle');

    $.ajax({
        url:    '/dashboard/settings/audit/getUsers',
        type:   'POST',
        success: (res) => {
            $("#audit_actor").typeahead({
                hint: true,
                highlight: true,
                minLength: 1
            }, {
                name: 'actor',
                source: substringMatcher(res.data)
            }).on('typeahead:selected', function(ev, item) {
                aValue = item;
                table.fnClearTable();
                loadIndex = 0;
                loadData();
            });
        }
    });

    $.ajax({
        url:        '/dashboard/settings/audit/getEvents',
        type:       'POST',
        success:    (res) => {
            console.log(res.data);
            $("#audit_event").typeahead({
                hint: true,
                highlight: true,
                minLength: 1
            }, {
                name: 'event',
                source: substringMatcher(res.data)
            }).on('typeahead:selected', function(ev, item) {
                eValue = item;
                table.fnClearTable();
                loadIndex = 0;
                loadData();
            });
        }    
    });

    $('#exportButton').click(function() {
        _onClick_Export_Button();
    });

    $('#audit_description').keyup(function(e) {
        dValue = e.target.value;
        table.fnClearTable();
        loadIndex = 0;
        loadData();
    });
}

initSocketConnection = () => {
    var socket = io('//' + document.location.hostname + ':' + document.location.port);
    socket.on('message', (data) => {
        table.fnAddData([
            data.actor, 
            moment(new Date()).format('YYYY-MM-DD HH:mm'),
            data.type,
            data.description
        ]);
    });
}

initTable = () => {

    jQuery.fn.dataTableExt.oSort['date-asc'] = function(x,y) {
        return ((new Date(x) < new Date(y)) ? -1 : ((new Date(x) > new Date(y)) ? 1 : 0 ));
    };

    jQuery.fn.dataTableExt.oSort['date-desc'] = function(x,y) {
        return ((new Date(x) < new Date(y)) ? 1 : ((new Date(x) < new Date(y)) ? -1 : 0 ));
    };

    $.ajax({
        url:        '/dashboard/settings/audit',
        type:       'POST',
        data:       {loadIndex: loadIndex},
        success:    (res) => {
            
            table = $('#audit_table').dataTable({
                data:               res.data,
                
                aaSorting:          [[1, "desc"]],
                aoColumns:          [
                    null, 
                    {sType: 'date'},
                    null,
                    null
                ],
                bFilter:            false,
                bInfo:              false,
                bScrollInfinite:    true,
                bScrollCollapse:    true,
                searching:          false,
                sScrollY:           ($('.panel-body').height() - 150),
                paging:             false,

                columns: [
                    {title: "Actor"},
                    {title: "Time"},
                    {title: "Event"},
                    {title: "Description"},
                ]
            });

            $('.dataTables_scrollBody').on('scroll', function(e) {
                if (loadIndex == 0) {
                    loadIndex++;
                    return;
                }

                if (e.target.offsetHeight + e.target.scrollTop == e.target.scrollHeight) {
                    scrollHeight = e.target.scrollHeight;
                    loadIndex++;
                    loadData();
                }
            });  
        }
    });
}

function loadData() {
    var param  = {};

    param.loadIndex = loadIndex;

    if (aValue != '' && aValue != null && aValue != undefined) {
        param.actor = aValue;
    }

    if (tfValue != '' && tfValue != null && tfValue != undefined) {
        param.time_from = tfValue;
    }

    if (ttValue != '' && ttValue != null && ttValue != undefined) {
        param.time_to = ttValue;
    }

    if (eValue != '' && eValue != null && eValue != undefined) {
        param.event = eValue;
    }

    if (dValue != '' && dValue != null && dValue != undefined) {
        param.description = dValue;
    }

    $.ajax({
        url:        '/dashboard/settings/audit',
        type:       'POST',
        data:       param,
        success:    (res) => {
            if (res.data.length == 0) {
                return;
            }

            table.fnAddData(res.data);

            if (loadIndex == 0 || loadIndex == 1) {
                $('.dataTables_scrollBody').scrollTop(0);
            } else {
                $('.dataTables_scrollBody').scrollTop(scrollHeight - 120);
            }
        }
    });
}

substringMatcher = function(strs) {
    return function findMatches(q, cb) {
        var matches, substrRegex;

        matches = [];

        substrRegex = new RegExp(q, 'i');

        $.each(strs, function(i, str) {
            if (substrRegex.test(str)) {
                matches.push(str);
            }
        });

        cb(matches);
    };
};

_onClick_Export_Button = () => {
    var dataSource = shield.DataSource.create({
        data: "#audit_table",
        schema: {
            type: "table",
            fields: {
                Actor:          { type: String },
                Time:           { type: String },
                Event:          { type: String },
                Description:    { type: String }
            }
        }
    });

    dataSource.read().then(function (data) {
        console.log(data);
        var pdf = new shield.exp.PDFDocument({
            author: "welink",
            created: new Date()
        });

        pdf.addPage("a4", "portrait");

        pdf.table(
            50,
            50,
            data,
            [
                { field: "Actor",       title: "Actor",         width: 100 },
                { field: "Time",        title: "Time",          width: 120 },
                { field: "Event",       title: "Event",         width: 100 },
                { field: "Description", title: "Description",   width: 150 }
            ],
            {
                margins: {
                    top:  10,
                    left: 10
                }
            }
        );

        pdf.saveAs({
            fileName: "Audit"
        });
    });
}
