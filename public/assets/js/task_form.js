$(function () {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  $("#addTaskBtn").on("click", function () {
    setTmzInForm($("#addTaskFormElement #timezone"), timezone);
  });

  $(document).on("show.bs.modal", "#addTaskModal", function (e) {
    $("#addTaskStartDate")
      .bootstrapMaterialDatePicker({
        format: "YYYY-MM-DD",
        currentDate: new Date(),
        time: false,
        weekStart: 1,
        clearButton: true,
      })
      .on("change", function (e, date) {
        $("#addTaskDueDate").bootstrapMaterialDatePicker("setMinDate", date);
      });

    $("#addTaskDueDate").bootstrapMaterialDatePicker({
      format: "YYYY-MM-DD",
      time: false,
      weekStart: 1,
      clearButton: true,
    });

    $("#addTaskStartTime").bootstrapMaterialDatePicker({
      format: "HH:mm",
      currentDate: new Date(),
      date: false,
      shortTime: false,
      clearButton: true,
    });

    $("#addTaskDueTime").bootstrapMaterialDatePicker({
      format: "HH:mm",
      date: false,
      shortTime: false,
      clearButton: true,
    });

    $("#addRepeatTaskDueDate").bootstrapMaterialDatePicker({
      format: "YYYY-MM-DD",
      time: false,
      weekStart: 1,
      clearButton: true,
    });

    $("#addAllDayTask").on("click", function () {
      if ($(this).is(":checked")) {
        $("#addTaskStartTime").hide();
        $("#addTaskDueTime").hide();
      } else {
        $("#addTaskStartTime").show();
        $("#addTaskDueTime").show();
      }
    });
  });

  $("#addRepeatTask").on("click", function () {
    // preview rrule in modal
    var calendar1 = document.getElementById("calendar1");
    var calendar2 = document.getElementById("calendar2");
    var calendar3 = document.getElementById("calendar3");

    var calendar2 = new FullCalendar.Calendar(calendar2, {
      headerToolbar: {
        left: "title",
        center: "",
        right: "",
      },
      aspectRatio: 1.7,
      showNonCurrentDates: false,
      initialView: "dayGridMonth",
      firstDay: 1,
      navLinks: false, // can click day/week names to navigate views
      nowIndicator: true,
      dayMaxEvents: false, // allow "more" link when too many events
      editable: false,
      eventDurationEditable: false,
      selectable: false,
      handleWindowResize: true,
      businessHours: false,
      weekNumbers: false,
      fixedWeekCount: true,
    });
    calendar2.render();

    var calendar3 = new FullCalendar.Calendar(calendar3, {
      headerToolbar: {
        left: "title",
        center: "",
        right: "",
      },
      aspectRatio: 1.7,
      showNonCurrentDates: false,
      initialView: "dayGridMonth",
      firstDay: 1,
      navLinks: false, // can click day/week names to navigate views
      nowIndicator: true,
      dayMaxEvents: false, // allow "more" link when too many events
      editable: false,
      eventDurationEditable: false,
      selectable: false,
      handleWindowResize: true,
      businessHours: false,
      weekNumbers: false,
      fixedWeekCount: true,
    });
    calendar3.render();

    var calendar1 = new FullCalendar.Calendar(calendar1, {
      headerToolbar: {
        left: "title",
        center: "",
        right: "prev,today,next",
      },
      aspectRatio: 1.7,
      showNonCurrentDates: false,
      initialView: "dayGridMonth",
      firstDay: 1,
      navLinks: false, // can click day/week names to navigate views
      nowIndicator: true,
      dayMaxEvents: false, // allow "more" link when too many events
      editable: false,
      eventDurationEditable: false,
      selectable: false,
      handleWindowResize: true,
      businessHours: false,
      weekNumbers: false,
      fixedWeekCount: true,
      datesSet: function (view) {
        if (view) {
          // Calendar 1 Current Start date
          var cal1Date = view.view.currentStart;

          // Calendar 2 & 3 new dates
          var cal2Date = new Date(cal1Date.setMonth(cal1Date.getMonth() + 1));
          var cal3Date = new Date(cal1Date.setMonth(cal1Date.getMonth() + 1));

          // Set new dates
          calendar2.gotoDate(cal2Date);
          calendar3.gotoDate(cal3Date);
        }
      },
    });
    calendar1.render();

    $("#rrule-data").on("change", function () {
      var myEvent = {
        title: "",
        rrule: $(this).val(),
        display: "background",
      };

      calendar1.removeAllEvents();
      calendar1.addEvent(myEvent);

      calendar2.removeAllEvents();
      calendar2.addEvent(myEvent);

      calendar3.removeAllEvents();
      calendar3.addEvent(myEvent);
    });

    $(".yearly #select-nth").multiselect({
      nonSelectedText: "nth",
      buttonWidth: "65px",
      // includeResetOption: true,
      // resetText: "Clear selection",
      buttonContainer: '<div class="btn-group pe-1" />',
      buttonClass: "form-select form-select-sm",
      templates: {
        button:
          '<button type="button" class="multiselect dropdown-toggle" data-bs-toggle="dropdown"><span class="multiselect-selected-text"></span></button>',
        resetButton:
          '<div class="multiselect-reset text-center"><button type="button" class="btn btn-sm btn-block btn-outline-secondary w-100"></button></div>',
      },
    });

    $(".yearly #select-day").multiselect({
      nonSelectedText: "Day(s)",
      buttonWidth: "90px",
      // includeResetOption: true,
      // resetText: "Clear selection",
      buttonContainer: '<div class="btn-group pe-1" />',
      buttonClass: "form-select form-select-sm",
      templates: {
        button:
          '<button type="button" class="multiselect dropdown-toggle" data-bs-toggle="dropdown"><span class="multiselect-selected-text"></span></button>',
        resetButton:
          '<div class="multiselect-reset text-center"><button type="button" class="btn btn-sm btn-block btn-outline-secondary w-100"></button></div>',
      },
    });

    $(".yearly #select-month").multiselect({
      nonSelectedText: "Month(s)",
      buttonWidth: "105px",
      // includeResetOption: true,
      // resetText: "Clear selection",
      buttonContainer: '<div class="btn-group" />',
      buttonClass: "form-select form-select-sm",
      templates: {
        button:
          '<button type="button" class="multiselect dropdown-toggle" data-bs-toggle="dropdown"><span class="multiselect-selected-text"></span></button>',
        resetButton:
          '<div class="multiselect-reset text-center"><button type="button" class="btn btn-sm btn-block btn-outline-secondary w-100"></button></div>',
      },
    });

    $(".monthly #select-nth").multiselect({
      nonSelectedText: "nth",
      buttonWidth: "65px",
      // includeResetOption: true,
      // resetText: "Clear selection",
      buttonContainer: '<div class="btn-group pe-1" />',
      buttonClass: "form-select form-select-sm",
      templates: {
        button:
          '<button type="button" class="multiselect dropdown-toggle" data-bs-toggle="dropdown"><span class="multiselect-selected-text"></span></button>',
        resetButton:
          '<div class="multiselect-reset text-center"><button type="button" class="btn btn-sm btn-block btn-outline-secondary w-100"></button></div>',
      },
    });

    $(".monthly #select-day").multiselect({
      nonSelectedText: "Day(s)",
      buttonWidth: "90px",
      // includeResetOption: true,
      // resetText: "Clear selection",
      buttonContainer: '<div class="btn-group pe-1" />',
      buttonClass: "form-select form-select-sm",
      templates: {
        button:
          '<button type="button" class="multiselect dropdown-toggle" data-bs-toggle="dropdown"><span class="multiselect-selected-text"></span></button>',
        resetButton:
          '<div class="multiselect-reset text-center"><button type="button" class="btn btn-sm btn-block btn-outline-secondary w-100"></button></div>',
      },
    });

    $(".monthly #select-month").multiselect({
      nonSelectedText: "Month(s)",
      buttonWidth: "105px",
      // includeResetOption: true,
      // resetText: "Clear selection",
      buttonContainer: '<div class="btn-group" />',
      buttonClass: "form-select form-select-sm",
      templates: {
        button:
          '<button type="button" class="multiselect dropdown-toggle" data-bs-toggle="dropdown"><span class="multiselect-selected-text"></span></button>',
        resetButton:
          '<div class="multiselect-reset text-center"><button type="button" class="btn btn-sm btn-block btn-outline-secondary w-100"></button></div>',
      },
    });

    $(".weekly #select-days").multiselect({
      nonSelectedText: "Day(s)",
      buttonWidth: "90px",
      // includeResetOption: true,
      // resetText: "Clear selection",
      buttonContainer: '<div class="btn-group pe-1" />',
      buttonClass: "form-select form-select-sm",
      templates: {
        button:
          '<button type="button" class="multiselect dropdown-toggle" data-bs-toggle="dropdown"><span class="multiselect-selected-text"></span></button>',
        resetButton:
          '<div class="multiselect-reset text-center"><button type="button" class="btn btn-sm btn-block btn-outline-secondary w-100"></button></div>',
      },
    });
  });

  $("#addTaskPriority").hierarchySelect({
    hierarchy: false,
    search: false,
    width: 150,
    initialValueSet: true,
  });

  // view/edit form
  $("#viewEditTaskModal").on("show.bs.modal click", function (e) {
    $("#editTaskStartDate")
      .bootstrapMaterialDatePicker({
        format: "YYYY-MM-DD",
        time: false,
        weekStart: 1,
        clearButton: true,
      })
      .on("change", function (e, date) {
        $("#editTaskDueDate").bootstrapMaterialDatePicker("setMinDate", date);
      });

    $("#editTaskDueDate").bootstrapMaterialDatePicker({
      format: "YYYY-MM-DD",
      time: false,
      weekStart: 1,
      clearButton: true,
    });

    $("#editTaskStartTime").bootstrapMaterialDatePicker({
      format: "HH:mm",
      date: false,
      shortTime: false,
      clearButton: true,
    });

    $("#editTaskDueTime").bootstrapMaterialDatePicker({
      format: "HH:mm",
      date: false,
      shortTime: false,
      clearButton: true,
    });

    $("#editRepeatTaskDueDate").bootstrapMaterialDatePicker({
      format: "YYYY-MM-DD",
      time: false,
      weekStart: 1,
      clearButton: true,
    });

    if ($("#editAllDayTask").is(":checked")) {
      $("#editTaskStartTime").hide();
      $("#editTaskDueTime").hide();
    } else {
      $("#editTaskStartTime").show();
      $("#editTaskDueTime").show();
    }
  });

  $("#editRepeatTask").on("click", function () {
    // preview rrule in modal
    var calendar1 = document.getElementById("calendar1");
    var calendar2 = document.getElementById("calendar2");
    var calendar3 = document.getElementById("calendar3");

    var calendar2 = new FullCalendar.Calendar(calendar2, {
      headerToolbar: {
        left: "title",
        center: "",
        right: "",
      },
      aspectRatio: 1.7,
      showNonCurrentDates: false,
      initialView: "dayGridMonth",
      firstDay: 1,
      navLinks: false, // can click day/week names to navigate views
      nowIndicator: true,
      dayMaxEvents: false, // allow "more" link when too many events
      editable: false,
      eventDurationEditable: false,
      selectable: false,
      handleWindowResize: true,
      businessHours: false,
      weekNumbers: false,
      fixedWeekCount: true,
    });
    calendar2.render();

    var calendar3 = new FullCalendar.Calendar(calendar3, {
      headerToolbar: {
        left: "title",
        center: "",
        right: "",
      },
      aspectRatio: 1.7,
      showNonCurrentDates: false,
      initialView: "dayGridMonth",
      firstDay: 1,
      navLinks: false, // can click day/week names to navigate views
      nowIndicator: true,
      dayMaxEvents: false, // allow "more" link when too many events
      editable: false,
      eventDurationEditable: false,
      selectable: false,
      handleWindowResize: true,
      businessHours: false,
      weekNumbers: false,
      fixedWeekCount: true,
    });
    calendar3.render();

    var calendar1 = new FullCalendar.Calendar(calendar1, {
      headerToolbar: {
        left: "title",
        center: "",
        right: "prev,today,next",
      },
      aspectRatio: 1.7,
      showNonCurrentDates: false,
      initialView: "dayGridMonth",
      firstDay: 1,
      navLinks: false, // can click day/week names to navigate views
      nowIndicator: true,
      dayMaxEvents: false, // allow "more" link when too many events
      editable: false,
      eventDurationEditable: false,
      selectable: false,
      handleWindowResize: true,
      businessHours: false,
      weekNumbers: false,
      fixedWeekCount: true,
      datesSet: function (view) {
        if (view) {
          // Calendar 1 Current Start date
          var cal1Date = view.view.currentStart;

          // Calendar 2 & 3 new dates
          var cal2Date = new Date(cal1Date.setMonth(cal1Date.getMonth() + 1));
          var cal3Date = new Date(cal1Date.setMonth(cal1Date.getMonth() + 1));

          // Set new dates
          calendar2.gotoDate(cal2Date);
          calendar3.gotoDate(cal3Date);
        }
      },
    });
    calendar1.render();

    $("#rrule-data").on("change", function () {
      var myEvent = {
        title: "",
        rrule: $(this).val(),
        display: "background",
      };

      calendar1.removeAllEvents();
      calendar1.addEvent(myEvent);

      calendar2.removeAllEvents();
      calendar2.addEvent(myEvent);

      calendar3.removeAllEvents();
      calendar3.addEvent(myEvent);
    });

    $(".yearly #select-nth").multiselect({
      nonSelectedText: "nth",
      buttonWidth: "65px",
      // includeResetOption: true,
      // resetText: "Clear selection",
      buttonContainer: '<div class="btn-group pe-1" />',
      buttonClass: "form-select form-select-sm",
      templates: {
        button:
          '<button type="button" class="multiselect dropdown-toggle" data-bs-toggle="dropdown"><span class="multiselect-selected-text"></span></button>',
        resetButton:
          '<div class="multiselect-reset text-center"><button type="button" class="btn btn-sm btn-block btn-outline-secondary w-100"></button></div>',
      },
    });

    $(".yearly #select-day").multiselect({
      nonSelectedText: "Day(s)",
      buttonWidth: "90px",
      // includeResetOption: true,
      // resetText: "Clear selection",
      buttonContainer: '<div class="btn-group pe-1" />',
      buttonClass: "form-select form-select-sm",
      templates: {
        button:
          '<button type="button" class="multiselect dropdown-toggle" data-bs-toggle="dropdown"><span class="multiselect-selected-text"></span></button>',
        resetButton:
          '<div class="multiselect-reset text-center"><button type="button" class="btn btn-sm btn-block btn-outline-secondary w-100"></button></div>',
      },
    });

    $(".yearly #select-month").multiselect({
      nonSelectedText: "Month(s)",
      buttonWidth: "105px",
      // includeResetOption: true,
      // resetText: "Clear selection",
      buttonContainer: '<div class="btn-group" />',
      buttonClass: "form-select form-select-sm",
      templates: {
        button:
          '<button type="button" class="multiselect dropdown-toggle" data-bs-toggle="dropdown"><span class="multiselect-selected-text"></span></button>',
        resetButton:
          '<div class="multiselect-reset text-center"><button type="button" class="btn btn-sm btn-block btn-outline-secondary w-100"></button></div>',
      },
    });

    $(".monthly #select-nth").multiselect({
      nonSelectedText: "nth",
      buttonWidth: "65px",
      // includeResetOption: true,
      // resetText: "Clear selection",
      buttonContainer: '<div class="btn-group pe-1" />',
      buttonClass: "form-select form-select-sm",
      templates: {
        button:
          '<button type="button" class="multiselect dropdown-toggle" data-bs-toggle="dropdown"><span class="multiselect-selected-text"></span></button>',
        resetButton:
          '<div class="multiselect-reset text-center"><button type="button" class="btn btn-sm btn-block btn-outline-secondary w-100"></button></div>',
      },
    });

    $(".monthly #select-day").multiselect({
      nonSelectedText: "Day(s)",
      buttonWidth: "90px",
      // includeResetOption: true,
      // resetText: "Clear selection",
      buttonContainer: '<div class="btn-group pe-1" />',
      buttonClass: "form-select form-select-sm",
      templates: {
        button:
          '<button type="button" class="multiselect dropdown-toggle" data-bs-toggle="dropdown"><span class="multiselect-selected-text"></span></button>',
        resetButton:
          '<div class="multiselect-reset text-center"><button type="button" class="btn btn-sm btn-block btn-outline-secondary w-100"></button></div>',
      },
    });

    $(".monthly #select-month").multiselect({
      nonSelectedText: "Month(s)",
      buttonWidth: "105px",
      // includeResetOption: true,
      // resetText: "Clear selection",
      buttonContainer: '<div class="btn-group" />',
      buttonClass: "form-select form-select-sm",
      templates: {
        button:
          '<button type="button" class="multiselect dropdown-toggle" data-bs-toggle="dropdown"><span class="multiselect-selected-text"></span></button>',
        resetButton:
          '<div class="multiselect-reset text-center"><button type="button" class="btn btn-sm btn-block btn-outline-secondary w-100"></button></div>',
      },
    });

    $(".weekly #select-days").multiselect({
      nonSelectedText: "Day(s)",
      buttonWidth: "90px",
      // includeResetOption: true,
      // resetText: "Clear selection",
      buttonContainer: '<div class="btn-group pe-1" />',
      buttonClass: "form-select form-select-sm",
      templates: {
        button:
          '<button type="button" class="multiselect dropdown-toggle" data-bs-toggle="dropdown"><span class="multiselect-selected-text"></span></button>',
        resetButton:
          '<div class="multiselect-reset text-center"><button type="button" class="btn btn-sm btn-block btn-outline-secondary w-100"></button></div>',
      },
    });
  });

  $("#editTaskPriority").hierarchySelect({
    hierarchy: false,
    search: false,
    width: 150,
    initialValueSet: true,
  });
});
