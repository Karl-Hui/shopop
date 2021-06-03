let removeCartItemButtons = document.querySelectorAll(".close");
// console.log(removeCartItemButtons);

for (let i = 0; i < removeCartItemButtons.length; i++) {
  let button = removeCartItemButtons[i];
  button.addEventListener("click", (event) => {
    let buttonClicked = event.target;
    console.log(buttonClicked);
    buttonClicked.parentElement.parentElement.parentElement.remove();
  });
}
