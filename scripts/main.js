var sections;
var projects;
var dotNav;

var maxiPhoneWidth = 645;
var miniPhoneWidth = 445;
var ratio = 0.58139;
var engine;

window.onbeforeunload = function(){ window.scrollTo(0,0); }

function convertValue(value, r1Min, r1Max, r2Min, r2Max) {
	var ratio = (r2Max - r2Min) / (r1Max - r1Min)
	return value * ratio + r2Min - r1Min * ratio
}

$(document).ready(function(){

	sections = $('.section');
	projects = $('.thumbnail, #about');
	dotNav = $('#dotNav');

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

	$(document).scrollTop(0);

	setTimeout(function () {
		watchScroll();
	}, 750);

	setTimeout(function () {
		engine = new Engine($('#container'), MagnetField);
		engine.start();
	}, 350);

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

	/*$("#long-tail").hide();*/

	$('#hero').addClass('loaded');

	/*$('.nav a').on("click", function(e){
		e.preventDefault()
		var ul = $(this).parent().parent();
		var myIndex = $(this).index('.nav a', ul);
		var myOffset = sections.eq(myIndex+1).offset().top;
		var centeredOffset = projects.eq(0).offset().top;
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
	});*/

	$('li', dotNav).on("click", function(e){
		e.preventDefault()
		var myIndex = $(this).index('#dotNav li');
		var centeredOffset = projects.eq(myIndex).offset().top;
		centeredOffset -= ($(window).height() - projects.eq(myIndex).outerHeight())/2;
		if(myIndex == 4){
			centeredOffset = projects.eq(projects.length-1).offset().top;
		}
		$('html, body').stop(true, true).animate({
			scrollTop: centeredOffset
		}, 2000, 'easeOutQuart');
	});

	$('a.messageCTA, p.big a').on("click", function(e){
		e.preventDefault();

		$("#long-tail").css('opacity', 1).slideDown(200, function(){
			var myOffset = projects.eq(projects.length-1).offset().top;
			var pageBottom = $(document).outerHeight()-$(window).height();
			if (myOffset > pageBottom){ myOffset = pageBottom; }
			$('html, body').stop(true, true).animate({
				scrollTop: myOffset
			}, 2000, 'easeOutQuart');
		});
	});

	$('a.workCTA').on("click", function(e){
		e.preventDefault();
		$("#long-tail").css('opacity', 1).slideDown(200, function(){
			$("li:eq(0)", dotNav).trigger( "click" );
		});
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

	$("#video-overlay .close").on("click", function(e){
		e.preventDefault();
		$("#video-overlay").fadeOut(600);
	});

	$(window).resize(function(){
		$('#container, #container canvas').width($('.slide:eq(0)').width());
		$('#container, #container canvas').height($('.slide:eq(0)').height());
		engine = new Engine($('#container'), MagnetField);
		engine.start();
	});


});

function watchScroll() {
	$(window).scroll(function(){

		console.log('watch scroll');

		var height = $(window).height();
		var scrollTop = $(window).scrollTop();
		var heroTop = convertValue(scrollTop, 40, height/8, 0, 10);
		var heroAlpha = convertValue(scrollTop, 40, height/2, 1, 0);
		var hero = $('#hero');

		if(heroAlpha <= 0){
			if(!hero.hasClass('hidden')){
				hero.addClass('hidden').css('height', '0 !important');
			}
		} else if (heroAlpha > 0) {
			if(hero.hasClass('hidden')){
				hero.removeClass('hidden')
			}
			hero.css('opacity', heroAlpha).css('transform', "translate(0, "+heroTop+"px)");
		}

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
			var contentOpacity =  convertValue(scrollTop, distanceMin+280, distanceMax-50, 0, 1);
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
				iphoneLeft = convertValue(scrollTop, distanceMin, distanceMax, 0, 0);
				contentOpacity =  convertValue(scrollTop, distanceMin+150, distanceMax+(thumbnail.height()/2), 0, 1);
				marginTop = 60;
			}
			iphone.css('opacity', iPhoneOpacity).css('margin-left', (iPhoneWidth/-2)-iphoneLeft).css('top', marginTop);
			video.css('width', iPhoneWidth*ratio).css('height', iPhoneWidth*ratio*(667/375));
			detail.css('opacity', contentOpacity);
		});

		checkSection();
		checkProject();
	});
}

function checkSection() {
	for(i=1;i<projects.length;i++){
		var sectionTop = projects.eq(i).offset().top-240;
		var currentTop = $(document).scrollTop();
		var pageBottom = $(document).outerHeight()-$(window).height();
		if (currentTop > sectionTop) {
			// $(".nav li", header).removeClass("active");
			// $(".nav li", header).eq(i-1).addClass("active");
		} else if (currentTop == pageBottom) {
			// $(".nav li", header).removeClass("active");
			// $(".nav li", header).eq(sections.length-2).addClass("active");
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
		/*if (currentTop > projects.eq(2).offset().top-300 || window.matchMedia('(max-width: 640px)').matches){
			if (dotNav.is(":visible")){ dotNav.hide() }
		} else {
			if(!dotNav.is(":visible")) { dotNav.show() }
		}*/
	}
}

