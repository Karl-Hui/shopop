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

let productData = [];

async function getSoldProduct() {
    async function fetchProduct() {
        const response = await fetch("/shop/api/getSoldCategory");
        const data = await response.json();
        // let arr = [];

        function pushToArr() {
            for (let key in data) {
                if (data.hasOwnProperty(key)) {
                    console.log(data[key])
                    productData.push(data[key])
                }
            }
        }
        await pushToArr()
        // productData = arr;
        // console.log("this is arr", arr)
    }
    await fetchProduct()
    // console.log("what is Product", productData)

    const ctx = document.getElementById('myChart').getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Tops', 'Bottom', 'Dresses', 'Outerwear', 'Shoes', 'Accessories', 'Others'],
            datasets: [{
                label: 'Product Category Sold',
                data: productData,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

getSoldProduct()

