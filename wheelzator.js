			function wheelzator(_originObject, _openOptions, _config) {
				function v(stuff) {
					if (false) {console.log(stuff);}
				}

				function pif(param, defaults) { // get Param If not Undefined (otherwise get default)
					if (typeof param == "undefined")
						return defaults;
					else
						return param;
				}
				v("_originObject"); v(_originObject);
				v("_openOptions"); v(_openOptions);
				v("_config"); v(_config);

				// --------------------------------- helping functions ---------------------------
/**
 * Returns a value overlapped inside min and max. performs a loop as if wrapping the value STEP times.
 * @param Number value - the value to be wrapped.
 * @param Number min - the floor
 * @param Number max - the roof
 * @param Number [step] - optional, defaults to max+1. how much to remove/add if beyond min/max.
 * @throws Error if a infinite loop happens
 * @returns Number the wrapped value.
 */
function wrapWithin(value, min, max, step) {
    if (step == undefined) step = max+1;
    var counter = 0;
    while (value > max) {
        value -= step;
        counter++;
        if (counter > 10000) { throw "Infinite loop at Wrap Within: MIN="+min+", MAX="+max+", STEP="+step+"."; }
    }
    counter = 0;
    while (value < min) {
        value += step;
        counter++;
        if (counter > 10000) { throw "Infinite loop at Wrap Within: MIN="+min+", MAX="+max+", STEP="+step+"."; }
    }
    return value;
}
function wrap360(value) {
    return wrapWithin(value,0,359);
}
function rad2deg(val) { return val * 180/Math.PI }
function deg2rad(val) { return val * Math.PI/180; }
/**
 * Returns the distance between 2 points
 * @param number x1
 * @param number x2
 * @param number x3
 * @param number x4
 * @returns float distance
 */
function pointDistance(x1,y1, x2,y2) {
    return Math.sqrt( (x1-x2)*(x1-x2) + (y1-y2)*(y1-y2) );
}

/**
 * Returns the angle between 2 points
 * @param number x1
 * @param number x2
 * @param number x3
 * @param number x4
 * @returns float angle
 */
function pointAngle(x1,y1,x2,y2) {
    return rad2deg(Math.atan2(-(y1-y2), x2-x1))+180;
}
				// --------------------------------- End of helping functions ---------------------------

				if(typeof _originObject == "undefined" || jQuery(_originObject).length == 0) {
					console.error("Origin Object not found: "+_originObject);
					return;
				}
				if(_openOptions.length == 0) {
					console.error("No options to open wheel", _openOptions);
					return;
				}
				if (typeof _config == "undefined") {
					_config = {};
				}


				if (typeof _originObject == "string") {
					_originObject = $(_originObject);
				}
				$(_originObject).html("");

				// --------------- defaults --------------- 
				var config = {

					minDistance : parseInt(pif(_config.minDistance,"20")),
					maxDistance : parseInt(pif(_config.maxDistance,"90")),
					optionDistance : parseInt(pif(_config.optionDistance,"60")),
					offsetAngle : parseInt(pif(_config.offsetAngle,"90")),
					offsetCalcAngle : parseInt(pif(_config.offsetCalcAngle,"-15")),

					onOpen : pif(_config.onOpen,function() {
						console.log("Wheelzator Opened");
					}),
					onClose : pif(_config.onClose,function() {
						console.log("Wheelzator Closed");
					}),
					onSelect : pif(_config.onSelect,function(data) {
						console.log("Wheelzator -- selected option "+data.index+" with value "+data.value);
					}),
					onDeselect : pif(_config.onDeselect,function() {
						console.log("Deselected");
					}),
				}
				var openOptions = [];
				for(var i=0; i<_openOptions.length; i++) {
					var _option = _openOptions[i];
					openOptions.push({
						icon:pif(_option.icon,"star"),
						value:pif(_option.value,i),
						title:pif(_option.title,"Option "+i),
					});
				}

				v("config"); v(config);
				v("openOptions"); v(openOptions);

				// --------------- building html --------------- 
				var wheelContainer = $("<div></div>");
				wheelContainer.addClass('wheel-container');

				var wheelInner = $("<div></div>");
				wheelInner.addClass('wheel-inner');
				wheelInner.css({
					width:(config.maxDistance*2)+"px",
					height:(config.maxDistance*2)+"px",
					top:(-config.maxDistance)+"px",
					left:(-config.maxDistance)+"px",
					"box-sizing":"border-box",
					padding:(config.maxDistance-1)+"px",
				});

				wheelInner.appendTo(wheelContainer);

				var wheelCenter = $("<div></div>");
				wheelCenter.addClass("wheel-center");
				wheelCenter.appendTo(wheelContainer);

				var wheelCenterIcon = $("<i></i>");
				wheelCenterIcon.addClass("fa");
				wheelCenterIcon.appendTo(wheelCenter);

				var angleBetweenOptions = 360/openOptions.length ;
				v("angleBetweenOptions"); v(angleBetweenOptions);

				for(var i=0; i<openOptions.length; i++) {
					var option = openOptions[i];

					var optionContainer = $("<div></div>");
					optionContainer.addClass('wheel-option-container');

					var optionInner = $("<a></a>");
					//optionInner.attr("href","#");
					optionInner.attr("title",option.title);
					optionInner.attr("data-icon",option.icon);
					optionInner.addClass('wheel-option');
					optionInner.addClass('icon-'+option.icon);
					optionInner.addClass('option-index-'+(i+1));
					optionInner.attr("data-val",option.value);

					var optionIcon = $("<i></i>");
					optionIcon.addClass("fa");
					optionIcon.addClass("fa-"+option.icon);

					optionIcon.appendTo(optionInner);
					optionInner.appendTo(optionContainer);
					optionContainer.appendTo(wheelInner);

					var optionDistance = config.optionDistance;
					var optionContainerPosition = {
						x:Math.round((Math.sin(deg2rad(angleBetweenOptions*(i+1)+config.offsetAngle) ))*optionDistance),
						y:Math.round((Math.cos(deg2rad(angleBetweenOptions*(i+1)+config.offsetAngle) ))*optionDistance),
					}
					optionContainerPosition.x+=config.maxDistance;
					optionContainerPosition.y+=config.maxDistance;

					v([i,angleBetweenOptions,optionDistance,optionContainerPosition.x, optionContainerPosition.y]);
					openOptions[i].htmlObj = optionContainer;

					optionContainer.css({
						top:optionContainerPosition.x,
						left:optionContainerPosition.y,
					});

				}

				// --------------- behavior functions ---------------

				var wcObj = {};
				wcObj.config = config;
				wcObj.openOptions = openOptions;
				wcObj.position = wheelContainer.offset();
				wcObj.nOptions = openOptions.length;
				wcObj.originObject = _originObject;
				wcObj.wheelContainer = wheelContainer;
				wcObj.setValue = function(value){
					for (var i=0; i<this.nOptions; i++){
						if (this.openOptions[i].value == value) {
							this.setIndex(i+1);
							return this;	
						}
					}
					console.log("wheelzator setValue() value: ",value);
					console.error("No option found with this value");
				}
				wcObj.setIndex = function(objIndex) {
					if (objIndex < 1 || objIndex > this.nOptions) {
						console.error("Index beyond wheelzator options (requested setIndex("+objIndex+"), maximum "+this.nOptions+". Obs.: starts in 1 not 0.");
						return;
					}
					var iconString = this.openOptions[objIndex-1].htmlObj.find("a").attr("data-icon")
					var centerIcon = this.wheelContainer.find(".wheel-center .fa")
					centerIcon.attr("class","fa");
					centerIcon.addClass("fa-"+iconString);

					this.wheelContainer.attr("data-selected",objIndex);
					this.wheelContainer.attr('data-icon',iconString);
					return this;
				}
				wcObj.deselect = function () {
					this.wheelContainer.find(".wheel-center .fa").attr("class","fa");
					$(this.wheelContainer).removeClass('in');
					$(this.wheelContainer).attr('data-selected','');
					$(this.wheelContainer).attr('data-icon','');
					return this;
				}
				wcObj.getValue = function() {
					return $(this.wheelContainer.attr("data-value"));
				}

				wcObj.getIndex = function() {
					return $(this.wheelContainer.attr("data-selected"));
				}


				wheelContainer.on("mousedown",function(e) {
					if (this.wheelContainer.is(".in")) {
						return;
					}
					this.wheelContainer.addClass('in');
					this.wheelContainer.attr('data-clickstart',new Date().getTime());
					this.config.onOpen();
					wcObj.position = wheelContainer.offset();

				}.bind(wcObj) )
				$(document).on("mousemove",function(e) {
					if (!this.wheelContainer.is(".in")) return;
					var angle = pointAngle(
						this.position.left+25,
						this.position.top+25,
						e.pageX,
						e.pageY);
					var distance = pointDistance(
						this.position.left+25,
						this.position.top+25,
						e.pageX,
						e.pageY);

					if (distance > this.config.maxDistance*2){
						this.deselect();
						this.config.onDeselect();
						this.config.onClose();
						return;
					}
					if (distance < this.config.minDistance+20 || distance > this.config.maxDistance+20) {
						this.wheelContainer.find(".wheel-center .fa").attr("class","fa");
						$(this.wheelContainer).attr('data-selected','');
						$(this.wheelContainer).attr('data-icon','');
						return;
					}
					//console.log(distance)

					angle = wrap360(angle + this.config.offsetAngle + this.config.offsetCalcAngle);
					var objIndex = Math.round(angle/(360/this.nOptions-1));
					objIndex = wrapWithin(objIndex,1,this.nOptions-1);
					v([this.position.left,
						this.position.top,
						e.pageX,
						e.pageY])

					//console.log(objIndex,this.nOptions)
					this.setIndex(objIndex);
					// apply classes
					// make css selector to these classes
				}.bind(wcObj) )
				$(document).on("mouseup",function(e) {
					if (!this.wheelContainer.is(".in")) return;

					//console.log(new Date().getTime() - parseInt(this.wheelContainer.attr("data-clickstart")))
					if (new Date().getTime() - parseInt(this.wheelContainer.attr("data-clickstart")) < 400 ) {
						return;
					}

					$(this.wheelContainer).removeClass('in');

					var angle = pointAngle(
						this.position.left+25,
						this.position.top+25,
						e.pageX,
						e.pageY);
					var distance = pointDistance(
						this.position.left+25,
						this.position.top+25,
						e.pageX,
						e.pageY);

					if (distance < this.config.minDistance+20 || distance > this.config.maxDistance+20) {
						this.deselect();
						this.config.onDeselect();
						this.config.onClose();
						return;
					}
					
					angle = wrap360(angle + this.config.offsetAngle + this.config.offsetCalcAngle);
					var objIndex = Math.round(angle/(360/this.nOptions-1));
					objIndex = wrapWithin(objIndex,1,this.nOptions-1);
					v([this.position.left,
						this.position.top,
						e.pageX,
						e.pageY])
					v([angle,this.config.offsetAngle,angle+this.config.offsetAngle,this.nOptions,(360/this.nOptions),Math.round((angle + this.config.offsetAngle)/(360/this.nOptions))])
					v(this.openOptions)

					this.setIndex(objIndex);
					
					this.config.onSelect({
						index:objIndex,
						value:this.openOptions[objIndex-1].htmlObj.find("a").attr("data-val"),
						target:this.openOptions[objIndex-1].htmlObj,
						wheelContainer:this.wheelContainer,
						originObject:this.originObject,
					});
					this.config.onClose();


    				e.stopImmediatePropagation();
    				e.preventDefault();
    				return false;
				}.bind(wcObj) )

				wheelContainer.appendTo(_originObject);

				return wcObj;
			}