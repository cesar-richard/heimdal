import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getAllBlocked } from "../../../actions/fetch/blockedActions";
import { getSalesLocations } from "../../../actions/fetch/salesLocationsActions";
import { Col, Container, ListGroup, Row, Spinner } from "react-bootstrap";
import FundationModel from "../../../models/FundationModel";
import BlockedModel from "../../../models/BlockedModel";
import SalesLocationModel from "../../../models/SalesLocationModel";

class Fundation extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    this.props.fetchAllBlocked(this.props.fundation.id);
    this.props.fetchSalesLocation(this.props.fundation.id);
  }

  handleClick() {
    console.log("click!", this.props.fundation.name);
  }

  render() {
    if (
      this.props.blocked.isLoading[this.props.fundation.id] &&
      this.props.salesLocations.isLoading[this.props.fundation.id]
    ) {
      return (
        <ListGroup.Item>
          <Container>
            <Row>
              <Col>{this.props.fundation.name}</Col>
              <Col>
                <Spinner animation='border' role='status' size='sm'>
                  <span className='sr-only'>Loading...</span>
                </Spinner>
              </Col>
              <Col>
                <Spinner animation='border' role='status' size='sm'>
                  <span className='sr-only'>Loading...</span>
                </Spinner>
              </Col>
            </Row>
          </Container>
        </ListGroup.Item>
      );
    }

    if (
      this.props.blocked.hasBeenFetched[this.props.fundation.id] ||
      this.props.salesLocations.hasBeenFetched[this.props.fundation.id]
    ) {
      const blockedCount = this.props.blocked.hasBeenFetched[
        this.props.fundation.id
      ]
        ? Object.values(this.props.blocked.data[this.props.fundation.id]).length
        : -1;
      let salesLocationsCount = -1;
      let activeSalesLocationsCount = -1;
      if (this.props.salesLocations.hasBeenFetched[this.props.fundation.id]) {
        salesLocationsCount = this.props.salesLocations.data[
          this.props.fundation.id
        ].length;
        activeSalesLocationsCount = this.props.salesLocations.data[
          this.props.fundation.id
        ].filter(item => {
          return item.enabled;
        }).length;
      }
      sessionStorage.blocked = JSON.stringify(this.props.blocked.data);
      return (
        <ListGroup.Item
          variant={0 < blockedCount ? "danger" : "info"}
          action
          href={`/fundations/${this.props.fundation.id}`}
        >
          <Container>
            <Row>
              <Col>{this.props.fundation.name}</Col>
              <Col>
                {this.props.blocked.hasBeenFetched[this.props.fundation.id] ? (
                  blockedCount + " blocked"
                ) : this.props.blocked.hasErrored[this.props.fundation.id] ? (
                  403 == this.props.blocked.hasErrored[this.props.fundation.id]
                    .status ? (
                    this.props.blocked.hasErrored[this.props.fundation.id]
                      .message
                  ) : (
                    "Error"
                  )
                ) : (
                  <Spinner animation='border' role='status' size='sm'>
                    <span className='sr-only'>Loading...</span>
                  </Spinner>
                )}
              </Col>
              <Col>
                {this.props.salesLocations.hasBeenFetched[
                  this.props.fundation.id
                ] ? (
                  activeSalesLocationsCount === salesLocationsCount &&
                  0 === salesLocationsCount ? (
                    "No sales locations"
                  ) : (
                    activeSalesLocationsCount +
                    "/" +
                    salesLocationsCount +
                    " active sales locations"
                  )
                ) : (
                  <Spinner animation='border' role='status' size='sm'>
                    <span className='sr-only'>Loading...</span>
                  </Spinner>
                )}
              </Col>
            </Row>
          </Container>
        </ListGroup.Item>
      );
    }
    if (this.props.blocked.hasErrored[this.props.fundation.id]) {
      return <ListGroup.Item variant='primary'>Error</ListGroup.Item>;
    }
    return <ListGroup.Item variant='warning'>Chelou</ListGroup.Item>;
  }
}

const mapStateToProps = state => ({
  blocked: state.blocked,
  salesLocations: state.salesLocations
});

const mapDispatchToProps = dispatch => ({
  fetchAllBlocked: fundationId => dispatch(getAllBlocked(fundationId)),
  fetchSalesLocation: fundationId => dispatch(getSalesLocations(fundationId))
});

Fundation.propTypes = {
  fetchAllBlocked: PropTypes.func,
  fetchSalesLocation: PropTypes.func,
  fundation: PropTypes.instanceOf(FundationModel).isRequired,
  blocked: PropTypes.arrayOf(PropTypes.instanceOf(BlockedModel)),
  salesLocations: PropTypes.arrayOf(PropTypes.instanceOf(SalesLocationModel))
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Fundation);
