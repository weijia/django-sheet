/**
 * jQuery.sheet's default formula engine
 * @namespace
 * @memberOf jQuery.sheet
 * @alias jQuery.sheet.engine
 */
var jSE = $.sheet.engine = {
	/**
	 * Calculate a spreadsheet
	 * @param {Number} sheet
	 * @param {Array} spreadsheet [row][cell], [1][1] = SHEET1!A1
	 * @param {Function} ignite function to run on every cell
	 * @memberOf jSE
	 */
	calc:function (sheet, spreadsheet, ignite) {
		spreadsheet = spreadsheet || [];

		var rowIndex = spreadsheet.length - 1,
			row,
			colIndex,
			cell;

		if (rowIndex > 0) {
			do {
				if (rowIndex > 0 && spreadsheet[rowIndex]) {
					row = spreadsheet[rowIndex];
					colIndex = row.length - 1;
					if (colIndex > 0) {
						do {
							cell = row[colIndex];
							cell.updateValue();
						} while (colIndex-- > 1);
					}
				}
			} while(rowIndex-- > 1);
		}
	},

	/**
	 * Parse a cell name to it's location
	 * @param {String} columnStr "A"
	 * @param {String|Number} rowString "1"
	 * @returns {Object} {row: 1, col: 1}
	 * @memberOf jQuery.sheet.engine
	 */
	parseLocation:function (columnStr, rowString) {
		return {
			row: parseInt(rowString),
			col: jSE.columnLabelIndex(columnStr)
		};
	},

	/**
	 * Parse a sheet name to it's index
	 * @param {String} locStr SHEET1 = 0
	 * @returns {Number}
	 * @memberOf jQuery.sheet.engine
	 */
	parseSheetLocation:function (locStr) {
		var sheetIndex = ((locStr + '').replace(/SHEET/i, '') * 1) - 1;
		return isNaN(sheetIndex) ? -1 : sheetIndex ;
	},

	/**
	 *
	 * @param {Number} col 1 = A
	 * @param {Number} row 1 = 1
	 * @returns {String}
	 * @memberOf jQuery.sheet.engine
	 */
	parseCellName:function (col, row) {
		return jSE.columnLabelString(col) + (row || '');
	},

	/**
	 * Available labels, used for their index
	 * @memberOf jQuery.sheet.engine
	 */
	alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
	/**
	 * Available labels, used for their index
	 * @memberOf jQuery.sheet.engine
	 */
	columnLabels: {},
	/**
	 * Get index of a column label
	 * @param {String} str A to 1, B to 2, Z to 26, AA to 27
	 * @returns {Number}
	 * @memberOf jQuery.sheet.engine
	 */
	columnLabelIndex:function (str) {
		return this.columnLabels[str.toUpperCase()];
	},

	/**
	 * Available indexes, used for their labels
	 * @memberOf jQuery.sheet.engine
	 */
	columnIndexes:[],

	/**
	 * Get label of a column index
	 * @param {Number} index 1 = A, 2 = B, 26 = Z, 27 = AA
	 * @returns {String}
	 * @memberOf jQuery.sheet.engine
	 */
	columnLabelString:function (index) {
		if (!this.columnIndexes.length) { //cache the indexes to save on processing
			var s = '', i, j, k, l;
			i = j = k = -1;
			for (l = 1; l < 16385; ++l) {
				s = '';
				++k;
				if (k == 26) {
					k = 0;
					++j;
					if (j == 26) {
						j = 0;
						++i;
					}
				}
				if (i >= 0) s += this.alphabet[i];
				if (j >= 0) s += this.alphabet[j];
				if (k >= 0) s += this.alphabet[k];
				this.columnIndexes[l] = s;
				this.columnLabels[s] = l;
			}
		}
		return this.columnIndexes[index] || '';
	},

	/**
	 * Regular expressions cache
	 * @memberOf jQuery.sheet.engine
	 */
	regEx: {
		n: 				/[\$,\s]/g,
		cell: 			/(\$?[a-zA-Z]+|[#]REF[!])(\$?[0-9]+|[#]REF[!])/gi, //a1
		range: 			/(\$?[a-zA-Z]+)\$?([0-9]+):(\$?[a-zA-Z]+)(\$?[0-9]+)/gi, //a1:a4
		remoteCell:		/\$?(SHEET+)(\$?[0-9]+)[:!](\$?[a-zA-Z]+)(\$?[0-9]+)/gi, //sheet1:a1
		remoteCellRange:/\$?(SHEET+)(\$?[0-9]+)[:!](\$?[a-zA-Z]+)(\$?[0-9]+):(\$?[a-zA-Z]+)(\$?[0-9]+)/gi, //sheet1:a1:b4
		sheet:			/SHEET/i,
		amp: 			/&/g,
		gt: 			/</g,
		lt: 			/>/g,
		nbsp: 			/&nbsp;/g
	},

	/**
	 * Creates a chart, piggybacks g Raphael JS
	 * @param {Object} o options
	 * x: { legend: "", data: [0]}, //x data
	 * y: { legend: "", data: [0]}, //y data
	 * title: "",
	 * data: [0], //chart data
	 * legend: "",
	 * td: jS.getTd(this.sheet, this.row, this.col), //td container for cell
	 * chart: jQuery('<div class="' + jS.cl.chart + '" />') //chart
	 * @returns {jQuery|HTMLElement}
	 */
	chart:function (o) {
		var jS = this.jS,
			chart = document.createElement('div'),
			td = this.td,
			gR,
			body = document.body;

		body.appendChild(chart);

		function sanitize(v, toNum) {
			if (!v) {
				if (toNum) {
					v = 0;
				} else {
					v = "";
				}
			} else {
				if (toNum) {
					v = arrHelpers.toNumbers(v);
				} else {
					v = arrHelpers.flatten(v);
				}
			}
			return v;
		}

		o = $.extend({
			x:{ legend:"", data:[0]},
			y:{ legend:"", data:[0]},
			title:"",
			data:[0],
			legend:""
		}, o);

		chart.className = jS.cl.chart;
		chart.onmousedown = function () {
			$(td).mousedown();
		};
		chart.onmousemove = function () {
			$(td).mousemove();
			return false;
		};

		jS.controls.chart[jS.i] = jS.obj.chart().add(chart);

		o.data = sanitize(o.data, true);
		o.x.data = sanitize(o.x.data, true);
		o.y.data = sanitize(o.y.data, true);
		o.legend = sanitize(o.legend);
		o.x.legend = sanitize(o.x.legend);
		o.y.legend = sanitize(o.y.legend);

		o.legend = (o.legend ? o.legend : o.data);

		var width,
			height,
			r = Raphael(chart);

		if (td.clientHeight > 0) {
			width = Math.max(td.clientWidth, 100);
			height = Math.max(td.clientHeight, 50);
		}

		if (o.title) r.text(width / 2, 10, o.title).attr({"font-size":20});
		switch (o.type) {
			case "bar":
				gR = r.barchart(width / 8, height / 8, width * 0.8, height * 0.8, o.data, o.legend)
					.hover(function () {
						this.flag = r.popup(
							this.bar.x,
							this.bar.y,
							this.bar.value || "0"
						).insertBefore(this);
					}, function () {
						this.flag.animate({
								opacity:0
							}, 300,

							function () {
								this.remove();
							}
						);
					});
				break;
			case "hbar":
				gR = r.hbarchart(width / 8, height / 8, width * 0.8, height * 0.8, o.data, o.legend)
					.hover(function () {
						this.flag = r.popup(this.bar.x, this.bar.y, this.bar.value || "0").insertBefore(this);
					}, function () {
						this.flag.animate({
								opacity:0
							}, 300,
							function () {
								this.remove();
							}
						);
					});
				break;
			case "line":
				gR = r.linechart(width / 8, height / 8, width * 0.8, height * 0.8, o.x.data, o.y.data, {
					nostroke:false,
					axis:"0 0 1 1",
					symbol:"circle",
					smooth:true
				})
					.hoverColumn(function () {
						this.tags = r.set();
						if (this.symbols.length) {
							for (var i = 0, ii = this.y.length; i < ii; i++) {
								this.tags.push(
									r
										.tag(this.x, this.y[i], this.values[i], 160, 10)
										.insertBefore(this)
										.attr([
											{ fill:"#fff" },
											{ fill:this.symbols[i].attr("fill") }
										])
								);
							}
						}
					}, function () {
						this.tags && this.tags.remove();
					});

				break;
			case "pie":
				gR = r.piechart(width / 2, height / 2, (width < height ? width : height) / 2, o.data, {legend:o.legend})
					.hover(function () {
						this.sector.stop();
						this.sector.scale(1.1, 1.1, this.cx, this.cy);

						if (this.label) {
							this.label[0].stop();
							this.label[0].attr({ r:7.5 });
							this.label[1].attr({ "font-weight":800 });
						}
					}, function () {
						this.sector.animate({ transform:'s1 1 ' + this.cx + ' ' + this.cy }, 500, "bounce");

						if (this.label) {
							this.label[0].animate({ r:5 }, 500, "bounce");
							this.label[1].attr({ "font-weight":400 });
						}
					});
				break;
			case "dot":
				gR = r.dotchart(width / 8, height / 8, width * 0.8, height * 0.8, o.x.data, o.y.data, o.data, {
					symbol:"o",
					max:10,
					heat:true,
					axis:"0 0 1 1",
					axisxstep:o.x.data.length - 1,
					axisystep:o.y.data.length - 1,
					axisxlabels:(o.x.legend ? o.x.legend : o.x.data),
					axisylabels:(o.y.legend ? o.y.legend : o.y.data),
					axisxtype:" ",
					axisytype:" "
				})
					.hover(function () {
						this.marker = this.marker || r.tag(this.x, this.y, this.value, 0, this.r + 2).insertBefore(this);
						this.marker.show();
					}, function () {
						this.marker && this.marker.hide();
					});

				break;
		}

		gR.mousedown(function () {
			$(td).mousedown().mouseup();
		});

		body.removeChild(chart);

		return chart;
	}
};