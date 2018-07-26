import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/index';
import { FormGroup, Col, Button, Input, InputGroup } from 'reactstrap';
import InputElement from '../../components/Input/';
import CardLayout from '../../components/CardLayout/';
import Select from 'react-select';
import _ from 'lodash';

class SponsorForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Sponsor: {
        name: '',
        event: '',
        description: '',
        websiteURL: '',
        imageURL: '',
        category: ''
      },
      editSponsor: false, nameRequired: false, eventRequired: false, categoryRequired: false
    }
  }
  componentWillMount() {
    this.props.getEvents();
  }
  componentDidMount() {
    let currentSponsor = _.pick(this.props.currentSponsor, ['name', 'eventName', 'category', 'websiteURL', 'imageURL', 'description']);
    let notEmpty = !Object.keys(currentSponsor).length;
    if (!notEmpty) {
      currentSponsor.event = this.props.currentSponsor.event._id;
      this.setState({
        ...this.state.Sponsor,
        Sponsor: currentSponsor,
        editSponsor: true
      });
    }
  }
  onChangeInput(event) {
    const { Sponsor } = { ...this.state };
    Sponsor[event.target.name] = event.target.value;
    this.setState({
      Sponsor: Sponsor,
      nameRequired: false
    })
  }

  handleEventChange(value) {
    if (value !== null) {
      let Sponsor = { ...this.state.Sponsor };
      Sponsor.event = value;
      this.setState({ Sponsor: Sponsor, eventRequired: false });
    }
  }
  handleCategoryChange(value) {
    if (value !== null) {
      let Sponsor = { ...this.state.Sponsor };
      Sponsor.category = value;
      this.setState({ Sponsor: Sponsor, categoryRequired: false });
    }
  }
  onSubmit() {
    let Sponsor = _.pick(this.state.Sponsor, ['name', 'event', 'category', 'description', 'websiteURL', 'imageURL']);
    let id = this.props.currentSponsor._id;
    if (Sponsor.name && Sponsor.category && Sponsor.event) {
      this.state.editSponsor ? this.props.editSponsor(id, Sponsor) : this.props.createSponsor(Sponsor);
      this.onReset();
      this.props.history.push('/sponsors');
    }
    else {
      !Sponsor.name ? this.setState({ nameRequired: true }) : null;
      !Sponsor.category ? this.setState({ categoryRequired: true }) : null;
      !Sponsor.event ? this.setState({ eventRequired: true }) : null;
    }
  }
  onReset() {
    this.setState(prevState => ({
      Sponsor: {
        ...prevState.Sponsor,
        name: '',
        event: '',
        description: '',
        websiteURL: '',
        imageURL: '',
        category: ''
      },
      nameRequired: false, eventRequired: false, categoryRequired: false
    }))

  }

  render() {
    const { Sponsor } = this.state;
    const eventOptions = this.props.eventList;
    const categoryOptions = this.props.categoryOptions;
    return (
      <CardLayout name="Sponsor">
        <FormGroup row>
          <Col xs="12" md="6">
            <InputElement
              icon="icon-tag"
              type="text"
              placeholder="Sponsor Name"
              name="name"
              required={this.state.nameRequired}
              value={Sponsor.name}
              onchanged={(event) => this.onChangeInput(event)}
            />
          </Col>
          <Col md="6">
            <Select
              placeholder="Select Event"
              value={Sponsor.event}
              options={eventOptions}
              simpleValue
              onChange={this.handleEventChange.bind(this)}
            />
            {this.state.eventRequired ? <div style={{ color: "red", marginTop: 0 }} className="help-block">*Required</div> : null}
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col xs="12" md="6">
            <InputElement
              icon="icon-info"
              type="text"
              placeholder="Description"
              name="description"
              value={Sponsor.description}
              onchanged={(event) => this.onChangeInput(event)}
            />
          </Col>
          <Col md="6">
            <InputElement
              icon="icon-link"
              type="text"
              placeholder="Website URL"
              name="websiteURL"
              value={Sponsor.websiteURL}
              onchanged={(event) => this.onChangeInput(event)}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col xs="12" md="6">
            <InputElement
              icon="icon-link"
              type="text"
              placeholder="Image URL"
              name="imageURL"
              value={Sponsor.imageURL}
              onchanged={(event) => this.onChangeInput(event)}
            />
          </Col>
          <Col md="6">
            <Select
              placeholder="Select category"
              value={Sponsor.category}
              options={categoryOptions}
              simpleValue
              onChange={this.handleCategoryChange.bind(this)}
            />
            {this.state.categoryRequired ? <div style={{ color: "red", marginTop: 0 }} className="help-block">*Required</div> : null}
          </Col>
        </FormGroup >
        <FormGroup row>
          <Col xs="12" md="3">
            <Button type="button" size="md" color="success" onClick={() => this.onSubmit()} >Submit</Button>
          </Col>
          <Col md="3">
            <Button type="button" size="md" color="danger" style={{ marginLeft: -160 }} onClick={() => this.onReset()} >Reset</Button>
          </Col>
          <Col md="6">
            {
              this.props.error !== "" ? <div style={{ color: "red", fontSize: 15, marginTop: 0 }} className="help-block">{this.props.error}</div> : null
            }
          </Col>
        </FormGroup >
      </CardLayout>
    )
  }
}
const mapStateToProps = state => {
  return {
    eventList: state.event.eventList,
    currentSponsor: state.sponsor.currentSponsor,
    error: state.sponsor.error,
    categoryOptions: state.sponsor.categoryOptions
  };
}
const mapDispatchToProps = dispatch => {
  return {
    getSponsors: () => dispatch(actions.getSponsors()),
    createSponsor: (room) => dispatch(actions.createSponsor(room)),
    editSponsor: (id, room) => dispatch(actions.editSponsor(id, room)),
    getEvents: () => dispatch(actions.getEvents()),
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(SponsorForm);
