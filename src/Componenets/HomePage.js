import React, { useState } from "react";
import { Grid, Button, TextField, Typography, InputLabel, Select, MenuItem } from "@material-ui/core";
import { FormLabel, FormControl, FormControlLabel, RadioGroup, Radio } from "@material-ui/core";
import { green } from '@material-ui/core/colors';
import { withStyles } from '@material-ui/core/styles';
import categorydata from "../Category.json";
import Quiz from "./Quiz";

const GreenRadio = withStyles({
  root: {
    color: green[400],
    '&$checked': {
      color: green[600],
    },
  },
  checked: {},
})((props) => <Radio color="default" {...props} />);

export default function HomePage() {
    const [type, setType] = useState("random");      // 101 is the default value for Random
    const [cat, setCat] = useState(101);
    const [diff, setDiff] = useState("random");
    const [num, setNum] = useState(10);         //The default question we're fetching is 10
    const [error, setError] = useState('');  //Just a flag to display an error msg
    const handleTypeChange = (event) => {
        setType(event.target.value);
    };
    const handleCatChange = (event) => {
        setCat(event.target.value);
    };
    const handleNumChange = (event) => {
        var val = event.target.value;
        setNum(event.target.value);
        if (val < 1)
            setError('Validation Error: No. of question can\'t be less than 0');
        else if (val > 50)
            setError('Validation Error: You can get 50 question per request');
        else
            setError('');
    };
    const handleDiffChange = (event) => {
        setDiff(event.target.value);
    };
    const mycategorydata = categorydata.categories;
    const getIdName = mycategorydata.map((val) => {
        return <MenuItem value={`${val.id}`}>{val.name}</MenuItem>
    });
    const submitFunc = (event) => {
        if (error)
            event.preventDefault();
    }
    const renderErrorMsg = () => {
        if (error) {
            return (
                <Grid item xs={12}>
                    <Typography
                    variant="h8"
                    component="h8"
                    color="secondary">{error}
                    </Typography>
                </Grid>
            );
        }
    }
    return (
        <div id="main"><br /><br />
			<form action="/quiz" onSubmit={submitFunc} >
				<Grid container spacing={6} direction="column" justify="center" alignItems="center">
					<Grid item xs={12}>
						<Typography variant='h4' component='h4'>Create a Quiz</Typography>
					</Grid>
					{renderErrorMsg()}
					<Grid item xs={12}>
					<FormControl>
						<TextField
						type="number"
						name="amount"
						value={num}
						onChange={handleNumChange}
						id="noques"
						label="Number of question" />
					</FormControl>
					</Grid>
					<Grid item xs={12}>
						<InputLabel id="label">Category</InputLabel>
						<Select name="category" labelId="label" id="select" value={cat} onChange={handleCatChange}>
						  <MenuItem value={101}>Random</MenuItem>
						  {getIdName}
						</Select><br /><br />
					</Grid>
					<Grid item xs={12}>
						<FormControl component="fieldset">
						  <FormLabel component="legend">Difficulty</FormLabel>
						  <RadioGroup name="difficulty" row aria-label="position" value={diff} onChange={handleDiffChange}>
							<FormControlLabel value="random" control={<Radio color="primary" />} label="Random" />
							<FormControlLabel value="easy" control={<GreenRadio />} label="Easy" />
							<FormControlLabel value="medium" control={<Radio color="default" />} label="Medium" />
							<FormControlLabel value="hard" control={<Radio color="secondary" />} label="Hard  " />
						  </RadioGroup>
						</FormControl>
					</Grid>
					<Grid item xs={12}>
						<InputLabel id="label">Type</InputLabel>
						<Select name="type" labelId="label" id="select" value={type} onChange={handleTypeChange}>
							<MenuItem value="random">Random</MenuItem>
							<MenuItem value="multiple">Multiple Choice</MenuItem>
							<MenuItem value="boolean">True/False</MenuItem>
						</Select>
					</Grid>
					<Grid item xs={12}>
						<Button type="submit" variant="contained" color="primary" size="large">Create</Button>
					</Grid>
				</Grid>
            </form>
        </div>
    );
}
