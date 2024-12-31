const questions = [
  {
    id: "10001",
    question: "I enjoy trying new foods.",
  },
  {
    id: "10002",
    question: "I prefer staying in over going out.",
  },
  {
    id: "10003",
    question: "I like to plan things in advance.",
  },
  {
    id: "10004",
    question: "I consider myself a morning person.",
  },
  {
    id: "10005",
    question: "I find it easy to make new friends.",
  },
  {
    id: "10006",
    question: "I enjoy reading books.",
  },
  {
    id: "10007",
    question: "I prefer listening to music over watching TV.",
  },
  {
    id: "10008",
    question: "I like to travel to new places.",
  },
  {
    id: "10009",
    question: "I enjoy attending social events.",
  },
  {
    id: "10010",
    question: "I feel comfortable speaking in public.",
  },
  {
    id: "10011",
    question: "I often follow my intuition.",
  },
  {
    id: "10012",
    question: "I enjoy working in a team.",
  },
  {
    id: "10013",
    question: "I prefer cats over dogs.",
  },
  {
    id: "10014",
    question: "I like to keep my living space tidy.",
  },
  {
    id: "10015",
    question: "I find it easy to express my emotions.",
  },
  {
    id: "10016",
    question: "I enjoy playing sports.",
  },
  {
    id: "10017",
    question: "I like to take risks.",
  },
  {
    id: "10018",
    question: "I prefer to spend my free time outdoors.",
  },
  {
    id: "10019",
    question: "I enjoy cooking meals at home.",
  },
  {
    id: "10020",
    question: "I feel confident in my abilities.",
  },
];

const agreeResponses = [
  {
    id: "10001",
    agreeFollowUp:
      "What was the most unusual food you've ever tried and did you like it?",
  },
  {
    id: "10002",
    agreeFollowUp: "What are your favorite activities to do when you stay in?",
  },
  {
    id: "10003",
    agreeFollowUp:
      "Can you give an example of a time when planning ahead really paid off for you?",
  },
  {
    id: "10004",
    agreeFollowUp:
      "What do you usually do to start your day on a positive note?",
  },
  {
    id: "10005",
    agreeFollowUp:
      "How do you usually approach someone new to start a friendship?",
  },
  {
    id: "10006",
    agreeFollowUp:
      "What is the last book you read and what did you think about it?",
  },
  {
    id: "10007",
    agreeFollowUp: "What kind of music do you enjoy the most and why?",
  },
  {
    id: "10008",
    agreeFollowUp:
      "What is your favorite travel destination so far and what did you enjoy about it?",
  },
  {
    id: "10009",
    agreeFollowUp: "What type of social event do you enjoy the most and why?",
  },
  {
    id: "10010",
    agreeFollowUp:
      "Can you share an experience where you had to speak in public?",
  },
  {
    id: "10011",
    agreeFollowUp:
      "Can you describe a situation where following your intuition led to a good outcome?",
  },
  {
    id: "10012",
    agreeFollowUp: "What do you think makes a team work well together?",
  },
  {
    id: "10013",
    agreeFollowUp: "What is it about cats that you prefer over dogs?",
  },
  {
    id: "10014",
    agreeFollowUp:
      "Do you have any tips or routines for keeping your living space organized?",
  },
  {
    id: "10015",
    agreeFollowUp: "How do you usually express your feelings to others?",
  },
  {
    id: "10016",
    agreeFollowUp:
      "What sport do you enjoy the most and what do you like about it?",
  },
  {
    id: "10017",
    agreeFollowUp:
      "Can you share an example of a risk you took and what happened?",
  },
  {
    id: "10018",
    agreeFollowUp: "What outdoor activities do you enjoy the most?",
  },
  {
    id: "10019",
    agreeFollowUp: "What is your favorite dish to cook and why?",
  },
  {
    id: "10020",
    agreeFollowUp:
      "Can you talk about a time when your confidence helped you succeed?",
  },
];

const disagreeResponses = [
  {
    id: "10001",
    disagreeFollowUp: "What types of food do you prefer to stick with and why?",
  },
  {
    id: "10002",
    disagreeFollowUp: "What do you enjoy doing when you go out?",
  },
  {
    id: "10003",
    disagreeFollowUp: "How do you approach tasks and activities instead?",
  },
  {
    id: "10004",
    disagreeFollowUp:
      "What do you enjoy about staying up late or having a different schedule?",
  },
  {
    id: "10005",
    disagreeFollowUp:
      "What challenges do you face when trying to make new friends?",
  },
  {
    id: "10006",
    disagreeFollowUp: "What other activities do you prefer over reading?",
  },
  {
    id: "10007",
    disagreeFollowUp: "What kind of TV shows or movies do you enjoy watching?",
  },
  {
    id: "10008",
    disagreeFollowUp: "What do you enjoy about staying in familiar places?",
  },
  {
    id: "10009",
    disagreeFollowUp:
      "How do you prefer to spend your time instead of attending social events?",
  },
  {
    id: "10010",
    disagreeFollowUp: "What makes speaking in public challenging for you?",
  },
  {
    id: "10011",
    disagreeFollowUp: "How do you usually make decisions if not by intuition?",
  },
  {
    id: "10012",
    disagreeFollowUp:
      "What do you find more appealing about working independently?",
  },
  {
    id: "10013",
    disagreeFollowUp: "What do you like about dogs that you prefer over cats?",
  },
  {
    id: "10014",
    disagreeFollowUp: "How do you feel comfortable keeping your living space?",
  },
  {
    id: "10015",
    disagreeFollowUp: "How do you prefer to handle your emotions?",
  },
  {
    id: "10016",
    disagreeFollowUp: "What activities do you prefer over playing sports?",
  },
  {
    id: "10017",
    disagreeFollowUp: "What benefits do you see in avoiding risks?",
  },
  {
    id: "10018",
    disagreeFollowUp: "What indoor activities do you enjoy the most?",
  },
  {
    id: "10019",
    disagreeFollowUp:
      "What do you prefer about eating out or having meals prepared?",
  },
  {
    id: "10020",
    disagreeFollowUp: "What areas do you find yourself lacking confidence in?",
  },
];

export default questions;
export { agreeResponses };
export { disagreeResponses };