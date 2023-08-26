function Options({ question, dispatch, answer }) {
   const hasAnswered = answer !== null;
   return (
      <div>
         <div className="options">
            {question.options.map((element, index) => (
               <button
                  className={`btn btn-option ${
                     index === answer ? "answer" : ""
                  } ${
                     hasAnswered
                        ? index === question.correctOption
                           ? "correct"
                           : "wrong"
                        : ""
                  }`}
                  key={element}
                  onClick={() =>
                     dispatch({ type: "newAnswer", payload: index })
                  }
                  disabled={answer !== null}
               >
                  {element}
               </button>
            ))}
         </div>
      </div>
   );
}

export default Options;
