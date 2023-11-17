const getAllCountries = async () => {
  const url = "https://restcountries.com/v3.1/all/?fields=name";
  const res = await fetch(url);
  const data = await res.json();
  return data;
};

const getCountryByName = async (country) => {
  try {
    const url = `https://restcountries.com/v3.1/name/${country}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("Country Not Found");
    }
    const data = await res.json();
    return data[0];
  } catch (error) {
    console.error(`Error fetching country "${country}":`, error);
    throw error;
  }
};

const getCountryToCard = async (country) => {
  try {
    const url = `https://restcountries.com/v3.1/name/${country}/?fields=name,flags,region,population,landlocked,independent,capital`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("Country Not Found");
    }
    const data = await res.json();
    return data[0];
  } catch (error) {
    console.error(`Error fetching country "${country}":`, error);
    throw error;
  }
};

const getNeighboringCountries = async (code) => {
  const url = `https://restcountries.com/v3.1/alpha/${code}/?fields=name,flags`;
  const res = await fetch(url);
  const data = await res.json();
  return data;
};

export {
  getAllCountries,
  getCountryByName,
  getNeighboringCountries,
  getCountryToCard,
};
