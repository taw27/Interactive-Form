
$(window).on('DOMContentLoaded', inititaliseForm);

function inititaliseForm() {

    $('#other-title').hide();
    $('#design').on('input', showColorOptionsForDesign);
    $('.activities').on('input', 'input', handleActivitySelection());
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
    return function (event) {
        const $changedEvent = $(event.target);
        const isChecked = $changedEvent.prop('checked');
        const $conflictingEvents = $events9To12.is($changedEvent) ? $events9To12 : $events1To4;

        isChecked ? disableConflictingEvents($changedEvent, $conflictingEvents) : $conflictingEvents.prop("disabled", false);
    }
}

function disableConflictingEvents($selectedEvent, $disableConflictingEvents) {
    $disableConflictingEvents.map((eventIndex) => {
        const $activity = $($disableConflictingEvents[eventIndex]);
        $activity.is($selectedEvent) ? $activity.prop("disabled", false) : $activity.prop('disabled', true);
    })
}



