import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Card, CardContent, 
Box, Grid, Button, ButtonGroup, Typography, Radio, RadioGroup, FormControlLabel } from "@material-ui/core";
import Quiz, { decodeEntities, shuffle } from "./Quiz";
import "../css/Quiz.css";

export default function QuizForm(props) {
	const [view, setView] = useState("Form");
	const [map, setMap] = useState({});
	const [answer, setAnswer] = useState([]);
	const [submit, setSubmit] = useState(false);
	const [score, setScore] = useState(0);
	const [options, setOptions] = useState([]);
	const [flag, setFlag] = useState(false);
	let history = useHistory();
	useEffect(() => {
		setAnswer([]);
		Object.entries(map).map(([key, val]) => {
			setAnswer(answer => [...answer, val]);
		});
		console.log("---------------------------------");
		props.data.results.forEach((val, index) => {
			console.log(props.data.results[index].correct_answer);
		})
		console.log(score);
		if (submit) {
			history.push({
			pathname:  "/result",
			state: {
			  data: props.data,
			  answer: answer,
			  score: score,
			} 
		});
		}
	}, [submit, map]);
	useEffect(() => {
		setFlag(flag => true);
	}, []);
	const renderButtonViewGroup = () => {
		if (view === "Form") {
			return (
				<ButtonGroup variant="contained" aria-label="contained primary button group">
					<Button color="primary" disabled>Form View</Button>
					<Button color="secondary" onClick={() => setView("Focused")}>Focused View</Button>
				</ButtonGroup>
			);
		}
    }
	const handleRadioChange = (index) => (event) => {
		const temp = {}
		temp[index] = event.target.value;
		setMap({...map, [index]: event.target.value});
		setSubmit(false);
	}
	const renderAnswers = (index) => {
		var temp = [];
		temp.push(props.data.results[index].correct_answer);
		props.data.results[index].incorrect_answers.forEach((current) => temp.push(current));
		var arr = shuffle(temp);
		setOptions(options => arr);
		return (
			<RadioGroup aria-label="quiz" name="quiz" onChange={handleRadioChange(index)}>
				{
					arr.map((val) => {
						return (<FormControlLabel value={decodeEntities(val)} control={<Radio color="primary" />} label={decodeEntities(val)} />);
					})
				}
			</RadioGroup>
		);
		setFlag(flag => false);
	}
	const handleSubmit = () => {
		setSubmit(true);
		console.log(answer);
		answer.forEach((val, index) => {
			if (answer[index] === decodeEntities(props.data.results[index].correct_answer))
				setScore(score => score + 1);
			else
				setScore(score => score - 1);
		});
		console.log(score);
		
	}
	const renderQuiz = () => {
		if (view === "Form") {
			return (
			<div className="quiz-child">
				<Grid container spacing={6} direction="column" justify="center" alignItems="center">
					<Grid item xs={12}>
						{renderButtonViewGroup()}
					</Grid>
					<Grid item xs={12}>
						<Button variant="contained" color="primary" onClick={handleSubmit}>Submit</Button>
					</Grid>
					{ 
						props.data.results.map((val, index) => {
							return (
								<Grid item xs={12}>
									<Card>
										<CardContent>
											<Grid container spacing={6} direction="column" justify="center" alignItems="center">
												<Grid item xs={12}>
													<Typography variant="h6" component="h6">{decodeEntities(val.question)}</Typography>
												</Grid>
												<Grid item xs={12}>
													{renderAnswers(index)}
												</Grid>
											</Grid>
										</CardContent>
									</Card>
								</Grid>
							);
						})
					}
					<Grid item xs={12}>
						<Button variant="contained" color="primary" onClick={handleSubmit}>Submit</Button>
					</Grid>
				</Grid>
			</div>
			);
		}
		else {
			return (<Quiz data={props.data}/>);
		}
	}
	return (
		<div className="quiz">
			{renderQuiz()}
		</div>
	);
}