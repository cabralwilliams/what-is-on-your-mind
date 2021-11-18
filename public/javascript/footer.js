const myThoughts = ["Alex Ovechkin's Chase for 895","The Theory of Relativity","Schrodinger's Cat - Is it Dead?","Schrodinger's Cat - Is it Alive?","Is there an Anti-Matter Me Somewhere?","Why People Get Excited about Billionaires Going to 'Space'","Does Anti-Matter Me Play an Anti-Matter PlayStation 4?"];

const my_mind = document.querySelector("#my_mind");

my_mind.innerHTML = myThoughts[Math.floor(Math.random()*myThoughts.length)];