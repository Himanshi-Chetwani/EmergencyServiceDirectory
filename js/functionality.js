const APP = (function () {
  const proxy = "https://people.rit.edu/dmgics/754/23/proxy.php";
  function getOrgTypes() {
    $.ajax({
      type: "GET",
      async: true,
      cache: false,
      url: proxy,
      data: { path: "/OrgTypes" },
      dataType: "xml",
      success: function (data, status) {
        let opts = "";
        if ($(data).find("error").length !== 0) {
          //do something graceful here

        } else {
          opts += "<option value=''>All Organization Types</option>";;
          $("row", data).each(function () {
            opts += "<option value= '" +
              $("type", this).text() +
              "'>" +
              $("type", this).text() +
              "</option>";

          });
          $("#orgType").html(opts);
        }
      }
    });
  }
  function getStates() {
    $.ajax({
      type: "GET",
      async: true,
      cache: false,
      url: proxy,
      data: { path: "/States" },
      dataType: "xml",
      success: function (data, status) {
        let opts = "";
        if ($(data).find("error").length !== 0) {
          opts += `<p>In correct Function</p>`;

        } else {
          opts += "<option value=''>All States</option>";;
          $("row", data).each(function () {
            opts += "<option value= '" +
              $("State", this).text() +
              "'>" +
              $("State", this).text() +
              "</option>";

          });
          $("#state").html(opts);
        }
      }
    });
  }
  function getCities(stateVal) {
    $.ajax({
      type: "GET",
      async: true,
      cache: false,
      url: proxy,
      data: { path: "/Cities?state=" + stateVal },
      dataType: "xml",
      success: function (data, status) {
        let opts = "";
        if ($(data).find("error").length !== 0) {
          //do something graceful here 

        } else {
          opts += "<option value=''>--cities--</option>";;
          $("row", data).each(function () {
            opts += "<option value= '" +
              $("city", this).text() +
              "'>" +
              $("city", this).text() +
              "</option>";

          });
          $("#cities").html(opts);
        }
      }
    });
  }
  function displayResults() {
    let serializedData = $("#search-form").serialize();
    $.ajax({
      type: "GET",
      async: true,
      cache: false,
      url: proxy,
      data: { path: "/Organizations?" + serializedData },
      dataType: "xml",
      success: function (data, status) {
        let output = "";
        $("#tabOutput").html("");
        if ($("row", data).length === 0) {
          output = "No matches found";
        }
        else {
          output = `<table id="results-table" class="tablesorter tablesorter-ice">
          <thead>
            <tr>
              <th>Type</th>
              <th>Name</th>
              <th>Email</th>
              <th>City</th>
              <th>State</th>
              <th>CountyName</th>
              <th>Zip</th>
            </tr>
            </thead>`;
          $("row", data).each(function () {
            output += `<tr>
                        <td>${$(this).find("type").text()}</td>
                          <td><a onclick="APP.getDetails(${$("OrganizationID", this).text()});" href="#tabsOutput">${$("Name", this).text()}</a></td>
                          <td>${$("Email", this).text()}</td>
                          <td>${$("city", this).text()}</td>
                          <td>${$("State", this).text()}</td>
                          <td>${$("CountyName", this).text()}</td>
                          <td>${$("zip", this).text()}</td>`
          });
          output += "</table>"
          $("#tableOutput").html(output)
        }
      }
    });
  }
  function getDetails(idv) {
    $.ajax({
      type: "GET",
      async: true,
      cache: false,
      url: proxy,
      data: { path: "/Application/Tabs?orgId=" + idv },
      dataType: "xml",
      success: function (data, status) {
        $(function () {
          $("#tabs").tabs();
        });
        let output = "";

        if ($("row", data).length === 0) {
          output = "No Matches Found"
        }
        else {
          $.ajax({
            type: "GET",
            async: true,
            cache: false,
            url: proxy,
            data: { path: "/" + idv + "/General" },
            dataType: "xml",
            success: function (data, status) {
              let output = "";
              if ($(data).length === 0) {
                output = "No Matches Found"
              }
              else {
                output += `<p> Name : ${$("name", data).text()}</p>`;
                output += `<p> Description : ${$("description", data).text()}</p>`;
                output += `<p> Email : ${$("email", data).text()}</p>`;
                output += `<p> Website : ${$("website", data).text()}</p>`;
                output += `<p> Number of members : ${$("nummembers", data).text()}</p> `;
                output += `<p> Number of calls last year : ${$("numcalls", data).text()}</p>`;
                output += `<p> Service Area : ${$("servicearea", data).text()}</p>`;
                $("#tabs-1").html(output);
              }
            }
          });
          let counter = 1;
          output = `<div id="tabs"><ul>`
          $("row", data).each(function () {
            output += `<li><a id="${$(this).text()}" href="#tabs-${counter}" name="#tabs-${counter}" rel="modal:open" class="btn" onclick="APP.getData(id,${idv},name);" >${$(this).text()}</a></li>`
            counter = counter + 1;
          })
          output += `</ul>`;

          let counter1 = 1;
          output += `<div id="modalData" class="modal">`
          $("Tab", data).each(function () {
            output += `<div id="tabs-${counter1}"><p></p><a href="#" rel="modal:close" class="btn-min">Close</a></div>`
            counter1 = counter1 + 1;

          })
          output += `</div> `
          output += "</div>"
          $("#tabsOutput").html(output);

        }
      }
    });


  }
  function getData(id, idv, tabV) {
    if (id === "General") {
      $.ajax({
        type: "GET",
        async: true,
        cache: false,
        url: proxy,
        data: { path: "/" + idv + "/General" },
        dataType: "xml",
        success: function (data, status) {
          let output = "";
          $("#data").html("");
          if ($(data).length === 0) {
            output = "No Matches Found"
          }
          else {
            output += `<p> Name : ${$("name", data).text()}</p>`;
            output += `<p> Description : ${$("description", data).text()}</p>`;
            output += `<p> Email : ${$("email", data).text()}</p>`;
            output += `<p> Website : ${$("website", data).text()}</p>`;
            output += `<p> Number of members : ${$("nummembers", data).text()}</p> `;
            output += `<p> Number of calls last year : ${$("numcalls", data).text()}</p>`;
            output += `<p> Service Area : ${$("servicearea", data).text()}</p>`;
            $(tabV).html(output);
          }
        }
      });
    }
    else if (id === "Treatment") {
      $.ajax({
        type: "GET",
        async: true,
        cache: false,
        url: proxy,
        data: { path: "/" + idv + "/Treatments" },
        dataType: "xml",
        success: function (data, status) {
          let output = "";
          $("#data").html("");
          if ($("treatment", data).length === 0) {
            output = "No Matches Found"
          }
          else {
            output += `<div>`
            output += `<table id="results-table-new" class="tablesorter  tablesorter-ice">
        <thead>
          <tr>
            <th>Type</th>
            <th>Abbreviation</th>
          </tr>
          </thead>
          <tbody>`;
            $("treatment", data).each(function () {
              output += `<tr>
                          <td>${$(this).find("type").text()}</td>
                          <td>${$("abbreviation", this).text()}</td>
                          </tr>`;
            });


            output += `</tbody>`;
            output += "</table>";
            output += `</div>`;
            $(tabV).html(output);
          }
        }
      });
    }
    else if (id === "Training") {
      $.ajax({
        type: "GET",
        async: true,
        cache: false,
        url: proxy,
        data: { path: "/" + idv + "/Training" },
        dataType: "xml",
        success: function (data, status) {
          let output = "";
          $("#data").html("");
          if ($("training", data).length === 0) {
            output = "No Matches Found"
          }
          else {
            output += `<div>`
            output += `<table id="results-table-new" class="tablesorter tablesorter-ice">
          <thead>
            <tr>
              <th>Type</th>
              <th>Abbreviation</th>
            </tr>
            </thead>
            <tbody>`;
            $("training", data).each(function () {
              output += `<tr>
                            <td>${$(this).find("type").text()}</td>
                            <td>${$("abbreviation", this).text()}</td>
                            </tr>`;
            });


            output += `</tbody>`;
            output += "</table>";
            output += `</div>`;
            $(tabV).html(output);
          }
        }
      });
    }
    else if (id === "Facilities") {
      $.ajax({
        type: "GET",
        async: true,
        cache: false,
        url: proxy,
        data: { path: "/" + idv + "/Facilities" },
        dataType: "xml",
        success: function (data, status) {
          let output = "";
          if ($("facility", data).length === 0) {
            output = "No Matches Found"
          }
          else {
            output += `<div>`
            output += `<table id="results-table-new" class="tablesorter tablesorter-ice">
          <thead>
            <tr>
              <th>Type</th>
              <th>Quatity</th>
              <th>Description</th>
            </tr>
            </thead>
            <tbody>`;
            $("facility", data).each(function () {
              output += `<tr>
                            <td>${$(this).find("type").text()}</td>
                            <td>${$("quantity", this).text()}</td>
                            <td>${$("description", this).text()}</td>
                            </tr>`;
            });


            output += `</tbody>`;
            output += "</table>";
            output += `</div>`;
            $(tabV).html(output);
          }
        }
      });
    }
    else if (id === "Equipment") {
      $.ajax({
        type: "GET",
        async: true,
        cache: false,
        url: proxy,
        data: { path: "/" + idv + "/Equipment" },
        dataType: "xml",
        success: function (data, status) {
          let output = "";
          if ($("equipment", data).length === 0) {
            output = "No Matches Found"
          }
          else {
            output += `<div>`
            output += `<table id="results-table-new" class="tablesorter tablesorter-ice">
          <thead>
            <tr>
              <th>Type</th>
              <th>Quatity</th>
              <th>Description</th>
            </tr>
            </thead>
            <tbody>`;
            $("equipment", data).each(function () {
              output += `<tr>
                            <td>${$(this).find("type").text()}</td>
                            <td>${$("quantity", this).text()}</td>
                            <td>${$("description", this).text()}</td>
                            </tr>`;
            });


            output += `</tbody>`;
            output += "</table>";
            output += `</div>`;
            $(tabV).html(output);
          }
        }
      });
    }
    else if (id === "Physicians") {
      $.ajax({
        type: "GET",
        async: true,
        cache: false,
        url: proxy,
        data: { path: "/" + idv + "/Physicians" },
        dataType: "xml",
        success: function (data, status) {
          let output = "";
          if ($("physician", data).length === 0) {
            output = "No Matches Found"
          }
          else {
            output += `<div>`
            output += `<table id="results-table-new" class="tablesorter tablesorter-ice"">
          <thead>
            <tr>
              <th>Name</th>
              <th>License</th>
              <th>Contact</th>
            </tr>
            </thead>
            <tbody>`;
            $("physician", data).each(function () {
              output += `<tr>
                            <td>${$(this).find("fName").text()} ${$(this).find("mName").text()} ${$(this).find("lName").text()}</td>
                            <td>${$("license", this).text()}</td>
                            <td>${$("phone", this).text()}</td>
                            </tr>`;
            });


            output += `</tbody>`;
            output += "</table>";
            output += `</div>`;
            $(tabV).html(output);
          }
        }
      });
    }
    else if (id === "Locations") {
      $.ajax({
        type: "GET",
        async: true,
        cache: false,
        url: proxy,
        data: { path: "/" + idv + "/Locations" },
        dataType: "xml",
        success: function (data, status) {
          let output = "";
          if ($("location", data).length === 0) {
            output = "No Matches Found"
          }
          else {
            let output = "";
            output += `<div id="location-info"`
            output += `<label for="loc">Location Information</label><br>`;
            output += `<select name="loc" id="loc">`;
            output += `<option>Choose from below</option>`
            $("location", data).each(function () {
              output += `<option value="${$("type", this).text()}">${$("type", this).text()}</option>`;
            });
            output += `</select>`
            output += `<div id=outputForLocation></div>`
            $(tabV).html(output);
            $("#loc").on('change', function () {
              output = "";
              output += `<div>`
              output += `<table id="mapsTable" class="tablesorter tablesorter-ice">`;
              output += ` <thead>
            <tr>
              <th>Details</th>
              <th>Maps</th>
            </tr>
            </thead>
            <tbody>`;
              output += `<tr>`;
              output += `<td> <div id="mapVis"> </div></td>`;
              output += `<td id= "mapContents">`
              output += `<p id = "mapData"></p>`;
              output += `</tr>`
              output += `</tbody`;
              output += `<table>`;
              $("#outputForLocation").html(output);
              $("#mapVis").height('250px')
              $("#mapVis").width('250px')
              var map = L.map('mapVis').setView([43.055091745202, -77.46073722839355], 13);

              L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              }).addTo(map);

              L.marker([43.055091745202, -77.46073722839355]).addTo(map)
                .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
                .openPopup();
              $("location", data).each(function () {
                output = ""
                if ($("type", this).text() === $("#loc").val()) {
                  output += `<div id=" ${$("type", this).text()}">`
                  output += `<p> Type : ${$("type", this).text()}</p>`;
                  output += `<p> Address : ${$("address1", this).text()} ${$("address2", data).text()}</p>`;
                  output += `<p> City : ${$("city", this).text()}</p>`;
                  output += `<p> State : ${$("state", this).text()}</p>`;
                  output += `<p> County ID : ${$("coutyName", this).text()}</p>`;
                  output += `<p> County Name : ${$("coutyId", this).text()}</p>`;
                  output += `<p> Zip : ${$("zip", this).text()}</p> `;
                  output += `<p> Contact : ${$("phone", this).text()}</p>`;
                  output += `<p>  TTY Phone : ${$("ttyPhone", this).text()}</p>`;
                  output += `<p>  Fax : ${$("fax", this).text()}</p>`;
                  output += `<p>  Latitude : ${$("latitude", this).text()}</p>`;
                  output += `<p>  Longitude : ${$("longitude", this).text()}</p>`;
                  output += `<p>  Site Id : ${$("siteId", this).text()}</p>`;
                  output += `</div>`;
                  $("#mapContents").html(output);
                }
              });
            });
          }
        }
      });
    }
    else if (id === "People") {
      $.ajax({
        type: "GET",
        async: true,
        cache: false,
        url: proxy,
        data: { path: "/" + idv + "/People" },
        dataType: "xml",
        success: function (data, status) {
          let output = "";
          if ($("site", data).length === 0) {
            output = "No Matches Found"
          }
          else {
            let output = "";
            output += `<div id="people-info"`
            output += `<label for="people">People</label><br>`;
            output += `<select name="people" id="people">`;
            output += `<option>Choose address from below</option>`
            $("site", data).each(function () {
              output += `<option value="${$(this).attr("siteId")}">${$(this).attr("address")}</option>`;
            });
            output += `</select>`
            output += `<div id=outputForPeople></div>`
            $(tabV).html(output);
            output = "";
            $("#people").on('change', function () {
              $("site", data).each(function () {
                if ($(this).attr("siteId") === $("#people").val()) {
                  output += `<div id ="${$(this).attr("siteId")}" class="person-dets">`;
                  output += `<p> Name : ${$("honorific", this).text()} ${$("fName", this).text()} ${$("mName", this).text()} ${$("lName", this).text()} ${$("suffix", this).text()}</p>`;
                  output += `<p> Role : ${$("role", this).text()} </p>`;
                  output += `<p> Contact Method : ${$("contactmethods", this).text()} </p>`;
                  output += `</div>`
                  $("#outputForPeople").html(output);
                }
              });
            })

          }
        }
      });
    }

  }
  function clearResults() {
    location.reload();
  }
  function callSupport() {
    $("#emCall")
      .slideFadeOut(1000)
      .show(2500);
  }
  $(function () {
    $(document).tooltip();
    getOrgTypes();
    getStates();
  });
  return {
    displayResults: displayResults,
    clearResults: clearResults,
    getCities: getCities,
    getDetails: getDetails,
    getData: getData,
    callSupport: callSupport

  };
})();