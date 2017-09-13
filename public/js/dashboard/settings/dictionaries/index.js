var loadIndex = 0;
var table_public;
var scrollHeight;

$(document).ready(() => {
    initComponent();
    initEventHandler(); 
});

initComponent = () => {
    initDictionaryTable();
    initPublicDictionaryTable();
}

initEventHandler = () => {
    $('.btn-delete').on('click', (e) => {
        var row = e.currentTarget.closest('.dictionary-item');
        var dictionaryID = e.currentTarget.closest('.dictionary-item').attributes[1].value;
 
        $.ajax({
            url:    '/dashboard/settings/dictionaries/delete',
            type:   'POST',
            data:   {dictionaryID: dictionaryID},
            success: (res) => {
                if (res.success) {
                    row.remove();
                }
            }
        });

        e.stopPropagation();
    });

    $('.btn-edit').on('click', (e) => {
        var dictionaryID = e.currentTarget.closest('.dictionary-item').attributes[1].value;
        location.href = '/dashboard/settings/dictionaries/edit?dictionaryID=' + dictionaryID;
        e.stopPropagation();
    });

    $('.btn-remove').on('click', (e) => {
        var dictionaryID = e.currentTarget.closest('.dictionary-item').attributes[1].value;
        $.ajax({
            url:    '/dashboard/settings/dictionaries/removeDictionary',
            type:   'POST',
            data:   {dictionaryID: dictionaryID},
            success:(res) => {
                if (res.success) {
                    location.href = '/dashboard/settings/dictionaries';
                }
            }
        });
        e.stopPropagation();
    });

    $('.btn-public-dictionary').each(function() {
        $(this).click(function() {
            var btn = $(this);
            var dictionaryID = btn.attr("id");
            if (btn.hasClass("btn-add-dictionary")) {
                $.ajax({
                    url:    '/dashboard/settings/dictionaries/addDictionary',
                    type:   'POST',
                    data:   {dictionaryID: dictionaryID},
                    success:(res) => {
                        if (res.success) {
                            location.href = '/dashboard/settings/dictionaries';
                        }
                    }
                });
            } 
        });
    });

    $('.show-dictionaries').on('click', (e) => {
        showPublicDictionaries();
        e.preventDefault(); 
    });

    $('.hide-dictionaries').on('click', (e) => {
        hidePublicDictionaries();
        e.preventDefault();
    });

    $('#search_form').submit(function(event) {
        loadIndex = 0;
        getPublicDictionaries(true);
        event.preventDefault();
    });
}

initDictionaryTable = () => {
    getAccountDictionaries();    
}

initPublicDictionaryTable = () => {
    $('.show-dictionaries').css('display', 'none');
    $('.hide-dictionaries').css('display', 'none');

    $.ajax({
        url:        '/dashboard/settings/dictionaries/getPublicDictionaries',
        type:       'POST',
        data:       {loadIndex: loadIndex},
        success:    (res) => {
            table_public = $('#table-public-dictionaries').dataTable({
                data:               res.data,

                aaSorting:          [[2, "desc"]],
                bFilter:            false,
                bInfo:              false,
                bScrollInfinite:    true,
                bScrollCollapse:    true,
                searching:          false,
                sScrollY:           ($('.page-aside').height() - 320),
                paging:             false,
                aoColumns:          [
                    { mData: 0,             
                      sTitle: "Icon",
                      mRender: function(data) {
                        return  "<a class='avatar' href='javascript:void(0)'>" + 
                                    "<img class='img-fluid' src='/assets/examples/images/grunt.png' alt='...'>" + 
                                "</a>";
                      }
                    },
                    { mData: 1,             
                      sTitle: "Title" , 
                      mRender: function(data) {
                          return "<div class='content'>" + 
                                    "<div class='name'>" + data.name + "</div>" + 
                                    "<div class='description'>" + data.description + "</div>" +
                                    "<div class='doc-link'><a class='more-info' target='_blank' href='" + data.doc_link + "'>More Info</a></div>" +  
                                 "</div>"
                      }},
                    { mData: 2,             
                      sTitle: "Items", 
                      mRender: function(data) {
                          return "<div class='public-keywords'>" + data.keywords + " keywords</div>" + 
                                 "<div class='public-images'>" + data.images + " images</div>";
                      }},
                    { mData: 3,             
                      sTitle: "Rating", 
                      mRender: function(data) {
                        var rating = 0;
                        if (data.length == 0) {
                            rating = 0
                        } else {
                            for (var i=0; i<data.length; i++) {
                                rating += Number(data[i]);
                            }
                            rating = rating/data.length;
                        }
                        
                        return "<div>Item Rating:" + data.length + " ratings" + "<div class='rating rating-sm'>" + rating+ "</div></div>";
                      }
                    },
                    { mData: 4,             sTitle: "Install", },
                    { mData: 5,             sTitle: "Author" , },
                    {
                        mData: 6,
                        bSortable: false,
                        mRender: function (data) {
                            return "<button type='button' class='btn btn-primary btn-public-dictionary btn-add-dictionary' id='" + data + "'>Add</button>"; 
                        }
                    }
                ],

                fnDrawCallback: function(oSettings) {
                    $("#table-public-dictionaries").find('.rating').each(function(i) {
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

            $('.dataTables_scrollBody').on('scroll', function(e) {
                if (loadIndex == 0 || loadIndex == 1) {
                    loadIndex++;
                    return;
                }

                if (e.target.offsetHeight + e.target.scrollTop == e.target.scrollHeight) {
                    scrollHeight = e.target.scrollHeight;
                    loadIndex++;
                    getPublicDictionaries();
                }
            });                
        }
    });

}

getPublicDictionaries = (isClear) => {
    var param = {};

    param.loadIndex = loadIndex - 2;
    param.search_word = $('.search-dictionaries').val();

    $.ajax({
        url: '/dashboard/settings/dictionaries/getPublicDictionaries',
        type: 'POST',
        data: param,
        success: (res) => {
            if (res.data.length == 0)  return;
            
            if (isClear) {
                table_public.fnClearTable();
            }

            table_public.fnAddData(res.data);

            if (loadIndex == 0 || loadIndex == 1) {
                $('.dataTables_scrollBody').scrollTop(0);
            } else {
                $('.dataTables_scrollBody').scrollTop(scrollHeight - 120); 
            }
        }
    });
}

getAccountDictionaries = () => {
    $.ajax({
        url: '/dashboard/settings/dictionaries/getAccountDictionaries',
        type: 'POST',
        success: (res) => {
            if (res.success) {
                var dictionaries = res.dictionaries;
                for (var i=0; i<dictionaries.length; i++) {
                    var row =   '<tr class="dictionary-item" id="' + dictionaries[i]._id + '" data-dictionaryID="' + dictionaries[i]._id + '" data-documentURL="' + dictionaries[i].doc_link + '">' +
                                    '<td>' +
                                        '<a class="avatar" href="javascript:void(0)">' +
                                            '<img class="img-fluid" src="/assets/examples/images/grunt.png" alt="">' +
                                        '</a>' +
                                    '</td>' +
                                    '<td>' +
                                        '<div class="content">' + 
                                            '<div class="name">' + dictionaries[i].name + '</div>' + 
                                            '<div class="description">' + dictionaries[i].description + '<br><a class="more-info" target="_blank" href="' + dictionaries[i].doc_link + '">More Info</a></div>' +
                                        '</div>' + 
                                    '</td>' +
                                    '<td>' + 
                                        '<div class="num_keywords">' + dictionaries[i].keywords.split(",").length + ' keywords </div>' + 
                                        '<div class="num_images">' + (dictionaries[i].images==undefined? 0 : dictionaries[i].images.length) + ' images </div>' + 
                                    '</td>' +
                                    '<td>' +
                                        '<div>Item Rating: ' + (dictionaries[i].ratings.length) + ' ratings' + '<div class="rating rating-sm average-rating"></div></div><div>Rate Item:<div class="rating rating-sm rate-item"></div></div>' +
                                    '</td>' +
                                    '<td class="text-center">' + dictionaries[i].num_install + '</td>' +
                                    '<td>' + dictionaries[i].author + '</td>';

                    if (dictionaries[i].isOwner) {
                        row += '<td>' +
                                        '<button type="button" class="btn btn-icon btn-success btn-round btn-edit"><i class="icon md-edit"></i></button>' +
                                        '<button type="button" class="btn btn-icon btn-danger btn-round btn-delete" ><i class="icon md-delete"></i></button>' +
                                '</td>';
                    } else {
                        if (dictionaries[i].access == 0) {
                            row += '<td></td>';
                        } else {
                            row += "<td><button type='button' class='btn btn-danger btn-remove'>Remove</button></td>";
                        }
                    }

                    row += '</tr>';     
                    
                    $('.table-account-dictionaries tbody').append(row);

                    var rating = 0;
                    if (dictionaries[i].ratings.length == 0) {
                        rating = 0
                    } else {
                        for (var j=0; j<dictionaries[i].ratings.length; j++) {
                            rating += Number(dictionaries[i].ratings[j]);
                        }
                        rating = rating/dictionaries[i].ratings.length;
                    }

                    $('#' + dictionaries[i]._id).find('.average-rating').raty({
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
                    
                    $('#' + dictionaries[i]._id).find('.rate-item').raty({
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
                            var dictionaryID = evt.toElement.parentNode.closest('.dictionary-item').attributes[1].value;
                            $.ajax({
                                url: '/dashboard/settings/dictionaries/rateDictionary',
                                type: 'POST',
                                data: {dictionaryID: dictionaryID, rating: score}
                            });
                        }
                    });
                }

                initEventHandler();
            }
        }
    });
}

showPublicDictionaries = () => {
    $('.hide-dictionaries').css('display', 'block');
    $('.show-dictionaries').css('display', 'none');
    $('.public-dictionaries').css('display', 'block');
}

hidePublicDictionaries = () => {
    $('.hide-dictionaries').css('display', 'none');
    $('.show-dictionaries').css('display', 'block');
    $('.public-dictionaries').css('display', 'none');
}

