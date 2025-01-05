async function fetchExchangeRate(baseCurrency) {
  try {
      const response = await fetch(`/api/rate?base=${baseCurrency}`);
      const data = await response.json();

      if (!response.ok) {
          throw new Error(data.error || "Failed to fetch exchange rates.");
      }

      return data.conversion_rates;
  } catch (error) {
      console.error("Error fetching exchange rates:", error);
      alert(`Error fetching exchange rates: ${error.message}`);
      throw error;
  }
}

async function display() {
  const baseCurrency = document.getElementById("baseCurrency").value;
  const targetCurrency = document.getElementById("targetCurrency").value;
  const amount = parseFloat(document.getElementById("amount").value);

  if (!amount || isNaN(amount)) {
      alert("Please enter a valid amount.");
      return;
  }

  try {
      const rates = await fetchExchangeRate(baseCurrency);
      const conversionRate = rates[targetCurrency];

      if (!conversionRate) {
          alert("Conversion rate not available.");
          return;
      }

      const convertedAmount = (amount * conversionRate).toFixed(2);
      document.getElementById("convertedAmount").textContent = convertedAmount;
  } catch (error) {
      console.error("Error displaying conversion:", error);
      document.getElementById("convertedAmount").textContent = "Error";
  }
}

// Attach event listener to the button
document.querySelector("button").addEventListener("click", display);