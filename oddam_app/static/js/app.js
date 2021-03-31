document.addEventListener("DOMContentLoaded", function() {
  /**
   * HomePage - Help section
   */
  class Help {
    constructor($el) {
      this.$el = $el;
      this.$buttonsContainer = $el.querySelector(".help--buttons");
      this.$slidesContainers = $el.querySelectorAll(".help--slides");
      this.currentSlide = this.$buttonsContainer.querySelector(".active").parentElement.dataset.id;
      this.init();
    }

    init() {
      this.events();
    }

    events() {
      /**
       * Slide buttons
       */
      this.$buttonsContainer.addEventListener("click", e => {
        if (e.target.classList.contains("btn")) {
          this.changeSlide(e);
        }
      });

      /**
       * Pagination buttons
       */
      this.$el.addEventListener("click", e => {
        if (e.target.classList.contains("btn") && e.target.parentElement.parentElement.classList.contains("help--slides-pagination")) {
          this.changePage(e);
        }
      });
    }

    changeSlide(e) {
      e.preventDefault();
      const $btn = e.target;

      // Buttons Active class change
      [...this.$buttonsContainer.children].forEach(btn => btn.firstElementChild.classList.remove("active"));
      $btn.classList.add("active");

      // Current slide
      this.currentSlide = $btn.parentElement.dataset.id;

      // Slides active class change
      this.$slidesContainers.forEach(el => {
        el.classList.remove("active");

        if (el.dataset.id === this.currentSlide) {
          el.classList.add("active");
        }
      });
    }

    /**
     * TODO: callback to page change event
     */
    changePage(e) {
      e.preventDefault();
      const page = e.target.dataset.page;

      console.log(page);
    }
  }
  const helpSection = document.querySelector(".help");
  if (helpSection !== null) {
    new Help(helpSection);
  }

  /**
   * Form Select
   */
  class FormSelect {
    constructor($el) {
      this.$el = $el;
      this.options = [...$el.children];
      this.init();
    }

    init() {
      this.createElements();
      this.addEvents();
      this.$el.parentElement.removeChild(this.$el);
    }

    createElements() {
      // Input for value
      this.valueInput = document.createElement("input");
      this.valueInput.type = "text";
      this.valueInput.name = this.$el.name;

      // Dropdown container
      this.dropdown = document.createElement("div");
      this.dropdown.classList.add("dropdown");

      // List container
      this.ul = document.createElement("ul");

      // All list options
      this.options.forEach((el, i) => {
        const li = document.createElement("li");
        li.dataset.value = el.value;
        li.innerText = el.innerText;

        if (i === 0) {
          // First clickable option
          this.current = document.createElement("div");
          this.current.innerText = el.innerText;
          this.dropdown.appendChild(this.current);
          this.valueInput.value = el.value;
          li.classList.add("selected");
        }

        this.ul.appendChild(li);
      });

      this.dropdown.appendChild(this.ul);
      this.dropdown.appendChild(this.valueInput);
      this.$el.parentElement.appendChild(this.dropdown);
    }

    addEvents() {
      this.dropdown.addEventListener("click", e => {
        const target = e.target;
        this.dropdown.classList.toggle("selecting");

        // Save new value only when clicked on li
        if (target.tagName === "LI") {
          this.valueInput.value = target.dataset.value;
          this.current.innerText = target.innerText;
        }
      });
    }
  }
  document.querySelectorAll(".form-group--dropdown select").forEach(el => {
    new FormSelect(el);
  });

  /**
   * Hide elements when clicked on document
   */
  document.addEventListener("click", function(e) {
    const target = e.target;
    const tagName = target.tagName;

    if (target.classList.contains("dropdown")) return false;

    if (tagName === "LI" && target.parentElement.parentElement.classList.contains("dropdown")) {
      return false;
    }

    if (tagName === "DIV" && target.parentElement.classList.contains("dropdown")) {
      return false;
    }

    document.querySelectorAll(".form-group--dropdown .dropdown").forEach(el => {
      el.classList.remove("selecting");
    });
  });

  /**
   * Switching between form steps
   */
  class FormSteps {
    constructor(form) {
      this.$form = form;
      this.$next = form.querySelectorAll(".next-step");
      this.$prev = form.querySelectorAll(".prev-step");
      this.$step = form.querySelector(".form--steps-counter span");
      this.currentStep = 1;

      this.$stepInstructions = form.querySelectorAll(".form--steps-instructions p");
      const $stepForms = form.querySelectorAll("form > div");
      this.slides = [...this.$stepInstructions, ...$stepForms];

      this.init();
    }

    /**
     * Init all methods
     */
    init() {
      this.events();
      this.updateForm();
    }

    /**
     * All events that are happening in form
     */
    events() {
      // Next step
      this.$next.forEach(btn => {
        btn.addEventListener("click", e => {
          e.preventDefault();
          this.currentStep++;
          this.updateForm();
        });
      });

      // Previous step
      this.$prev.forEach(btn => {
        btn.addEventListener("click", e => {
          e.preventDefault();
          this.currentStep--;
          this.updateForm();
        });
      });

      // Form submit
      this.$form.querySelector("form").addEventListener("submit", e => this.submit(e));
    }
    categories_f()  {
      let inputs = document.querySelectorAll("input[type='checkbox']");
      let categories_arr = []
      inputs.forEach(input => {
        if (input.checked == true) {
          categories_arr.push(input.parentElement.lastElementChild.innerHTML);
        }
      })
      return categories_arr
    }

    categories_id_f()  {
      let inputs = document.querySelectorAll("input[type='checkbox']");
      let categories_id = []
      inputs.forEach(input => {
        if (input.checked == true) {
          categories_id.push(input.value);
        }
      })
      return categories_id
    }

    data_f(){
      let address = document.querySelector("[name='address']").value
      let city = document.querySelector("[name='city']").value
      let postcode = document.querySelector("[name='postcode']").value
      let phone = document.querySelector("[name='phone']").value
      let date = document.querySelector("[name='data']").value
      let time = document.querySelector("[name='time']").value
      let more_info = document.querySelector("[name='more_info']").value

      let data = {
            'address': address,
            'city': city,
            'postcode': postcode,
            'phone': phone,
            'date': date,
            'time': time,
            'more_info': more_info,
       }
       return data
    }
    /**
     * Update form front-end
     * Show next or previous section etc.
     */

    updateForm() {
      this.$step.innerText = this.currentStep;

      // TODO: Validation
      this.slides.forEach(slide => {
        slide.classList.remove("active");

        if (slide.dataset.step == this.currentStep) {
          slide.classList.add("active");
        }
      });

      this.$stepInstructions[0].parentElement.parentElement.hidden = this.currentStep >= 6;
      this.$step.parentElement.hidden = this.currentStep >= 6;

      // TODO: get data from inputs and show them in summary
      if (this.currentStep == 3) {
        let categories = this.categories_f()
        console.log(categories)
        let summary_btn = document.querySelector("form [data-step='4']").querySelector(".next-step");
        summary_btn.addEventListener("click", evt => {

          let bags = document.querySelector("[name='bags']").value
          let institutions = document.querySelectorAll("input[type='radio']");
          let institution = ""
          institutions.forEach(i => {
            if (i.checked == true) {
              institution = i.parentElement.lastElementChild.firstElementChild.innerHTML;
            }
          })
          let form_data = this.data_f()
          let summary = document.querySelector(".summary")
          let bags_quantity = ''
          console.log(bags)
          if (bags == 1){
            bags_quantity = 'worek'
          }
          else if (bags <= 4 || bags > 1 && bags < 5){
            bags_quantity = 'worki'
          } else {
            bags_quantity = 'worków'
          }
          summary.querySelector("#BAG").innerHTML = bags + " " + bags_quantity + ": (" + categories.join(', ') + ")";
          summary.querySelector("#INST").innerHTML = institution;
          summary.querySelector("#UL1").innerHTML = `
          <li>${form_data.address}</li>
          <li>${form_data.city}</li>
          <li>${form_data.postcode}</li>
          <li>${form_data.phone}</li>`;
          summary.querySelector("#UL2").innerHTML = `
          <li>${form_data.date}</li>
          <li>${form_data.time}</li>
          <li>${form_data.more_info}</li>`;
        })
      }
    }
    /**
     * Submit form
     *
     * TODO: validation, send data to server
     */
    submit(e) {
      e.preventDefault();
      let bags = document.querySelector("[name='bags']").value
      let institution_id = document.querySelector("input[type='radio']").value;
      let institutions = document.querySelectorAll("input[type='radio']");
      let institution = ""
      institutions.forEach(i => {
        if (i.checked == true) {
          institution = i.parentElement.lastElementChild.firstElementChild.innerHTML
        }
      })
      let form_data = this.data_f();
      let token = document.querySelector("[name='csrfmiddlewaretoken']").value;
      let categories_id = this.categories_id_f();
      let dataForm = new FormData();
      dataForm.append("bags", bags);
      dataForm.append("address", form_data.address);
      dataForm.append("phone", form_data.phone);
      dataForm.append("city", form_data.city);
      dataForm.append("postcode", form_data.postcode);
      dataForm.append("date", form_data.date);
      dataForm.append("time", form_data.time);
      dataForm.append("more_info", form_data.more_info);
      dataForm.append("institution", institution);
      dataForm.append("institution_id", institution_id);
      dataForm.append('categories_id', categories_id);
      dataForm.append('csrfmiddlewaretoken', token);
      fetch('http://127.0.0.1:8000/form/', {
        method: 'post',
        body: dataForm,
    })
          .then( resp => resp.text())
          .then( resp => document.body.innerHTML = resp)
    }
  }
  const form = document.querySelector(".form--steps");
  if (form !== null) {
    new FormSteps(form);
  }
});
