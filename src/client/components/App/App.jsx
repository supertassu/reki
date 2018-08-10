import React from 'react';
import { Navbar, Grid, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router';
import { getMainNavigation } from './MainNavigation';
import { getErrorNotification } from './ErrorNotification';

export function getApp(errorStore, errorActions) {
  class App extends React.Component {
    render() {
      const MainNavigation = getMainNavigation();
      const ErrorNotification = getErrorNotification(errorStore, errorActions);

      return (
        <div>
          <Navbar fluid>
            <Navbar.Header>
              <Navbar.Brand>
                <Link to="/">REKI</Link>
              </Navbar.Brand>
            </Navbar.Header>
            <MainNavigation />
          </Navbar>
          <Grid fluid className="page-content">
            <Row>
              <Col sm={ 2 } className="sidebar">
                { this.props.sidebar }
              </Col>
              <Col sm={ 10 } smOffset={ 2 } className="main">
                { this.props.main }
              </Col>
            </Row>
          </Grid>
          <ErrorNotification />
        </div>
      );
    }
  }

  App.propTypes = {
    sidebar: React.PropTypes.node,
    main: React.PropTypes.node,
  };

  return App;
}
