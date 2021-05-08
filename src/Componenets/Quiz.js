import React, { useEffect, useState } from "react";
import axios from "axios";
import { NavLink, useHistory } from "react-router-dom";
import update from 'react-addons-update';
import { Grid, Typography, Button, ButtonGroup, RadioGroup, Radio, FormControlLabel } from "@material-ui/core";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import CircularProgress from '@material-ui/core/CircularProgress';
import "../css/Quiz.css";
import QuizForm from "./QuizForm";
import { Link } from "react-router-dom";

var decodeEntities = (function() {
  // this prevents any overhead from creating the object each time
  var element = document.createElement('div');

  function decodeHTMLEntities (str) {
    if(str && typeof str === 'string') {
      // strip script/html tags
      str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
      str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
      element.innerHTML = str;
      str = element.textContent;
      element.textContent = '';
    }
    return str;
  }
  return decodeHTMLEntities;
})();
const shuffle = (array) => {
      var currentIndex = array.length, temporaryValue, randomIndex;
      // While there remain elements to shuffle...
      while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }
      return array;
}
export { decodeEntities, shuffle };
export default function Quiz(props) {
    const [data, setData] = useState({});
    const [array, setArrState] = useState([]);
    const [score, setScore] = useState(0);
    const [value, setValue] = useState(""); // To store current value of Radio Button
    const [error, setError] = useState(false);
    const [question, setQuestion] = useState("");
    const [view, setView] = useState("Focused");
    const [count, setCount] = useState(0);
    const [amount, setAmount] = useState(0);
    const [answer, setAnswer] = useState([]); // state to store all the values entered by the user
    const [correctanswer, setCorrectAnswer] = useState([]); // state to store all the correct answer fetched by the api
	const [submit, setSubmit] = useState(false);
	let history = useHistory();
    useEffect(() => { getData(); }, []);
    useEffect(() => { setInitialQuestion(); });
    useEffect(() => { setArray(); }, [data, count]);
    useEffect(() => { setInputs(); }, [data, count, value]);
	useEffect(() => {
		if (data.results) {
			if (count > answer.length - 1) {
				if (answer[count - 1] === data.results[count - 1].correct_answer) {
				console.log("correct");
				setScore(score => score + 1);
				const newarr = [...answer];
				console.log("newarr[count] = " + newarr[count]);
				setValue(value => newarr[count]);
				}
				else {
					console.log("incorrect answer");
					setScore(score => score - 1);
					const newarr = [...answer];
					console.log("newarr[count] = " + newarr[count]);
					setValue(value => newarr[count]);
				}
			}
			else {
				if (answer[count] === data.results[count].correct_answer) {
					console.log("correct");
					setScore(score => score + 1);
					const newarr = [...answer];
					console.log("newarr[count] = " + newarr[count]);
					setValue(value => newarr[count]);
				}
				else {
					console.log("incorrect answer");
					setScore(score => score - 1);
					const newarr = [...answer];
					console.log("newarr[count] = " + newarr[count]);
					setValue(value => newarr[count]);
				}
			}
		}
	}, [count]);
	useEffect(() => {
		if (submit) {
			history.push({
				pathname:  "/result",
				state: {
				  data: data,
				  answer: answer,
				  score: score,
				} 
			});
		}
	}, [submit]);
	const setInputs = () => {
		if (data.results) {
			if (count > answer.length) {
				if (value !== "") {
					setAnswer(answer => [...answer, value]);
				}
			}
			else {
				if (value !== "") {
					const newarr = [...answer];
					newarr[count] = value;
					setAnswer(newarr);
				}
			}
        }
	}
	
    const setInitialQuestion = () => {
        if (data.results)
            setQuestion(decodeEntities(data.results[count].question));
    }
    const getData = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const amount = urlParams.get('amount');
        setAmount(amount);
        const category = urlParams.get('category');
        const difficulty = urlParams.get('difficulty');
        const type = urlParams.get('type');

        var requesturl = `https://opentdb.com/api.php?amount=${amount}`;
        if (category != 101) {
            requesturl += `&category=${category}`;
        }
        if (difficulty !== "random") {
            requesturl += `&difficulty=${difficulty}`;
        }
        if (type !== "random") {
            requesturl += `&type=${type}`;
        }
		if (!props.data) {
			axios.get(requesturl)
				.then((response) => {
					setData(response.data);
				});
		}
		else {
			setData(data => props.data);
		}
    }
    const myFunc = (val) => {
        setArrState(array => [...array, String(val)])
    }
    const setArray = () => {
        if (data.results) {
            setArrState([String(data.results[count].correct_answer)]);
            data.results[count].incorrect_answers.forEach(myFunc);
            setArrState(array => shuffle(array));
        }
    }
    const handleRadioChange = (event) => {
        setValue(event.target.value);
        setError(false);
    };
    const handleNextChange = () => {
        if (!value || value === "")
            setError(true);
        else {
            if (count <= amount)
                setCount(count => count + 1);
			setValue("");
        }
    }
    const handlePrevChange = () => {
        if (count > 0) {
            setCount((count) => count - 1);
		}
        
    }
    const handleSkipChange = () => {
        if (count < amount) {
            setCount(count => count + 1);
            setValue("");
			setError(false);
        }
    }
    const renderErrorMsg = () => {
        if (error) {
            return  (
                <Grid item xs={12}>
                    <Typography
                    variant="h8"
                    component="h8"
                    color="secondary">
                    Validation Error: Choose an option
                    </Typography>
                </Grid>
            );
        }
    }
    const renderButtonViewGroup = () => {
        if (view === "Focused") {
            return (
                <ButtonGroup variant="contained" aria-label="contained primary button group">
                    <Button color="primary" onClick={() => setView("Form")}>Form View</Button>
                    <Button color="secondary" disabled>Focused View</Button>
                </ButtonGroup>
            );
        }
        else {
            return (
                <ButtonGroup variant="contained" aria-label="contained primary button group">
                    <Button color="primary" disabled>Form View</Button>
                    <Button color="secondary" onClick={() => setView("Focused")}>Focused View</Button>
                </ButtonGroup>
            );
        }
    }
    const handleSubmit = () => {
		if (answer[count] === data.results[count].correct_answer) {
			console.log("correct");
			setScore(score => score + 1);
			const newarr = [...answer];
			console.log("newarr[count] = " + newarr[count]);
			setValue(value => newarr[count]);
		}
		else {
			console.log("incorrect answer");
			setScore(score => score - 1);
			const newarr = [...answer];
			console.log("newarr[count] = " + newarr[count]);
			setValue(value => newarr[count]);
		}
		setSubmit(submit => true);
    }
    const renderButtonNavGroup = () => {
        if (count == amount - 1) {
            return (
                <ButtonGroup variant="contained" aria-label="contained primary button group">
                    <Button onClick={handlePrevChange} className="prev-btn" color="primary">Prev</Button>
                    <Button onClick={handleSubmit} className="skip-btn" color="secondary">Skip</Button>
                    <Button onClick={handleSubmit} className="next-btn" color="primary">Submit</Button>
                </ButtonGroup>
            );
        }
        else if (count == 0) {
            return (
                <ButtonGroup variant="contained" aria-label="contained primary button group">
                    <Button onClick={handlePrevChange} className="prev-btn" color="primary" disabled>Prev</Button>
                    <Button onClick={handleSkipChange} className="skip-btn" color="secondary">Skip</Button>
                    <Button onClick={handleNextChange} className="next-btn" color="primary">Next</Button>
                </ButtonGroup>
            );
        }
        else {
            return (
                <ButtonGroup variant="contained" aria-label="contained primary button group">
                    <Button onClick={handlePrevChange} className="prev-btn" color="primary">Prev</Button>
                    <Button onClick={handleSkipChange} className="skip-btn" color="secondary">Skip</Button>
                    <Button onClick={handleNextChange} className="next-btn" color="primary">Next</Button>
                </ButtonGroup>
            );
        }
    }
    const renderQuiz = () => {
		if (view === "Focused") {
			if (data.response_code === 0) {
				return (
					<div className="quiz-child">
						<Grid container spacing={6} direction="column" justify="center" alignItems="center">
                            <Grid item xs={12}>
                                <Button component={Link} to="/" variant="contained" color="default">Home</Button>
                            </Grid>
							<Grid item xs={12}>
								{renderButtonViewGroup()}
							</Grid>
							<Grid item xs={12} align="center">
								<h2>{question}</h2>
								{console.log("--------------------------------------")}
								{console.log("Score = " + score)}
								{console.log("Amount = " + amount)}
								{console.log("Count = " + count)}
								{console.log("Answers: " + answer)}
								{console.log("Value: " + value)}
							</Grid>
							<Grid item xs={12} align="center">
								<RadioGroup aria-label="quiz" name="quiz" value={value} onChange={handleRadioChange}>
								{
									array.map((val) => {
										return (<FormControlLabel value={decodeEntities(val)} control={<Radio color="primary" />} label={decodeEntities(val)} />);
									})
								}
								</RadioGroup>
							</Grid>
								{renderErrorMsg()}
							<Grid item xs={12} align="center">
								{renderButtonNavGroup()}
							</Grid>
						</Grid>
					</div>
				);
			}
			else {
				return (<CircularProgress className="loading" />);
			}
		}
		else {
			return (<QuizForm data={data}/>);
		}
    }
    return (
        <div className="quiz">
            {renderQuiz()}
        </div>
    );
}
