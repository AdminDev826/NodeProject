function init() {
	$("audit").each(function() {
		var obj_attrs = {};
		$.each(this.attributes, function() {
			if(this.specified) {
				obj_attrs[this.name] = this.value;
			}
		});
		$(this).AuditTable(obj_attrs);
	});
}

function loadResources(resources, callback, index) {
	if (!index) index = 0;
	if (index < resources.length) {
		var src = resources[index];
		if (src.lastIndexOf(".") < 0) loadResources(resources, callback, index + 1);

		var element, head, flag;

		if (src.substr(src.lastIndexOf(".") + 1) == "css") {
			element = document.createElement("link");
			element.rel = "stylesheet";
			element.type = "text/css";
			element.href = src;
		} else if (src.substr(src.lastIndexOf(".") + 1) == "js") {
			element = document.createElement("script");
			element.type = "text/javascript";
			element.src = src;
		} else {
			loadResources(resources, callback, index + 1);
		}
		element.onload = element.onreadystatechange = function() {
			if (!flag && (!this.readyState || this.readyState == "complete")) {
				flag = true;
				loadResources(resources, callback, index + 1);
			}
		}
		element.onerror = function() {
			console.log("Error occured while loading external resource");
			loadResources(resources, callback, index + 1);
		}
		head = document.getElementsByTagName("head")[0];
		head.appendChild(element);
	} else {
		callback();
	}
}

window.onload = function() {
	var resource_url = [
		"/assets/css/bootstrap.min.css",
		"/assets/vendor/typeahead-js/typeahead.css",
		"/lib/bootstrap-datetimepicker/bootstrap-datetimepicker.min.css",
		"https://cdn.datatables.net/1.10.15/css/jquery.dataTables.min.css",
		"https://www.shieldui.com/shared/components/latest/css/light/all.min.css",
		"/assets/vendor/jquery/jquery.js",
		"/assets/vendor/tether/tether.js",
		"/assets/vendor/bootstrap/bootstrap.js",
		"https://cdn.datatables.net/1.10.15/js/jquery.dataTables.min.js",
		"https://www.shieldui.com/shared/components/latest/js/shieldui-all.min.js",
		"https://www.shieldui.com/shared/components/latest/js/jszip.min.js",
		"/assets/vendor/moment/moment.js",
		"/lib/bootstrap-datetimepicker/bootstrap-datetimepicker.min.js",
		"/assets/vendor/typeahead-js/typeahead.jquery.min.js",
	];

	loadResources(resource_url, function() {
		initPlugin();
		init();
	});
}

var url_users 	        = "/dashboard/settings/audit/getUsers";
var url_events 	        = "/dashboard/settings/audit/getEvents";
var url_audits 	        = "/dashboard/settings/audit";
var url_img_resource    = "/img/logo.png";

function initPlugin() {
    var methods = {
        /**
         * general methods
         */
        init : function(options) {
            var table, scrollHeight, aValue, tfValue, ttValue, eValue, dValue;
            var loadIndex = 0;
            var instance = this;
            var columns =  [
                {cId: 'actor',          title: "Actor",         width: "17%"},
                {cId: 'time',           title: "Time",          width: "20%"},
                {cId: 'event',          title: "Event",         width: "25%"},
                {cId: 'description',    title: "Description",   width: "38%"}
            ];

            var title   =   "<div class='audit-table-title m-b-10 text-center'></div>";
            var toolbar =   "<div class='audit-table-toolbar m-b-10'>" +
                                "<button class='btn btn-success pull-right clearfix audit-table-toolbar-export-pdf m-b-20'>" +
                                    "<span class='fa fa-file-pdf-o m-r-10'></span>" +
                                    "Export to PDF" +
                                "</button>"
                            "</div>";
            var header  =   "<div class='audit-table-header m-b-10'>" +
                                "<div class='audit-table-filter-bar'>" +
                                    "<table style='width:100%'>" +
                                        "<tr>";

            columns.forEach(function(column) {
                if (column.cId == "time") {
                    header += "<td class='vcenter' style='position:relative; padding:5px;width:" + column.width + ";'>" +
                                "<div style='width: 100%;display:flex'>" +
                                "<input type='text' class='form-control audit-table-filter " + column.cId + "-from' placeholder='From' style='margin-right:5px;'>" +
                                "<input type='text' class='form-control audit-table-filter " + column.cId + "-to' placeholder='To' style='margin-left:5px;'>" +
                                "</div>" +
                              "</td>";
                } else {
                    header += "<td class='vcenter' style='padding:5px;width:" + column.width + "'>" +
                                "<input type='text' class='form-control audit-table-filter " + column.cId +  "' placeholder='Search " + column.title + "'>" +
                              "</td>";
                }
            });

            header +=                   "</tr>" +
                                    "</table>" +
                                "</div>" +
                            "</div>";

            var body    =   "<div class='audit-table-body m-b-10'>" +
                                "<table class='w-full'>" +
                                    "<thead>" +
                                        "<tr>";

            columns.forEach(function(column) {
                body += "<th class='text-center' style='width:" + column.width + ";'>" + column.title + "</th>"
            });

            body +=                     "</tr>" +
                                    "</thead>" +
                                "</table>" +
                            "</div>";

            var footer  = "<div class='audit-table-footer text-center' style='font-size:12px;margin:10px;'>" +
                            "<img src='" + url_img_resource + "' style='width:30px;height:30px; margin-right:10px;' />" +
                            "Widget provided by Welink" +
                          "</div>";

            this.append($(title));
            this.append($(toolbar));
            this.append($(header));
            this.append($(body));
            this.append($(footer));

            instance.find('.audit-table-filter.time-from').datetimepicker({
                format: 'YYYY-MM-DD HH:mm'
            }).on('dp.change', function(ev) {
                tfValue = ev.target.value;
                table.fnClearTable();
                loadData(table, aValue, tfValue, ttValue, eValue, dValue, loadIndex, options.hash, scrollHeight);
            });
            instance.find('.audit-table-filter.time-to').datetimepicker({
                format: 'YYYY-MM-DD HH:mm'
            }).on('dp.change', function(ev) {
                tfValue = ev.target.value;
                table.fnClearTable();
                loadData(table, aValue, tfValue, ttValue, eValue, dValue, loadIndex, options.hash, scrollHeight);
            });

            jQuery.fn.dataTableExt.oSort['date-asc'] = function(x,y) {
                return ((new Date(x) < new Date(y)) ? -1 : ((new Date(x) > new Date(y)) ? 1 : 0 ));
            };

            jQuery.fn.dataTableExt.oSort['date-desc'] = function(x,y) {
                return ((new Date(x) < new Date(y)) ? 1 : ((new Date(x) < new Date(y)) ? -1 : 0 ));
            };

            $.ajax({
                url:    url_users,
                type:   'POST',
                data:   {encryptedData: options.hash},
                success:(res) => {
                    instance.find(".audit-table-filter.actor").typeahead({
                        hint: true,
                        highlight: true,
                        minLength: 1
                    }, {
                        name: 'actor',
                        source: substringMatcher(res.data)
                    }).on('typeahead:selected', function(ev, item) {
                        aValue = item;
                        table.fnClearTable();
                        loadData(table, aValue, tfValue, ttValue, eValue, dValue, loadIndex, options.hash, scrollHeight);
                    }).on('change', function(ev) {
                        aValue = $(this).val();
                        table.fnClearTable();
                        loadData(table, aValue, tfValue, ttValue, eValue, dValue, loadIndex, options.hash, scrollHeight);
                    });
                }
            });
            $.ajax({
                url:    url_events,
                type:   'POST',
                success:(res) => {
                    instance.find(".audit-table-filter.event").typeahead({
                        hint: true,
                        highlight: true,
                        minLength: 1
                    }, {
                        name: 'event',
                        source: substringMatcher(res.data)
                    }).on('typeahead:selected', function(ev, item) {
                        eValue = item;
                        table.fnClearTable();
                        loadData(table, aValue, tfValue, ttValue, eValue, dValue, loadIndex, options.hash, scrollHeight);
                    }).on('change', function(ev) {
                        eValue = $(this).val();
                        table.fnClearTable();
                        loadData(table, aValue, tfValue, ttValue, eValue, dValue, loadIndex, options.hash, scrollHeight);
                    });
                }
            });
            instance.find('.audit-table-filter.description').keyup(function(e) {
                dValue = e.target.value;
                table.fnClearTable();
                loadData(table, aValue, tfValue, ttValue, eValue, dValue, loadIndex, options.hash, scrollHeight);
            });

            $.ajax({
                url     : url_audits,
                type    : 'POST',
                data    : {encryptedData: options.hash, loadIndex: loadIndex},
                success : (res) => {
                    table = instance.find('.audit-table-body table').dataTable({
                        data                : res.data,
                        bFilter             : false,
                        bInfo               : false,
                        bScrollInfinite     : true,
                        bScrollCollapse     : true,
                        searching           : false,
                        paging              : false,
                        columns             : [
                            {title: columns[0].title},
                            {title: columns[1].title},
                            {title: columns[2].title},
                            {title: columns[3].title},
                        ]
                    });
                }
            });

            $(".audit-table-toolbar-export-pdf").click(function(){
                var dataSource = shield.DataSource.create({
                    data: ".audit-table-body table",
                    schema: {
                        type: "table",
                        fields: {
                            Actor       : { type: String },
                            Time        : { type: String },
                            Event       : { type: String },
                            Description : { type: String }
                        }
                    }
                });

                dataSource.read().then(function (data) {
                    var pdf = new shield.exp.PDFDocument({
                        created: new Date()
                    });
                    pdf.addPage("a4", "portrait");
                    pdf.table(
                        50,
                        50,
                        data,
                        [
                            { field: columns[0].title, title: columns[0].title, width: 100 },
                            { field: columns[1].title, title: columns[1].title, width: 120 },
                            { field: columns[2].title, title: columns[2].title, width: 100 },
                            { field: columns[3].title, title: columns[3].title, width: 150 }
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
            });

            /** set attributes */
            if (options.backgroundcolor != undefined) {
                this.find('.audit-table-body').css('background-color', options.backgroundcolor);
            }
            if (options.foregroundcolor != undefined) {
                this.find('.audit-table-body').css('color', options.foregroundcolor);
            }
            if (options.fontsize != undefined) {
                this.find('.audit-table-body').css('font-size', options.fontsize);
            }
            if (options.fontface != undefined) {
                this.find('.audit-table-body').css('font-family', options.fontface);
            }
            if (options.title != undefined) {
                this.find('.audit-table-title').html("<h4>" + options.title + "</h4>");
            }
            if (options.showtitlebar != undefined) {
                this.find('.audit-table-title').css('display', (eval(options.showtitlebar) == true)?'': 'none');
            }
            if (options.showfilterbar != undefined) {
                this.find('.audit-table-filter-bar').css('display', (eval(options.showfilterbar) == true)?'': 'none');
            }
            if (options.showtoolbar != undefined) {
                this.find('.audit-table-toolbar').css('display', (eval(options.showtoolbar) == true)?'': 'none');
            }
            if (options.showfooter != undefined) {
                this.find('.audit-table-footer').css('display', (eval(options.showfooter) == true)?'': 'none');
            }
        },

        show : function() {
            this.css('display', '');
        },

        hide : function() {
            this.css('display', 'none');
        },

        backgroundColor : function(color) {
            this.find('.audit-table-body').css('background-color', color);
        },

        foregroundColor : function(color) {
            this.find('.audit-table-body').css('color', color);
        },

        fontSize : function(size) {
            this.find('.audit-table-body').css('font-size', size);
        },

        fontFace : function(font) {
            this.find('.audit-table-body').css('font-family', font);
        },

        fontStyle : function(style) {
            this.find('.audit-table-body').css('font-style', style);
        },

        title : function(title) {
            this.find('.audit-table-title').html("<h4>" + title + "</h4>");
        },

        showTitleBar : function(value) {
            if (eval(value)) {
                this.find('.audit-table-title').css('display', '');
            } else {
                this.find('.audit-table-title').css('display', 'none');
            }
        },

        /**
         * advanced methods
         */
        /**
         * param:   true or false
         * description: whether filter show or not
         */
        showFilterBar : function(value) {
            if (eval(value)) {
                this.find('.audit-table-filter-bar').css('display', '');
            } else {
                this.find('.audit-table-filter-bar').css('display', 'none');
            }
        },
        /**
         * param:   column indexes (array)
         * description: show specified columns
         */
        showColumn : function(columns) {
        },
        /**
         * param:   true of false
         * description: whether toolbar show or not
         */
        showToolbar : function(value) {
            if (eval(value)) {
                this.find('.audit-table-toolbar').css('display', '');
            } else {
                this.find('.audit-table-toolbar').css('display', 'none');
            }
        },
        /**
         * param:   true of false
         * description: whether footer show or not
         */
        showFooter : function(value) {
            if (eval(value)) {
                this.find('.audit-table-footer').css('display', '');
            } else {
                this.find('.audit-table-footer').css('display', 'none');
            }
        },
    };

    $.fn.AuditTable = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.AuditTable');
        }
    }
};

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

function loadData(table, aValue, tfValue, ttValue, eValue, dValue, loadIndex, encryptedData, scrollHeight) {
    var param  = {};

    param.loadIndex = loadIndex;

    if (encryptedData != '' && encryptedData != null && encryptedData != undefined) {
        param.encryptedData = encryptedData;
    }

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
        url:        url_audits,
        type:       'POST',
        data:       param,
        success:    (res) => {
            if (res.data.length == 0) {
                return;
            }

            table.fnAddData(res.data);

            if (loadIndex == 0 || loadIndex == 1) {
                table.scrollTop(0);
            } else {
                table.scrollTop(scrollHeight - 120);
            }
        }
    });
}
