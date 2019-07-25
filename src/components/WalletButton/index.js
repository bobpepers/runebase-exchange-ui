import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Divider } from 'semantic-ui-react';
import {
  Grid,
} from '@material-ui/core';
import { AccountBalanceWallet } from '@material-ui/icons';
import './styles.css';

@inject('store')
@observer
export default class WalletButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
    };
  }

  handleSelectChange = (key, event) => {
    this.props.store.wallet.changeAddress(key, event);
    this.setState({ show: false });
  }

  handleToggle = (e) => {
    e.target.focus();
    this.setState({ show: !this.state.show });
  }

  handleBlur = (e) => {
    if (e.nativeEvent.explicitOriginalTarget &&
        e.nativeEvent.explicitOriginalTarget === e.nativeEvent.originalTarget) {
      return;
    }

    if (this.state.show) {
      setTimeout(() => {
        this.setState({ show: false });
      }, 200);
    }
  }

  render() {
    const { store: { wallet } } = this.props;
    const { show, handleToggle, handleBlur, handleSelectChange } = this;
    const addressSelectBoolean = wallet.currentAddressSelected === '';
    return (
      <div>
        <div className={`verticalTextButton arrow ${addressSelectBoolean ? 'pulsate' : 'notPulsate'}`}>
          <AccountBalanceWallet></AccountBalanceWallet>
          {wallet.currentAddressSelected !== '' ? wallet.currentAddressSelected : 'Please Select An Address'}
        </div>
      </div>
    );
  }
}