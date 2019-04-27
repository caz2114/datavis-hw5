$(document).ready(function(){
    $('#section1').click(function(){
        $('html, body').animate({
            scrollTop: ($('#section1_start').first().offset().top)
        },500);
    })

    $('#section2').click(function(){
        $('html, body').animate({
            scrollTop: ($('#section2_start').first().offset().top)
        },500);
    })

    $('#section3').click(function(){
        $('html, body').animate({
            scrollTop: ($('#section3_start').first().offset().top)
        },500);
    })

    $('#to_head').click(function(){
        $('html, body').animate({
            scrollTop: ($('#top').first().offset().top)
        },500);
    })

})
