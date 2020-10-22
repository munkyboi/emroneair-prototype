
// ============================================================
// ============================================================
// ============================================================
// ============================================================
// ========	       UTILITY SCRIPTS FOR F8PHOTO        =========
// ============================================================
// ============================================================
// ============================================================
// ============================================================

// ADD COMMAS
const addCommas = function(nStr) {
  nStr += '';
  x = nStr.split('.');
  x1 = x[0];
  x2 = x.length > 1 ? '.' + x[1] : '';
  var rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
      x1 = x1.replace(rgx, '$1' + ',' + '$2');
  }
  return x1 + x2;
}

// MOBILE VIEW CHECK
let isMobileView = false
const checkIfMobileView = function() {
  isMobileView = $(window).width() <= 786
  // console.log('isMobileView', isMobileView)
  return isMobileView
}

// RANDOM RANGE
function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

// GET URL PARAMS
function getParameterByName(name, url) {
	if (!url) url = window.location.href;
	name = name.replace(/[\[\]]/g, '\\$&');
	var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
		results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

// PRECISE ROUNDING
function round(value, precision) {
	var multiplier = Math.pow(10, precision || 0);
	return Math.round(value * multiplier) / multiplier;
}

// SHUTTER EFFECT
const $shutter_bodies = $('.quickview-transition #bodies');
const $shutter_edges = $('.quickview-transition #edges');
const shutter_count = 8;
const shutter_rotate = 80;
const shutter_count_inc = 0.025
const shutter_loop_delay = 5
let shutter_arc = (x,y,s) => `A${shutter_rotate},${shutter_rotate},0,0,${s},${x},${y}`;
let shutter_path = (i,d) => `<path transform='rotate(${i/+shutter_count*360})' ${d} fill='url(#grad1)'></path>`;
let shutter_interval = 0

const updateShutter = (val) => {
	let step = Math.PI*(0.5 + 2/+shutter_count);
	let p1x = Math.cos(step)*shutter_rotate; 
	let p1y = Math.sin(step)*shutter_rotate;
	let cos = Math.cos(-val);
	let sin = Math.sin(-val);
	let c1x = p1x - cos * p1x - sin * p1y;
	let c1y = p1y - cos * p1y + sin * p1x;
	let dx = - sin * shutter_rotate - c1x;
	let dy = shutter_rotate - cos * shutter_rotate - c1y;
	let dc = Math.sqrt(dx*dx + dy*dy);
	let a = Math.atan2(dy, dx) - Math.acos(dc/2/shutter_rotate);
	let x = c1x + Math.cos(a)*shutter_rotate;
	let y = c1y + Math.sin(a)*shutter_rotate;

	let edge = `M${p1x},${p1y}${shutter_arc(0,shutter_rotate,0)}${shutter_arc(x,y,1)}`;
	$shutter_edges.html('')
	$shutter_bodies.html('')
	for (let i = 0; i < +shutter_count; i++) {
		$shutter_edges.html($shutter_edges.html() + shutter_path(i, `fill='none' stroke-width='0.1px' stroke='#c9c9c9' d='${edge}'`));
		$shutter_bodies.html($shutter_bodies.html() + shutter_path(i, `d='${edge}${shutter_arc(p1x,p1y,0)}'`)); 
	}
}

const shutterClose = (isNew) => {
	clearInterval(shutter_interval)
	let count = 0
	if (isNew) {
		updateShutter(1.05)
	} else {
	shutter_interval = setInterval(() => {
		count += shutter_count_inc
		updateShutter(count)
		if (count >= 1.05) {
		clearInterval(shutter_interval)
		}
	}, shutter_loop_delay)
	}
}

const shutterOpen = () => {
	clearInterval(shutter_interval)
	let count = 1.05
	shutter_interval = setInterval(() => {
	count -= shutter_count_inc
	updateShutter(count)
	if (count <= shutter_count_inc) {
		clearInterval(shutter_interval)
	}
	}, shutter_loop_delay)
}

const getProductData = (id) => {
	let result = false
	$.getJSON('js/products.json', (data) => {
		$.each(data, (i,e) => {
			if (data[i].id === id) {
				result = data[i]
			}
		})
		return result
	})
}