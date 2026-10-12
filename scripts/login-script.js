const toggleButtons = document.querySelectorAll(".btn-toggle");
const infoSection = document.querySelector(".info-section");

toggleButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    infoSection.classList.toggle("inverted");
  });
});
