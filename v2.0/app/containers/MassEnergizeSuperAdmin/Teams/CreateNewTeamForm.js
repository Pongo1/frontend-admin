import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import Select2 from '@material-ui/core/Select';
import Paper from '@material-ui/core/Paper';
import { Field, reduxForm } from 'redux-form/immutable';
import Grid from '@material-ui/core/Grid';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import {
  Checkbox,
  TextField,
  Switch,
  Select
} from 'redux-form-material-ui';
import { fetchData, sendJson } from '../../../utils/messenger';

import { initAction, clearAction } from '../../../actions/ReduxFormActions';

const renderRadioGroup = ({ input, ...rest }) => (
  <RadioGroup
    {...input}
    {...rest}
    valueselected={input.value}
    onChange={(event, value) => input.onChange(value)}
  />
);

// validation functions
const required = value => (value == null ? 'Required' : undefined);

const styles = theme => ({
  root: {
    flexGrow: 1,
    padding: 30
  },
  field: {
    width: '100%',
    marginBottom: 20
  },
  fieldBasic: {
    width: '100%',
    marginBottom: 20,
    marginTop: 10
  },
  inlineWrap: {
    display: 'flex',
    flexDirection: 'row'
  },
  buttonInit: {
    margin: theme.spacing.unit * 4,
    textAlign: 'center'
  },
});


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, that) {
  return {
    fontWeight:
      that.state.formData.admins.indexOf(name) === -1
        ? that.props.theme.typography.fontWeightRegular
        : that.props.theme.typography.fontWeightMedium,
  };
}


const initData = {
  name: 'New Dummy Team 1',
  description: 'No Description yet',
};

class CreateNewTeamForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: { admins: [], members: [] },
      people: [],
      communities: []
    };
  }


  async componentDidMount() {
    const people = await fetchData('v2/users');
    const communities = await fetchData('v2/communities');

    if (people) {
      this.setStateAsync({ people: people.data });
    }

    if (communities) {
      this.setStateAsync({ communities: communities.data });
    }
  }

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve);
    });
  }

  handleChangeMultiple = (event) => {
    const { target } = event;
    const { name, options } = target;
    const value = [];
    for (let i = 0, l = options.length; i < l; i += 1) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }
    this.setState({
      formData: { [name]: value }
    });
  };

  handleFormDataChange = (event) => {
    const { target } = event;
    if (!target) return;
    const { name, value } = target;
    const { formData } = this.state;
    this.setState({
      formData: { ...formData, [name]: value }
    });
  }

  submitForm = async (event) => {
    event.preventDefault();
    const { formData } = this.state;
    const cleanedValues = { ...formData };

    console.log(cleanedValues);
    const response = sendJson(cleanedValues, '/v2/teams', '/admin/read/teams');
    console.log(response);
  }

  async updateForm(fieldName, value) {
    const { formData } = this.state;
    await this.setStateAsync({
      formData: {
        ...formData,
        [fieldName]: value
      }
    }
    );
  }

  render() {
    const trueBool = true;
    const {
      classes,
      pristine,
      reset,
      submitting,
      init,
      clear
    } = this.props;
    const {
      formData, people, communities
    } = this.state;
    const { admins, members, community } = formData;
    // let communitySelected = communities.filter(c => c.id === community)[0];
    // communitySelected = communitySelected ? communitySelected.name : '';

    return (
      <div>
        <Grid container spacing={24} alignItems="flex-start" direction="row" justify="center">
          <Grid item xs={12} md={6}>
            <Paper className={classes.root}>
              <Typography variant="h5" component="h3">
                 New Team
              </Typography>
              <div className={classes.buttonInit}>
                <Button onClick={() => init(initData)} color="secondary" type="button">
                  Load Sample Data
                </Button>
                <Button onClick={() => clear()} type="button">
                  Clear Data
                </Button>
              </div>
              <form onSubmit={this.submitForm}>
                <div>
                  <Field
                    name="name"
                    component={TextField}
                    placeholder="Team Name"
                    label="Team Name"
                    validate={required}
                    required
                    ref={this.saveRef}
                    className={classes.field}
                    onChange={this.handleFormDataChange}
                  />
                </div>
                <div className={classes.field}>
                  <Field
                    name="description"
                    className={classes.field}
                    component={TextField}
                    placeholder="About this Team"
                    label="About this Team"
                    multiline={trueBool}
                    rows={4}
                    onChange={this.handleFormDataChange}
                  />
                </div>
                <div>
                  <FormControl className={classes.field}>
                    <InputLabel htmlFor="community">Community</InputLabel>
                    <Field
                      name="community"
                      component={Select}
                      placeholder="Select a Community"
                      autoWidth={trueBool}
                      onChange={async (newValue) => { await this.updateForm('community', newValue); }}
                    >
                      { communities
                        && communities.map(c => (
                          <MenuItem value={c.id} key={c.id}>
                            {c.name}
                          </MenuItem>
                        ))
                      }
                    </Field>
                  </FormControl>
                </div>
                <div className={classes.field}>
                  <FormControl className={classNames(classes.formControl, classes.noLabel)}>
                    <Select2
                      multiple
                      displayEmpty
                      value={admins}
                      onChange={this.handleFormDataChange}
                      input={<Input id="select-multiple-placeholder" name="admins" />}
                      renderValue={selected => {
                        if (selected.length === 0) {
                          return <em>Please Select Administrators of this Team</em>;
                        }
                        const names = selected.map(s => people.filter(t => t.id === s)[0].full_name);
                        return names.join(', ');
                      }}
                      MenuProps={MenuProps}
                    >
                      <MenuItem disabled value="">
                        <em>Team Admins</em>
                      </MenuItem>
                      {
                        people.map(t => (
                          <MenuItem key={t.id} value={t.id} style={getStyles(t.name, this)}>
                            {`${t.full_name} - ${t.email}`}
                          </MenuItem>
                        ))
                      }
                    </Select2>
                  </FormControl>
                </div>


                <div className={classes.field}>
                  <FormControl className={classNames(classes.formControl, classes.noLabel)}>
                    <Select2
                      multiple
                      displayEmpty
                      value={members}
                      onChange={this.handleFormDataChange}
                      input={<Input id="select-multiple-placeholder" name="members" />}
                      renderValue={selected => {
                        if (selected.length === 0) {
                          return <em>Please Select members of this Team</em>;
                        }
                        const names = selected.map(s => people.filter(t => t.id === s)[0] && people.filter(t => t.id === s)[0].full_name);
                        return names.join(names ? ', ' : '');
                      }}
                      MenuProps={MenuProps}
                    >
                      <MenuItem disabled value="">
                        <em>Members</em>
                      </MenuItem>
                      {
                        people.map(t => (
                          <MenuItem key={t.id} value={t.id}>
                            {`${t.full_name} - ${t.email}`}
                          </MenuItem>
                        ))
                      }
                    </Select2>
                  </FormControl>
                </div>
                {/* <div className={classes.fieldBasic}>
                  <FormLabel component="label">Toggle Input</FormLabel>
                  <div className={classes.inlineWrap}>
                    <FormControlLabel control={<Field name="onof" component={Switch} />} label="On/OF Switch" />
                    <FormControlLabel control={<Field name="checkbox" component={Checkbox} />} label="Checkbox" />
                  </div>
                </div> */}
                <div>
                  <Button variant="contained" color="secondary" type="submit" disabled={submitting}>
                    Submit
                  </Button>
                </div>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

renderRadioGroup.propTypes = {
  input: PropTypes.object.isRequired,
};

CreateNewTeamForm.propTypes = {
  classes: PropTypes.object.isRequired,
  reset: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  init: PropTypes.func.isRequired,
  clear: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  init: bindActionCreators(initAction, dispatch),
  clear: () => dispatch(clearAction),
});

const ReduxFormMapped = reduxForm({
  form: 'immutableExample',
  enableReinitialize: true,
})(CreateNewTeamForm);

const reducer = 'initval';
const FormInit = connect(
  state => ({
    force: state,
    initialValues: state.getIn([reducer, 'formValues'])
  }),
  mapDispatchToProps,
)(ReduxFormMapped);

export default withStyles(styles, { withTheme: true })(FormInit);
