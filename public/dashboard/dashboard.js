console.log("Hello from dashboard js")

const balance = document.querySelector("#balance")
const button = document.getElementById("payout")
// console.log(button)



function checkBalance(balance) {
    let num = parseInt(balance.innerHTML)
    console.log(num)
    if (num === 0) {
        console.log(1)
        button.innerHTML = "Disabled"
        button.disabled = true;
    } else {
        console.log(2)
        button.disabled = false
    }
}

checkBalance(balance)
// console.log(typeof balance.innerHTML)