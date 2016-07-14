import React from 'react';
import { getPropertySelect } from '../../../components';

export function getLocalGroupFilterContainer(participantStore, participantActions) {
  const PropertySelect = getPropertySelect();

  class LocalGroupFilterContainer extends React.Component {
    constructor(props) {
      super(props);

      this.state = this.extractState();
      this.onStoreChanged = this.onStoreChanged.bind(this);
    }

    componentWillMount() {
      participantActions.loadLocalGroups.defer();
    }

    componentDidMount() {
      participantStore.listen(this.onStoreChanged);
    }

    componentWillUnmount() {
      participantStore.unlisten(this.onStoreChanged);
    }

    onStoreChanged() {
      this.setState(this.extractState());
    }

    extractState() {
      return { options: participantStore.getState().localGroups };
    }

    render() {
      return (
        <PropertySelect
          label="Lippukunta"
          property="localGroup"
          value={ this.props.currentSelection.localGroup }
          onChange={ this.props.onChange }
          options={ this.state.options }
        />
      );
    }
  }

  LocalGroupFilterContainer.propTypes = {
    currentSelection: React.PropTypes.object.isRequired,
    onChange: React.PropTypes.func.isRequired,
  };

  return LocalGroupFilterContainer;
}
