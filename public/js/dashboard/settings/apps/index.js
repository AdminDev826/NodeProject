var loadIndex = 0;
var tablePublic;
var scrollHeight;

$(document).ready(() => {
    initComponent();
    initEventHandler();
});

/** init components */
initComponent = () => {
    initAppTable();
    initPublicAppTable();
}

/** init event handlers */
initEventHandler = () => {
    $('.btn-delete').on('click', (e) => {
        var row = e.currentTarget.closest('.app-item');
        var appID = e.currentTarget.closest('.app-item').attributes[1].value;

        $.ajax({
            url:    '/dashboard/settings/apps/delete',
            type:   'POST',
            data:   {appID: appID},
            success: (res) => {
                if (res.success) {
                    row.remove();
                }
            }
        });

        e.stopPropagation();
    });

    $(".btn-remove").on("click", (e) => {
        var appID = e.currentTarget.closest('.app-item').attributes[1].value;
        $.ajax({
            url     : "/dashboard/settings/apps/remove",
            type    : "POST",
            data    : {appID: appID},
            success : (res) => {
                if (res.success) {
                    location.href = "/dashboard/settings/apps";
                }
            } 
        });

        e.stopPropagation();
    });

    $(".btn-add-app").on("click", (e) => {
        var appID = e.currentTarget.id;
        $.ajax({
            url     : "/dashboard/settings/apps/add",
            type    : "POST",
            data    : {appID: appID},
            success : (res) => {
                if (res.success) {
                    location.href = "/dashboard/settings/apps";
                }
            }
        });
    });

    $('.btn-edit').on('click', (e) => {
        var appID = e.currentTarget.closest('.app-item').attributes[1].value;
        location.href = '/dashboard/settings/apps/edit?appID=' + appID;
        e.stopPropagation();
    });

    $("#search_form").submit(function(event) {
        loadIndex = 0;
        getPublicApps(true);
        event.preventDefault();
    });
}

initAppTable = () => {
    $.ajax({
        url: '/dashboard/settings/apps/getAccountApps', 
        type: 'POST',
        success: (res) => {
            if (res.success) {
                var apps = res.apps;
                for (var i=0; i<apps.length; i++) {
                    var row =   '<tr class="app-item" id="' + apps[i]._id + '" data-appID="' + apps[i]._id + '" data-appURL="' + apps[i].app_url + '">' +
                                    '<td>' +
                                        '<a class="avatar" href="javascript:void(0)">' +
                                            '<img class="img-fluid" src="/assets/examples/images/grunt.png" alt="">' +
                                        '</a>' +
                                    '</td>' +
                                    '<td>' +
                                        '<div class="content">' + 
                                            '<div class="name">' + apps[i].name + '</div>' + 
                                            '<div class="description">' + apps[i].description + '<br><a class="more-info" href="' + apps[i].app_url + '">More Info</a></div>' +
                                        '</div>' + 
                                    '</td>' +
                                    '<td>' +
                                        '<div>Item Rating: ' + apps[i].ratings.length + ' ratings<br>' + '<div class="rating rating-sm average-rating"></div></div>' + 
                                        '<div>Rate Item: <br><div class="rating rating-sm rate-item"></div></div>' +
                                    '</td>' +
                                    '<td class="text-center">' + apps[i].num_install + '</td>' +
                                    '<td>' + apps[i].author + '</td>';
                                    
                    if (apps[i].isOwner) {
                        row +=  '<td>' +
                                    '<button type="button" class="btn btn-icon btn-success btn-round btn-edit"><i class="icon md-edit"></i></button>' +
                                    '<button type="button" class="btn btn-icon btn-danger btn-round btn-delete" ><i class="icon md-delete"></i></button>' +
                                '</td>';
                    } else {
                        if (apps[i].access == 0) {
                            row += '<td></td>';
                        } else {
                            row += '<td><button type="button" class="btn btn-danger btn-remove">Remove</button></td>';
                        }
                    }
                    
                    row += '</tr>';

                    $('.table-account-apps tbody').append(row);
                    var rating = 0;
                    if (apps[i].ratings.length == 0) {
                        rating = 0;
                    } else {
                        for (var j=0; j<apps[i].ratings.length; j++) {
                            rating += Number(apps[i].ratings[j]);
                        }
                        rating = rating/apps[i].ratings.length;
                    }

                    $('#' + apps[i]._id).find('.average-rating').raty({
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

                    $('#' + apps[i]._id).find('.rate-item').raty({
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
                            var appID = evt.toElement.parentNode.closest('.app-item').attributes[1].value;
                            $.ajax({
                                url: '/dashboard/settings/apps/rate',
                                type: 'POST',
                                data: {appID: appID, rating: score}
                            });
                        }
                    });
                }

                initEventHandler();
            }
        }
    });
}

initPublicAppTable = () => {
    $.ajax({
        url     : '/dashboard/settings/apps/getPublicApps',
        type    : 'POST',
        data    : {loadIndex: loadIndex},
        success : (res) => {
            tablePublic = $(".table-public-apps").dataTable({
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
                                        "<div class='doc-link'><a class='more-info' target='_blank' href='" + data.app_url + "'>More Info</a></div>" +  
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
                            return "<button type='button' class='btn btn-primary btn-add-app' id='" + data + "'>Add</button>";
                        }
                    }
                ],
                fnDrawCallback: function(oSettings) {
                    $(".table-public-apps").find(".rating").each(function(i) {
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
                    getPublicApps();
                }
            });
        }
    });
}

getPublicApps = (isClear) => {
    var param           = {};
    param.loadIndex     = loadIndex - 2;
    param.searchWord    = $(".search-apps").val();

    $.ajax({
        url     : "/dashboard/settings/apps/getPublicApps",
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