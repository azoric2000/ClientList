

$(document).ready(function() {
                                 
		if(window.location.hash) {
			var $currentState = window.location.hash.substring(1);               
			ShowTab($currentState)                                                                             
		} else {
			ShowTab(0)                       
		}                             
		$('.tabTop').click(function(){                                      
			var $catVal = $('.tabTop').index(this);
			location.hash = $catVal;
			ShowTab($catVal)
		});
		function ShowTab(tabNo){         

                $('.tabBody').hide();
                $('.tabBody').eq(tabNo).show();                             
                $('.tabTop').removeClass('activeTab');
                $('.tabTop').addClass('inactiveTab');
                $('.tabTop').eq(tabNo).removeClass('inactiveTab');
                $('.tabTop').eq(tabNo).addClass('activeTab');                    

};
		// Default Action

                $(".tab_content").hide(); // Hide all content
                $("ul.tabs li:first").addClass("active").show(); // Activate first tab
                $(".tab_content:first").show(); // Show first tab content

                // On Click Event

                $("ul.tabs li").click(function() {
					$("ul.tabs li").removeClass("active"); // Remove any "active" class
					$(this).addClass("active"); // Add "active" class to selected tab
					$(".tab_content").hide(); // Hide all tab content
					var activeTab = $(this).find("a").attr("href"); // Find the rel
						// attribute value to
						// identify the active
						// tab + content
						$(activeTab).fadeIn(); // Fade in the active content
						return false;
                });
                              
});

 