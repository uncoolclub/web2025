const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

ctx.beginPath();
ctx.moveTo(80, 100);
ctx.lineTo(260, 100);
ctx.lineTo(120, 250);
ctx.lineTo(170, 30);
ctx.lineTo(220, 250);
ctx.lineTo(80, 100);
ctx.closePath();

ctx.fillStyle = "yellow";
ctx.fill();
ctx.stroke();
