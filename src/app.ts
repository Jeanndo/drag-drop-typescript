// validation

interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

function validate(validatebaleInput: Validatable) {
  let isValid = true;

  if (validatebaleInput.required) {
    isValid = isValid && validatebaleInput.value.toString().trim().length !== 0;
  }

  if (
    validatebaleInput.minLength != null &&
    typeof validatebaleInput.value === "string"
  ) {
    isValid =
      isValid && validatebaleInput.value.length >= validatebaleInput.minLength;
  }

  if (
    validatebaleInput.maxLength != null &&
    typeof validatebaleInput.value === "string"
  ) {
    isValid =
      isValid && validatebaleInput.value.length <= validatebaleInput.maxLength;
  }

  if (
    validatebaleInput.min != null &&
    typeof validatebaleInput.value === "number"
  ) {
    isValid = isValid && validatebaleInput.value >= validatebaleInput.min;
  }
  if (
    validatebaleInput.max != null &&
    typeof validatebaleInput.value === "number"
  ) {
    isValid = isValid && validatebaleInput.value <= validatebaleInput.max;
  }
  return isValid;
}

// autobind decorator

function autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,

    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    },
  };
  return adjDescriptor;
}

// ProjectInput CLass

class ProjectInput {
  templateEment: HTMLTemplateElement;
  hostEment: HTMLDivElement;
  element: HTMLFormElement;

  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    this.templateEment = document.getElementById(
      "project-input"
    )! as HTMLTemplateElement;
    this.hostEment = document.getElementById("app")! as HTMLDivElement;

    const importedNode = document.importNode(this.templateEment.content, true);
    this.element = importedNode.firstElementChild as HTMLFormElement;
    this.element.id = "user-input";

    this.titleInputElement = this.element.querySelector(
      "#title"
    )! as HTMLInputElement;

    this.descriptionInputElement = this.element.querySelector(
      "#description"
    )! as HTMLInputElement;
    this.peopleInputElement = this.element.querySelector(
      "#people"
    )! as HTMLInputElement;

    this.configure();
    this.attach();
  }

  private clearInputs() {
    this.titleInputElement.value = "";
    this.descriptionInputElement.value = "";
    this.peopleInputElement.value = "";
  }

  private gatherUsersInput(): [string, string, number] | void {
    const enteredTitle = this.titleInputElement.value;
    const enteredDescription = this.descriptionInputElement.value;
    const enteredPeople = this.peopleInputElement.value;

    const titleValidatable: Validatable = {
      value: enteredTitle,
      required: true,
    };

    const descriptionValidatable: Validatable = {
      value: enteredDescription,
      required: true,
      minLength: 5,
    };

    const peopleValidatable: Validatable = {
      value: enteredPeople,
      required: true,
      min: 1,
      max: 5,
    };

    if (
      !validate(titleValidatable) ||
      !validate(descriptionValidatable) ||
      !validate(peopleValidatable)
    ) {
      alert("Invalid input please try again");
      return;
    } else {
      return [enteredTitle, enteredDescription, +enteredPeople];
    }
  }

  @autobind
  private submitHandler(event: Event) {
    event.preventDefault();
    // console.log(this.titleInputElement.value);
    const userInput = this.gatherUsersInput();

    if (Array.isArray(userInput)) {
      const [title, desc, people] = userInput;
      console.log(title, desc, people);

      this.clearInputs();
    }
  }

  private configure() {
    // this.element.addEventListener("submit", this.submitHandler.bind(this));
    this.element.addEventListener("submit", this.submitHandler);
  }

  private attach() {
    this.hostEment.insertAdjacentElement("afterbegin", this.element);
  }
}

const prjInput = new ProjectInput();
