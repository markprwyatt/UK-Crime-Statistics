const display = document.querySelector(".display");
const locations = document.querySelector(".locations");
const table = document.querySelector(".table");

// fetch categories of crimes

let crimeStats = {};

// get locaiton of user

window.navigator.geolocation.getCurrentPosition(
  position => {
    let lat = position.coords.latitude;
    let long = position.coords.longitude;
    getCrimeCategories(lat, long);
  },
  err => console.log(err),
  { timeout: 5000 }
);

const getCrimeCategories = (lat, long) => {
  fetch("https://data.police.uk/api/crime-categories?date=2019-04")
    .then(res => res.json())
    .then(data => {
      exportCategories(data);
      getCrimesByLocation(lat, long);
    });
};

// Fetch data based on coords of user to nearest station

const getCrimesByLocation = (lat, long) => {
  fetch(
    `https://data.police.uk/api/crimes-street/all-crime?lat=${lat}&lng=${long}`
  )
    .then(response => response.json())
    .then(data => {
      // loop through data and update crime stat categories with their values
      console.log(data);

      console.log(data);
      for (let i = 0; i < data.length; i++) {
        for (let prop in crimeStats) {
          // update all crime with length of all data

          if (prop === "all-crime") {
            crimeStats[prop] = data.length;
          }

          // if object key matches data category +1 to value

          if (data[i].category === prop) {
            crimeStats[prop]++;
          }
        }
      }

      // render table from crimeStats
      generateTableHeader(table);
      generateTable(table, crimeStats);
    });
};

// Create table functions

const generateTableHeader = table => {
  console.log("Header");
  let thead = table.createTHead();
  let row = thead.insertRow();
  const headers = ["Crime", "Total"];
  headers.forEach(header => {
    let th = document.createElement("th");
    let text = document.createTextNode(header);
    th.appendChild(text);
    row.appendChild(th);
  });
};

const generateTable = (table, obj) => {
  for (let props in obj) {
    if (obj[props] === 0) {
      continue;
    }
    let row = table.insertRow();
    let cellCrime = row.insertCell();
    let cellNum = row.insertCell();
    let crimeName = props.replace(/-/g, " ");
    let crimeText = document.createTextNode(crimeName);
    let crimeNum = document.createTextNode(obj[props] + "");
    cellCrime.appendChild(crimeText);
    cellNum.appendChild(crimeNum);
  }
};

// set categories  to global object

const exportCategories = data => {
  crimeStats = Object.assign(...data.map(key => ({ [key.url]: 0 })));
};
