import React from 'react';
import _ from 'lodash';
import { Nav } from 'react-bootstrap';
import { getNavigationItem } from '../../components';

export function getMainNavigation() {
  const NavigationItem = getNavigationItem();

  class MainNavigation extends React.Component {
    render() {
      const navItems = this.props.currentUser ? this.getLoggedInNavItems() : this.getLoggedOutNavItems();

      return (
        <Nav pullRight>
          {
            navItems.map(navItem => <NavigationItem key={ navItem.label } values={ navItem } />)
          }
        </Nav>
      );
    }

    getLoggedInNavItems() {
      const navItems = [ ];
      const roles = this.props.currentUser.roles;

      if (_.includes(roles, 'registryAdmin')) {
        navItems.push(
          {
            to: '/admin',
            isIndexLink: true,
            label: 'Käyttäjät',
          }
        );
      }

      if (_.includes(roles, 'registryUser')) {
        navItems.push(
          {
            to: '/participants',
            isIndexLink: true,
            label: 'Leiriläiset',
          }
        );
      }

      navItems.push(
        {
          icon: 'user',
          label: `${this.props.currentUser.firstName} ${this.props.currentUser.lastName}`,
        }
      );

      navItems.push(
        {
          to: '/logout',
          isExternalLink: true,
          label: 'Kirjaudu ulos',
        }
      );

      return navItems;
    }

    getLoggedOutNavItems() {
      return [
        {
          to: '/login/partioid',
          isIndexLink: true,
          label: 'Kirjaudu sisään',
          isExternalLink: true,
        },
      ];
    }
  }

  MainNavigation.propTypes = {
    currentUser: React.PropTypes.object,
    onLogout: React.PropTypes.func,
  };

  return MainNavigation;
}
