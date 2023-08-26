function FinishScreen({ points, maxPoints, highscore, dispatch }) {
   const percent = (points / maxPoints) * 100;
   return (
      <>
         <p className="result">
            You scored <strong>{points}</strong> out of {maxPoints} (
            {Math.ceil(percent)}%)
         </p>
         <p className="highscore">(Highscore: {highscore} points)</p>
         <button
            className="btn btn-ui"
            onClick={() => dispatch({ type: "restartGame" })}
         >
            Restart game!
         </button>
      </>
   );
}

export default FinishScreen;
