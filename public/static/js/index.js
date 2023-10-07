/**
 
 */
$(function () {
    $(window).on("resize", function () {
       
        let clientW = $(window).width();
        // console.log(clientW);

      
        let isShowBigImage = clientW >= 800;

     
        let $allItems = $("#lk_carousel .item");
        // console.log($allItems);

       
        $allItems.each(function (index, item) {
          
            let src = isShowBigImage ? $(item).data("lg-img") : $(item).data("sm-img");
            let imgUrl = 'url("' + src +'")';

           
            $(item).css({
                backgroundImage: imgUrl
            });

           
            if(!isShowBigImage){
                let $img = "<img src='" + src + "'>";
                $(item).empty().append($img);
            }else {
                $(item).empty();
            }

        });
    });

    $(window).trigger("resize");



   
    $('[data-toggle="tooltip"]').tooltip();

    
    $(window).on("resize", function () {
         let $ul = $("#lk_product .nav");
         let $allLis = $("[role='presentation']", $ul);
         // console.log($allLis);

      
        let totalW = 0;
        $allLis.each(function (index, item) {
             totalW += $(item).width();
        });

        // console.log(totalW);

        let parentW = $ul.parent().width();

        
        if(totalW > parentW){
            $ul.css({
                width: totalW + "px"
            })
        }else {
            $ul.removeAttr("style");
        }
    });

    
   
    let allLis = $("#lk_nav li");
    
    $(allLis[2]).on("click", function () {
        $("html,body").animate({ scrollTop: $("#lk_hot").offset().top }, 1000);
    });


    $(window).trigger("resize");
});