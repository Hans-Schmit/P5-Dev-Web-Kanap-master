/**
 * start - get the orderId from the url and display it in the page
 */
const start = () => {
    document.querySelector("#orderId").textContent = new URL(window.location.href).searchParams.get("orderId")
}

// Wait for DOM release
window.addEventListener('load', start())