;(function($){
	var Carousel = function(poster){
		//保存this，使this一直指向poster
		var self=this;

		//保存单个旋转木马对象poster
		this.poster=poster;
		this.posterItemMain=poster.find("ul.poster-list");
		this.nextBtn = poster.find("div.poster-next-btn");
		this.prevBtn = poster.find("div.poster-prev-btn");
		this.posterFirstItem = this.posterItemMain.find("li").eq(0);
		this.posterItems=poster.find("li.poster-item");
		this.posterLastItem=this.posterItems.last();
		
		//设置默认参数
		this.setting={
			"width":800,				//幻灯片的宽度
			"height":270,				//幻灯片的高度
			"posterWidth":640,			//幻灯片第一帧的宽度
			"posterHeight":270,			//幻灯片第一帧的高度
			"scale":0.9,				//幻灯片显示比例
			"speed":500,				//幻灯片
			"verticalAign":"middle"		//bottom top
		};
		//extend(dest,src1,src2,src3...);
		//判断是否没有有参数 没有则用默认参数代替
		$.extend(this.setting,this.getSetting());
		//console.log(this.getSetting());

		//设置配置参数值
		this.setSettingValue();
		this.setPosterPos();
		//要先保存好self 不可以直接用this
		this.nextBtn.click(function(){
			self.carouselRotate("left");
		});
		this.prevBtn.click(function(){
			self.carouselRotate("right");
		});
	};


	Carousel.prototype={
		carouselRotate:function(dir){
			var _this_  = this;
			var zIndexArr = [];//保存zindex
			//左旋转
			if(dir === "left"){
				this.posterItems .each(function(){
					var self = $(this),
						   prev = self.prev().get(0)?self.prev():_this_.posterLastItem,
						   width = prev.width(),
						   height =prev.height(),
						   zIndex = prev.css("zIndex"),
						   opacity = prev.css("opacity"),
						   left = prev.css("left"),
						   top = prev.css("top");
							zIndexArr.push(zIndex);	//push() 方法可向数组的末尾添加一个或多个元素，并返回新的长度。
						   self.animate({
							   					width:width,
												height:height,
												//zIndex:zIndex,
												opacity:opacity,
												left:left,
												top:top
												},_this_.setting.speed,function(){
													_this_.rotateFlag = true;
												});
				});
				//zIndex需要单独保存再设置，防止循环时候设置再取的时候值永远是最后一个的zindex
				this.posterItems.each(function(i){
					$(this).css("zIndex",zIndexArr[i]);
				});
			}else if(dir === "right"){//右旋转
				this.posterItems .each(function(){
					var self = $(this),
						   next = self.next().get(0)?self.next():_this_.posterFirstItem,
						   width = next.width(),
						   height =next.height(),
						   zIndex = next.css("zIndex"),
						   opacity = next.css("opacity"),
						   left = next.css("left"),
						   top = next.css("top");
						   zIndexArr.push(zIndex);	
						   self.animate({
							   					width:width,
												height:height,
												//zIndex:zIndex,
												opacity:opacity,
												left:left,
												top:top
												},_this_.setting.speed,function(){
													_this_.rotateFlag = true;
												});
	
				});
				//zIndex需要单独保存再设置，防止循环时候设置再取的时候值永远是最后一个的zindex
				this.posterItems.each(function(i){
					$(this).css("zIndex",zIndexArr[i]);
				});
			};
		},
		
		//设置剩余的帧的位置关系
		setPosterPos:function(){
			var self = this;
			var sliceItems = this.posterItems.slice(1);
			var sliceSize = sliceItems.size()/2;
			var	rightSlice=sliceItems.slice(0,sliceSize);
			//z-index
			var level = Math.floor(this.posterItems.size()/2);
			//左边剩余的帧数
			var leftSlice = sliceItems.slice(sliceSize);
			
		//设置右边帧的位置关系和宽高
		var rw=this.setting.posterWidth;
		var rh=this.setting.posterHeight;
		//右边显示出来的宽度
		var gap=((this.setting.width-this.setting.posterWidth)/2)/level;
		//第一张的left
		var firstLeft=(this.setting.width-this.setting.posterWidth)/2;
		var fixOffsetLeft=firstLeft+rw;
			//each循环
			rightSlice.each(function(i){
				level--;
				rw=rw*self.setting.scale;
				rh=rh*self.setting.scale;
				
				var j=i;
				$(this).css({
					zIndex:level,
					width:rw,
					height:rh,
					opacity:1/(++i),
					left:fixOffsetLeft+(++j)*gap-rw,
					top:self.setVertucalAlign(rh)//设置垂直对齐方法
					//(self.setting.height-rh)/2//第一帧高度减去自身的高度

				});

			});


			//设置左边帧的位置关系和宽高
			var lw=rightSlice.last().width();
			var lh=rightSlice.last().height();
			var oloop = Math.floor(this.posterItems.size()/2);
			leftSlice.each(function(i){
				$(this).css({
					zIndex:i,
					width:lw,
					height:lh,
					opacity:1/oloop,
					left:i*gap,
					top:self.setVertucalAlign(lh)
					//(self.setting.height-lh)/2//第一帧高度减去自身的高度

				});
				lw=lw/self.setting.scale;
				lh=lh/self.setting.scale;
				oloop--;

			});

		},
		//设置垂直排列对齐
		setVertucalAlign:function(height){
			var verticalType = this.setting.verticalAign;
			var top=0;
			if(verticalType === 'middle'){
				top=(this.setting.height-height)/2;
			}else if(verticalType === 'top'){
				top = 0;
			}else if(verticalType === 'bottom'){
				top = this.setting.height-height;
			}else{//当自定义出错时，居中
				top=(self.setting.height-height)/2;
			}
			return top;
		},
		//设置配置参数值去控制基本的宽度高度的方法
		setSettingValue:function(){
			this.poster.css({
				width:this.setting.width,
				height:this.setting.height
			});
			this.posterItemMain.css({
				width:this.setting.width,
				height:this.setting.height
			});
			//切换按钮的宽高
			var w=(this.setting.width-this.setting.posterWidth)/2;
			this.nextBtn.css({
				width:w,
				height:this.setting.height,
				zIndex:Math.ceil(this.posterItems.size()/2)
			});
			this.prevBtn.css({
				width:w,
				height:this.setting.height,
				zIndex:Math.ceil(this.posterItems.size()/2)
			});
			this.posterFirstItem.css({
				width:this.setting.posterWidth,
				height:this.setting.posterHeight,
				left:w,
				top:0,
				zIndex:Math.floor(this.posterItems.size()/2)

			});
		},


		//获取人工配置参数
		getSetting:function(){
			var setting = this.poster.attr("data-setting");
			//将setting转换为JSON对象 
			if(setting&&setting!=""){
				return $.parseJSON(setting);
			}else{
				return setting;
			}
			
		},
	};


	//初始化的方法 
	Carousel.init = function(posters){
		var _this_ =this;
		//处理集合 each循环
		posters.each(function(){
			new _this_($(this));
		});
	};
	window["Carousel"] = Carousel;
})(jQuery);