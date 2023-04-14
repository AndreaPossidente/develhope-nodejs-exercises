/* Create a getResults function that uses async and await.
Inside of the function, call the luckyDraw function for each of the players: Tina, Jorge, Julien
Log out the resolved value for each promise and handle any promise rejections. */

function luckyDraw(player) {
  return new Promise((resolve, reject) => {
    const win = Boolean(Math.round(Math.random()));

    process.nextTick(() => {
      if (win) {
        resolve(`${player} won a prize in the draw!`);
      } else {
        reject(new Error(`${player} lost the draw.`));
      }
    });
  });
}

const getResults = async () => {
  try {
    const tina = await luckyDraw("Tina");
    console.log(tina);
    const jorge = await luckyDraw("Jorge");
    console.log(jorge);
    const julien = await luckyDraw("Julien");
    console.log(julien);
  } catch (err) {
    console.log(err);
  }
};

getResults();
