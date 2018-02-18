$(document).ready(() => {
  $(".button-collapse").sideNav();
  $("select").material_select();
});

CKEDITOR.replace("body", {
  plugins: "wysiwygarea,toolbar,basicstyles,link"
});

document.getElementById("textbox")
.addEventListener("keyup", function (event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        document.getElementById("submit").click();
    }
});

function buttonCode()
