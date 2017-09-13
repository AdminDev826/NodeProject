var loadIndex = 0;
var tablePublic;
var scrollHeight;

$(document).ready(() => {
    initComponent();
    initEventHandler();
});

/** init components */
initComponent = () => {
    initPluginTable();
    initPublicPluginTable();
}

/** init event handlers */
initEventHandler = () => {
    $('.btn-delete').on('click', (e) => {
        var row = e.currentTarget.closest('.plugin-item');
        var pluginID = e.currentTarget.closest('.plugin-item').attributes[1].value;

        $.ajax({
            url:    '/dashboard/settings/plugins/remove',
            type:   'POST',
            data:   {pluginID: pluginID},
            success: (res) => {
                if (res.success) {
                    row.remove();
                }
            }
        });

        e.stopPropagation();
    });

    $(".btn-remove").on("click", (e) => {
        var pluginID = e.currentTarget.closest('.plugin-item').attributes[1].value;
        $.ajax({
            url     : "/dashboard/settings/plugins/remove",
            type    : "POST",
            data    : {pluginID: pluginID},
            success : (res) => {
                if (res.success) {
                    location.href = "/dashboard/settings/plugins";
                }
            } 
        });

        e.stopPropagation();
    });

    $(".btn-add-plugin").on("click", (e) => {
        var pluginID = e.currentTarget.id;
        $.ajax({
            url     : "/dashboard/settings/plugins/add",
            type    : "POST",
            data    : {pluginID: pluginID},
            success : (res) => {
                if (res.success) {
                    location.href = "/dashboard/settings/plugins";
                }
            }
        });
    });

    $('.btn-edit').on('click', (e) => {
        var pluginID = e.currentTarget.closest('.plugin-item').attributes[1].value;
        location.href = '/dashboard/settings/plugins/edit?pluginID=' + pluginID;
        e.stopPropagation();
    });

    $("#search_form").submit(function(event) {
        loadIndex = 0;
        getPublicPlugins(true);
        event.preventDefault();
    });
}

initPluginTable = () => {
    $.ajax({
        url: '/dashboard/settings/plugins/getAccountPlugins',
        type: 'POST',
        success: (res) => {
            if (res.success) {
                var plugins = res.plugins;
                for (var i=0; i<plugins.length; i++) {
                    var row =   '<tr class="plugin-item" id="' + plugins[i]._id +  '" data-pluginID="' + plugins[i]._id + '" data-pluginURL="' + plugins[i].plugin_url + '">' +
                                    '<td>' +
                                        '<a class="avatar" href="javascript:void(0)">' +
                                            '<img class="img-fluid" src="/assets/examples/images/grunt.png" alt="">' +
                                        '</a>' +
                                    '</td>' +
                                    '<td>' +
                                        '<div class="content">' + 
                                            '<div class="name">' + plugins[i].name + '</div>' + 
                                            '<div class="description">' + plugins[i].description + '<br><a class="more-inf" href="' + plugins[i].plugin_url + '">More Info</a></div>' +
                                        '</div>' + 
                                    '</td>' +
                                    '<td>' +
                                        '<div>Item Rating: ' + plugins[i].ratings.length + ' ratings' + '<div class="rating rating-sm average-rating"></div></div>' + 
                                        '<div>Rate Item: <br><div class="rating rating-sm rate-item"></div></div>' +
                                    '</td>' +
                                    '<td class="text-center">' + plugins[i].num_install + '</td>' +
                                    '<td>' + plugins[i].author + '</td>';

                    if (plugins[i].isOwner) {
                        row +=  '<td>' +
                                    '<button type="button" class="btn btn-icon btn-success btn-round btn-edit"><i class="icon md-edit"></i></button>' +
                                    '<button type="button" class="btn btn-icon btn-danger btn-round btn-delete" ><i class="icon md-delete"></i></button>' +
                                '</td>';
                    } else {
                        if (plugins[i].access == 0) {
                            row += '<td></td>';
                        } else {
                            row += '<td><button type="button" class="btn btn-danger btn-remove">Remove</button></td>';
                        }
                    }               
                    
                    row += '</tr>';

                    $('.table-account-plugins tbody').append(row);
                    var rating = 0;
                    if (plugins[i].ratings.length == 0) {
                        rating = 0;
                    } else {
                        for (var j=0; j<plugins[i].ratings.length; j++) {
                            rating += Number(plugins[i].ratings[j]);
                        }
                        rating = rating/plugins[i].ratings.length;
                    }

                    $('#' + plugins[i]._id).find('.average-rating').raty({
                        hints       : ['bad', 'poor', 'regular', 'good', 'gorgeous'],
                        number      : 5,
                        score       : rating,
                        readOnly    : true,
                        half        : true,
                        halfShow    : true,
                        starHalf    : '/img/star-half.png',
                        starOn      : '/img/star-on.png',
                        starOff     : '/img/star-off.png'
                    });

                    $('#' + plugins[i]._id).find('.rate-item').raty({
                        hints       : ['bad', 'poor', 'regular', 'good', 'gorgeous'],
                        number      : 5,
                        score       : 0,
                        readOnly    : false,
                        half        : true,
                        halfShow    : true,
                        starHalf    : '/img/star-half.png',
                        starOn      : '/img/star-on.png',
                        starOff     : '/img/star-off.png',
                        click       : function (score, evt) {
                            var pluginID = evt.toElement.parentNode.closest('.plugin-item').attributes[1].value;
                            $.ajax({
                                url: '/dashboard/settings/plugins/rate',
                                type: 'POST',
                                data: {pluginID: pluginID, rating: score}
                            });
                        }
                    });
                }

                initEventHandler();
            }
        }
    });
}

initPublicPluginTable = () => {
    $.ajax({
        url     : '/dashboard/settings/plugins/getPublicPlugins',
        type    : 'POST',
        data    : {loadIndex: loadIndex},
        success : (res) => {
            tablePublic = $(".table-public-plugins").dataTable({
                data                : res.data,
                aaSorting           : [[2, 'desc']],
                bFilter             : false,
                bInfo               : false,
                bScrollInfinite     : true,
                bScrollCollapse     : true,
                searching           : false,
                sScrollY            : ($('.page-aside').height() - 320),
                paging              : false,
                aoColumns           : [
                    {
                        mData       : 0,
                        sTitle      : "Icon",
                        mRender     : function(data) {
                            return  "<a class='avatar' href='javascript:void(0)'>" + 
                                        "<img class='img-fluid' src='/assets/examples/images/grunt.png' alt='...'>" + 
                                    "</a>"; } 
                    },
                    {
                        mData       : 1,
                        sTitle      : "Title",
                        mRender     : function(data) {
                            return  "<div class='content'>" + 
                                        "<div class='name'>" + data.name + "</div>" + 
                                        "<div class='description'>" + data.description + "</div>" +
                                        "<div class='doc-link'><a class='more-info' target='_blank' href='" + data.plugin_url + "'>More Info</a></div>" +  
                                    "</div>";
                        }
                    },
                    {
                        mData       : 2,
                        sTitle      : "Rating",
                        mRender     : function (data) {
                            var rating = 0;
                            if (data.length == 0) {
                                rating = 0;
                            } else {
                                for (var i=0; i<data.length; i++) {
                                    rating += Number(data[i]);
                                }
                                rating = rating/data.length;
                            }
                            return "<div>Item Rating:" + data.length + " ratings" + "<div class='rating rating-sm'>" + rating + "</div></div>";
                        }
                    },
                    {
                        mData       : 3,
                        sTitle      : "Installs" 
                    },
                    {
                        mData       : 4,
                        sTitle      : "Author"
                    },
                    {
                        mData       : 5,
                        bSortable   : false,
                        mRender     : function (data) {
                            return "<button type='button' class='btn btn-primary btn-add-plugin' id='" + data + "'>Add</button>";
                        }
                    }
                ],
                fnDrawCallback: function(oSettings) {
                    $(".table-public-plugins").find(".rating").each(function(i) {
                        var score = Number($(this).html());
                        $(this).raty({
                            hints       : ['bad', 'poor', 'regular', 'good', 'gorgeous'],
                            number      : 5,
                            score       : score,
                            readOnly    : true,
                            half        : true,
                            halfShow    : true,
                            starHalf    : '/img/star-half.png',
                            starOn      : '/img/star-on.png',
                            starOff     : '/img/star-off.png'
                        });

                        initEventHandler();
                    });
                }
            });

            $(".dataTables_scrollBody").on("scroll", function(e) {
                if (loadIndex == 0 || loadIndex == 1) {
                    loadIndex ++;
                    return;
                }
                
                if (e.target.offsetHeight + e.target.scrollTop == e.target.scrollHeight) {
                    scrollHeight = e.target.scrollHeight;
                    loadIndex++;
                    getPublicPlugins();
                }
            });
        }
    });
}

getPublicPlugins = (isClear) => {
    var param           = {};
    param.loadIndex     = loadIndex - 2;
    param.searchWord    = $(".search-plugins").val();

    $.ajax({
        url     : "/dashboard/settings/plugins/getPublicPlugins",
        type    : "POST",
        data    : param,
        success : (res) => {
            if (res.data.length == 0) return;
            
            if (isClear) {
                tablePublic.fnClearTable();
            }
            
            tablePublic.fnAddData(res.data);
            
            if (loadIndex == 0 || loadIndex == 1) {
                $(".dataTables_scrollBody").scrollTop(0);
            } else {
                $(".dataTables_scrollBody").scrollTop(scrollHeight - 120);
            }
        }
    }); 
}