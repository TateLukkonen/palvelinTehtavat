function makeCoffee(isMachineOn) {
  return new Promise((resolve, reject) => {
    console.log("Starting the coffee machine...");

    setTimeout(() => {
      if (isMachineOn) {
        resolve("☕ Coffee is ready!");
      } else {
        reject("🚫 Coffee machine is off. Please turn it on.");
      }
    }, 2000); // Simulate 2 seconds to make coffee
  });
}

export { makeCoffee };
