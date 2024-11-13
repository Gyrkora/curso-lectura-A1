import { h5ps_cap1 } from "../api/internal-h5ps.js";

function openSmallWindow(siteKey) {
    const url = h5ps_cap1[siteKey];
    if (url) {
        window.open(url, "_blank", "width=650,height=700");
    } else {
        console.error(`URL for "${siteKey}" not found.`);
    }

   
}

window.openSmallWindow = openSmallWindow;
