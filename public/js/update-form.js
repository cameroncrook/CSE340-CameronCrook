

const form = document.querySelector("#updateForm")
    form.addEventListener("change", function () {
      const updateBtn = document.querySelector(".add-form__submit")
      updateBtn.removeAttribute("disabled")
    })