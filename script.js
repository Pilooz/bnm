var urlcourante = document.location.href;  

// Supprimons l'éventuel dernier slash de l'URL
var urlcourante = urlcourante.replace(/\/$/, "");
var queue_url = urlcourante.substring (urlcourante.lastIndexOf( "/" )+1 );


const url = new URL(window.location.href);
const searchParams = new URLSearchParams(url.search);

const id = url.hash.split("#")[1];
console.log(url)
console.log(id)


// var urlFixe = "https://bnwwkshop.glitch.me/"
var urlFixe = "http://localhost:3001/"
document.getElementById("lien-bq").href = urlFixe + id;
document.getElementById("lien-hq").href = urlFixe + id;




///sticky header /// 

window.onscroll = function() {myFunction()};


var fix = document.getElementById("myFix");



var sticky = fix.offsetTop;
function myFunction() {
  if (window.pageYOffset > sticky) {
    fix.classList.add("sticky");
  } else {
    fix.classList.remove("sticky");

  }
} 

///// return button lecteur //// 
document.getElementById("go-back").addEventListener("click", () => {
  history.back();
});