import { useParams } from "react-router-dom";
import { agreeResponses } from "../database";
import { users } from "../database";
import { Link } from "react-router-dom";
import { useState } from "react";
import Countdown from "../components/Countdown";
const AgreeFUQPage = () => {
  const { userId, agreeResponseId } = useParams();
  const followUp = agreeResponses.find(
    (response) => response.id === agreeResponseId
  );
  const user = users.find((user) => user.userId === userId);

  const [countdownFinished, setCountdownFinished] = useState(false);

  console.log(user.userId);
  console.log(followUp.question);

  const handleCountdownEnd = () => {
    setCountdownFinished(true); // Set the state to true when countdown is over
  };
  return (
    <>
      <div class="timer">
        {!countdownFinished && (
          <>
          <h1>Please find your group</h1>
          <Countdown onCountdownEnd={handleCountdownEnd} />
          </>
        )}
      </div>
      {countdownFinished && (
        <>
          <h1>{followUp.agreeFollowUp}</h1>
        </>
      )}
    </>
  );
};
export default AgreeFUQPage;
