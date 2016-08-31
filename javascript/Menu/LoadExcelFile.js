/**
 * Created by Andre on 01/05/2016.
 */



$(function(){
    $('#file').on('change', function(){
        var file_data = $('#file').prop('files')[0];
        var form_data = new FormData();
        form_data.append("file", file_data);


        $.ajax({
            url:'../core/php/loadExcel.php',
            data: form_data,
            type: 'post',
            processData: false,
            contentType: false,
            cache: false,
            success:function (response) {
                alertSuccess();
            },
            error:function(){
                alertError();
            }
        });


    });
});