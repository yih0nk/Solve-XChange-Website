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

function showSidebar(){
  const sidebar = document.querySelector('.sidebar');
  sidebar.style.display = 'flex';
}

function hideSidebar(){
  const sidebar = document.querySelector('.sidebar');
  sidebar.style.display = 'none';
}