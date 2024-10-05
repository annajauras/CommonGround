import { useParams } from "react-router-dom";
import { disagreeResponses } from "../database";
import { users } from "../database";
import { Link } from "react-router-dom";
const DisagreeFUQPage = () => {
  const { userId, disagreeResponseId } = useParams();
  const followUp = disagreeResponses.find(
    (response) => response.id === disagreeResponseId
  );
  const user = users.find((user) => user.userId === userId);
  console.log(user.userId);
  console.log(followUp.question);
  return <h1>{followUp.disagreeFollowUp}</h1>;
};
export default DisagreeFUQPage;
