$(window).on("DOMContentLoaded", inititaliseForm); // initialises all the form when DOM was loaded

/* 
  Initialises the page by focusing on the name input, hiding the other text input and color selection, 
  and initialises all other event handlers for selections and validation 
 */
function inititaliseForm() {
  $("#name").focus();
  $('#other-title, label[for = "other-title"], #colors-js-puns').hide();
  $("#design").on("input", showColorOptionsForDesign);
  $(".activities").on("input", "input", handleActivitySelection());
  $("#payment").on("input", handlePaymentSelection());
  $("#title").on("input", handleJobSelection);
  initialiseValidations();
}

/* 
  Takes in the event object for the input change event of design selection and displays the appropiate
  color options based on the design selection
 */
function showColorOptionsForDesign(event) {
  const designSelected = $(event.target).val();
  const $heartJsColorOptions = $(
    "option[value = 'tomato'], option[value = 'steelblue'], option[value = 'dimgrey']"
  );
  const $jsPunColorOptions = $(
    "option[value = 'cornflowerblue'], option[value = 'darkslategrey'], option[value = 'gold']"
  );
  const $colorDropDown = $("#colors-js-puns");
  if (designSelected === "js puns") {
    showAndHideOptions($jsPunColorOptions, $heartJsColorOptions);
    $colorDropDown.fadeIn(500);
  } else if (designSelected === "heart js") {
    showAndHideOptions($heartJsColorOptions, $jsPunColorOptions);
    $colorDropDown.fadeIn(500);
  } else {
    $heartJsColorOptions.show();
    $jsPunColorOptions.show();
    $($jsPunColorOptions["0"]).prop("selected", true);
    $colorDropDown.fadeOut(500);
  }
}

/* 
  Takes in two jquery objects. One jquery object containing color option elements to display 
  and another jquery object containing color option elements to hide. Displays the appropriate
  elemts and hides the appropriate elemtns
 */
function showAndHideOptions($optionsToShow, $optionstoHide) {
  $optionstoHide.hide();
  $optionsToShow.show();
  $($optionsToShow["0"]).prop("selected", true);
}
/*
  returns an event handler function to handle the logic of activity selection. Disable conflicting
  events upon selection and displays the totals as activities are being selected
 */
function handleActivitySelection() {
  const $events9To12 = $(
    "input[name = 'js-frameworks'], input[name = 'express'], input[name = 'build-tools']"
  );
  const $events1To4 = $(
    "input[name = 'js-libs'], input[name = 'node'], input[name = 'npm']"
  );
  const $totalContainer = initialiseTotalCounter();
  return function(event) {
    const $changedEvent = $(event.target);
    const isChecked = $changedEvent.prop("checked");
    const $conflictingEvents = $events9To12.is($changedEvent)
      ? $events9To12
      : $events1To4;

    if (isChecked) {
      if ($changedEvent.attr("name") !== "all") {
        disableConflictingEvents($changedEvent, $conflictingEvents);
        changeTotal(100, $totalContainer);
      } else {
        changeTotal(200, $totalContainer);
      }
    } else {
      $conflictingEvents.prop("disabled", false);
      $conflictingEvents.parent().css("color", "#000");
      $changedEvent.attr("name") === "all"
        ? changeTotal(-200, $totalContainer)
        : changeTotal(-100, $totalContainer);
    }
  };
}

/*
  Takes in the selected activity element and a jQuery object containing conflicting activities.
  Disables the activities conflicting the selected activity and enables the selected activity
 */
function disableConflictingEvents(selectedActivity, $conflictingActivities) {
  $conflictingActivities.map(eventIndex => {
    const $activity = $($conflictingActivities[eventIndex]);
    if (!$activity.is(selectedActivity)) {
      $activity.prop("disabled", true);
      $activity.parent().css({ color: "#A9A9A9" });
    } else {
      $activity.prop("disabled", false);
    }
  });
}

/* 
  Creates the total counter container, appends it to the activities container and
  hides the counter container
 */
function initialiseTotalCounter() {
  $totalContainer = $(`<div class = "Total"> Total: $ <span>0<span>  </div>`);

  $totalContainer.hide();
  $(".activities").append($totalContainer);

  return $totalContainer;
}

/* 
  takes in a number and a jQuery object of the container as parameters.
  Changes the number in the container by the number. Runs animation to display/hide
  the total at the end

 */
function changeTotal(numberToChangeBy, $container) {
  let $totalSpan = $container.find("span");
  let total = parseInt($totalSpan.text());

  total += numberToChangeBy;
  $totalSpan.text(total);
  runTotalAnimation(total, $totalSpan, $container);
}

/* 
  Takes in the total, the jQuery object containing the total span and jQuery containing
  the total container as parameters. Hides the total span and container if the total is 0
  and shows the total if total is greater than 0 with fade and slide animations
 */
function runTotalAnimation(total, $textSpan, $container) {
  if (total === 0) {
    $textSpan.fadeOut();
    $container.slideUp(500);
  } else {
    $textSpan.fadeIn(600);
    $container.slideDown(500);
  }
}

/*
  Set's the default payment method to credit card.
  returns a fucntion that handles the payment selection process by displaying the payment option 
  selected and hiding the other options
 */
function handlePaymentSelection() {
  const $paymentOptions = $("#payment");
  const $creditCard = $("#credit-card");
  const $otherPayments = $creditCard.siblings("div");

  setDefaultPaymentMethod($paymentOptions, $creditCard, $otherPayments);

  return function(event) {
    paymentSelection = $(event.target).val();
    displaySelectedPaymentMethod(paymentSelection, $creditCard, $otherPayments);
  };
}

/* 
  takes in the jquery objects containing the payment selection options, the credit card container and 
  the other payment option containers. It sets the default payment option to credit card, displays
  it, and hide the rest of the payment containers
 */
function setDefaultPaymentMethod($options, $creditCard, $otherPayments) {
  $options.find("option[value = 'credit card']").prop("selected", true);
  $options.find("option[value = 'select_method']").hide();
  $creditCard.show();
  $otherPayments.hide();
}

/* 
  Displays the payment option selected and hides the rest with slide animation
 */
function displaySelectedPaymentMethod(
  selectedOption,
  $creditCard,
  $otherPayments
) {
  if (selectedOption === "credit card") {
    $creditCard.slideDown();
    $otherPayments.slideUp();
  } else {
    $creditCard.slideUp();

    $otherPayments.map(index => {
      const chosenPayment = new RegExp(`${selectedOption}`, "i").test(
        $($otherPayments[index])
          .find("p")
          .text()
      );
      chosenPayment
        ? $($otherPayments[index]).slideDown()
        : $($otherPayments[index]).slideUp();
    });
  }
}

/* 
  Initialises all the validation containers for name, email, activity, and credit card with 
  validation messages and hides them after
 */
function initialiseValidationContainers() {
  createValidationContainerAndHide(
    "#name",
    "name-validation",
    "Name must be filled"
  );
  createValidationContainerAndHide(
    "#mail",
    "mail-validation",
    "Email must be valid"
  );
  createValidationContainerAndHide(
    ".activities",
    "activity-validation",
    "At least one activity must be selected"
  );
  createCreditValidationContainerAndHide();
}

/* 
  Takes in the selector to select the element/container to create the validation for,
  take's in the id for the validation container to be created and also the message to display. 
  Creates the container and hides it
 */
function createValidationContainerAndHide(
  targetSelector,
  validationId,
  message
) {
  $(targetSelector).after(
    `<ol><li id = "${validationId}" class = "validation">${message}</li></ol>`
  );
  $(`#${validationId}`).hide();
}

/* 
  Initialises the name, email, activity and credit card validation processes 
 */
function initialiseValidations() {
  initialiseValidationContainers();
  initialiseNameValidation();
  initialiseEmailValidation();
  initialiseCardValidation();
  initialiseActivityValidation();
  $("form").submit(validateAll);
}

/* 
  Initialises the name validation process 
 */
function initialiseNameValidation() {
  $("#name").on("click input", event => validateName($(event.target)));
  $("#name").on("focusout", event => {
    hideValidationMessages($(event.target), $("#name-validation"));
  });
}

/* 
  Initialises the email validation process 
 */
function initialiseEmailValidation() {
  $("#mail").on("input focus", event => validateEmail($(event.target)));
  $("#mail").on("focusout", event => {
    hideValidationMessages($(event.target), $("#mail-validation"));
  });
}

/* 
  Initialises the card validation process 
 */
function initialiseCardValidation() {
  $("#cc-num, #zip, #cvv").on("input focus", event => {
    validateCardNumber($("#cc-num"));
    validateCvvNumber($("#cvv"));
    validateZipdNumber($("#zip"));
  });

  $("#cc-num, #zip, #cvv").on("focusout", event => {
    hideValidationMessages(
      $("#cc-num, #zip, #cvv"),
      $("#cc-num-validation, #zip-validation, #cvv-validation")
    );
  });
}

/* 
  Initialises the activity selection validation process 
 */
function initialiseActivityValidation() {
  $(".activities").on("input", "input", event => {
    validateActivitySelection($(".activities"));
  });

  $(".activities").on("mouseover", event => {
    validateActivitySelection($(".activities"));
  });

  $(".activities").on("mouseout", event => {
    hideValidationMessages($(".activities"), $("#activity-validation"));
  });
}

/* 
  Creates validation container for the credit card along with the message and hides it
 */
function createCreditValidationContainerAndHide() {
  $("#credit-card").after(
    `<ol id = "card-validation">
            <li id = "cc-num-validation" class = "validation">Credit Card field number between 13 and 16 digits</li>
            <li id = "zip-validation" class = "validation">Zip Code should be  5 digits</li>
            <li id = "cvv-validation" class = "validation">CVV should be 3 digits</li>
         </ol>`
  );
  $(`#card-validation li`).hide();
}

/* 
  Takes in a jQuery object container the name input. Checks if the value is not empty, displays the validation messages
  and returns true if it is valid
 */
function validateName($nameConatiner) {
  const validName = $nameConatiner.val().trim() !== "";
  displayValidationResultStyle(
    $nameConatiner,
    $("#name-validation"),
    validName
  );

  return validName;
}
/* 
  Takes in a jQuery object container the email input. Checks if the email is valid, displays the validation messages
  and returns true if it is valid
*/
function validateEmail($emailConatiner) {
  const emailEntered = $emailConatiner.val();
  // regex from https://www.w3resource.com/javascript/form/email-validation.php for validating emails
  const validatorRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const validEmail = validatorRegex.test(emailEntered);

  displayValidationResultStyle(
    $emailConatiner,
    $("#mail-validation"),
    validEmail
  );

  return validEmail;
}

/* 
  Takes in the Jquery object validation target & the validation mesage container, and a boolean
  indicating if validsation passed. Displays the validation messages and changes the color of messages to red  
  passed, green if not passed. If the container does not have the activity class then changes the border color to green if passed
  and red if not passed

  Style visuals inspiration https://ireade.github.io/form-validation-realtime/
 */
function displayValidationResultStyle(
  $validationTarget,
  $validationMessageContainer,
  validationPassed
) {
  $validationMessageContainer.show();

  if (validationPassed) {
    $validationMessageContainer.css("color", "#7FFF00");
    if ($validationTarget.className !== "activities") {
      $validationTarget.css("border-color", "#2ecc71");
    }
  } else {
    $validationMessageContainer.css("color", "#F61C1C");
    if ($validationTarget.className !== "activities") {
      $validationTarget.css("border-color", "#FD5858");
    }
  }
}

/* 
  takes in jQuery object of the validation target and the validation message container. Hides
  the message containers and changes the input borders to original color if it does not have the
  activity class
 */
function hideValidationMessages(
  $validationTarget,
  $validationMessageContainer
) {
  $validationMessageContainer.hide();

  if ($validationTarget.className !== "activities") {
    $validationTarget.css("border-color", "#5e97b0");
  }
}

/* 
  Takes in jQuery object of the card number container. Checks if the credit number is valid, displays the validation messages
  and returns true if it is valid
 */
function validateCardNumber($numberContainer) {
  const numberEntered = $numberContainer.val();
  const validatorRegex = /^\d{13,16}$/; // regex to check if the number is between 13 and 16 number
  const validNumber = validatorRegex.test(numberEntered);

  displayValidationResultStyle(
    $numberContainer,
    $("#cc-num-validation"),
    validNumber
  );

  return validNumber;
}

/* 
  Takes in jQuery object of the zip number container. Checks if the zip number is valid, displays the validation messages
  and returns true if it is valid
 */
function validateZipdNumber($numberContainer) {
  const numberEntered = $numberContainer.val();
  const validatorRegex = /^\d{5}$/; // regex to check if number contains exactly 5 digits
  const validNumber = validatorRegex.test(numberEntered);

  displayValidationResultStyle(
    $numberContainer,
    $("#zip-validation"),
    validNumber
  );

  return validNumber;
}

/* 
  Takes in jQuery object of the cvv number container. Checks if the zip number is valid, displays the validation messages
  and returns true if it is valid
 */
function validateCvvNumber($numberContainer) {
  const numberEntered = $numberContainer.val();
  const validatorRegex = /^\d{3}$/; // regex to check is number contains exactly 3 digits
  const validNumber = validatorRegex.test(numberEntered);

  displayValidationResultStyle(
    $numberContainer,
    $("#cvv-validation"),
    validNumber
  );

  return validNumber;
}

/* 
  Takes in jQuery object of the activity container. Checks if the  number of activity selected is atleast one for validation, displays the validation messages
  and returns true if it is valid
 */
function validateActivitySelection($activitiesContainer) {
  const activitySelectionValid =
    $activitiesContainer.find("input:checked").length > 0; // checks if atleast one activity is selected

  displayValidationResultStyle(
    $activitiesContainer,
    $("#activity-validation"),
    activitySelectionValid
  );

  return activitySelectionValid;
}

/* 
  validates name, email, activity selection and credit card (if it is selected) at once and displays 
  the appropriate validation messages 
*/

function validateAll(event) {
  const validActivity = validateActivitySelection($(".activities"));
  const validName = validateName($("#name"));
  const validEmail = validateEmail($("#mail"));
  let validCard = true;

  if ($("#payment").val() === "credit card") {
    const validCardNumber = validateCardNumber($("#cc-num"));
    const validCardZip = validateZipdNumber($("#zip"));
    const validCardCvv = validateCvvNumber($("#cvv"));
    validCard = validCardNumber && validCardCvv && validateZipdNumber;
  }

  if (!(validActivity && validName && validEmail && validCard)) {
    event.preventDefault();
  }
}

/* 
  Displays the other text box if the other job option is selected and hides it if it is
  not selected
 */
function handleJobSelection(event) {
  $titleContainer = $(event.target);
  selectedTitle = $titleContainer.val();
  if (selectedTitle === "other") {
    $('#other-title, label[for = "other-title"').show();
  } else {
    $('#other-title, label[for = "other-title"').hide();
  }
}
