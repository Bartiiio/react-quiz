import React, { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";
import Footer from "./Footer";
import Timer from "./Timer";

const initialState = {
   questions: [],
   status: "loading",
   index: 0,
   answer: null,
   points: 0,
   highscore: 0,
   secondsRemaining: null,
};

function reducer(state, action) {
   switch (action.type) {
      case "dataReceived":
         return { ...state, questions: action.payload, status: "ready" };

      case "dataFailed":
         return { ...state, status: "error" };

      case "start":
         return {
            ...state,
            status: "active",
            secondsRemaining: state.questions.length * 20,
         };

      case "newAnswer":
         const question = state.questions.at(state.index);

         return {
            ...state,
            answer: action.payload,
            points:
               action.payload === question.correctOption
                  ? state.points + question.points
                  : state.points,
         };

      case "nextQuestion":
         return {
            ...state,
            index: state.index + 1,
            answer: null,
         };

      case "finished":
         return {
            ...state,
            status: "finished",
            highscore:
               state.points > state.highscore ? state.points : state.highscore,
         };

      case "restartGame":
         return {
            ...state,
            status: "ready",
            answer: null,
            points: 0,
            index: 0,
            secondsRemaining: state.questions.length * 20,
         };
      case "tick":
         return {
            ...state,
            secondsRemaining: state.secondsRemaining - 1,
            status: state.secondsRemaining === 0 ? "finished" : state.status,
         };
      default:
         throw new Error("Action unknown");
   }
}

export default function App() {
   const [
      { questions, status, index, answer, points, highscore, secondsRemaining },
      dispatch,
   ] = useReducer(reducer, initialState);

   const numQuestions = questions.length;

   const maxPoints = questions.reduce((prev, cur) => prev + cur.points, 0);

   useEffect(function () {
      const dataloading = async function () {
         try {
            const fetching = await fetch(
               "https://raw.githubusercontent.com/Bartiiio/kursywalutv2/master/images/questions.json"
            );
            const res = await fetching.json();
            dispatch({ type: "dataReceived", payload: res.questions });
         } catch (error) {
            dispatch({ type: "dataFailed" });
         }
      };
      dataloading();
   }, []);

   return (
      <div className="app">
         <Header />
         <Main>
            {status === "loading" && <Loader />}
            {status === "error" && <Error />}
            {status === "ready" && (
               <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
            )}
            {status === "active" && (
               <>
                  <Progress
                     index={index}
                     numQuestions={numQuestions}
                     points={points}
                     maxPoints={maxPoints}
                     answer={answer}
                  />
                  <Question
                     question={questions[index]}
                     dispatch={dispatch}
                     answer={answer}
                  />
                  <Footer>
                     <Timer
                        dispatch={dispatch}
                        secondsRemaining={secondsRemaining}
                     />
                     <NextButton
                        dispatch={dispatch}
                        answer={answer}
                        numQuestions={numQuestions}
                        index={index}
                     />
                  </Footer>
               </>
            )}

            {status === "finished" && (
               <FinishScreen
                  points={points}
                  maxPoints={maxPoints}
                  highscore={highscore}
                  dispatch={dispatch}
               />
            )}
         </Main>
      </div>
   );
}
