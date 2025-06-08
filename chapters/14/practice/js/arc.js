const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

ctx.fillStyle = "red";
ctx.beginPath();
ctx.arc(120, 100, 50, (Math.PI / 180) * 270, (Math.PI / 180) * 90, true);
ctx.closePath();
ctx.fill();

ctx.beginPath();
ctx.arc(200, 100, 50, (Math.PI / 180) * 90, (Math.PI / 180) * 270, false);
ctx.closePath();
ctx.stroke();
