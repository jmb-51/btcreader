import React, { useState }  from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import TextField from '@material-ui/core/TextField';


const useStyles = makeStyles((theme) => ({
    root: {
      minWidth: 400,
      '& > *': {
        margin: theme.spacing(1),
        width: '25ch',
      },
    },
    bullet: {
      display: 'inline-block',
      margin: '0 2px',
      transform: 'scale(0.8)',
    },
    title: {
      fontSize: 14,
    },
    pos: {
      marginBottom: 12,
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120
    },
    selectEmpty: {
      marginTop: theme.spacing(2)
    }
  }));


export const QueryLatestBtcUsd = () => {

    const classes = useStyles();

    // create currency state hook
    const [currency, setCurrency] = useState("");
    // result state hook
    const [resultMessage, setResultMessage]= useState([]);
  
    // text handler to get conversion rate
    const handleChange = (event) => {
      setCurrency(event.target.value);
    };

    // get latest rate
    const handleInput = (input, currency) => {
      fetch(`http://${process.env.REACT_APP_FETCH_ENDPOINT}/api/v1/rates/latest`)
      .then(resp => resp.json())
      .then(resp => {
        if (currency === 'btc') {
          var usdResultValue = input * resp.usd;
          setResultMessage(`The converted price is 
          "BTC ${input}" = "USD ${usdResultValue}" 
          at timestamp ${resp.lastCalled}`)
        } else {
          var btcResultValue = input / resp.usd;
          setResultMessage(`The converted price is 
          "USD ${input}" = "BTC ${btcResultValue}" 
          at timestamp ${resp.lastCalled}`)
        }
      })

      .catch(err => alert(err))


    };    

  

    return (
      <Card className={classes.root}>
        <CardContent>
          <Typography variant="h5" component="h2">
            Type in BTC/USD to get latest rate.
          </Typography>
          {/* Currency conversion label box */}
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel id="currency-selector-label">Conversion</InputLabel>
            <Select
              labelId="currency-selector-label"
              id="currency-selector"
              value={currency}
              onChange={handleChange}
              label="Convert from"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={"btc"}>BTC TO USD</MenuItem>
              <MenuItem value={"usd"}>USD TO BTC</MenuItem>
            </Select>
          </FormControl>
          {/* Field to enter price in BTC or USD */}
          <form className={classes.root} noValidate autoComplete="off">
            <TextField id="currency-field" label={currency}
            onInput={e => handleInput(e.target.value, currency)}/>
          </form>
          <Typography variant="h6" component="h6">
            {resultMessage}
          </Typography>
        </CardContent>
      </Card>
    );

};