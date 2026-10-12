const btnsToggle = document.querySelectorAll(".btn-toggle");
const infoSection = document.querySelector(".info-section");

btnsToggle.forEach((btn) => {
  btn.addEventListener("click", () => {
    infoSection.classList.toggle("invertido");
  });
});
