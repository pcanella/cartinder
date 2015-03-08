'use strict';

// This is dumb but I have to do this because FOTORAMA
$(document).ready(function() {

    $('.fotorama__caption__wrap').on('click', function() {
        console.log('click');
    });

    $('.fotorama__caption .delete-image').on('click touchend', function(e) {
        e.preventDefault();
        var a = document.createElement('a');
        a.href = $(this).data('imageid').split('images/');
        console.log(a.pathname.split('/').pop());
    });

});