console.log("Hello from dashboard js")

const balance = document.querySelector("#balance")
const button = document.getElementById("payout")



function checkBalance(balance) {
    let num = parseInt(balance.innerHTML)
    if (num === 0) {
        button.innerHTML = "Disabled"
        button.disabled = true;
    } else {
        button.disabled = false
    }
}

checkBalance(balance)