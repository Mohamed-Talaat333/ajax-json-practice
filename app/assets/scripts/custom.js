/*global $*/

$(function () {
  "use strict";

  /* ------------------------------------------------------------*/
  /* --- 0. top nav
  /* ------------------------------------------------------------*/

  // window scroll function for the navbars
  var lastScrollPosition = 0;

  $(window).scroll(function () {
    var scrollTop = $(this).scrollTop(),
      $navbar = $(".top_nav_wrapper");

    // changing the navbar look on scrolling
    if (scrollTop >= 100) {
      $navbar.addClass("new");
    } else {
      $navbar.removeClass("new");
    }
    smashNavbar();
    lastScrollPosition = scrollTop;
  });

  /* ------------------------------------------------------------*/
  /* --- 0. circular progress
  /* ------------------------------------------------------------*/

  $(".box-circle").each(function () {
    let i = 0,
      that = $(this),
      circleBorder = that.find(".circle-border"),
      borderColor = circleBorder.data("color1"),
      animationColor = circleBorder.data("color2"),
      percentageText = that.find(".percentage"),
      percentage = percentageText.data("percentage"),
      degrees = percentage * 3.6;

    circleBorder.css({
      "background-color": animationColor,
    });

    setTimeout(function () {
      loopIt();
    }, 1);

    function loopIt() {
      i = i + 1;

      if (i < 0) {
        i = 0;
      }

      if (i > degrees) {
        i = degrees;
      }

      percentage = i / 3.6;
      percentageText.text(percentage.toFixed(1) + " %");

      if (i <= 180) {
        circleBorder.css(
          "background-image",
          "linear-gradient(" +
            (90 + i) +
            "deg, transparent 50%," +
            borderColor +
            " 50%),linear-gradient(90deg, " +
            borderColor +
            " 50%, transparent 50%)"
        );
      } else {
        circleBorder.css(
          "background-image",
          "linear-gradient(" +
            (i - 90) +
            "deg, transparent 50%," +
            animationColor +
            " 50%),linear-gradient(90deg, " +
            borderColor +
            " 50%, transparent 50%)"
        );
      }

      setTimeout(function () {
        loopIt();
      }, 1);
    }
  });

  /* ------------------------------------------------------------*/
  /* --- 0. chart
  /* ------------------------------------------------------------*/

  const ctx = $("#myChart");

  const myChart = new Chart(ctx, {
    type: "bar",
    maintainAspectRatio: false,
    data: {
      labels: [
        "19/5",
        "18/4",
        "17/6",
        "20/7",
        "22/7",
        "30/8",
        "30/8",
        "30/8",
        "30/8",
        "30/8",
        "30/8",
        "20/7",
        "22/7",
        "30/8",
        "30/8",
        "30/8",
      ],
      datasets: [
        {
          barPercentage: 0.9,
          categoryPercentage: 0.5,
          label: "Adam",
          data: [
            36, 33, 45, 50, 65, 80, 70, 20, 95, 85, 30, 45, 50, 65, 80, 70,
          ],
          backgroundColor: ["#e5f0f7"],
          borderColor: ["#0977b7"],
          borderWidth: 1,
          borderRadius: 50,
          borderSkipped: false,
        },
        {
          barPercentage: 0.9,
          categoryPercentage: 0.5,
          label: "Average",
          data: [
            30, 25, 50, 45, 55, 75, 60, 35, 85, 75, 30, 25, 50, 45, 55, 75,
          ],
          backgroundColor: ["#e5e5e5"],
          borderColor: ["#383838"],
          borderWidth: 1,
          borderRadius: 50,
          borderSkipped: false,
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      scales: {
        y: {
          ticks: {
            color: "#969696",
          },
          grid: {
            borderDash: [8, 4],
            color: "#d8d8d8",
            drawBorder: false,
          },
        },
        x: {
          ticks: {
            color: "#969696",
          },
          grid: {
            display: false,
            drawBorder: false,
            drawTicks: false,
          },
        },
      },
      plugins: {
        legend: {
          align: "start",
          labels: {
            boxWidth: 3,
            boxHeight: 20,
          },
          title: {
            color: "#969696",
            font: {
              size: 14,
              family: "NotoSans-Regular, arial, tahoma",
            },
          },
        },
      },
    },
  });

  /* ------------------------------------------------------------*/
  /* --- 0. calendar
  /* ------------------------------------------------------------*/

  var eventDates = {};
  eventDates[new Date("05/29/2022")] = new Date("05/29/2022");
  eventDates[new Date("05/30/2022")] = new Date("05/30/2022");
  eventDates[new Date("05/31/2022")] = new Date("05/31/2022");
  eventDates[new Date("06/01/2022")] = new Date("06/01/2022");
  eventDates[new Date("06/02/2022")] = new Date("06/02/2022");
  eventDates[new Date("06/03/2022")] = new Date("06/03/2022");
  eventDates[new Date("06/04/2022")] = new Date("06/04/2022");
  eventDates[new Date("06/05/2022")] = new Date("06/05/2022");
  eventDates[new Date("06/06/2022")] = new Date("06/06/2022");
  eventDates[new Date("06/07/2022")] = new Date("06/07/2022");

  // activating calendar
  $("#datepicker_inline").datepicker({
    beforeShowDay: function (date) {
      var highlight = eventDates[date];
      if (date.getDay() == 5 || date.getDay() == 6) {
        return [true, "weekend", ""];
      } else if (highlight) {
        return [true, "active", "Tooltip text"];
      } else {
        return [true, "", ""];
      }
    },
  });
});
