import React, { useState }  from "react";
import { useLocation } from 'react-router-dom';
import { Grid, Typography, FormHelperText, Card, CardContent, Box } from "@material-ui/core";
import { decodeEntities } from "./Quiz";
import { makeStyles } from '@material-ui/core/styles';
import { shadows } from '@material-ui/system';

export default function Result() {
	const location = useLocation();
	const score = location.state.score;
	const answer = location.state.answer;
	const data = location.state.data;
	var bordercolor;
	const defaultProps = {
	  bgcolor: 'background.paper',
	  border: 2,
	};
	
	const decideborderColor = (ans, value) => {
		if (ans === decodeEntities(value))
			bordercolor = "primary.main";
		else
			bordercolor = "secondary.main";
	}
	
    return (
        <div className="result">
			 <Grid container spacing={6} direction="column" justify="center" alignItems="center">
				<Grid item xs={12} align="center">
					<Typography variant="h5" componenet="h5">Your Score: {score}</Typography>
					<FormHelperText>
						+1 when you answer correctly <br />
						-1 when you answer incorrectly <br />
						nothing when you skip <br />
					</FormHelperText>
				</Grid>
				{
					data.results.map((val, index) => {
						return (
						<Grid item xs={12} align="center">
						{decideborderColor(answer[index], val.correct_answer)}
						<Box boxShadow={3} borderColor={bordercolor} borderRadius={16} {...defaultProps}>
							<Card>
								<CardContent>
									<Typography variant="h6" componenet="h6">{decodeEntities(val.question)}</Typography>
									<Typography variant="h8" componenet="h8">Your Answer: {answer[index]}</Typography> <br />
									<Typography variant="h8" componenet="h8">Correct Answer: {decodeEntities(val.correct_answer)}</Typography>
								</CardContent>
							</Card>
						</Box>
						</Grid>
						);
					})
				}
			 </Grid>
		</div>
    );
}
