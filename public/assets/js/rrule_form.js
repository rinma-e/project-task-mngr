$(function () {
  var date = new Date();
  var start_date = $("#addTaskStartDate").val()
    ? $("#addTaskStartDate").val()
    : $("#editTaskStartDate").val();
  start_date = !start_date.trim()
    ? date.toISOString().slice(0, 10)
    : start_date;
  var dtstart = moment(start_date).format("YYYYMMDD");

  var month = date.getMonth();
  var nth = (nth = ["1", "2", "3", "4", "Last"]);
  var rrule = {
    asString: "FREQ=YEARLY;BYMONTH=1;BYMONTHDAY=1",
    nth: nth,
    date: date,
    nthDay: nth[Math.floor(date.getDate() / 7)],
    year: date.getFullYear(),
    month: month,
    humanMonth: month + 1,
    monthday: date.getDate(),
    day: date.getDay() - 1,
    days: ["MO", "TU", "WE", "TH", "FR", "SA", "SU"],
    monthdays: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    updateRrule: function (ruleType) {
      var end = "";
      if ($("#rrules-end .count:visible").length > 0) {
        var interval = Math.round($("#rrules-end .interval").val());
        if (!Number.isInteger(interval) || interval < 1) {
          interval = 1;
        }
        end = ";COUNT=" + interval;
      }
      if ($("#rrules-end .until:visible").length > 0) {
        var date = new Date($("#rrules-end .date").val());
        if (!(date.toString() === "Invalid Date")) {
          var month = "" + (date.getMonth() + 1);
          var day = "" + date.getDate();
          var year = date.getFullYear();
          if (month.length < 2) month = "0" + month;
          if (day.length < 2) day = "0" + day;
          end = ";UNTIL=" + year + month + day;
        }
      }
      switch (ruleType) {
        case "yearly-on": {
          var month = $("#rrule .yearly .yearly-on .month").val();
          var monthday = $("#rrule .yearly .yearly-on .monthday").val();
          rrule.asString =
            "FREQ=YEARLY;BYMONTH=" + month + ";BYMONTHDAY=" + monthday + end;
          break;
        }
        case "yearly-onthe": {
          var month = $("#rrule .yearly .yearly-onthe .month").val();
          var day = $("#rrule .yearly .yearly-onthe .day").val();
          var nth = $("#rrule .yearly .yearly-onthe .nth").val();
          rrule.asString =
            "FREQ=YEARLY;BYMONTH=" +
            month +
            ";BYDAY=" +
            day +
            ";BYSETPOS=" +
            nth +
            end;
          break;
        }
        case "monthly-on": {
          var monthday = $("#rrule .monthly .monthly-on .monthday").val();
          var interval = Math.round($("#rrule .monthly .interval").val());
          if (!Number.isInteger(interval) || interval < 1) {
            interval = 1;
          }
          rrule.asString =
            "FREQ=MONTHLY;BYMONTHDAY=" +
            monthday +
            ";INTERVAL=" +
            interval +
            end;
          break;
        }
        case "monthly-onthe": {
          var interval = Math.round($("#rrule .monthly .interval").val());
          if (!Number.isInteger(interval) || interval < 1) {
            interval = 1;
          }
          var day = $("#rrule .monthly .monthly-onthe .day").val();
          var nth = $("#rrule .monthly .monthly-onthe .nth").val();
          rrule.asString =
            "FREQ=MONTHLY;INTERVAL=" +
            interval +
            ";BYDAY=" +
            day +
            ";BYSETPOS=" +
            nth +
            end;
          break;
        }
        case "weekly": {
          var interval = Math.round($("#rrule .weekly .interval").val());
          if (!Number.isInteger(interval) || interval < 1) {
            interval = 1;
          }
          var days = "";
          $('#rrule .weekly input[type="checkbox"]:checked').each(function (
            index
          ) {
            if (this.checked) {
              if (index > 0) {
                days += ",";
              }
              days += this.value;
            }
          });
          if (days.length == 0) {
            days = rrule.days[rrule.day];
          }
          rrule.asString =
            "FREQ=WEEKLY;INTERVAL=" + interval + ";BYDAY=" + days + end;
          break;
        }
        case "daily": {
          var interval = Math.round($("#rrule .daily .interval").val());
          if (!Number.isInteger(interval) || interval < 1) {
            interval = 1;
          }
          rrule.asString = "FREQ=DAILY;INTERVAL=" + interval + end;
          break;
        }
        default: {
          rrule.asString = "";
          break;
        }
      }

      $("#rrule").data(
        "rrule",
        "DTSTART:" + dtstart + "\nRRULE:" + rrule.asString
      );
      $("#rrule-result").html($("#rrule").data("rrule"));
    },
  };

  $(function () {
    $("#rrule .day").each(function () {
      $(this).val(rrule.days[rrule.day]);
    });
    $("#rrule .days").each(function () {
      var selector = 'option[value="' + rrule.days[rrule.day] + '"]';
      $(this).find(selector).prop("selected", true);
    });
    $("#rrule .monthly-on .monthday").each(function () {
      var $monthday = $(this);
      $monthday.val(rrule.monthday);
      $monthday.trigger("change");
    });
    $("#rrule .month").each(function () {
      var selector = 'option[value="' + (month + 1) + '"]';
      $(this).find(selector).attr("selected", true);
    });
    $("#rrule .monthly-on select").on("change", function () {
      rrule.updateRrule("monthly-on");
    });
    $("#rrule .monthly-onthe select").on("change", function () {
      rrule.updateRrule("monthly-onthe");
    });
    $("#rrule .frequency").on("change", function () {
      var selected = $(this).val().toLowerCase();
      $("#rrule")
        .children()
        .each(function () {
          var $this = $(this);
          if ($this.hasClass(selected) || this.hasAttribute("id")) {
            $this.css("display", "flex");
          } else {
            $this.css("display", "none");
          }
          if ($this.hasClass(selected)) {
            if (this.hasAttribute("data-selector")) {
              rrule.updateRrule($this.data("selector"));
            } else {
              rrule.updateRrule(
                $this.find("*[data-selector]:visible").data("selector")
              );
            }
          }
        });
    });
    $("#rrule .monthly .interval, #rrule .daily .interval").on(
      "change input",
      function () {
        rrule.updateRrule(
          $("#rrule *[data-selector]:visible").data("selector")
        );
      }
    );
    $("#rrule .weekly input").on("change input", function () {
      rrule.updateRrule("weekly");
    });
    $("#rrule .monthly .type").on("change", function () {
      var $this = $(this);
      if ($this.val() == "on") {
        $("#rrule .monthly .monthly-on").css("display", "flex");
        $("#rrule .monthly .monthly-onthe").css("display", "none");
        rrule.updateRrule("monthly-on");
      } else {
        $("#rrule .monthly .monthly-on").css("display", "none");
        $("#rrule .monthly .monthly-onthe").css("display", "flex");
        rrule.updateRrule("monthly-onthe");
      }
    });
    $("#rrule .yearly .type").on("change", function () {
      var $this = $(this);
      if ($this.val() == "on") {
        $("#rrule .yearly .yearly-on").css("display", "flex");
        $("#rrule .yearly .yearly-onthe").css("display", "none");
        rrule.updateRrule("yearly-on");
      } else {
        $("#rrule .yearly .yearly-on").css("display", "none");
        $("#rrule .yearly .yearly-onthe").css("display", "flex");
        rrule.updateRrule("yearly-onthe");
      }
    });
    $("#rrule .yearly .yearly-onthe select").on("change", function () {
      rrule.updateRrule("yearly-onthe");
    });
    $("#rrule .yearly .yearly-on .monthday").on("change", function () {
      rrule.updateRrule("yearly-on");
    });
    $("#rrule .yearly .yearly-on .month")
      .on("change", function () {
        var $this = $(this);
        var selectedMonth = $this.val() - 1;
        var days = rrule.monthdays[selectedMonth];
        var $monthday = $this.parent().next().children();
        $monthday.html("");
        for (var i = 1; i <= days; i++) {
          var $option = $("<option value='" + i + "'>" + i + "</option>");
          $option.appendTo($monthday);
        }
        if (selectedMonth == month) {
          $monthday.val(rrule.monthday);
          $monthday.trigger("change");
        } else {
          $monthday.val(1);
          $monthday.trigger("change");
        }
      })
      .val(rrule.humanMonth)
      .trigger("change");
    $("#rrules-end div input").on("change, input", function () {
      rrule.updateRrule($("#rrule *[data-selector]:visible").data("selector"));
    });
    $("#rrules-end .ends").on("change", function () {
      $("#rrules-end > div.ends-at").css("display", "none");
      switch ($(this).val()) {
        case "count": {
          $("#rrules-end .count").css("display", "flex");
          break;
        }
        case "until": {
          $("#rrules-end .until").css("display", "flex");
          break;
        }
        default: {
          break;
        }
      }
      rrule.updateRrule($("#rrule *[data-selector]:visible").data("selector"));
    });
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    $("#addRepeatTaskDueDate")
      .on("change", function (e, date) {
        rrule.updateRrule(
          $("#rrule *[data-selector]:visible").data("selector")
        );
      })
      .bootstrapMaterialDatePicker("setDate", tomorrow)
      .bootstrapMaterialDatePicker("setMinDate", tomorrow);

    //* put or delete rrule-data value to be sent in addTask form
    //* based on #addRepeatTask switch state
    $("#addRepeatTask").on("click", function () {
      if ($("[name='repeatTask']").is(":checked")) {
        // console.log('checked');
        // hidden input fields don't fire 'change' event automatically
        // so it need to be fired manually
        $("#rrule-data").val($("#rrule").data("rrule")).trigger("change");
      } else {
        // console.log('not checked');
        $("#rrule-data").val("");
      }
    });
  });
});
