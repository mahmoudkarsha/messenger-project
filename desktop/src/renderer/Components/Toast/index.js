import "../../Assets/css/toast.css";

export const toast = function (header) {
  let toastContainerElement = document.getElementById("toast-container");
  if (!toastContainerElement) {
    toastContainerElement = document.createElement("div");
    toastContainerElement.id = "toast-container";
    document.querySelector("body").append(toastContainerElement);
  }

  const toastDiv = document.createElement("div");

  toastDiv.classList.add("toast");
  toastDiv.innerHTML = header;

  toastContainerElement.append(toastDiv);

  setTimeout(() => {
    toastDiv.remove();
  }, 2900);
};
