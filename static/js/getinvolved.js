//#region Constants

//#endregion

//#region Initialization

//#endregion

//#region Functions
function expandDiv(obj) {
    var x = document.getElementById(obj);
    var y = document.getElementById('label' + obj);
    if (x.style.display == "block") {
      x.style.display = "none";
      y.innerHTML = "+";
    } else {
      x.style.display = "block";
      y.innerHTML = "-";
    }
  }
//#endregion