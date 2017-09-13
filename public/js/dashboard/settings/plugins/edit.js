var radioValue = null;
var tmpResource = "";
var tags_value_group = ['collection', 'storage', 'processing', 'alerting', 'reporting']; 

$(document).ready(() => {
    initFormValidators();
    initComponent();
    initEventHandler();
});

initComponent = () => {
    $('#tags').tokenfield({
        autocomplete: {
            source: tags_value_group,
            delay: 100
        },
        showAutocompleteOnFocus: true,
        limit: 3
    });

    validate_License_Field();
    validate_Form();

    $(".properties").each(function() {
        $(this).repeatable_fields();
    });

    loadValues();
}

initEventHandler = () => {
    $('#license_type').on('change', () => { 
        validate_License_Field();
    });

    $('.image-item.empty').on('click', () => {
        $('#imageModal').modal();
    });

    $('#imageModal').on('shown.bs.modal', () => {
        resetModal();
    });

    $("input").on('ifChecked', function () {
        $('#container_local').css('display', 'none');
        $('#container_remote').css('display', 'none');
        
        if (this.value == 'choose_from_local') {
            $('#container_local').css('display', '');
            $('#image_url').val('');
            $('.preview').css('display', 'none');
            radioValue = 'choose_from_local';
        } else if (this.value == 'choose_from_remote') {
            $('#container_remote').css('display', '');
            $('#image_drag_drop').val('');
            radioValue = 'choose_from_remote';
        }
    });

    $('#image_drag_drop').change(function () {
        if (this.files && this.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                tmpResource = e.target.result;
            }
            reader.readAsDataURL(this.files[0]);
        } else {
            tmpResource = "";
        }
    });

    $('.btn-add').on('click', () => {
        var imageTag = $('#image_tag').val();
        var imageResource = "";
        if (radioValue == 'choose_from_local') {
            imageResource = tmpResource;
        } else {
            imageResource = $('#image_url').val();
        }

        if (imageResource == "") {
            $('#message').css('display', '');
            $('#message').html('Please choose image file or enter image url');
            return;
        }

        var newImageItem = '<div class="col-xs-4 col-md-3 image-item">' +
                                '<div class="card card-block">' +
                                    '<img class="image-content" src="' + imageResource + '" alt="">' +
                                    '<div class="overlay">' +
                                        '<button type="button" class="btn btn-sm btn-icon item-remove"><i class="icon md-delete"></i></button>' +
                                        '<label class="item-tag">' + imageTag + '</label>' +
                                    '</div>' +
                                '</div>' +
                            '</div>';
        $('.image-item.empty').before(newImageItem);
        
        $('.item-remove').on('click', (e) => {
            e.currentTarget.closest('.image-item').remove();
        });

        $('.item-edit').on('click', () => {
            $('#imageModal').modal();
        });

        $('#imageModal').modal('toggle');
    });

    $('.btn-submit').on('click', () => {
        $('#createForm').submit();
    });

    $('#createForm').submit(function(event) {
        var name            = $('#name').val();
        var plugin_url      = $('#plugin_url').val();
        var access          = $('#access').val();
        var license_type    = $('#license_type').val();
        var license_method  = $('#license_method').val();
        var license_cost    = $('#license_cost').val();
        var description     = $('#description').val();
        var tags            = $('#tags').val();
        var images          = [];
        var properties      = [];

        $(".property-row").each(function(index) {
            if (index == 0) return;
            var property    = {};
            property.name   = $(this).find(".property-name").val();
            property.value  = $(this).find(".property-value").val();
            properties.push(property);
        });

        if (name=="" || description =="" || tags=="") {
            return;
        }

        $('.image-item').each(function() {
            var imageContent = $(this).find('.image-content').attr('src');
            var imageTag     = $(this).find('.item-tag').html();

            if (imageContent != null) {
                var item = {
                    tag:    imageTag,
                    image:  imageContent
                };
                images.push(item);
            }
        });

        var param = {
            pluginID        : getURLParameter(location.href, 'pluginID'),
            name            : name,
            plugin_url      : plugin_url,
            access          : access,
            license_type    : license_type,
            license_method  : license_method,
            license_cost    : license_cost,
            description     : description,
            tags            : tags,
            images          : JSON.stringify(images),
            properties      : JSON.stringify(properties)
        };

        event.preventDefault();

        $.ajax({
            url: '/dashboard/settings/plugins/edit',
            data: param,
            type: 'POST',
            success: (res) => {
                if (res.success) {
                    location.href = '/dashboard/settings/plugins';
                }
            }
        });
    });

    $('#tags').on('tokenfield:createtoken', function(event) {
        if (tags_value_group.indexOf(event.attrs.value) == -1) {
            event.preventDefault();
        }
    }).on('tokenfield:createdtoken', function() {
        $('#createForm').formValidation('revalidateField', 'tags');
    }).on('tokenfield:removedtoken', function() {
        $('#createForm').formValidation('revalidateField', 'tags');
    });
}

initFormValidators = () =>  {
    FormValidation.Validator.notAllowMultiTokens = {
        validate: function(validator, $field, options) {
            var tokens = $field.tokenfield('getTokens');
            
            var values = [];
            for (var i=0; i<tokens.length; i++) {
                values.push(tokens[i].value);
            }

            for (var i=0; i<values.length; i++) {
                if (countInArray(values, values[i]) > 1) {
                    $field.closest('.tokenfield.form-control.focus').css('border-color', '#ff9800');
                    return false;
                }
            }

            if (tokens.length > 0 ) {
                $field.closest('.tokenfield.form-control.focus').css('border-color', '#4caf50');
                return true;    
            }
        }
    };

    FormValidation.Validator.notEmptyToken = {
        validate: function(validator, $field, options) {
            var tokens = $field.tokenfield('getTokens');
            if (tokens.length == 0) {
                $field.closest('.tokenfield.form-control.focus').css('border-color', '#ff9800');
                return false;
            } else {
                $field.closest('.tokenfield.form-control.focus').css('border-color', '#4caf50');
                return true;
            }
        }
    }

    countInArray = (array, what) => {
        var count = 0;
        for (var i = 0; i < array.length; i++) {
            if (array[i] === what) {
                count++;
            }
        }
        return count;
    }
}

validate_Form = () => {
    $('#createForm').formValidation({
        framework: "bootstrap4",
        autoFocus: true,
        err: {
            clazz: 'text-help'
        },
        fields: {
            name: {
                validators: {
                    notEmpty: {
                        message: 'Please enter the name'
                    }
                }
            },
            description: {
                validators: {
                    notEmpty: {
                        message: 'Please enter the description'
                    }
                }
            },
            tags: {
                validators: {
                    notEmptyToken: {
                        message: 'Please enter the tags'
                    },

                    notAllowMultiTokens: {
                        message: 'This field is containing multiple values'
                    }
                }
            },
            license_cost: {
                validators: {
                    numeric: {
                        message: 'The cost must be a number'
                    }
                }
            }
        }
    });
}

validate_License_Field = () => {
    if ($('#license_type').val() == 1) {
        disable_License_Method();
        disable_License_Cost();    
    } else {
        enable_License_Method();
        enable_License_Cost();
    }
}

disable_License_Method = () => {
    $('#license_method').val(0);
    $('#license_method').attr('disabled', true);
}

enable_License_Method = () => {
    $('#license_method').attr('disabled', false);
}

disable_License_Cost = () => {
    $('#license_cost').val("");
    $('#license_cost').attr('disabled', true);
}

enable_License_Cost = () => {
    $('#license_cost').attr('disabled', false);
}

getBase64Image = (img) => {
  var canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);
  var dataURL = canvas.toDataURL("image/png");
  return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}

getURLParameter = (url, name) => {
    return (RegExp(name + '=' + '(.+?)(&|$)').exec(url)||[,null])[1];
}

loadValues = () => {
    $.ajax({
        url: '/dashboard/settings/plugins/getAccountPlugins',
        type: 'POST',
        data: {pluginID: getURLParameter(location.href, 'pluginID')},
        success: (res) => {
            if (!res.success) return;

            var plugin = res.plugin;
            
            $('#name').val(plugin.name);
            $('#plugin_url').val(plugin.plugin_url);
            $('#access').val(plugin.access);
            $('#license_type').val(plugin.license_type);
            $('#license_method').val(plugin.license_method);
            $('#license_cost').val(plugin.license_cost);
            $('#description').val(plugin.description);
            $('#tags').tokenfield('setTokens', plugin.tags);

            validate_License_Field();
            var images = plugin.images;
            for (var i=0; i<images.length; i++) {
                var imageResource = images[i].image;
                var imageTag      = images[i].tag;
                var imageItem = '<div class="col-xs-4 col-md-3 image-item">' +
                                '<div class="card card-block">' +
                                    '<img class="image-content" src="' + imageResource + '" alt="">' +
                                    '<div class="overlay">' +
                                        '<button type="button" class="btn btn-sm btn-icon item-remove"><i class="icon md-delete"></i></button>' +
                                        // '<button type="button" class="btn btn-sm btn-icon item-edit"><i class="icon md-edit"></i></button>' +
                                        '<label class="item-tag">' + imageTag + '</label>' +
                                    '</div>' +
                                '</div>' +
                            '</div>';
                $('.image-item.empty').before(imageItem);
                
                $('.item-remove').on('click', (e) => {
                    e.currentTarget.closest('.image-item').remove();
                });

                $('.item-edit').on('click', () => {
                    $('#imageModal').modal();
                });
            }

            var properties = plugin.properties;
            
            for (var i=0; i<plugin.properties.length; i++) {
                $(".properties").find(".add").click();
            }

            $(".property-row").each(function(index) {
                if (index == 0) return;
                $(this).find(".property-name").val(plugin.properties[index-1].name);
                $(this).find(".property-value").val(plugin.properties[index-1].value);
            });

        }
    });
}

resetModal = () => {
    $('.dropify-clear').click();
    $('#choose_from_local').iCheck('check');
    $('#message').css('display', 'none');
}