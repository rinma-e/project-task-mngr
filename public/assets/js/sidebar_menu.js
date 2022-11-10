/*----------------------------------------------------------------
	When adding, editing and deleting spaces they are reloaded via
	ajax from database
------------------------------------------------------------------*/

var baseUrl = window.location.origin + "/project-task-mngr/";
var default_icon_top_lvl = "bx bx-label";
var default_icon_sub_lvls = "bx bx-right-arrow-alt";
var parentId;
var spaceId;
var space_menu_action = "";
var original_element = "";
var original_icon = "";
var picked_icon;

$(document).ready(function () {
  loadMenu();

  $(document).on("click", "#menu a[data-spaceid]", function (e) {
    e.preventDefault();
    localStorage.removeItem("activeMenuItems");
    // first collect active links for sidebar menu
    let activeMenuItems = [];
    activeMenuItems.push($(this).data("spaceid"));
    $('#menu li.mm-active .has-arrow[aria-expanded="true"]').each(function () {
      activeMenuItems.push($(this).parent().data("spaceid"));
    });
    localStorage.setItem("activeMenuItems", activeMenuItems);

    //Create a Form for submitting id
    let $link = $(this).attr("href");
    let $form = $("<form/>")
      .attr("id", "data_form")
      .attr("action", $link)
      .attr("method", "post");
    $("body").append($form);

    let menuData = JSON.parse(localStorage.getItem("menuData"));
    let spaceIds = findSpacesToDelete(menuData, $(this).attr("data-spaceId"));
    //Append the values to be send.
    AddParameter($form, "spaceIds", spaceIds);

    //Send the Form.
    $form[0].submit();

    function AddParameter(form, name, value) {
      let $input = $("<input />")
        .attr("type", "hidden")
        .attr("name", name)
        .attr("value", value);
      form.append($input);
    }
  });

  $(document).on(
    "click",
    "#menu a[data-action], #menu .menu-label button",
    function (e) {
      e.preventDefault();
      removeInput(e);

      // input field to be appended
      let input = $("<div>")
        .append(
          $("<input/>", {
            class: "form-control form-control-sm",
            type: "text",
            name: "spacename",
            value: "",
          })
        )
        .append(
          $("<i>", {
            type: "button",
            class: "fas fa-check-circle confirm-edit text-success",
          })
        )
        .append(
          $("<i>", {
            type: "button",
            class: "fas fa-times-circle cancel-edit text-danger",
          })
        );

      let icon = $("<span>", {
        class: "icp icp-dd dropdown-toggle",
        "data-selected": "fa-car",
        "data-bs-toggle": "dropdown",
      });
      let icon_dropdown = $("<div>", { class: "dropdown-menu" });

      space_menu_action = $(this).data("action");
      if (space_menu_action == "add") {
        parentId =
          $(this).parents("li[data-spaceid]:first").length != 0
            ? $(this).parents("li[data-spaceid]:first").data("spaceid")
            : 0;
        $(function () {
          input.addClass("spaceinput");
          if (parentId > 0) {
            $(
              '#menu li[data-spaceid="' + parentId + '"] .mm-trigger:first'
            ).after($(input));
          } else {
            $("#menu .menu-label button").parent().after($(input));
          }
          $("#menu .spaceinput input").focus();
        });
      } else if (space_menu_action == "edit") {
        spaceId =
          $(this).parents("li[data-spaceid]:first").length != 0
            ? $(this).parents("li[data-spaceid]:first").data("spaceid")
            : false;
        parentId =
          $('#menu li[data-spaceid="' + spaceId + '"]').parents(
            "li[data-spaceid]:first"
          ).length != 0
            ? $('#menu li[data-spaceid="' + spaceId + '"]')
                .parents("li[data-spaceid]:first")
                .data("spaceid")
            : 0;

        picked_icon = "";
        input.addClass("spaceedit");
        original_element = $(
          '#menu li[data-spaceid="' + spaceId + '"] .spacename:first'
        )
          .clone()
          .detach();
        original_icon = $(
          '#menu li[data-spaceid="' + spaceId + '"] .parent-icon:first i'
        )
          .clone()
          .detach();

        $(function () {
          if (
            $('#menu li[data-spaceid="' + spaceId + '"]').has(".parent-icon")
              .length > 0
          ) {
            $(
              '#menu li[data-spaceid="' + spaceId + '"] .spacename:first'
            ).after($(input));
            $('#menu li[data-spaceid="' + spaceId + '"] .spaceedit')
              .find("input")
              .val(original_element.text());
            $(
              '#menu li[data-spaceid="' + spaceId + '"] .spacename:first'
            ).remove();

            $('#menu li[data-spaceid="' + spaceId + '"] .parent-icon').addClass(
              "iconpicker-component"
            );
            $(
              '#menu li[data-spaceid="' + spaceId + '"] .parent-icon i'
            ).addClass("picker-target fa-fw");
            $('#menu li[data-spaceid="' + spaceId + '"] .spaceedit')
              .prepend($(icon_dropdown))
              .prepend($(icon));

            $(".icp-dd").iconpicker({});
          } else {
            $(
              '#menu li[data-spaceid="' + spaceId + '"] .spacename:first'
            ).after($(input));
            $('#menu li[data-spaceid="' + spaceId + '"] .spaceedit')
              .find("input")
              .val(original_element.text());
            $(
              '#menu li[data-spaceid="' + spaceId + '"] .spacename:first'
            ).remove();
          }
          $("#menu input").focus();
        });
      } else if (space_menu_action == "delete") {
        spaceId = $(this).parents("li[data-spaceid]:first").data("spaceid");
        spaceTitle = $(this)
          .parents("li[data-spaceid]:first")
          .find(".spacename:first")
          .text();

        let confirm_action = $("<div>", {
          class: "modal fade",
          id: "confirm-delete",
        }).append(
          $("<div>", { class: "modal-dialog modal-dialog-centered" }).append(
            $("<div>", { class: "modal-content" })
              .append(
                $("<div>", { class: "modal-header" })
                  .append(
                    $("<h5>", {
                      class: "modal-title",
                      html: 'Choose delete action for "' + spaceTitle + '"',
                    })
                  )
                  .append(
                    $("<button>", {
                      type: "button",
                      class: "btn-close",
                      "data-bs-dismiss": "modal",
                      "aria-label": "Close",
                    })
                  )
              )
              .append(
                $("<div>", { class: "modal-body" }).append(
                  $("<div>", { class: "list-group" })
                    .append(
                      $("<label>", { class: "list-group-item d-flex" })
                        .append(
                          $("<input>", {
                            class: "form-check-input me-3 flex-shrink-0",
                            type: "radio",
                            "data-delete-action": "delete-space",
                            name: "delete-option",
                            value: spaceId,
                          })
                        )
                        .append(
                          $("<div>", {
                            class:
                              "delete-description w-100 d-flex flex-column",
                          })
                            .append(
                              $("<span>", {
                                class: "w-100",
                                html: "Delete space",
                              })
                            )
                            .append(
                              $("<small>", {
                                class: "w-100 text-primary",
                                html: "Description: Deletes space and assign all sub-spaces and tasks to another space",
                              })
                            )
                        )
                    )
                    .append(
                      $("<label>", { class: "list-group-item d-flex" })
                        .append(
                          $("<input>", {
                            class: "form-check-input me-3 flex-shrink-0",
                            type: "radio",
                            "data-delete-action": "delete-space&subspaces",
                            name: "delete-option",
                            value: spaceId,
                          })
                        )
                        .append(
                          $("<div>", {
                            class:
                              "delete-description w-100 d-flex flex-column",
                          })
                            .append(
                              $("<span>", {
                                class: "w-100",
                                html: "Delete space and all sub-spaces",
                              })
                            )
                            .append(
                              $("<small>", {
                                class: "w-100 text-primary",
                                html: "Description: Deletes space and all sub-spaces and assign all tasks to another space",
                              })
                            )
                        )
                    )
                    .append(
                      $("<label>", { class: "list-group-item d-flex" })
                        .append(
                          $("<input>", {
                            class: "form-check-input me-3 flex-shrink-1",
                            type: "radio",
                            "data-delete-action": "delete-all",
                            name: "delete-option",
                            value: spaceId,
                          })
                        )
                        .append(
                          $("<span>", {
                            class: "w-100",
                            html: "Delete space with all sub-spaces and all tasks that are contained within space.",
                          })
                        )
                    )
                )
              )
              .append(
                $("<div>", { class: "modal-footer" }).append(
                  $("<button>", {
                    id: "delete-space",
                    type: "button",
                    class: "btn btn-danger",
                    html: "Confirm delete",
                  })
                )
              )
          )
        );

        $(".page-content").prepend($(confirm_action));
        $("#confirm-delete").modal("show");

        //$('#menu li[data-spaceid="'+spaceId+'"]').remove();
        // console.log(spaceId);
      }
    }
  );

  $(document).on("hidden.bs.modal", "#confirm-delete", function () {
    $(this).remove();
  });

  $(document).on("click", "#confirm-delete input", function () {
    let menuData = JSON.parse(localStorage.getItem("menuData"));

    let container = $("<div>", {
      id: "select-space",
      class: "dropdown hierarchy-select",
    })
      .append(
        $("<button>", {
          type: "button",
          id: "select-space-button",
          class: "btn btn-outline-primary btn-sm dropdown-toggle",
          "data-bs-toggle": "dropdown",
          "aria-haspopup": "true",
          "aria-expanded": "false",
        })
      )
      .append(
        $("<div>", {
          class: "dropdown-menu",
          "aria-labelledby": "select-space-button",
        })
          .append(
            $("<div>", { class: "hs-searchbox" }).append(
              $("<input>", {
                type: "text",
                class: "form-control",
                placeholder: "Search...",
                autocomplete: "off",
              })
            )
          )
          .append(
            $("<div>", { class: "hs-menu-inner" }).append(
              $("<a>", {
                class: "dropdown-item",
                "data-value": "",
                "data-level": "1",
                "data-default-selected": "",
                href: "#",
                html: "Select space...",
              })
            )
          )
          .append(
            $("<input>", {
              type: "text",
              class: "d-none",
              name: "example_one",
              readonly: "readonly",
              "aria-hidden": "true",
            })
          )
      );

    let select_space_menu = $("<div>", {
      class: "d-flex select-space align-items-center mt-3",
    })
      .append($("<span>", { class: "text-nowrap pe-2", html: "Select space:" }))
      .append(container);

    $(this).parent().parent().find(".select-space").remove();
    $(this).parent().find(".delete-description").append(select_space_menu);

    let selection = $(this).parent().find(".hs-menu-inner");
    parseMenuList(selection, spaceId, menuData);

    $("#select-space").hierarchySelect({
      width: "100%",
      initialValueSet: true,
    });
  });

  $(document).on("click", "#delete-space", function () {
    let menuData = JSON.parse(localStorage.getItem("menuData"));
    let deleteAction = $(
      '#confirm-delete input[name="delete-option"]:checked'
    ).data("delete-action");
    let spaceSelectedToDelete = $(
      '#confirm-delete input[name="delete-option"]:checked'
    ).val();
    let spacesToUpdateOrDelete;
    if (deleteAction == "delete-space") {
      spacesToUpdateOrDelete = findSpacesToUpdate(
        menuData,
        spaceSelectedToDelete
      );
    } else {
      spacesToUpdateOrDelete = findSpacesToDelete(
        menuData,
        spaceSelectedToDelete
      );
    }

    let spaceToMoveTo = $(
      "#select-space .dropdown-menu .dropdown-item.active"
    ).data("value");
    if (!spaceSelectedToDelete) {
      alert("Please select delete option!");
      return;
    }

    deleteSpacesAjax(
      spaceSelectedToDelete,
      spacesToUpdateOrDelete,
      spaceToMoveTo,
      deleteAction
    );
  });

  $(document).on(
    "click",
    "#menu .spaceinput i.confirm-edit,#menu .spaceedit i.confirm-edit",
    function () {
      if ($(this).parent().find('input[name="spacename"]').val() != "") {
        switch (space_menu_action) {
          case "add":
            addSpaceAjax();
            break;
          case "edit":
            editSpaceAjax();
            break;
        }
      }
    }
  );

  $(document).on("keypress", '#menu input[name="spacename"]', function (e) {
    if (e.which == 13 && $(this).val() != "") {
      switch (space_menu_action) {
        case "add":
          addSpaceAjax();
          break;
        case "edit":
          editSpaceAjax();
          break;
      }
    }
  });

  $(document).on("click keyup", function (e) {
    if ($("#menu input").length) {
      if (
        e.which == 27 ||
        !$(e.target).closest("#menu .spaceinput, #menu .spaceedit").length
      ) {
        removeInput();
      }
    }
  });

  $(document).on("click", "#menu i.cancel-edit", function () {
    removeInput();
  });

  $(document).on("iconpickerSelected", ".icp", function (e) {
    $("#menu .picker-target").get(0).className =
      "picker-target " +
      e.iconpickerInstance.options.iconBaseClass +
      " " +
      e.iconpickerInstance.options.fullClassFormatter(e.iconpickerValue);
    picked_icon = e.iconpickerValue;
  });

  $(".back-to-top").on("click", function () {
    return (
      $("html, body").animate(
        {
          scrollTop: 0,
        },
        600
      ),
      !1
    );
  });

  $(function () {
    "use strict";
    $(".mobile-toggle-menu").on("click", function () {
      $(".wrapper").addClass("toggled");
    });

    $(".toggle-icon").click(function () {
      $(".wrapper").hasClass("toggled")
        ? ($(".wrapper").removeClass("toggled"),
          $(".sidebar-wrapper").unbind("hover"))
        : ($(".wrapper").addClass("toggled"),
          $(".sidebar-wrapper").hover(
            function () {
              $(".wrapper").addClass("sidebar-hovered");
            },
            function () {
              $(".wrapper").removeClass("sidebar-hovered");
            }
          ));
    });

    $('[data-bs-toggle="tooltip"]').tooltip();
  });
});

$(window).on("scroll", function () {
  $(this).scrollTop() > 300
    ? $(".back-to-top").fadeIn()
    : $(".back-to-top").fadeOut();
});

function removeInput() {
  $("#menu .spaceinput").remove();
  $("#menu .spaceedit")
    .parents('li[data-spaceid="' + spaceId + '"]')
    .find(".parent-icon:first i.picker-target")
    .remove();
  $("#menu .spaceedit")
    .parents('li[data-spaceid="' + spaceId + '"]')
    .find(".parent-icon:first")
    .append(original_icon);
  $("#menu .spaceedit").before(original_element);
  $("#menu .spaceedit").remove();
}

function loadMenu(reload = false) {
  let menuData = JSON.parse(localStorage.getItem("menuData"));

  if (!menuData || reload) {
    $.ajax({
      type: "post",
      url: baseUrl + "spaces/createMenuAjax",
      dataType: "json",
      success: function (result) {
        if (menuData) {
          localStorage.removeItem("menuData");
        }
        localStorage.setItem("menuData", JSON.stringify(result));
        menuData = result;

        let menu = $("#menu");
        menu.metisMenu("dispose");
        parseMenu(menu, menuData);

        menu.metisMenu({
          // toggle: false,
          triggerElement: ".mm-trigger",
          subMenu: ".submenu",
        });
      },
      error: function (jqXhr, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
      },
    });
  } else {
    let menu = $("#menu");
    menu.metisMenu("dispose");
    parseMenu(menu, menuData);

    menu.metisMenu({
      // toggle: false,
      triggerElement: ".mm-trigger",
      subMenu: ".submenu",
    });
    //$(this).attr('disabled', 'disabled');
  }
}

function parseMenu(ul, menuData) {
  let activeItems = localStorage.getItem("activeMenuItems")
    ? localStorage.getItem("activeMenuItems").split(",").map(Number)
    : "";

  for (let i = 0; i < menuData.length; i++) {
    let isActive = "";
    if ($.inArray(menuData[i].id, activeItems) != -1) {
      isActive = "mm-active";
    }

    let arrow = menuData[i].children != null ? " has-arrow" : "";
    let dots = menuData[i].children != null ? "horizontal" : "vertical";
    let noarrow = menuData[i].children != null ? "" : "-no-arrow";

    let dropdownMenu = $("<ul>", {
      class: "dropdown-menu dropdown-menu-start py-2",
    })
      .append(
        $("<li>").append(
          $("<a>", { class: "dropdown-item", "data-action": "add", href: "#" })
            .append($("<i>", { class: "bx bx-list-plus" }))
            .append($("<span>", { html: "Add sub-space" }))
        )
      )
      .append($("<li>").append($("<div>", { class: "dropdown-divider" })))
      .append(
        $("<li>").append(
          $("<a>", { class: "dropdown-item", "data-action": "edit", href: "#" })
            .append($("<i>", { class: "bx bx-edit" }))
            .append($("<span>", { html: "Edit space" }))
        )
      )
      .append($("<li>").append($("<div>", { class: "dropdown-divider" })))
      .append(
        $("<li>").append(
          $("<a>", {
            class: "dropdown-item",
            "data-action": "delete",
            href: "#",
          })
            .append($("<i>", { class: "bx bx-trash" }))
            .append($("<span>", { html: "Delete space" }))
        )
      );

    //* set title of element with sub-elements to be text (non clicable) or link
    //let linkOrText = menuData[i].children != null ? $('<span>', { class: 'text-truncate spacename', html: menuData[i].name }) : $('<a>', { class: 'text-truncate spacename', href: baseUrl + 'space/' + menuData[i].name.toLowerCase().replace(/ /g, "_"), 'data-spaceId': menuData[i].id, html: menuData[i].name })
    //* title of element with sub-elements now can be clicked as result in calendar
    //* are now shown all task that belong to him and all of its sub-elements
    let linkOrText = $("<a>", {
      class: "text-truncate spacename",
      href:
        baseUrl + "space/" + menuData[i].name.toLowerCase().replace(/ /g, "_"),
      "data-spaceId": menuData[i].id,
      html: menuData[i].name,
    });

    let parentIcon =
      menuData[i].parent_id != 0
        ? $("<i>", { class: default_icon_sub_lvls })
        : $("<div>", { class: "parent-icon" }).append(
            $("<i>", { class: menuData[i].icon })
          );

    let menuTitle =
      menuData[i].parent_id != 0
        ? linkOrText
        : $("<div>", { class: "menu-title" }).append($(linkOrText));

    let li = $(ul).append(
      $("<li>", {
        class: "li" + " " + isActive,
        "data-spaceid": menuData[i].id,
        "data-menuorder": menuData[i].menu_order,
      }).append(
        $("<div>", { class: "mm-trigger" + arrow })
          .append(parentIcon)
          .append(menuTitle)
          .append(
            $("<div>", { class: "settings-btn" + noarrow + " dropdown" })
              .append(
                $("<i>", {
                  class:
                    "bx bx-dots-" +
                    dots +
                    "-rounded dropdown-toggle dropdown-toggle-nocaret",
                  roll: "button",
                  "data-bs-toggle": "dropdown",
                  "aria-expanded": "false",
                })
              )
              .append($(dropdownMenu))
          )
      )
    );

    if (menuData[i].children != null) {
      let subul = $("<ul>", { class: "submenu" });
      $(li)
        .find('li[data-spaceID="' + menuData[i].id + '"]')
        .append(subul);
      parseMenu($(subul), menuData[i].children);
    }
  }
}

function parseMenuList(parent, space_id, menuData, j = 1) {
  for (let i = 0; i < menuData.length; i++) {
    if (menuData[i].id != space_id) {
      $(parent).append(
        $("<a>", {
          class: "dropdown-item",
          "data-value": menuData[i].id,
          "data-level": j,
          href: "#",
          html: menuData[i].name,
        })
      );

      if (menuData[i].children != null) {
        j = j + 1;
        parseMenuList($(parent), space_id, menuData[i].children, j);
        j = j - 1;
      }
    }
  }
}

function findSpacesToDelete(menuData, spaceToDelete, idList = []) {
  for (let i = 0; i < menuData.length; i++) {
    if (idList.length !== 0) return idList;

    if (menuData[i].id == spaceToDelete) {
      idList.push(menuData[i].id);
      if (menuData[i].children != null) {
        JSON.stringify(menuData[i].children, (key, value) => {
          if (key === "id") idList.push(value);
          return value;
        });
      }
    } else if (menuData[i].children != null) {
      findSpacesToDelete(menuData[i].children, spaceToDelete, idList);
    }
  }
  return idList;
}

function findSpacesToUpdate(menuData, spaceToDelete, idList = []) {
  for (let i = 0; i < menuData.length; i++) {
    if (menuData[i].parent_id == spaceToDelete) {
      idList.push(menuData[i].id);
    }

    if (menuData[i].children != null) {
      findSpacesToUpdate(menuData[i].children, spaceToDelete, idList);
    }
  }
  return idList;
}

function addSpaceAjax() {
  let title = $('#menu input[name="spacename"]').val();
  let menu_order = "";
  if (parentId > 0) {
    menu_order =
      $('#menu .li[data-spaceid="' + parentId + '"] .submenu').length > 0
        ? $(
            '#menu .li[data-spaceid="' + parentId + '"] .submenu:first'
          ).children(".li[data-spaceid]").length + 1
        : 1;
  } else {
    menu_order = $("#menu > .li[data-spaceid]").length + 1;
  }

  let icon = parentId == 0 ? default_icon_top_lvl : "";

  //? FOR TESTING OF PUTTING DATA TO MENU WITHOUT PUTTING DATA TO DATABASE
  // let newSpaceId = $('#menu .li[data-spaceid]').length + 1;
  // addSpaceToMenu(title,spaceId,newSpaceId,icon);
  // removeInput();
  // console.log(spaceId,title,menu_order);
  //? --------------------------------------------------------------------

  $.ajax({
    type: "post",
    url: baseUrl + "spaces/addSpaceAjax",
    dataType: "json",
    data: {
      parent_id: parentId,
      title: title,
      menu_order: menu_order,
      icon: icon,
    },
    success: function (result) {
      $("#menu").metisMenu("dispose");
      $("#menu li[data-spaceid]").remove();
      removeInput();
      loadMenu(true);
    },
    error: function (jqXhr, textStatus, errorThrown) {
      console.log(textStatus, errorThrown);
    },
  });
}

function editSpaceAjax() {
  let old_title = original_element.text();
  let new_title = $('#menu input[name="spacename"]').val();
  // let old_menu_order = $('#menu .li[data-spaceid="'+spaceId+'"]').data('menuorder');
  let new_menu_order = "";
  let new_icon = "";
  if (original_icon.length) {
    old_icon = original_icon.attr("class");
    new_icon = picked_icon != "" ? picked_icon : "";
    new_icon = new_icon.search(old_icon) == -1 ? new_icon : "";
  }
  new_title = new_title != old_title ? new_title : "";

  //? FOR TESTING OF EDITING DATA IN MENU WITHOUT UPDATING DATA TO DATABASE
  // console.log(parentId,spaceId);
  // removeInput();
  // editSpaceInMenu(spaceId,new_title,new_menu_order,new_icon);
  //? --------------------------------------------------------------------

  if (new_title != "" || new_icon != "" || new_menu_order != "") {
    $.ajax({
      type: "post",
      url: baseUrl + "spaces/updateSpaceAjax",
      data: {
        space_id: spaceId,
        parent_id: parentId,
        title: new_title,
        menu_order: new_menu_order,
        icon: new_icon,
      },
      success: function (result) {
        if (result == true) {
          original_icon.remove();
          original_element.remove();
          $("#menu").metisMenu("dispose");
          removeInput();
          $("#menu li[data-spaceid]").remove();

          loadMenu(true);
        }
      },
      error: function (jqXhr, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
      },
    });
  }
}

function deleteSpacesAjax(
  spaceSelectedToDelete,
  spacesToUpdateOrDelete,
  spaceToMoveTo,
  deleteAction
) {
  // console.log(spaceSelectedToDelete, spacesToUpdateOrDelete, spaceToMoveTo, deleteAction);
  if (spaceToMoveTo != "") {
    $.ajax({
      type: "post",
      url: baseUrl + "spaces/deleteSpacesAjax",
      data: {
        spaceSelectedToDelete: spaceSelectedToDelete,
        spacesToUpdateOrDelete: spacesToUpdateOrDelete,
        spaceToMoveTo: spaceToMoveTo,
        deleteAction: deleteAction,
      },
      success: function (result) {
        if (result == true) {
          $("#menu").metisMenu("dispose");
          $("#confirm-delete").modal("hide");
          $("#confirm-delete").remove();
          $("#menu li[data-spaceid]").remove();

          loadMenu(true);
        }
      },
      error: function (jqXhr, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
      },
    });
  } else {
    alert("Please select to which space to move data!");
  }
}
