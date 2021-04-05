; "use strict";

{
    window.closeDialog = function(reset) {
        top.closeDialog(reset);
    }

    window.addEventListener("keydown", function (e) {
        switch (e.key) {
        case "Escape":
            closeDialog();
            
            break;
        }
    });

    document.getElementById("close").onclick = e => closeDialog();
}