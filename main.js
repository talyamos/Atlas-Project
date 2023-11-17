import {
  getCountryToCard,
  getCountryByName,
  getNeighboringCountries,
} from "./functions.js";

const mainContent = document.querySelector("#mainContent");
const startStates = [
  "israel",
  "usa",
  "united kingdom",
  "france",
  "THAILAND",
  "Australia",
];
const navCountry = document.querySelectorAll(".nav-link");

navCountry.forEach((item) => (item.onclick = () => createCountryPage(item.id)));

const changePages = (newPage) => {
  const oldPage = mainContent.querySelector(".displayCountries");
  mainContent.replaceChild(newPage, oldPage);
};

const createHomePage = () => {
  const holder = document.createElement("div");
  // holder.setAttribute("data-aos", "fade-up");
  // holder.setAttribute("data-aos-duration", "2000");
  holder.className =
    "displayCountries container d-flex flex-wrap justify-content-between";

  console.log(holder);

  startStates.map(async (state) => {
    try {
      const data = await getCountryToCard(state);

      const cardEl = document.createElement("div");
      cardEl.className = "card m-4";
      cardEl.style = "width: 19rem";

      const img = document.createElement("img");
      img.className = "card-img-top";
      img.src = data.flags.png;
      img.alt = data.name.common;
      img.style = "height: 45%";

      const body = document.createElement("div");
      body.className = "card-body";

      const title = document.createElement("h5");
      title.innerHTML = data.name.common;

      const description = document.createElement("p");
      description.className = "card-text";

      let independent = "";
      data.independent
        ? (independent = "An independent")
        : (independent = "A non-independent");

      let borders = "";
      data.landlocked
        ? (borders = "It is landlocked")
        : (borders = "It borders the sea");

      description.innerHTML = `${independent} country located on the continent of ${
        data.region
      }. ${borders} and houses the capital city ${
        data.capital
      }, with a population of ${data.population.toLocaleString()} citizens`;

      const btn = document.createElement("a");
      btn.className = "btn btn-primary";
      btn.innerHTML = "Learn More";
      btn.addEventListener("click", () =>
        createCountryPage(data.name.official)
      );

      body.append(title, description, btn);
      cardEl.append(img, body);
      holder.append(cardEl);
      mainContent.append(holder);
      AOS.refresh();
    } catch (error) {
      console.log(error);
    }
  });
};

const createBorderList = (borders) => {
  if (borders == null) {
    const noBorders = document.createElement("p");
    noBorders.innerHTML = "This country does not border other countries";
    return noBorders;
  }
  const ul = document.createElement("ul");
  borders.map((border) => {
    getNeighboringCountries(border).then((data) => {
      const li = document.createElement("li");

      const flag = document.createElement("img");
      flag.className = "flag-icon";
      flag.src = data.flags.png;
      flag.alt = data.name.common;

      const borderName = document.createElement("a");
      borderName.href = "#";
      borderName.addEventListener("click", () =>
        createCountryPage(data.name.official)
      );
      borderName.innerHTML = data.name.common;

      li.append(flag, borderName);
      ul.append(li);
    });
  });

  return ul;
};

const render = (c) => {
  const displayCountry = document.createElement("div");
  displayCountry.className = "displayCountries container p-3";
  displayCountry.style =
    "background: rgba(245, 245, 245, 0.591); border-radius: 10px;";
  displayCountry.innerHTML = `<h1 id="countryName" class="text-center">${c.name}</h1>`;

  const info = document.createElement("div");
  info.className = "info d-flex justify-content-between p-5";
  const details = document.createElement("div");
  details.innerHTML = `
      <p><h5 class="details-title">Population:</h5> <span id="population"> ${c.population}</span></p>
      <p><h5 class="details-title">Capital City:</h5> <span id="capital"> ${c.capital}</span></p>
      `;

  const languages = document.createElement("p");
  const l = Object.values(c.languages).length;
  languages.innerHTML = `<h5 class="details-title">Languages:</h5>`;
  Object.values(c.languages).map((val, index) => {
    const span = document.createElement("span");
    index + 1 == l ? (span.innerHTML = val) : (span.innerHTML = val + ", ");
    languages.append(span);
  });

  const borders = document.createElement("p");
  borders.id = "borders";
  borders.innerHTML = `<h5>Neighboring Countries:</h5>`;
  const bordersList = createBorderList(c.borders);
  bordersList.className = "countries-list";
  borders.append(bordersList);
  details.append(languages, borders);

  const flag = document.createElement("img");
  flag.id = "flag";
  flag.src = c.flag;
  flag.aly = c.name + " flag";
  info.append(details, flag);

  const map = document.createElement("div");
  map.innerHTML = `
      <iframe src="https://maps.google.com/maps?q=${c.location[0]},${c.location[1]}&hl=en&z=7&amp;output=embed"
          id="map"
          width="100%"
          height="450"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
       ></iframe>
    `;

  displayCountry.append(info, map);
  return displayCountry;
};

const createCountryPage = async (countryName) => {
  const holder = document.createElement("div");
  holder.className =
    "displayCountries container d-flex flex-wrap justify-content-between";

  try {
    const data = await getCountryByName(countryName);
    console.log(data);
    const country = {
      name: data.name.common,
      population: data.population.toLocaleString(),
      capital: data.capital[0],
      languages: data.languages,
      flag: data.flags.png,
      borders: data.borders,
      location: data.latlng,
    };
    // return render(country);
    changePages(render(country));
  } catch (error) {
    console.log(error);
  }
};

const createNotFoundPage = (error) => {
  const holder = document.createElement("div");
  holder.className =
    "displayCountries container d-flex flex-wrap justify-content-between";

  const title = document.createElement("h1");
  title.className = "w-100 text-center";
  title.innerHTML = error;

  holder.append(title);
  console.log(holder);
  changePages(holder);
};

const searchCountry = async (event) => {
  try {
    event.preventDefault();
    const country = searchInput.value;
    const data = await getCountryByName(country);
    createCountryPage(data.name.official);
  } catch (error) {
    createNotFoundPage(error);
  }
};

const searchForm = document.querySelector("#searchForm");
searchForm.addEventListener("submit", searchCountry);
createHomePage();
AOS.refresh();
