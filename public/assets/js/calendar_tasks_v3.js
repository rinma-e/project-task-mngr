document.addEventListener("DOMContentLoaded", function () {
  let baseUrl = window.location.origin + "/project-task-mngr/";
  // console.log(space_ids);
  let left, center, right, url, initialView;
  switch (page_title) {
    case "Today":
      left = "title";
      center = "";
      right = "";
      initialView = "listDay";
      url = baseUrl + "tasks/loadAllTasksAjax";
      break;
    case "Next 5 days":
      left = "title";
      center = "";
      right = "";
      initialView = "listFiveDays";
      url = baseUrl + "tasks/loadAllTasksAjax";
      break;
    default:
      left = "prevYear,prev,today,next,nextYear";
      center = "title";
      right = "dayGridMonth,timeGridWeek,timeGridDay,listWeek";
      initialView = "dayGridMonth";
      url = baseUrl + "tasks/loadAllSpaceTasksAjax";
  }
  var calendarEl = document.getElementById("calendar");
  var calendar = new FullCalendar.Calendar(calendarEl, {
    headerToolbar: {
      left: left,
      center: center,
      right: right,
    },
    initialView: initialView,
    firstDay: 1,
    navLinks: true, // can click day/week names to navigate views
    nowIndicator: true,
    dayMaxEvents: true, // allow "more" link when too many events
    editable: true,
    eventDurationEditable: true,
    selectable: true,
    handleWindowResize: true,
    businessHours: true,
    weekNumbers: true,
    slotDuration: "00:15:00",
    eventTimeFormat: {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    },
    slotLabelFormat: {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    },
    slotLabelInterval: "00:15:00",
    views: {
      listFiveDays: {
        type: "list",
        duration: { days: 5 },
        buttonText: "5 day",
      },
    },
    select: function (start, end) {},
    events: {
      url: url,
      method: "POST",
      dataType: "json",
      extraParams: {
        user_id: user_id,
        //*space_ids as comma delimited string
        // space_ids: space_ids
        //TODO: space_ids as array sent to TaskController as array
        space_ids: JSON.stringify(space_ids),
      },
      success: function (result) {
        var events = [];
        let currentDate = moment().format("YYYY-MM-DD");

        // tasks koji su overdue task_end_date < current_date
        result["tasks"].forEach(function (obj) {
          let start = moment(obj.start_date).format("YYYY-MM-DD HH:mm:ss");
          let end = obj.end_date
            ? moment(obj.end_date).format("YYYY-MM-DD HH:mm:ss")
            : null;
          let start_or_end = end ? end : start;
          let overdue =
            (!obj.finished || obj.finished > start_or_end) &&
            currentDate >= start_or_end
              ? moment(currentDate).diff(start_or_end, "days") + 1
              : 0;
          let duration = end ? moment(end).diff(start, "days") : obj.all_day;

          let event = {
            id: obj.id,
            title: obj.title,
            start: start,
            end: overdue
              ? moment(start_or_end)
                  .add(overdue, "days")
                  .format("YYYY-MM-DD HH:mm:ss")
              : end,
            allDay: obj.all_day == "0" ? false : true,
            color: obj.finished ? (color = "#d3d3d3") : "",
            // textColor: overdue ? "#f41127" : "",
            // borderColor: overdue && duration == 0 ? "#f41127" : "",
            className: overdue ? "text-danger" : "",
            extendedProps: {
              description: obj.description,
              originalStart: obj.start_date,
              originalEnd: obj.end_date,
              started: obj.started,
              finished: obj.finished,
              overdue: overdue,
              duration: duration,
              spaceId: obj.space_id,
              spaceName: obj.space_name,
              priority: obj.priority,
              trackWorkingH: obj.tracking_working_h,
              recurring: obj.recurring,
              reminder: obj.reminder,
              tmz: obj.timezone,
              ownerId: obj.owner_id,
              parentTaskId: obj.parent_task_id,
            },
          };

          if (!duration && overdue) {
            event.rrule =
              "DTSTART:" +
              moment(start).format("YYYYMMDDTHHmmss") +
              "\nRRULE:FREQ=DAILY;COUNT=2;INTERVAL=" +
              overdue +
              ";WKST=MO;BYDAY=MO,TU,WE,TH,FR";
          }
          // console.log(event.title, event.start, event.end, duration, overdue);
          events.push(event);
        });
        return events;
      },
      failure: function (err) {
        console.log(err);
      },
    },
    eventContent: function (arg) {
      let event = arg.event;
      // console.log(arg);
      if (
        calendar.view.type == "dayGridMonth" &&
        !event.extendedProps.finished
      ) {
        const start = moment(event.start).format("YYYY-MM-DD");
        const end = event.end ? moment(event.end).format("YYYY-MM-DD") : start;
        let customHtml = "";
        let fontColor =
          moment(event.end).diff(moment(event.start), "hours") <= 24
            ? " text-danger"
            : "";
        if (calendar.view.type == "listWeek") {
          fontColor = " text-danger";
        }

        //TODO: PUT VARIANTS IN TO CSS AND CHANGE CLASSES VIA JS (so user can change progress bar theme)
        //* FOR BOTH PROGRESS BAR VARIANTS 'LEFT' PROPERTY CALCULATION IS SAME
        //* VARIANT1: show real started time as progress bar below title
        // let progress_bar = !event.extendedProps.started ? "" : "<div data-progress-id='" + event.id + "' class='position-relative m-0 p-0' style='background-color:rgba(255,255,255,0.6); height: 3px'></div>"
        // customHtml = "<p data-event-id='" + event.id + "'class='position-relative d-inline m-0 pe-1 fw-bold" + fontColor + "'>" + event.title + "<span class='position-absolute top-0 start-100 translate-middle-y badge bg-light rounded-pill border border-danger text-danger fw-normal'>+" + event.extendedProps.overdue + "<small>d</small></span></p>" + progress_bar;

        //* VARIANT2: show progress bar for:
        //*   1. overdue dates as non transparent overlay,
        //*   2. actual dates as transparent overlay,
        let progress_bar =
          !event.extendedProps.started || !event.extendedProps.duration
            ? ""
            : $("<div>", {
                "data-progress-id": event.id,
                class: "position-absolute opacity-25 bg-white",
                style: "inset:0; height:100%;z-index:-1;",
              });

        let progress_bar_overdue = !event.extendedProps.overdue
          ? ""
          : $("<div>", {
              "data-progress-overdue-id": event.id,
              class: "position-absolute bg-danger",
              style: "inset:0; height:100%;z-index:-1;",
            });

        let singleDayTaskDot = event.extendedProps.overdue
          ? $("<i>", { class: "fa-solid fa-clock text-danger mx-1" })
          : $("<div>", { class: "fc-daygrid-event-dot" });

        let showTime =
          event.allDay || event.extendedProps.overdue
            ? ""
            : moment(event.start).format("HH:mm");

        if (!event.extendedProps.duration) {
          customHtml = $("<div>")
            .append(singleDayTaskDot)
            .append(
              $("<div>", {
                class: "fc-event-time",
                html: showTime,
              })
            )
            .append(
              $("<div>", {
                class: "fc-event-title",
                html: event.title,
              }).append(
                $("<small>", {
                  class: "fw-normal",
                  html: " (" + event.extendedProps.spaceName + ")",
                })
              )
            );
        } else {
          customHtml = $("<div>").append(
            $("<div>", { class: "fc-event-main-frame" })
              .append(progress_bar_overdue)
              .append(progress_bar)
              .append(
                $("<div>", {
                  class: "fc-event-time",
                  html: event.extendedProps.overdue
                    ? $("<i>", { class: "fa-solid fa-clock ms-1" })
                    : showTime,
                })
              )
              .append(
                $("<div>", { class: "fc-event-title-container" })
                  .append(
                    $("<div>", {
                      class: "fc-event-title fc-sticky",
                      html: event.title,
                    })
                  )
                  .append(
                    $("<small>", {
                      class: "fw-normal",
                      html: " (" + event.extendedProps.spaceName + ")",
                    })
                  )
              )
          );
        }

        //* VARIANT3: show progress bar as striped transparent overlay
        // let progress_bar = !event.extendedProps.started && start !== end ? "" : "<div class='row g-0'><div data-progress-id='" + event.id + "' class='col' style='position:absolute;inset:0; height:100%;background-color:rgba(255,255,255,0.4);background-image:repeating-linear-gradient(-55deg, transparent 0px, transparent 5px, transparent 5px, rgba(255,255,255,0.4) 5px, rgba(255,255,255,0.4) 10px);'></div></div>"
        // customHtml = "<div class='container position-relative g-0'>" + progress_bar + "<div class='row g-0'><div data-event-id='" + event.id + "'class='col-auto position-relative m-0 p-0 px-1 fw-bold" + fontColor + "'>" + event.title + "<span class='position-absolute top-0 start-100 translate-middle-y badge bg-light rounded-pill border border-danger text-danger fw-normal'>+" + event.extendedProps.overdue + "<small>d</small></span></div></div>";

        return {
          html: customHtml.html(),
        };
      }
    },
    eventDidMount: function (info) {
      //* ADJUST 'LEFT' PROPERTY TO SHOW STARTED/OVERDUE DATE FOR TASKS THAT SPREAD
      //* ACROSS MULTIPLE CALENDAR CELLS
      let event = info.event;
      // progress bar div
      let progress_bar = info.el.querySelector(
        "div[data-progress-id='" + event.id + "'"
      );
      // overdue progress bar div
      let progress_bar_overdue = info.el.querySelector(
        "div[data-progress-overdue-id='" + event.id + "'"
      );
      // only if task have progress_bar and calendar.view.type !== 'listWeek' because in 'listWeek' don't have calendar elements
      if (
        (progress_bar || progress_bar_overdue) &&
        calendar.view.type !== "listWeek"
      ) {
        // calendar cell width
        let calendar_cell_width = info.el
          .closest("td")
          .getBoundingClientRect().width;
        // task start date in calendar row
        let task_start_date_in_row = moment(
          info.el.closest("td").getAttribute("data-date")
        ).format("YYYY-MM-DD");
        // first day in row where task bar is
        let first_date_in_row = moment(
          info.el.closest("tr").firstChild.getAttribute("data-date")
        ).format("YYYY-MM-DD");
        // last day in row where task bar is
        let last_date_in_row = moment(
          info.el.closest("tr").lastChild.getAttribute("data-date")
        ).format("YYYY-MM-DD");
        // actual starting date
        let started = event.extendedProps.started
          ? moment(event.extendedProps.started).format("YYYY-MM-DD")
          : false;
        // overdue starting date
        let overdue_started = event.extendedProps.overdue
          ? moment(event.end)
              .subtract(event.extendedProps.overdue, "days")
              .format("YYYY-MM-DD")
          : false;

        if (started) {
          // if started date is younger than last day in row delete progress bar in that row
          if (last_date_in_row < started) {
            progress_bar.remove();
          } else if (
            started >= first_date_in_row &&
            started <= last_date_in_row
          ) {
            // calculate difference in days between 'start date in row' and actual 'started' date
            let offset_start = moment(started).diff(
              task_start_date_in_row,
              "days"
            );
            // get link element who contains 'margin-left' property that moves beginning of task graphic in first cell
            const styles = window.getComputedStyle(info.el.closest("a"));
            // get correction based on value of 'margin-left' property
            let correction_left =
              styles.getPropertyValue("margin-left") == "0px" ? 0 : 2;
            // calculate 'left' property value
            let calc_left =
              offset_start * calendar_cell_width - correction_left;
            // adjust 'left' property of progress_bar
            progress_bar.style.left = calc_left + "px";
          }
        }

        if (overdue_started) {
          // if started date is younger than last day in row delete progress bar in that row
          if (last_date_in_row < overdue_started) {
            progress_bar_overdue.remove();
          } else if (
            overdue_started >= first_date_in_row &&
            overdue_started <= last_date_in_row
          ) {
            // calculate difference in days between 'start date in row' and actual 'overdue' date
            let offset_start_overdue =
              moment(overdue_started).diff(task_start_date_in_row, "days") + 1;
            // get link element who contains 'margin-left' property that moves beginning of task graphic in first cell
            const styles = window.getComputedStyle(info.el.closest("a"));
            // get correction based on value of 'margin-left' property
            let correction_left_overdue =
              styles.getPropertyValue("margin-left") == "0px" ? 0 : 2;
            // calculate 'left' property value
            let calc_left_overdue =
              offset_start_overdue * calendar_cell_width -
              correction_left_overdue;
            // adjust 'left' property of progress_bar
            progress_bar_overdue.style.left = calc_left_overdue + "px";
          }
        }
      }
    },
    eventClick: function (info) {
      populateViewEditFormModal(info);
    },
  });
  calendar.render();

  // show/hide add task button in down right corner only if space selected don't have children
  $(function () {
    let space_id = $("#addTaskFormElement").find("[name='space_id']").val();
    let menuData = JSON.parse(localStorage.getItem("menuData"));
    let children = haveChildren(menuData, space_id);
    if (children) {
      $("#addTaskBtn").addClass("invisible");
    } else {
      $("#addTaskBtn").removeClass("invisible");
    }
  });

  // check if title in add/edit modal is not empty and in correct format
  $("[name='title']").on("keyup focus", function () {
    checkNotEmptyAndCorrectFormat($(this), "^[a-zA-Z0-9]");
  });

  // handle add task submit
  $("#addTaskFormElement").on("submit", function (e) {
    e.preventDefault();

    // if title is empty or in incorrect format show error
    if (
      !checkNotEmptyAndCorrectFormat(
        $(this).find("[name='title']"),
        "^[a-zA-Z0-9]"
      )
    )
      return;

    var dataString = $(this).serializeArray();

    $.ajax({
      type: "POST",
      url: baseUrl + "tasks/addTaskAjax",
      dataType: "json",
      data: dataString,
      success: function (result) {
        if (result["errors"] || !result) {
          //show errors
        } else if (result["last_id"]) {
          //reset form
          $("#addTaskFormElement")[0].reset();

          //hide task modal
          $("#addTaskModal").modal("hide");

          // reload calendar events
          calendar.refetchEvents();

          //show notification
          Lobibox.notify("success", {
            pauseDelayOnHover: true,
            continueDelayOnInactiveTab: false,
            icon: "bx bx-check-circle",
            sound: false,
            msg: "Task '" + dataString[0].value + "' successfully added",
          });
        }
      },
      error: function (jqXhr, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
      },
    });
  });

  // handle edit task submit
  $("#viewEditTaskFormElement").on("submit", function (e) {
    e.preventDefault();

    // if title is empty or in incorrect format show error
    if (
      !checkNotEmptyAndCorrectFormat(
        $(this).find("[name='title']"),
        "^[a-zA-Z0-9]"
      )
    )
      return;

    var dataString = $(this).serializeArray();

    $.ajax({
      type: "POST",
      url: baseUrl + "tasks/editTaskAjax",
      dataType: "json",
      data: dataString,
      success: function (result) {
        if (result["errors"] || !result) {
          //show errors
        } else {
          //reset form
          $("#viewEditTaskFormElement")[0].reset();

          //hide task modal
          $("#viewEditTaskModal").modal("hide");

          // reload calendar events
          calendar.refetchEvents();

          //show notification
          Lobibox.notify("success", {
            pauseDelayOnHover: true,
            continueDelayOnInactiveTab: false,
            icon: "bx bx-check-circle",
            sound: false,
            msg: "Task '" + dataString[0].value + "' successfully edited",
          });
        }
      },
      error: function (jqXhr, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
      },
    });
  });

  // delete title field error massages if exist
  $("#viewEditTaskModal").on("hide.bs.modal", function () {
    $(this).find(".is-invalid").removeClass("is-invalid");
    $(this).find(".invalid-feedback").remove();
  });

  // delete title field error massages if exist
  $("#addTaskModal").on("hide.bs.modal", function () {
    $(this).find(".is-invalid").removeClass("is-invalid");
    $(this).find(".invalid-feedback").remove();
  });

  // show/hide edit/save task buttons
  $("#edit-task").on("click", function () {
    // unlock all fields
    $("#viewEditTaskForm").find(":disabled").prop("disabled", false);
    // show/hide proper buttons
    $("#delete-task").removeClass("invisible");
    $("#edit-task").removeClass("order-last").addClass("invisible");
    $("#save-task").removeClass("invisible").addClass("order-last");
  });

  // show confirm delete dialog
  $("#delete-task").on("click", function () {
    let title = $("#viewEditTaskFormElement").find("[name='title']").val();
    $("#confirmDeleteModal .modal-body").html(
      $("<h5>", {
        html: "Are You sure you want to delete task '" + title + "'?",
      })
    );
  });

  // handle delete task
  $("#confirm-task-delete").on("click", function () {
    let title = $("#viewEditTaskFormElement").find("[name='title']").val();
    let task_id = $("#viewEditTaskFormElement").find("[name='task_id']").val();

    $.ajax({
      type: "POST",
      url: baseUrl + "tasks/deleteTaskAjax",
      dataType: "json",
      data: { task_id: task_id },
      success: function (result) {
        if (result["errors"] || !result) {
          $("#confirmDeleteModal").modal("hide");
          $("#viewEditTaskModal").modal("show");
          //show error
          Lobibox.notify("error", {
            pauseDelayOnHover: true,
            continueDelayOnInactiveTab: false,
            icon: "bx bx-error-circle",
            sound: false,
            msg: "Something went wrong while deleting task '" + title + "'!",
          });
        } else {
          //reset form
          $("#viewEditTaskFormElement")[0].reset();

          //hide task modal
          $("#confirmDeleteModal").modal("hide");
          $("#viewEditTaskModal").modal("hide");

          // reload calendar events
          calendar.refetchEvents();

          //show notification
          Lobibox.notify("success", {
            pauseDelayOnHover: true,
            continueDelayOnInactiveTab: false,
            icon: "bx bx-check-circle",
            sound: false,
            msg: "Task '" + title + "' successfully deleted.",
          });
        }
      },
      error: function (jqXhr, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
      },
    });
  });

  // save started date to db
  $("#editTaskStart").on("click", function () {
    let task_id = $("#viewEditTaskFormElement").find("[name='task_id']").val();
    let title = $("#viewEditTaskFormElement").find("[name='title']").val();
    let currentDate = moment().format("YYYY-MM-DD HH:mm");

    $.ajax({
      type: "POST",
      url: baseUrl + "tasks/addTaskStartedDateAjax",
      dataType: "json",
      data: { task_id: task_id, started: currentDate },
      success: function (result) {
        if (result["errors"] || !result) {
          //show errors
        } else {
          // add started date to event
          let event = calendar.getEventById(task_id);
          event.setExtendedProp("started", currentDate);
          // rerender modal with new data
          populateViewEditFormModal(event);

          // reload calendar events
          calendar.refetchEvents();

          //show notification
          Lobibox.notify("success", {
            pauseDelayOnHover: true,
            continueDelayOnInactiveTab: false,
            icon: "bx bx-check-circle",
            sound: false,
            msg: "Task '" + title + "' start time successfully added",
          });
        }
      },
      error: function (jqXhr, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
      },
    });
  });

  // save finished date to db
  $("#editTaskFinish").on("click", function () {
    let task_id = $("#viewEditTaskFormElement").find("[name='task_id']").val();
    let title = $("#viewEditTaskFormElement").find("[name='title']").val();
    let currentDate = moment().format("YYYY-MM-DD HH:mm");

    $.ajax({
      type: "POST",
      url: baseUrl + "tasks/addTaskFinishedDateAjax",
      dataType: "json",
      data: { task_id: task_id, finished: currentDate },
      success: function (result) {
        if (result["errors"] || !result) {
          //show errors
        } else {
          // add finished date to event
          let event = calendar.getEventById(task_id);
          event.setExtendedProp("finished", currentDate);
          // rerender modal with new data
          populateViewEditFormModal(event);

          // reload calendar events
          calendar.refetchEvents();

          //show notification
          Lobibox.notify("success", {
            pauseDelayOnHover: true,
            continueDelayOnInactiveTab: false,
            icon: "bx bx-check-circle",
            sound: false,
            msg: "Task '" + title + "' finish time successfully added",
          });
        }
      },
      error: function (jqXhr, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
      },
    });
  });
});

// helper function to select correct time zone in selection menu
function setTmzInForm(element, tmz) {
  element.find("option:selected").removeAttr("selected");
  // find element whose option value is same as timezone
  let tz_element = element.find("option[value='" + tmz + "'");
  if (tz_element.length) {
    tz_element.attr("selected", "selected");
  } else {
    // if not found check if possible to find timezone by searching city name in options text
    let city = tmz.split("/")[1];
    element
      .find("option")
      .filter(function () {
        return $(this).text().search(city) != -1;
      })
      .attr("selected", "selected");
  }
}

function haveChildren(menuData, space_id) {
  let children = false;
  menuData.forEach((element) => {
    if (element.id == space_id) {
      if (element.children) {
        children = true;
      }
    } else {
      if (element.children) {
        if (haveChildren(element.children, space_id)) children = true;
      }
    }
  });
  return children;
}

function populateViewEditFormModal(info) {
  let data = info.event ? info.event : info;
  // console.log(data);

  $("#viewEditTaskFormElement")[0].reset();

  let status = "";
  if (!data.extendedProps.started) {
    status = '<i class="fa-regular fa-circle text-secondary"></i> not started';
  } else if (data.extendedProps.started && !data.extendedProps.finished) {
    status = '<i class="fa-regular fa-clock text-info"></i> in progress';
  } else if (data.extendedProps.finished) {
    status = '<i class="fa-solid fa-circle-check text-success"></i> finished';
  }

  if (data.extendedProps.overdue) {
    status +=
      ' | <i class="fa-solid fa-clock text-danger"> ' +
      data.extendedProps.overdue +
      "</i> day(s) overdue";
  }
  $("#viewEditTaskStatus").html(status);
  // console.log(data);
  $("#viewEditTaskSpaceName").html(
    $("<H6>", {
      class: "fw-normal",
      html: "Space: " + data.extendedProps.spaceName,
    })
  );
  $("#editTaskTitle").val(data.title).prop("disabled", true);
  $("#editTaskDescription")
    .val(data.extendedProps.description)
    .prop("disabled", true);

  //? setting priority work around. 'hierarchySelect' plugin don't have function
  //? to manually set selected option after it's initialization
  let priority = $(
    "#editTaskPriority a[data-value='" + data.extendedProps.priority + "']"
  );
  $("#editTaskPriority").find(".active").removeClass("active");
  priority.addClass("active");
  $("#viewEditTaskFormElement #select-priority-button")
    .html(priority.html())
    .prop("disabled", true);

  //? determine which start, end and allDay to show.
  //? Overdue for tasks are added as additional event because fullcalendar can't show overdue
  let start = data.extendedProps.originalStart;
  let end = data.extendedProps.originalEnd;
  let allDay = data.allDay;
  // set start date
  $("#editTaskStartDate")
    .val(moment(start).format("YYYY-MM-DD"))
    .prop("disabled", true);
  // set start time if task is not allDay
  !allDay
    ? $("#editTaskStartTime")
        .val(moment(start).format("HH:mm"))
        .prop("disabled", true)
    : $("#editTaskStartTime").val("").prop("disabled", true);
  // set due date if exist
  end
    ? $("#editTaskDueDate")
        .val(moment(end).format("YYYY-MM-DD"))
        .prop("disabled", true)
    : $("#editTaskDueDate").val("").prop("disabled", true);
  // set due time if exist and if task is not allDay
  end && !allDay
    ? $("#editTaskDueTime")
        .val(moment(end).format("HH:mm"))
        .prop("disabled", true)
    : $("#editTaskDueTime").val("").prop("disabled", true);
  // set allDay
  allDay
    ? $("#editAllDayTask").attr("checked", true).prop("disabled", true)
    : $("#editAllDayTask").attr("checked", false).prop("disabled", true);

  // task started and finished date/time
  let startedDateTimeFormat = "YYYY-MM-DD HH:mm";
  let finishedDateTimeFormat = "YYYY-MM-DD HH:mm";
  if (data.extendedProps.started) {
    $("#editTaskStart").hasClass("invisible")
      ? ""
      : $("#editTaskStart").addClass("invisible").removeClass("order-last");

    $("#editTaskStarted")
      .removeClass("invisible")
      .find("div")
      .html(moment(data.extendedProps.started).format(startedDateTimeFormat));
    $("#collapseStartedFinished").collapse("show");
  } else {
    if (!$("#editTaskStarted").hasClass("invisible")) {
      $("#editTaskStarted").addClass("invisible");
    }

    $("#collapseStartedFinished").collapse("hide");

    !$("#editTaskStart").hasClass("invisible")
      ? ""
      : $("#editTaskStart").removeClass("invisible").addClass("order-last");
  }

  if (data.extendedProps.finished) {
    $("#editTaskFinish").hasClass("invisible")
      ? ""
      : $("#editTaskFinish").addClass("invisible");

    $("#editTaskFinished")
      .removeClass("invisible")
      .find("div")
      .html(moment(data.extendedProps.finished).format(finishedDateTimeFormat));
  } else {
    if (!$("#editTaskFinished").hasClass("invisible")) {
      $("#editTaskFinished").addClass("invisible");
    }

    if (data.extendedProps.started) {
      $("#editTaskFinish").hasClass("invisible")
        ? $("#editTaskFinish").removeClass("invisible")
        : "";
    } else {
      $("#editTaskFinish").hasClass("invisible")
        ? ""
        : $("#editTaskFinish").addClass("invisible");
    }
  }

  // set time zone
  setTmzInForm($("#viewEditTaskFormElement #timezone"), data.extendedProps.tmz);
  $("#viewEditTaskFormElement #timezone").prop("disabled", true);

  let task_id = data.id.slice(-1) == "o" ? data.id.slice(0, -1) : data.id;
  $("#viewEditTaskFormElement [name='task_id']").val(task_id);
  $("#viewEditTaskFormElement #editRepeatTask").prop("disabled", true);
  $("#viewEditTaskFormElement #editTaskReminder").prop("disabled", true);

  $("#delete-task").addClass("invisible");
  $("#save-task").removeClass("order-last").addClass("invisible");
  $("#edit-task").removeClass("invisible").addClass("order-last");

  $("#viewEditTaskModal").modal("show");
}

// function to check input field as you type for not empty and correct format and show errors
function checkNotEmptyAndCorrectFormat(inputElement, regex) {
  let text = inputElement.val();
  if (!text) {
    inputElement.addClass("is-invalid");
    inputElement.parent().find(".invalid-feedback").remove();
    inputElement.parent().append(
      $("<div>", {
        class: "invalid-feedback",
        html: "Title must not be empty!",
      })
    );
    return false;
  } else {
    if (!text.match(regex)) {
      inputElement.addClass("is-invalid");
      inputElement.parent().find(".invalid-feedback").remove();
      inputElement.parent().append(
        $("<div>", {
          class: "invalid-feedback",
          html: "Title can start only with small letter, big letter or number",
        })
      );
      return false;
    } else {
      inputElement.removeClass("is-invalid");
      inputElement.parent().find(".invalid-feedback").remove();
      return true;
    }
  }
}
