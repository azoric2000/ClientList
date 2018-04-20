var LIST = {

    init: function() {
    	console.log('initaizing')
    	$('#target').load('feature.html')
    },

    loadPage: function() {
    	$('.nav li').click(function(){
    		$('.nav li').removeClass('active');
    		$(this).addClass('active');
    		$('#target').load($(this).attr('data-target'));
    	})
    },

    resetButton: function(){
    	$('#reset').click(function(){
    		$('input:checkbox').removeAttr('checked');
    		$('#breadcrumb').html('');
    	});
    },

    selectAll: function(){
    	$('#selectAll').click(function(){
    		$('input:checkbox').prop('checked',true);
    	})
    },

    breadcrumbing: function(){
    	$('input:checkbox').change(function(){
    		if ($(this).prop('checked')){
    			$('#breadcrumb').append('<div id="' + $(this).val() + '">' + $(this).attr('data-label')  + '</div>')
    		}
    		else{
    			$('#' + $(this).val()).remove()
    		}
    	})
    }

};


$(document).ready(function(){
	LIST.init();
	LIST.loadPage();

})