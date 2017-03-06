var sections;
var projects;
var dotNav;
var header2;

var maxiPhoneWidth = 645;
var miniPhoneWidth = 445;
var ratio = 0.58139;

function convertValue(value, r1Min, r1Max, r2Min, r2Max) {
	var ratio = (r2Max - r2Min) / (r1Max - r1Min)
	return value * ratio + r2Min - r1Min * ratio
}

$(document).ready(function(){

	sections = $('.section');
	projects = $('.thumbnail');
	dotNav = $('#dotNav');
	header = $('#header');
	header2 = $('#header2');

	projects.each(function(){
		var thumbnail = $(this);
		var iphone = $('.iphone', thumbnail);
		var screens = $('.screen', thumbnail);
		var screenTabs = $('.screen-tabs li', thumbnail);
		var marginTop = (thumbnail.outerHeight()-iphone.height())/2;
		iphone.css('opacity', 0).css('margin-left', maxiPhoneWidth/-2).css('top', marginTop);
		$('video', iphone).css('width', maxiPhoneWidth*ratio);
		dotNav.append("<li></li>").css("margin-top", dotNav.outerHeight()/-2);
		screens.css("opacity", 0);
		screens.eq(0).css("opacity", 1);
		screenTabs.each(function(index){
			var myIndex = index;
			$(this).on("click", function(){
				screens.animate({
					opacity: 0
				}, 100, 'easeOutQuint');
				screens.eq(myIndex).animate({
					opacity: 1
				}, 200, 'easeInQuint');
				screenTabs.removeClass("active");
				$(this).addClass("active");
			});
		});
	});

	$('#hero, #work, #slider, #about, #light-blue, #dark-blue, #header2').css('opacity', 0);
	$("html, body").delay(500).animate({ scrollTop: 0 }, 250, 'easeOutQuart');
	$("#hero, #work, #slider, #about, #light-blue, #dark-blue, #header2").delay(750).css('opacity', 0).animate({
		opacity: 1
	}, 1000, 'easeOutCubic');

	setTimeout(function () {
		watchScroll();
	}, 750);

	/*
	This will completely disable scrolling:

	$('html, body').css({
		overflow: 'hidden',
		height: '100%'
	});
	To restore:

	$('html, body').css({
		overflow: 'auto',
		height: 'auto'
	});
	*/

	$('.nav a').on("click", function(e){
		e.preventDefault()
		var ul = $(this).parent().parent();
		var myIndex = $(this).index('.nav a', ul);
		var headerHeight = header.outerHeight()/2;
		var myOffset = sections.eq(myIndex+1).offset().top-headerHeight;
		var centeredOffset = projects.eq(0).offset().top-headerHeight;
		var pageBottom = $(document).outerHeight()-$(window).height();
		centeredOffset -= ($(window).height() - projects.eq(0).outerHeight())/2;
		if (myIndex == 0){
			myOffset = centeredOffset;
		} else if (myOffset > pageBottom){
			myOffset = pageBottom;
		}
		$('html, body').stop(true, true).animate({
			scrollTop: myOffset
		}, 2000, 'easeOutQuart');
	});

	$('li', dotNav).on("click", function(e){
		e.preventDefault()
		var myIndex = $(this).index('#dotNav li');
		var headerHeight = header.outerHeight()/2;
		var centeredOffset = projects.eq(myIndex).offset().top-headerHeight;
		centeredOffset -= ($(window).height() - projects.eq(myIndex).outerHeight())/2;
		$('html, body').stop(true, true).animate({
			scrollTop: centeredOffset
		}, 2000, 'easeOutQuart');
	});

	$('a.messageCTA').on("click", function(e){
		e.preventDefault();
		$(".nav a:eq(2)", header).trigger( "click" );
	});

	$('a.workCTA').on("click", function(e){
		e.preventDefault();
		$("li:eq(0)", dotNav).trigger( "click" );
	});

	$("#contactform").on("submit", function(e){
		
		e.preventDefault();
		var action = $(this).attr('action');
		$('#submit').attr('disabled','disabled').after('<img src="./images/ajax-loader.gif" class="loader" />');
		$.post(action, { 
			name: $('#name').val(),
			email: $('#email').val(),
			message: $('#message').val()
		},
			function(data){
				$('#notice').html(data);
				$('#contactform img.loader').fadeOut('fast',function(){$(this).remove()});
				$('#submit').removeAttr('disabled'); 
				if(data.match('Success! Message sent.') != null) {
					$('#contact .close').trigger('click');
				}
			}
		);
		
		return false; 
	
	});

	/*$('.pictour').on("click", function(e){
		e.preventDefault();
		$("#video-overlay").fadeIn(600);
	});*/

	$("#video-overlay .close").on("click", function(e){
		e.preventDefault();
		$("#video-overlay").fadeOut(600);
	});


});

function watchScroll() {
	$(window).scroll(function(){

		var height = $(window).height();
		var scrollTop = $(window).scrollTop();
		var heroTop = convertValue(scrollTop, 40, 280, 0, 100);
		var heroAlpha = convertValue(scrollTop, 40, 340, 1, 0);
		var headerAlpha = convertValue(scrollTop, 290, 340, 0, 1);
		var header2Top = convertValue(scrollTop, 0, 50, 0, 30);

		header.css('opacity', headerAlpha);
		header2.css('top', header2Top);
		$('#hero').css('opacity', heroAlpha).css('top', heroTop);

		projects.each(function(){
			var thumbnail = $(this);
			var iphone = $('.iphone', thumbnail);
			var img = $('img', iphone);
			var detail = $('.project-detail', thumbnail);
			var video = $('.screen', iphone);
			var distanceMin = thumbnail.offset().top-projects.eq(0).offset().top;
			var distanceMax = thumbnail.offset().top-40;
			var iphoneLeft = convertValue(scrollTop, distanceMin, distanceMax, 0, miniPhoneWidth/1.5);
			var iPhoneWidth = convertValue(scrollTop, distanceMin, distanceMax, maxiPhoneWidth, miniPhoneWidth);
			var iPhoneOpacity = convertValue(scrollTop, distanceMin+100, distanceMin+300, 0, 1);
			var contentOpacity =  convertValue(scrollTop, distanceMin+150, distanceMax-75, 0, 1);
			if (scrollTop <= distanceMax && scrollTop >= distanceMin){
				img.css('width', iPhoneWidth);
			} else {
				if (scrollTop > distanceMax) {
					img.css('width', miniPhoneWidth);
					iphoneLeft = convertValue(distanceMax, distanceMin, distanceMax, 0, miniPhoneWidth/1.5);
					iPhoneWidth = convertValue(distanceMax, distanceMin, distanceMax, maxiPhoneWidth, miniPhoneWidth);
				} else {
					img.css('width', maxiPhoneWidth);
					iphoneLeft = convertValue(distanceMin, distanceMin, distanceMax, 0, miniPhoneWidth/1.5);
					iPhoneWidth = convertValue(distanceMin, distanceMin, distanceMax, maxiPhoneWidth, miniPhoneWidth);
				}
			}
			var marginTop = (thumbnail.outerHeight()-iphone.height())/2;
			if (window.matchMedia('(max-width: 1024px)').matches) {
				console.log($("body").width());
				console.log(window.outerWidth);
				iphoneLeft = convertValue(scrollTop, distanceMin, distanceMax, 0, 0);
				contentOpacity =  convertValue(scrollTop, distanceMin+150, distanceMax+(thumbnail.height()/2), 0, 1);
				marginTop = 60;
			}
			iphone.css('opacity', iPhoneOpacity).css('margin-left', (iPhoneWidth/-2)-iphoneLeft).css('top', marginTop);
			video.css('width', iPhoneWidth*ratio);
			detail.css('opacity', contentOpacity);
		});

		checkSection();
		checkProject();
	});
}

function checkSection() {
	for(i=1;i<sections.length;i++){
		var sectionTop = sections.eq(i).offset().top-240;
		var currentTop = $(document).scrollTop();
		var pageBottom = $(document).outerHeight()-$(window).height();
		if (currentTop > sectionTop) {
			$(".nav li", header).removeClass("active");
			$(".nav li", header).eq(i-1).addClass("active");
		} else if (currentTop == pageBottom) {
			$(".nav li", header).removeClass("active");
			$(".nav li", header).eq(sections.length-2).addClass("active");
		}
	}
}

function checkProject() {
	for(i=0;i<projects.length;i++){
		var projectTop = projects.eq(i).offset().top-400;
		var currentTop = $(document).scrollTop();
		if (currentTop > projectTop) {
			$("li", dotNav).removeClass("active");
			$("li", dotNav).eq(i).addClass("active");
		}
		if (currentTop > sections.eq(2).offset().top-300 || window.matchMedia('(max-width: 640px)').matches){
			if (dotNav.is(":visible")){ dotNav.hide() }
		} else {
			if(!dotNav.is(":visible")) { dotNav.show() }
		}
	}
}