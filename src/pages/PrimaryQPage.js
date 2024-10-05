import { useParams } from "react-router-dom";
import questions from "../database";
import { users } from "../database";
import { Link } from "react-router-dom";
import Countdown from "../components/Countdown";
import { useState } from "react";
const PrimaryQPage = () => {
  const { userId, questionId } = useParams();
  const question = questions.find((question) => question.id === questionId);
  const player = users.find((user) => user.userId === userId);
  if (!player) {
    return <h1>User not found</h1>;
  }
  return (
      <>
        <h1> {question.question} </h1>
        <Link to={`/agree/${player.userId}/${question.id}`}>
          <button>Agree</button>
        </Link>
        <Link to={`/disagree/${player.userId}/${question.id}`}>
          <button>Disagree</button>
        </Link>
      </>
  );
};

export default PrimaryQPage;
