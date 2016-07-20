







/**
* ==============================================
* INIT BASE
* ==============================================
*/

(function ($, window, document, undefined) {

    /**
    * INITIALIZE ALL PLUGINS
    */
    var app = {
    	init: function() {
            //fancy.init();
            form.init();
            //color.init();
         
            var $preview = $('.preview');
            /*
            $preview.stick_in_parent({
                offset_bottom: 0,
                offset_top: 100
            });*/
            
            

            $('#constructor').construct({
                afterStep: function() {
                    $preview.trigger("sticky_kit:recalc");
                },
                afterInit: function() {
                    $preview.trigger("sticky_kit:recalc");
                }
            });
            //slider.init();
            /*$('#intro h1').gradientText({
                    colors: ['#f9c203', '#dd6e0c']
            });
            $('#intro .h-span').gradientText({
                    colors: ['#ffffff', '#d3d3d3']
            });*/

            /*$('#goToConstruct').on('click', function()
            {
                $('html, body').animate({ scrollTop: $('.construct-anc').offset().top }, 500);
            });*/



            $('[data-tooltip!=""]').qtip({ // Grab all elements with a non-blank data-tooltip attr.
                content: {
                    attr: 'data-tooltip' // Tell qTip2 to look inside this attr for its content,
                },
                position: {
                    target: 'mouse', // Track the mouse as the positioning target
                    adjust: { x: 10, y: 10 } // Offset it slightly from under the mouse
                },
                style: {
                   classes: 'qtip-dark'
                }
            });

            $('.qtip-link').qtip({ // Grab all elements with a non-blank data-tooltip attr.
                content: '<a style="color: #fff; font-weight: 500;" href="size" target="_blank">Как выбрать размер?</a>',
                hide: {
                    fixed: true,
                    delay: 300
                },
                style: {
                   classes: 'qtip-dark'
                }
            });

    	}
    };


    var uploader = false;
    /**
    * INITIALIZE FORM PLUGINS
    */
    var form = {
        init: function() {
            $(document).find('.validate').validate();
            form.ajaxSubmit();
            $(document).find('.phone-input').mask("0 (000) 000-00-00");

            if(uploader !== false) return;

             uploader = new plupload.Uploader({
                            runtimes : 'html5,flash,silverlight,html4',
                            browse_button: 'pickfiles', // you can pass in id...
                            container: document.getElementById('file-container'), // ... or DOM Element itself
                            url: '#',
                            flash_swf_url: '#',
                            unique_names: true,
                            rename: true,
                            max_file_count: 3,
                            multi_selection: true,
                            multiple_queues: true,
                            silverlight_xap_url: '#',
                            filters: {
                                max_file_size: '5mb',
                                mime_types: [{
                                    title: "Image files",
                                    extensions: "jpg,gif,png,cdr,ai"
                                }, {
                                    title: "Zip files",
                                    extensions: "zip"
                                }, {
                                    title: "Doc files",
                                    extensions: "pdf,xml,xmls,xlsx,txt,rtf,odt,sxw,tex,doc,docx,docm"
                                }]
                            },

                            init: {
                                PostInit: function() {
                                    document.getElementById('filelist').innerHTML = '';
                                    document.getElementById('uploadfiles').onclick = function() {
                                        uploader.start();
                                        return false;
                                    };
                                },

                                FilesAdded: function(up, files) {
                                    document.getElementById('filelist').innerHTML = '';
                                    plupload.each(files, function(file) {
                                        document.getElementById('filelist').innerHTML += '<div id="' + file.id + '">' + file.name + ' (' + plupload.formatSize(file.size) + ') <b></b></div>';
                                    });
                                    up.start();
                                },

                                UploadProgress: function(up, file) {
                                    document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + "%</span>";
                                },

                                Error: function(up, err) {
                                    //document.getElementById('console').innerHTML += "\nError #" + err.code + ": " + err.message;
                                },
                                UploadComplete: function(up, files) {
                                    var $attachedArr = [];

                                    $.each(files, function(i, file) {
                                        $attachedArr.push(file.target_name);
                                    });

                                    var logoStr = $attachedArr.join(',');

                                    $('.logo-input').val(logoStr);
                                }
                            }
                        });

                        uploader.init();


        },
        ajaxSubmit: function() {
            $(document).off('submit', '.ajaxSubmit');
            $(document).on('submit', '.ajaxSubmit', function(event) {
                event.preventDefault ? event.preventDefault() : event.returnValue = false;
                var $url,$data,$el;
                $el = $(this);
                form.showLoader($el);
                $data = $(this).serialize();
                $url = $(this).attr('action');
                $.ajax({
                        url: $url,
                        type: "post",
                        dataType: "html",
                        data: $data,
                        error: function() {
                            alert('Произошла ошибка (код #001) отправки сообщения.');
                        },
                        complete: function() {
                            form.hideLoader($el);
                        },
                        success: function( strData ){
                            $.fancybox.close();
                            $.fancybox($(strData), {padding: 0});
                        }
                });
            })
        },
        showLoader: function($el) {

        },
        hideLoader: function($el) {

        }
    }

  $(document).ready(app.init)

})(jQuery, window, document);
