const getLineType = (line) => {
  line = line.trim();
  if(line.length === 0) return "blank";
  else if(line.charAt(1) === ')' || (line.substring(0,3) === ">>>" && line.charAt(4) === ')')) return "answer";
  else return "question";
}

const getAnswerText = (answer) => answer.split(')')[1].trim()

export function convertPDSToJson(PDSText){
  const lines = PDSText.split('\n');
  let questions = [];

  for(let i=0; i< lines.length; i++){
    lines[i] = lines[i].trim()
  }

  let currentType = "blank", previousType = "blank", ignore = false;
  let newQuestion = {
    text: undefined,
    answers: []
  }


  for(let i=0; i< lines.length; i++){
    let currentLine = lines[i];
    // let previousLine = (i > 0) ? lines[i-1] : "";


    previousType = (i > 0) ? currentType : "blank";
    currentType = getLineType(currentLine);

    switch(currentType){
      case "blank": {
        if (newQuestion.text && newQuestion.answers.length > 0 && ignore === false) {
          questions.push(newQuestion);
          ignore = false;
        } else {
          ignore = true;
        }
        newQuestion = {text: undefined, answers: []};
        break;
      }
      case "question": {
        if(previousType === "question" && ignore === false){
          newQuestion.text += '\n'+currentLine;
          ignore = false;
        }
        else if(previousType === "blank"){
          newQuestion = {text: currentLine, answers: []};
          ignore = false;
        }
        else /*if(previousType === "answer")*/{
          newQuestion = {text: undefined, answers: []};
          ignore = true;
        }
        break;
      }
      case "answer": {
        if(previousType === "answer" && ignore === false){
          const correct = (currentLine.substring(0, 3) === ">>>");
          newQuestion.answers.push({text: getAnswerText(currentLine), isTrue: correct});
          ignore = false;
        }
        else if (previousType === "question" && newQuestion.text && ignore === false){
          const correct = (currentLine.substring(0, 3) === ">>>");
          newQuestion.answers = [{text: getAnswerText(currentLine), isTrue: correct}];
          ignore = false;
        }
        else {
          newQuestion = {name: undefined, answers: []};
          ignore = true;
        }
      }
    }
  }
  if (newQuestion.text && newQuestion.answers.length > 0 && ignore === false) {
    questions.push(newQuestion)
  }
  return questions;
}

// console.log(convertPDSToJson("    Question?\n" +
//   "    A) Answer 1\n" +
//   "    A) Answer 2\n" +
//   "    >>>A) Answer 3\n" +
//   "    \n" +
//   "    Question?\n" +
//   "    Z) Answer 1\n" +
//   "    Y) Answer 2\n" +
//   "    >>>X) Answer 3"));



