import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link ,Redirect} from 'react-router-dom';
import * as actions from '../../store/actions/index';
import { FormGroup, Col, Button, Input, InputGroup } from 'reactstrap';
import CardLayout from '../../components/CardLayout/';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css';

class SpeakerList extends Component {
    constructor(props) {
        super(props);
        this.state = {
           event : ''
        }
    }
    componentDidMount () {
        this.props.getSpeakerList();
        this.props.getEvents();
     
    }
    ondeleteSpeaker (cell, row) {
        return  <Link to={this}  onClick={() =>  this.props.deleteSpeaker(row._id)}>
                    <i className="fa fa-trash"></i>
                </Link>  
    }
    onEditSpeaker (cell, row) {
        return  <Link to={`${this.props.match.url}/speakerForm/${row._id}`} onClick={() => this.props.storeSpeakerData(row) }>
                    <i className="fa fa-pencil"></i>
                </Link>  
    }
    handleEventChange (value) {
        value !== null ? ( this.setState({ event : value}) , this.props.getSpeakersForEvent(value)) 
        : (this.setState ({ event : ''}) ,  this.props.getSpeakerList());
    }
    render() {
          const options = {
            sizePerPageList: [{
                text: '250', value: 250
                },{
                text: '500', value: 500
                },{
                text: '1000', value: 1000
                }, {
                text: 'All', value: this.props.speakerList.length
                } ], 
                sizePerPage: 250,
        };
        return (
            <CardLayout name="Speaker List">
                <FormGroup row>
                    <Col xs="12" md="8">
                        <Link to={`${this.props.match.url}/speakerForm`}>
                            <Button type="button" color="primary" style ={{marginLeft : -14}} size="small"> <i className="fa fa-plus"></i>
                                Add Speaker </Button>
                        </Link>
                    </Col>
                    <Col md="4">
                        <Select 
                            name= "Event"
                            placeholder =  "Select Event"
                            options = {this.props.eventList}
                            value = {this.state.event}
                            simpleValue
                            onChange = {this.handleEventChange.bind(this)}
                            />
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <BootstrapTable ref='table' data={this.props.speakerList} pagination={true} search={true} options={options} exportCSV={true}>
                        <TableHeaderColumn dataField='_id' headerAlign='left' isKey hidden>Id</TableHeaderColumn>
                        <TableHeaderColumn dataField='firstName' headerAlign='left' width='100' csvHeader='First Name'>First Name</TableHeaderColumn>
                        <TableHeaderColumn dataField='lastName' headerAlign='left' width='100' csvHeader='Last Name'>Last Name</TableHeaderColumn>
                        <TableHeaderColumn dataField='email' headerAlign='left' width='100' csvHeader='Email'>Email</TableHeaderColumn>
                        <TableHeaderColumn dataField='eventName' headerAlign='left' width='100' csvHeader='Event'>Event</TableHeaderColumn>
                        <TableHeaderColumn dataField='edit' dataFormat={this.onEditSpeaker.bind(this)} headerAlign='left' width='40' export={false}>Edit</TableHeaderColumn>
                        <TableHeaderColumn dataField='delete' dataFormat={this.ondeleteSpeaker.bind(this)} headerAlign='left' width='40' export={false}>Delete</TableHeaderColumn>
                    </BootstrapTable>
                </FormGroup>
                <FormGroup row>
                    <Col md="6">
                        <div style={{ color: "red" }} className="help-block">{this.props.speakerError}</div>
                    </Col>
                </FormGroup>
            </CardLayout>
        )
    }
}

const mapStateToProps = state => {
    return {
        speakerError: state.speaker.error,
        speakerList : state.speaker.speakerList,
        eventList :  state.event.eventList
    };
}

const mapDispatchToProps = dispatch => {
    return {
        getSpeakerList : () => dispatch(actions.getSpeakers()),
        storeSpeakerData : (attendee) => dispatch(actions.storeSpeakerData(attendee)),
        deleteSpeaker : (id) => dispatch(actions.deleteSpeaker(id)),
        getEvents : () => dispatch(actions.getEvents()),
        getSpeakersForEvent : (eventId) => dispatch(actions.getSpeakersForEvent(eventId)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SpeakerList);