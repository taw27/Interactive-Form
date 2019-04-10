
$(window).on('DOMContentLoaded', inititaliseForm);

function inititaliseForm() {

    $('#other-title').hide();
    $('#design').on('input', showColorOptionsForDesign);
    $('.activities').on('input', 'input', handleActivitySelection());
    $('#payment').on('input', handlePaymentSelection());
    initialiseValidations();
}

function showColorOptionsForDesign(event) {
    const designSelected = $(event.target).val();
    const $heartJsColorOptions = $("option[value = 'tomato'], option[value = 'steelblue'], option[value = 'dimgrey']");
    const $jsPunColorOptions = $("option[value = 'cornflowerblue'], option[value = 'darkslategrey'], option[value = 'gold']");

    if (designSelected === "js puns") {
        showAndHideOptions($jsPunColorOptions, $heartJsColorOptions);
    } else if (designSelected === "heart js") {
        showAndHideOptions($heartJsColorOptions, $jsPunColorOptions);
    } else {
        $heartJsColorOptions.show();
        $jsPunColorOptions.show();
        $($jsPunColorOptions["0"]).prop('selected', true);
    }
}

function showAndHideOptions($optionsToShow, $optionstoHide) {
    $optionstoHide.hide();
    $optionsToShow.show();
    $($optionsToShow["0"]).prop('selected', true);
}

function handleActivitySelection() {
    const $events9To12 = $("input[name = 'js-frameworks'], input[name = 'express'], input[name = 'build-tools']");
    const $events1To4 = $("input[name = 'js-libs'], input[name = 'node'], input[name = 'npm']");
    const $totalContainer = initialiseTotalCounter();
    return function (event) {
        const $changedEvent = $(event.target);
        const isChecked = $changedEvent.prop('checked');
        const $conflictingEvents = $events9To12.is($changedEvent) ? $events9To12 : $events1To4;

        if (isChecked) {
            if ($changedEvent.attr('name') !== 'all') {
                disableConflictingEvents($changedEvent, $conflictingEvents)
                changeTotal(100, $totalContainer);
            } else {
                changeTotal(200, $totalContainer);
            }
        } else {
            $conflictingEvents.prop("disabled", false);
            $conflictingEvents.parent().css('color', '#000')
            $changedEvent.attr('name') === 'all' ? changeTotal(-200, $totalContainer) : changeTotal(-100, $totalContainer);
        }

    }
}

function disableConflictingEvents($selectedEvent, $disableConflictingEvents) {
    $disableConflictingEvents.map((eventIndex) => {
        const $activity = $($disableConflictingEvents[eventIndex]);
        if (!$activity.is($selectedEvent)) {
            $activity.prop('disabled', true);
            $activity.parent().css({ color: "#A9A9A9" });
        } else {
            $activity.prop("disabled", false);
        }
    })
}

function initialiseTotalCounter() {
    $totalContainer = $(`<div class = "Total"> Total: $ <span>0<span>  </div>`);

    $totalContainer.hide();
    $('.activities').append($totalContainer);

    return $totalContainer;
}

function changeTotal(numberToChangeBy, $container) {
    let $totalSpan = $container.find('span');
    let total = parseInt($totalSpan.text());

    total += numberToChangeBy;
    $totalSpan.text(total);
    runTotalAnimation(total, $totalSpan, $container);
}

function runTotalAnimation(total, $textSpan, $container) {
    if (total === 0) {
        $textSpan.fadeOut();
        $container.slideUp(500);
    } else {
        $textSpan.fadeIn(600);
        $container.slideDown(500);  
    }
}

function handlePaymentSelection(){
    const $paymentOptions = $('#payment');
    const $creditCard = $('#credit-card');
    const $otherPayments = $creditCard.siblings('div');
   
    setDefaultPaymentMethod($paymentOptions, $creditCard, $otherPayments);

    return function (event){
        paymentSelection = $(event.target).val();
        displaySelectedPaymentMethod(paymentSelection, $creditCard, $otherPayments);
    }
}

function setDefaultPaymentMethod($options, $creditCard, $otherPayments){
    $options.find("option[value = 'credit card']").prop('selected', true);
    $options.find("option[value = 'select_method']").hide();
    $creditCard.show();
    $otherPayments.hide()
}

function displaySelectedPaymentMethod(selectedOption, $creditCard, $otherPayments){
    if(selectedOption === 'credit card'){
        $creditCard.slideDown()
        $otherPayments.slideUp();
    } else {
        $creditCard.slideUp();
        
        $otherPayments.map((index) => {
            const chosenPayment = new RegExp(`${selectedOption}`, "i").test($($otherPayments[index]).find('p').text());
            chosenPayment ? $($otherPayments[index]).slideDown() : $($otherPayments[index]).slideUp();
        });
    }
}

function initialiseValidationContainers(){
    createValidationContainerAndHide('#name', 'name-validation', "Name must be filled");
    createValidationContainerAndHide('#mail', 'mail-validation', "Email must be valid" );
    createValidationContainerAndHide('.activities', 'activity-validation', "At least one activity must be selected");
    createCreditValidationContainerAndHide();
}

function createValidationContainerAndHide(targetSelector, validationId, message){
    $(targetSelector).after(`<ol><li id = "${validationId}" class = "validation">${message}</li></ol>`);
    $(`#${validationId}`).hide();
}

function initialiseValidations () {
    initialiseValidationContainers();

    $('#name').on('mouseover input', handleNameValidation);
    $('#name').on('mouseout focusout', (event) => {
       hideValidationMessages($(event.target),$('#name-validation'));
    });

    $('#mail').on('mouseover input', handleEmailValidation);
    $('#mail').on('mouseout focusout', (event) => {
       hideValidationMessages($(event.target),$('#mail-validation'));
    });
}

function createCreditValidationContainerAndHide(){
    $('#credit-card').after(
        `<ol id = "card-validation">
            <li id = "cc-num-validation" class = "validation">Credit Card field number between 13 and 16 digits</li>
            <li id = "zip-validation" class = "validation">Zip Code should be  5 digits</li>
            <li id = "cvv-validation" class = "validation">CVV should be 3 digits</li>
         </ol>`
);
    $(`#card-validation li`).hide();
}

function handleNameValidation(event){
    $nameConatiner = $(event.target);
    displayValidationResultStyle($nameConatiner, $('#name-validation'), $nameConatiner.val().trim() === '');
}

// regex from https://www.w3resource.com/javascript/form/email-validation.php
function handleEmailValidation(event){
    $emailConatiner = $(event.target);
    const emailEntered = $emailConatiner.val();
    const validatorRegex =  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const inValidEmail = ! validatorRegex.test(emailEntered);
    
    displayValidationResultStyle($emailConatiner, $('#mail-validation'), inValidEmail);
}

// Stle visuals inspiration https://ireade.github.io/form-validation-realtime/
function displayValidationResultStyle($validationTarget, $validationMessageContainer, validationFailed){
    $validationMessageContainer.show();

    if(validationFailed){
        $validationMessageContainer.css('color', '#F61C1C');
        if ($validationTarget.className !== 'activities'){
            $validationTarget.css('border-color', '#FD5858');
        }
    } else {
        $validationMessageContainer.css('color', '#7FFF00');
        if ($validationTarget.className !== 'activities'){
            $validationTarget.css('border-color', '#2ecc71');
        }
    }
}

function hideValidationMessages($validationTarget, $validationMessageContainer){
    $validationMessageContainer.hide();

    if ($validationTarget.className !== 'activities'){
        $validationTarget.css('border-color', '#5e97b0');
    }
}





