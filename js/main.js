
const $ = e => document.querySelector(e);
const $$ = e => [...document.querySelectorAll(e)];

window.addEventListener('load', e => {
	const canvas = $('#canvas');
	const ctx = canvas.getContext('2d');
	const vertices = [];
	const edges = [];
	let selectedVertex = null;
	let mode = 'create-vertices';
	
	['create-vertices', 
		'delete-vertices',
		'create-edges', 
		'move-vertices'].forEach(mod => {
			$('#' + mod).addEventListener('input', e => {
			mode = mod;
		});
	});

	canvas.addEventListener('click', e => {
		const p = {x: e.offsetX, y: e.offsetY};
		if (mode == 'create-vertices') {
			vertices.push(new Vertex(p));
		} else if (mode == 'delete-vertices') {
			for (let i=0; i<vertices.length; i++) {
				const v = vertices[i];
				if (dist(v.center, p) < 5) {
					vertices.splice(i, 1);
					break;
				}
			}
		} else if (mode == 'create-edges') {
			let vs = null;
			for (let i=0; i<vertices.length; i++) {
				const v = vertices[i];
				if (dist(v.center, p) < 5) {
					vs = v;
					break;
				}
			}
			if (vs != null) {
				if (selectedVertex == null) {
					selectedVertex = vs;
				} else {
					edges.push([selectedVertex, vs]);
					selectedVertex = null;
				}
			}
		}
		repaint();
	});

	canvas.addEventListener('mousedown', e => {
		if (mode == 'move-vertices') {
			const p = {x: e.offsetX, y: e.offsetY};
			let vs = null;
			for (let i=0; i<vertices.length; i++) {
				const v = vertices[i];
				if (dist(v.center, p) < 5) {
					vs = v;
					break;
				}
			}
			if (vs != null) {
				selectedVertex = vs;
				selectedVertex.from = p;
			}
			repaint();
		}
	});

	canvas.addEventListener('mousemove', e => {
		if (mode == 'move-vertices' && selectedVertex != null) {
			const p = {x: e.offsetX, y: e.offsetY};
			selectedVertex.center = add(sub(p, selectedVertex.from), selectedVertex.center);
			selectedVertex.from = p;
			repaint();
		}
	});
	
	canvas.addEventListener('mouseup', e => {
		if (mode == 'move-vertices' && selectedVertex != null) {
			selectedVertex = null;
		}
	});
	
	canvas.addEventListener('mouseout', e => {
		if (mode == 'move-vertices' && selectedVertex != null) {
			selectedVertex = null;
		}
	});

	function repaint() {
		ctx.fillStyle = 'white';
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		vertices.forEach(v => {
			v.draw(ctx, selectedVertex);
		});
		edges.forEach(e => {
			const v1c = e[0].center;
			const v2c = e[1].center;
			ctx.beginPath();
			ctx.moveTo(v1c.x, v1c.y);
			ctx.lineTo(v2c.x, v2c.y);
			ctx.stroke();
		});
	}
});

function fillCircle(ctx, c, r, color) {
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.arc(c.x, c.y, r, 0, 2*Math.PI);
	ctx.closePath();
	ctx.fill();
}

function drawText(ctx, text, p, color, font, stroke) {
	ctx.save();
	if (font) ctx.font = font;
	const tm = ctx.measureText(text);
	ctx.fillStyle = color;
	if (p.ljust) 
		ctx.fillText(text, p.x, p.y);
	else if (p.rjust)
		ctx.fillText(text, p.x-tm.width, p.y);
	else
		ctx.fillText(text, p.x-tm.width/2, p.y);
	if (stroke) {
		ctx.strokeStyle = stroke;
		ctx.lineWidth = 1;
		ctx.strokeText(text, p.x-tm.width/2, p.y);
	}
	ctx.restore();
	return tm;
}

function add(a, b) {
	return {x: a.x+b.x, y: a.y+b.y};
}

function mul(a, val) {
	return {x: a.x*val, y: a.y*val};
}

function sub(a, b) {
	return add(a, mul(b, -1));
}

function dist(a, b) {
	return Math.sqrt(Math.pow(a.x-b.x, 2) + Math.pow(a.y-b.y, 2));
}

let numVertices = 0;

class Vertex {
	constructor(center) {
		this.center = center;
		this.id = numVertices++;
	}

	draw(ctx, selected) {
		const color = this == selected ? 'red' : 'black';
		fillCircle(ctx, this.center, 5, color);
		drawText(ctx, this.id, {x: this.center.x, y: this.center.y-10}, 'black', '12px sans', null);
	}
}
