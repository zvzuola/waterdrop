//小提示框
;(function(){
    var defaults = {
        trigger : 'click'
    }
    var popovers = [];
    function popover(element,options){
        this.$target = $(element).siblings('.wd-target');
        this.$element = $(element);
        popovers.push(this.$element);
        this.options = $.extend({},defaults, options);

        this.init();
        var self = this;
        $(window).resize(function() {
            self.setPosition();
        });

    }
    popover.prototype = {
        init:function(){
            this.setPosition();
            this.initTargetEvents();
            this._targetclick = false;
            if (this.getTrigger() === 'click') {
                this.$element.off('click').on('click', $.proxy(this.elementClickHandler, this));
            } else if (this.getTrigger() === 'hover') {
                this.$element
                        .off('mouseenter mouseleave click')
                        .on('mouseenter', $.proxy(this.mouseenterHandler, this))
                        .on('mouseleave', $.proxy(this.mouseleaveHandler, this));
            }            
        },
        destroy: function() {
            var index = -1;
            for (var i = 0; i < popovers.length; i++) {
                if (popovers[i] === this.$element) {
                    index = i;
                    break;
                }
            }
            popovers.splice(index, 1);
            // this.hide();
            this.$target.hide();
            this.$element.data('plugin_popover', null);
            if (this.getTrigger() === 'click') {
                this.$element.off('click');
            } else if (this.getTrigger() === 'hover') {
                this.$element.off('mouseenter mouseleave');
            }
        },
        hideAll: function() {
            for (var i = 0; i < popovers.length; i++) {
                popovers[i].wdPopover('hide');
            }
        },
        setPosition: function(){
            if (this.$element.parent().css('position') == 'static') {
                this.$element.parent().css('position','relative');
            }
            var width = this.$target.outerWidth(true);
            //如果是下拉式按钮
            if(this.$target.hasClass('wd-dropdown-menu')){
                var targetBorderPaddingWidth = parseInt(this.$target.css('padding-left'))
                                                + parseInt(this.$target.css('padding-right'))
                                                + parseInt(this.$target.css('border-left-width'))
                                                + parseInt(this.$target.css('border-right-width'));
                this.$target.css('min-width',this.$element.outerWidth()-targetBorderPaddingWidth);
                width = this.$target.outerWidth(true);
            }
            var height = this.$target.outerHeight(true),
                elementWidth = this.$element.outerWidth(true),
                elementHeight = this.$element.outerHeight(true),
                elementPositionTop = this.$element.position().top,
                elementPositionLeft = this.$element.position().left,
                top = elementHeight + elementPositionTop,
                left = elementPositionLeft - (width - elementWidth)/2;
                
            if(this.$target.hasClass('wd-dropdown-menu'))//如果是下拉式按钮
                left = elementPositionLeft;
            if(this.$target.hasClass('wdm-popover-bottom')){
                // 如果超出左边界
                if(this.$element.offset().left < (width - elementWidth)/2){
                    left = elementPositionLeft;
                    this.$target.find('.wd-popover-arrow').css('left',elementWidth/2);
                }
                // 如果超出右边界
                if($(document).width() - this.$element.offset().left < (width + elementWidth)/2){
                    left = elementPositionLeft - (width - elementWidth);
                    this.$target.find('.wd-popover-arrow').css('left',width - elementWidth/2);
                }
            }

            if(this.$target.hasClass('wdm-popover-top')){
                top = elementPositionTop - height;
                // 如果超出左边界
                if(this.$element.offset().left < (width - elementWidth)/2){
                    left = elementPositionLeft;
                    this.$target.find('.wd-popover-arrow').css('left',elementWidth/2);
                }
                // 如果超出右边界
                if($(document).width() - this.$element.offset().left < (width + elementWidth)/2){
                    left = elementPositionLeft - (width - elementWidth);
                    this.$target.find('.wd-popover-arrow').css('left',width - elementWidth/2);
                }
            }

            if(this.$target.hasClass('wdm-popover-left')){
                left = elementPositionLeft - width;
                top = elementPositionTop - (height - elementHeight)/2;
                // 如果超出上边界
                if(this.$element.offset().top < (height - elementHeight)/2){
                    top = elementPositionTop;
                    this.$target.find('.wd-popover-arrow').css('top',elementHeight/2);
                }
                // 如果超出下边界
                if($(document).height() - this.$element.offset().top < (height + elementHeight)/2){
                    top = elementPositionTop - (height - elementHeight);
                    this.$target.find('.wd-popover-arrow').css('top',height - elementHeight/2);
                }
            }
            if(this.$target.hasClass('wdm-popover-right')){
                left = elementPositionLeft + elementWidth;
                top = elementPositionTop - (height - elementHeight)/2;
                // 如果超出上边界
                if(this.$element.offset().top < (height - elementHeight)/2){
                    top = elementPositionTop;
                    this.$target.find('.wd-popover-arrow').css('top',elementHeight/2);
                }
                // 如果超出下边界
                if($(document).height() - this.$element.offset().top < (height + elementHeight)/2){
                    top = elementPositionTop - (height - elementHeight);
                    this.$target.find('.wd-popover-arrow').css('top',height - elementHeight/2);
                }
            }

            this.$target.css({
                "top": top,
                "left": left
            });
        },
        elementClickHandler: function(e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            this.getTarget().is(':visible') ? this.hide() : this.show();
        },
        hide: function(event) {
            if (event) {
                event.preventDefault();
                event.stopPropagation();
            }
            this.$element.removeClass('wd-open');
            this.$target.hide();
        },
        show: function() {
            var $target = this.getTarget();
            this.hideAll();
            $target.show();
            this.$element.addClass('wd-open');

            //为body绑定事件不能放在init中，只能放在这里根据不同元素的显示来绑定相应的事件
            $(document).off('click.plugin_popover').on('click.plugin_popover', $.proxy(this.bodyClickHandler, this));
        },
        initTargetEvents: function() {
            if (this.getTrigger() === 'hover') {
                this.$target
                    .off('mouseenter mouseleave')
                    .on('mouseenter', $.proxy(this.mouseenterHandler, this))
                    .on('mouseleave', $.proxy(this.mouseleaveHandler, this));
            }
            this.$target.off('click.plugin_popover').on('click.plugin_popover', $.proxy(this.targetClickHandler, this));
        },
        bodyClickHandler: function() {
            if (this.getTrigger() === 'click') {
                if (this._targetclick) {
                    this._targetclick = false;
                } else {
                    this.hideAll();
                }
            }
        },
        targetClickHandler: function() {
            //下拉菜单
            if(this.$target.hasClass('wd-dropdown-menu'))
                this._targetclick = false;
            else
                this._targetclick = true;
        },
        mouseenterHandler: function() {
            var self = this;
            if (self._timeout) {
                clearTimeout(self._timeout);
            }
            self._enterTimeout = setTimeout(function() {
                if (!self.getTarget().is(':visible')) {
                    self.show();
                }
            }, 100);
        },
        mouseleaveHandler: function() {
            var self = this;
            clearTimeout(self._enterTimeout);
            self._timeout = setTimeout(function() {
                self.hide();
            }, 100);
        },
        getTrigger: function() {
            return this.$element.attr('data-trigger') || this.options.trigger;
        },
        getTarget: function() {
            return this.$target;
        }
    }
    $.fn.wdPopover=function(options){
        return $(this).each(function() {
            var popoverData = $.data(this, 'plugin_popover');
            if (!popoverData) {
                popoverData = new popover(this, options);
                $.data(this, 'plugin_popover', popoverData);
            }else{
                if(options === 'destroy') {
                    popoverData.destroy();
                }else if (typeof options === 'string') {
                    popoverData[options]();
                }
            }
        });
    }
})(jQuery);


//弹框
;(function($){
	var defaults={
		title:'提示',
        minWidth:335,
        width:335,
		buttons: null
	}
    var wd_dialog = function(element,options){
        this.$element = $(element);
        this.opts=$.extend({},defaults,options);
        this.init();
    }
	wd_dialog.prototype = {
		init:function(){
            var self = this;
			var mdlg=$("<div class='wdm-dlg'><table class='wd-dlgtable'><tr><td class='wd-dlgtd'><div class='wd-dlgwrap'></div></td></tr></table></div>");
			var head=$("<div class='wd-dlghead'><span class='wd-dlg-title'>"+this.opts.title+"</span><b class='icon-close-dlg'></b></div>");
			var foot=$("<div class='wd-dlgfoot'></div>");
			var body=$('<div />').addClass('wd-dlgbody').append(this.$element.show());
			var buttons = this.opts.buttons;
			if(buttons!=null){
				$.each( buttons, function( name, props ) {
					var props = $.isFunction( props ) ? { click: props, text: name } : props;
                    var click = props.click;
                    props.click = function() {
                        click.apply( self.$element[ 0 ], arguments );
                    };
					$( "<button></button>",props).addClass('wdu-btn wdu-btn-dlg').appendTo(foot);
				});
			}
			mdlg.find('.wd-dlgwrap').css({'width':this.opts.width,'min-width':this.opts.minWidth}).append(head).append(body).append(foot);
			$('body').append(mdlg);
			mdlg.find('.icon-close-dlg').on('click', function(event) {
				event.preventDefault();
                self.close();
			});
		},
        close:function(){
            var parent = this.$element.parents('.wdm-dlg');
            this.$element.hide().appendTo('body');
            parent.remove();
            $('body').removeClass('f-oh');
		},
        destroy:function(){
            this.$element.data('plugin_dialog', null);
        }
	};
	
	$.fn.extend({
		wdDialog:function(options){
    			return $(this).each(function() {
                $('body').addClass('f-oh');
                var plugin_dialog = $.data(this, 'plugin_dialog');
                if (!plugin_dialog) {
                    plugin_dialog = new wd_dialog(this, options);
                    $.data(this, 'plugin_dialog', plugin_dialog);
                }else{
                    if(options === 'destroy') {
                        plugin_dialog.destroy();
                    }else if (typeof options === 'string') {
                        plugin_dialog[options]();
                    }else{
                        plugin_dialog.init();
                    }
                }
            });
		}
	});
})(jQuery);

//图片滚动
;(function($){
    var delLiIndex;
    $.fn.extend({
        startScroll:function(options){
            return this.each(function(){
                var defaults ={
                    speed: 500, //动画速度
                    space: 5000, //时间间隔
                    auto: false, //自动滚动
                    trigger: 'click', //触发事件
                    current:'cur', //当前切换器样式名称
                    preBtn:'#pre',//左边按钮id
                    nextBtn:'#next',//右边按钮id
                    layer:false,//是否点击图片显示弹窗
                    isContinue:false,//是否连续滚动
                    perNum:3,//每页显示个数
                    index:0
                },
                Timer,
                _this=$(this),
                settings=$.extend({},defaults,options),
                index=settings.index,
                bannerWidth,
                switcherNum,
                firstInit=true,
                ulWidth;
                

                function init(){
                    
                    // 设置li浮动并居中里面的图片, 获得滚动图片的个数
                    switcherNum = _this.find("ul li").addClass('f-fl wdu-mgr20').size();
                    // 获取li的width;
                    bannerWidth = _this.find("ul li").eq(0).outerWidth(true);
                    // ul宽度
                    ulWidth=bannerWidth*switcherNum;
                    _this.addClass('wdm-scroll').find('ul').addClass('wd-scroll-ul').css({'left': -index*bannerWidth})

                    //为左右按钮添加背景图片
                    $(settings.preBtn).addClass('wdu-pre-scroll');
                    $(settings.nextBtn).addClass('wdu-next-scroll');

                    // 如果当前没有截图，隐藏展示区域
                    if(switcherNum == 0){
                        _this.addClass('f-dn');
                    }else{
                        _this.removeClass('f-dn');
                    }
                    
                    // 如果总个数小于每页显示个数，则隐藏按钮
                    if(switcherNum<=settings.perNum){
                        $(settings.nextBtn).hide();
                        $(settings.preBtn).hide();
                    }else{
                        $(settings.nextBtn).show();
                    }
                    // 如果不连续滚动且为第一次初始化时隐藏上一个按钮
                    if(!settings.isContinue&&firstInit&&index==0){
                        $(settings.preBtn).hide();
                        firstInit=false;
                    }
                    // 检查是否滚动到最后一页
                    var isLast=ulWidth+_this.find('ul').position().left<=_this.width()+20;
                    if(!settings.isContinue&&(switcherNum<=settings.perNum||isLast)){
                        $(settings.nextBtn).hide();
                    }
                    if(settings.auto){
                        Timer = setInterval(slide, settings.space);
                    }
                }

                function slide(direc){
                    if(direc=='pre'){
                        index--;
                    }else{
                        index++;
                    }
                    if(index > switcherNum-settings.perNum){
                        index = 0;
                    }
                    if(index < 0){
                        index = switcherNum-settings.perNum;
                    }
                    //$(".switcher img").removeClass(settings.current).eq(index).addClass(settings.current);
                    _this.find("ul").stop().animate({left: -index*bannerWidth}, settings.speed);
                }

                if(settings.layer){
                    _this.on('click.layer','li img',function(){
                        $('body').addClass('f-oh');
                        var tempParent = $(this).closest('.wd-scroll-ul');
                            tempIndex=$(this).closest('li').index(),
                            mask=$("<div class='wdm-dlg wdm-dlg-layer'><table class='wd-dlgtable'><tr><td class='wd-dlgtd'></td></tr></table></div>"),
                            li=_this.find('ul').html(),
                            ul=$("<ul class='f-cb'></ul>").append(li)
                            layerdiv=$("<div></div>",{id:'dlgScroll'}).css({'width':bannerWidth+140,'margin':'0 auto'});

                        ul.find('li').each(function(){
                            $(this).css('width',bannerWidth+140);
                            var imgSrc = $(this).find('img').attr('src');
                            var props = {
                                click:function(){
                                    window.open (imgSrc);
                                },
                                class:'wdu-btn-reverse-gray wdu-btn-md',
                                text: '下载截图'
                            }
                            var btnLoad = $("<div class='wdu-mgt20'></div>").append($("<button></button>",props));
                            $(this).append(btnLoad);
                        });
                        layerdiv.append(ul).append("<div id='layerPreBtn'></div><div id='layerNextBtn'></div>");
                        mask.find('.wd-dlgtd').append(layerdiv);
                        $('body').append(mask);
                        $('#dlgScroll').startScroll({preBtn:'#layerPreBtn',nextBtn:'#layerNextBtn',perNum:1,index:tempIndex});
                        mask.find('li img').off('click.layer');
                        $('.wdm-dlg-layer').on('click',function(e){
                            var e=e||window.event;
                            var src=e.target||e.srcElement;
                            if(src.id=='layerNextBtn'||src.id=='layerPreBtn'||src.className.indexOf('wdu-btn-reverse-gray') != -1||src.className.indexOf('icon-close2') != -1){
                                if(src.className.indexOf('icon-close2') != -1){
                                    tempParent.find('li').eq(delLiIndex).find('.icon-close2').trigger('click');
                                }
                                return false;
                            }
                            else{
                                $(this).remove();
                                $('body').removeClass('f-oh');
                            }

                        });
                    });
                }
                _this.on(settings.trigger,settings.nextBtn,_rightClickFunc);
                _this.on(settings.trigger,settings.preBtn,_leftClickFunc);
                // if(_this.find('.icon-close2').length){
                    _this.on('click','li .icon-close2',_del);
                // }


                function _pause(){
                    clearInterval(Timer);
                }
                function _continue(){
                    if(settings.auto){
                        Timer = setInterval(slide, settings.space);
                    }
                }
                function _leftClickFunc(){
                    _pause();
                    slide('pre');
                    $(settings.nextBtn).fadeIn();
                    // 如果不连续且为第一张则隐藏上一步按钮
                    if(!settings.isContinue&&index==0){
                        $(settings.preBtn).fadeOut();
                        return;
                    }
                    _continue();
                }
                function _rightClickFunc(){
                    _pause();
                    slide();
                    $(settings.preBtn).fadeIn();
                    // 如果不连续且为最后一页则隐藏下一步按钮
                    if(index==switcherNum-settings.perNum&&!settings.isContinue){
                        $(settings.nextBtn).fadeOut();
                        return;
                    }
                    _continue();
                }
                function _del(){
                    delLiIndex = $(this).closest('li').index();
                    $(this).closest('li').remove();
                    init();
                    _pause();
                    // 如果已经滚动到最后一页且总个数大于每页显示的个数则向前滚动一次
                    if(ulWidth+_this.find('ul').position().left<_this.find('ul').parent().width()&&switcherNum>=settings.perNum){
                        // index=index-1;
                        slide('pre');
                    }
                    // 删掉最后一张时隐藏截图区域
                    if(_this.find('li').size() == 0){
                        _this.addClass('f-dn');
                    }
                }
                $.fn.startScroll.destroy=function(){
                    _this.find("ul").stop().animate({left: 0}, settings.speed);
                    _this.off(settings.trigger,settings.nextBtn,_rightClickFunc);
                    _this.off(settings.trigger,settings.preBtn,_leftClickFunc);
                    _this.off('click','li .icon-close2',_del);
                    if(settings.layer){
                        _this.off('click.layer','li img');
                    }
                }
                return init();
            });
        }
    });
})(jQuery);

;(function($){
    $.fn.extend({
        scrollFixed:function(){
            var self = this;
            var top = self.offset().top;
            function wdScroll(){
                if($(window).scrollTop() >= top){
                    self.attr('style', 'position:fixed;top:3px');
                }else{
                    self.attr('style', '');
                }
            }
            $(window).scroll(function(event) {
                wdScroll();
            });
        }
    });
})(jQuery);

//此方法借鉴网上的...
;(function ($) {
    var $container = $('<div class="wdm-select-container"><span class="selected"></span></div>');
    var $list = $('<ul class="wdm-select" style="display:none;"></ul>');
    $.fn.wdDropdown = function (options) { 
        var $els = $(this); 
        $els.hide();
        //Go through each select and create Dropdown
        $els.each(function(index,value) {
        //Clone Containers and List Objects
        var $currentContainer = $container.clone().addClass($(value).attr('class'));
        var $currentList = $list.clone();
        //Pull out Select Info and Copy it Over to our New Structure
        var $el = $(value);
        var $options = $el.find('option'); 
        var selectText = $el.find('option:selected').addClass('z-crt').text() || $($options[0]).addClass('z-crt').text();
        //Insert Container into DOM
        $el.after($currentContainer);
        //Move select into Container
        $el.appendTo($currentContainer); 
        //Insert our Shell List
        $currentList.appendTo($currentContainer);
        //Copy over Options into List
        $options.each(function (index, value) {
            var $option = $(value);
            var $wrapper = $("<li></li>");
            var attributes = $option.prop("attributes"); 
            $wrapper.prop("attributes", attributes);
            //Copy over teh attributes
            $.each(attributes, function(index, attribute) {
              $wrapper.attr(attribute.name, attribute.value);
            });
            $wrapper.append($option.text());

            //Add it to our list
            $currentList.append($wrapper); 
        });
        //Set the currently selected Default
        $currentContainer.find('.selected').text(selectText);
        // $currentContainer.css({'width':$currentList.outerWidth(),'box-sizing':'border-box'});


        //Behaviorals
        $currentContainer.on("click.wdm.select", function() {
            //When the Click on our "select" dropdown box
            var $sel = $(this);
            //Close all other boxes
            var targets = $.grep($('.wdm-select-container'), function (e) {
              return ! $sel.is($(e));
            });
            $(targets).removeClass('wd-open').find('ul').hide();
            if($(document).height() - $sel.offset().top < $sel.find('ul').outerHeight())
                $sel.find('ul').addClass('wd-select-top');
            else
                $sel.find('ul').removeClass('wd-select-top');
            //Toggle our Box
            $sel.find('ul').toggle();
            $sel.toggleClass('wd-open');
        });
        $currentContainer.on("click.wdm.option", "li", function(e) { 
            //Dont Trigger General Select
            e.stopPropagation();
            //Update Selected Text
            var $li = $(this); 
            var $currentContainer = $li.parents('.wdm-select-container');
            var $currentlySelected = $currentContainer.find('span.selected');
            if($li.attr('disabled'))
                return false;
            $li.addClass('z-crt').siblings('li').removeClass('z-crt');
            $currentlySelected.text($li.text());
            //Toggle our Dropdown
            $li.parents('ul').toggle();
            $li.parents('.wdm-select-container').toggleClass('wd-open');
            //Set Select Selected
            var $select = $currentContainer.find('select');
            $select.val($li.attr('value')).change(); //Make sure you trigger the change event
        }); 
        //If an element is added after init
        $el.on("DOMNodeInserted", function (e) {
            //Add to List if it's an Option Tag
            var $option =  $(e.target); 
            if ($option.is('option')) {
                var $wrapper = $("<li></li>");
                var attributes = $option.prop("attributes"); 
                $wrapper.prop("attributes", attributes);
                $.each(attributes, function(index, attribute) {
                    $wrapper.attr(attribute.name, attribute.value);
                }); 
                $wrapper.append($option.text());
                $currentList.append($wrapper); 
            }   
        });
        //If an element is removed after init
        $el.on("DOMNodeRemoved", function (e) {
            //Remove from List if it's Option Tag
            var $option =  $(e.target);
            if ($option.is('option')) {
                $currentList.find("li:contains('"+$option.text()+"')").remove();
            }
        });
        $('body').click(function(e){
            if(!$(e.target).closest('.wdm-select-container').length){
                $(".wdm-select-container").removeClass('wd-open').find('ul').hide();
            }
        });
      });
   }
})(jQuery);

$(function(){
    // 下拉菜单
    $('.wd-dropdown-trigger').wdPopover();
    // tab标签切换
    $('.wdm-tab').find('li.z-crt').each(function(index, el) {
        try{
            $($(this).children('a').attr('href')).show();
        }catch(e){
            return false;
        }
    });
    $('.wdm-tab').on('click','li',function(){
        if($(this).hasClass('z-dis'))
            return false;
        else{
            var crtId = $(this).closest('.wdm-tab').find('li.z-crt').children('a').attr('href'),
                thisId = $(this).children('a').attr('href');
            $(this).addClass('z-crt').siblings('li').removeClass('z-crt');
            try{
                $(crtId).hide();
                $(thisId).show();
                return false;
            }catch(e){
                return false;
            }
        }
    });
});

var rules = {
    required:function(obj){
        return obj.val()==''? false : true;
    },
    maxVal:function(obj){
        var value = obj.attr('data-max');
        return obj.val()<=parseInt(value);
    }

}

var validateFun = function(obj){
    this.obj = obj;
    this.validate = function(){
        this.obj.find('.required').each(function(){
            console.log($(this).attr('data-rules'));
            var _this = $(this);
            var rulesObj = {};
            var item = $(this).attr('data-rules').split(',');
            for(var i = 0; i<item.length; i++){
                var rule = item[i].split(':');
                console.log(rule);
                rulesObj[rule[0]] = rule[1];
            }
            console.log(rulesObj);
            for(var i in rulesObj){
                console.log(rules[i](_this));
                if(rules[i](_this)){
                    _this.removeClass('error');
                    if(_this.parent().find('.errorText').length)
                        _this.parent().find('.errorText').remove();
                }
                else{
                    _this.addClass('error');
                    if(!_this.parent().find('.errorText').length)
                    $('<span class="errorText"></span>').text(rulesObj[i]).appendTo(_this.parent());
                    break;
                }
            }


        });
        console.log(this.obj.find('.error').length);

        return this.obj.find('.error').length ? false : true;
    }
}