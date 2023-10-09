const name = document.getElementById("name");
const infoForm = document.getElementById("a_info_form");
const planForm = document.getElementById("a_plan_form");
const addOnForm = document.getElementById("a_add_ons_form");

const inputField = document.querySelectorAll(".inputfield");
const radiofield = document.querySelectorAll(".radiofield");
const plansDiv = document.querySelector(".plans");
const durationCheckbox = document.querySelector(".checkbox");
const pricesEl = document.querySelectorAll(".price");
const freeEl = document.querySelectorAll(".free");
const monthlyPlan = document.querySelector(".month");
const yearlyPlan = document.querySelector(".year");
const addOncharges = document.querySelectorAll(".charge");
const selectedPlanContainer = document.querySelector(".finish_plan");
const addOnsCheckboxes = document.querySelectorAll(".add_ons_checkbox");
const aAddOnsForm = document.getElementById("a_add_ons_form");
const AddOnsContainer = document.querySelector(".finish_add_ons");
const Service = document.getElementById("service");
const totalPrice = document.querySelector(".total_price");
const confirmButton = document.getElementById("a_finish");
let change = null;

///////// initial state ///////////

document.getElementById("arcade").checked = "true";
document
  .getElementById("arcade")
  .parentNode.parentNode.classList.add("selected_plan");
planFinished(document.getElementById("arcade"));
change = document.querySelector(".change");

// console.log(document.getElementById("arcade").checked);

/////////////// helper functions///////

// 1. form validation
function formValidation(element) {
  if (element.value === "") {
    element.classList.add("error_border");
    element.previousElementSibling.lastElementChild.classList.add("error_text");
    return false;
  } else {
    element.classList.remove("error_border");
    element.previousElementSibling.lastElementChild.classList.remove(
      "error_text"
    );
    return true;
  }
}

// 2. finishing up plan

function planFinished(element) {
  selectedPlanContainer.innerHTML = "";
  const div = document.createElement("div");
  const h1 = document.createElement("h1");
  h1.innerText = `${element.id} (${element.dataset.duration})`;
  const h2 = document.createElement("h2");
  h2.setAttribute("class", "change");
  h2.innerText = "Change";
  div.append(h1);
  div.append(h2);
  const h3 = document.createElement("h3");
  h3.setAttribute("class", "plan_price");
  h3.innerText = `$${element.dataset.price}/${element.dataset.duration.slice(
    0,
    2
  )}`;
  selectedPlanContainer.append(div);
  selectedPlanContainer.append(h3);
}

// 3. page changer
function stepChanger(num1, num2) {
  if (num1) {
    document.getElementById(`c${num1}`).classList.remove("circle_background");
    document.getElementById(`c${num2}`).classList.add("circle_background");
  }

  document.getElementById(`p${num1}`).classList.add("display_form");
  document.getElementById(`p${num2}`).classList.remove("display_form");
}

// 4.parse integer

function parseInteger(str) {
  return str.match(/\d+/)[0];
}

/////// plan form ///////
plansDiv.addEventListener("click", (e) => {
  if (e.target.type === "radio") {
    planFinished(e.target);
    change = document.querySelector(".change");
    // console.log(change);
    radiofield.forEach((radioEl) => {
      if (radioEl.checked) {
        radioEl.parentNode.parentNode.classList.add("selected_plan");
      } else {
        radioEl.parentNode.parentNode.classList.remove("selected_plan");
      }
    });
  }
});

// duration  checkbox

function setAddonsCharges(addonplan) {
  addOncharges.forEach((El) => {
    if (addonplan) {
      El.innerText = `+$${El.parentNode.dataset.charge * 10}/yr`;
    } else {
      El.innerText = `+$${El.parentNode.dataset.charge}/mo`;
    }
  });
}

// navigation for back button

const backPlan = document.querySelector(".back_plan");
const backAdd = document.querySelector(".back_add");
const bacFinish = document.querySelector(".back_finish");

backPlan.addEventListener("click", () => {
  stepChanger(2, 1);
});

backAdd.addEventListener("click", () => {
  stepChanger(3, 2);
});

bacFinish.addEventListener("click", () => {
  stepChanger(4, 3);
});

confirmButton.addEventListener("click", () => {
  document.getElementById("p4").classList.add("display_form");
  document.getElementById("p5").classList.remove("display_form");
});

window.addEventListener("click", (e) => {
  console.log(e.target);
  console.log(change);
  if (e.target == change) {
    // console.log(5);
    stepChanger(4, 2);
    AddOnsContainer.innerHTML = "";
    addOnsCheckboxes.forEach((el) => {
      el.checked = false;
      el.parentNode.classList.remove("selected_plan");
    });
  }
});

durationCheckbox.addEventListener("click", (e) => {
  setAddonsCharges(durationCheckbox.checked);

  monthlyPlan.classList.toggle("inactive_duration");
  yearlyPlan.classList.toggle("active_duration");
  pricesEl.forEach((el) => {
    if (durationCheckbox.checked) {
      el.parentNode.lastElementChild.dataset.duration = "yearly";
      el.parentNode.lastElementChild.dataset.price = `${el.dataset.price * 10}`;
      el.innerText = `$${el.dataset.price * 10}/yr`;
      el.nextElementSibling.classList.remove("free");
    } else {
      el.parentNode.lastElementChild.dataset.duration = "monthly";

      el.parentNode.lastElementChild.dataset.price = `${el.dataset.price}`;
      el.innerText = `$${el.dataset.price}/mo`;
      el.nextElementSibling.classList.add("free");
    }
  });
});

durationCheckbox.addEventListener("click", () => {
  Service.innerText = durationCheckbox.checked ? "(per year)" : "per month";
  radiofield.forEach((El) => {
    if (El.checked) {
      planFinished(El);
      change = document.querySelector(".change");
    }
  });
});

inputField.forEach((input) => {
  input.addEventListener("blur", (e) => {
    formValidation(e.target);
  });
});

///////// submit info form ////////

infoForm.addEventListener("submit", (event) => {
  event.preventDefault();
  inputField.forEach((input) => {
    formValidation(input);
  });
  if (Array.from(inputField).every((el) => formValidation(el))) {
    stepChanger(1, 2);
  }
});

////////submit plan form ////

planForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (Array.from(radiofield).some((el) => el.checked)) {
    stepChanger(2, 3);
  }
});

addOnForm.addEventListener("submit", (event) => {
  totalPrice.innerText = "";
  event.preventDefault();
  stepChanger(3, 4);

  let planCost = parseInteger(document.querySelector(".plan_price").innerText);
  let addOnsCost = Array.from(addOnsCheckboxes).reduce((acc, cur) => {
    if (cur.checked) {
      acc = acc + Number(cur.parentNode.dataset.charge);
    }
    return acc;
  }, 0);
  totalPrice.innerText = durationCheckbox.checked
    ? `$${+planCost + addOnsCost * 10}/yr`
    : `$${+planCost + addOnsCost}/mo`;
});

//  addon background changes

addOnsCheckboxes.forEach((el) => {
  el.addEventListener("click", (e) => {
    e.target.parentNode.classList.toggle("selected_plan");
  });
});

// create list of addons

function createSelectedAddon(element) {
  let str = element.nextElementSibling.firstElementChild.innerText.slice(0, 4);
  if (element.checked) {
    str = element.nextElementSibling.firstElementChild.innerText.slice(0, 4);
    const div = document.createElement("div");
    div.setAttribute("class", `finish_addon ${str}`);
    const h1 = document.createElement("h1");
    const h2 = document.createElement("h2");
    h1.innerText = element.nextElementSibling.firstElementChild.innerText;
    h2.innerText = element.parentNode.lastElementChild.innerText;
    div.appendChild(h1);
    div.appendChild(h2);
    AddOnsContainer.appendChild(div);
  } else {
    AddOnsContainer.removeChild(document.querySelector(`.${str}`));
  }
}

aAddOnsForm.addEventListener("click", (e) => {
  if (e.target.type === "checkbox") {
    createSelectedAddon(e.target);
  }
});
