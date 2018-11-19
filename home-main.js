
var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var panel = this.nextElementSibling;
    if (panel.style.maxHeight){
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    } 
  });
}






let button1 = document.getElementById('myButton1');
let button2 = document.getElementById('myButton2');
let button3 = document.getElementById('myButton3');


button1.addEventListener('click', changeText);
button2.addEventListener('click', changeText);
button3.addEventListener('click', changeText);


function changeText() {
    if (this.innerHTML === 'Read More'){
        this.innerHTML = 'Read Less';
    }  else {
        this.innerHTML = 'Read More';
    }
}






