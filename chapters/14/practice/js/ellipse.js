const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

ctx.strokeStyle = "blue";
ctx.scale(0.7, 1);
ctx.beginPath();
ctx.arc(200, 150, 50, 0, Math.PI * 2, true);
ctx.stroke();
ctx.closePath();
