import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import * as actions from '../../store/actions/index';
import { FormGroup, Col, Button, Input, InputGroup } from 'reactstrap';
import CardLayout from '../../components/CardLayout/';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css';

class SponsorsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            event: ''
        }
    }
    componentDidMount() {
        this.props.getSponsors();
        this.props.getEvents();
    }
    onDeleteSponsor(cell, row) {
        return <Link to={this} onClick={() => this.props.deleteSponsor(row._id)}>
            <i className="fa fa-trash"></i>
        </Link>
    }
    onEditSponsor(cell, row) {
        return <Link to={`${this.props.match.url}/sponsorForm/${row._id}`} onClick={() => this.props.storeCurrentSponsor(row)}>
            <i className="fa fa-pencil"></i>
        </Link>
    }
    handleEventChange(value) {
        value !== null ? (this.setState({ event: value }), this.props.getSponsorsForEvent(value))
            : (this.setState({ event: '' }), this.props.getSponsors());
    }
    render() {
        const options = {
            sizePerPageList: [{
                text: '250', value: 250
            }, {
                text: '500', value: 500
            }, {
                text: '1000', value: 1000
            }, {
                text: 'All', value: this.props.sponsorsList.length
            }],
            sizePerPage: 250,
        };
        return (
            <CardLayout name="Sponsors List">
                <FormGroup row>
                    <Col xs="12" md="8">
                        <Link to={`${this.props.match.url}/sponsorForm`}>
                            <Button type="button" color="primary" style={{ marginLeft: -14 }} size="small"> <i className="fa fa-plus"></i>
                                Add Sponsor </Button>
                        </Link>
                    </Col>
                    <Col md="4">
                        <Select
                            name="Event"
                            placeholder="Select Event"
                            options={this.props.eventList}
                            value={this.state.event}
                            simpleValue
                            onChange={this.handleEventChange.bind(this)}
                        />
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <BootstrapTable ref='table' data={this.props.sponsorsList} pagination={true} search={true} options={options} exportCSV={true}>
                        <TableHeaderColumn dataField='_id' headerAlign='left' isKey hidden>Id</TableHeaderColumn>
                        <TableHeaderColumn dataField='name' headerAlign='left' width='100' csvHeader='Sponsor Name'>Sponsor Name</TableHeaderColumn>
                        <TableHeaderColumn dataField='category' headerAlign='left' width='100' csvHeader='Category'>Category</TableHeaderColumn>
                        <TableHeaderColumn dataField='eventName' headerAlign='left' width='100' csvHeader='Event'>Event</TableHeaderColumn>
                        <TableHeaderColumn dataField='edit' dataFormat={this.onEditSponsor.bind(this)} headerAlign='left' width='40' export={false}>Edit</TableHeaderColumn>
                        <TableHeaderColumn dataField='delete' dataFormat={this.onDeleteSponsor.bind(this)} headerAlign='left' width='40' export={false}>Delete</TableHeaderColumn>
                    </BootstrapTable>
                </FormGroup>
                <FormGroup row>
                    <Col md="6">
                        <div style={{ color: "red" }} className="help-block">{this.props.error}</div>
                    </Col>
                </FormGroup>
            </CardLayout>
        )
    }
}
const mapStateToProps = state => {
    return {
        sponsorsList: state.sponsor.sponsors,
        eventList: state.event.eventList,
        error: state.sponsor.error
    };
}
const mapDispatchToProps = dispatch => {
    return {
        getSponsors: () => dispatch(actions.getSponsors()),
        storeCurrentSponsor: (sponsor) => dispatch(actions.storeCurrentSponsor(sponsor)),
        deleteSponsor: (id) => dispatch(actions.deleteSponsor(id)),
        getEvents: () => dispatch(actions.getEvents()),
        getSponsorsForEvent: (eventId) => dispatch(actions.getSponsorsForEvent(eventId))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(SponsorsList);
