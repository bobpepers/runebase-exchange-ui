import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import _ from 'lodash';
import {
  withStyles,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core';
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl';
import styles from './styles';

const messages = defineMessages({
  redeemConfirmMessageMsg: {
    id: 'redeemConfirm.message',
    defaultMessage: 'You are about to {txDesc} for {txAmount} {txToken}. Please click OK to continue.',
  },
  redeemConfirmMessageWithFeeMsg: {
    id: 'redeemConfirm.messageWithFee',
    defaultMessage: 'You are about to {txDesc} for {txAmount} {txToken} with a maximum transaction fee of {txFee} RUNES. Any unused transaction fees will be refunded to you. Please click OK to continue.',
  },
  strTypeMsg: {
    id: 'str.type',
    defaultMessage: 'Type',
  },
  strAmountMsg: {
    id: 'str.amount',
    defaultMessage: 'Amount',
  },
  strFeeMsg: {
    id: 'str.fee',
    defaultMessage: 'Gas Fee (RUNES)',
  },
  strGasLimitMsg: {
    id: 'str.gasLimit',
    defaultMessage: 'Gas Limit',
  },
});

/**
 * Shows the transactions that the user is approving before executing them. Some txs require 2 different txs.
 * USED IN:
 * - wallet
 * - event page
 * - create event
 */
@injectIntl
@withStyles(styles, { withTheme: true })
@inject('store')
@observer
export default class RedeemConfirmDialog extends Component {
  render() {
    const { open, txFees, onConfirm, onClose, txAmount, txToken, txDesc } = this.props;
    const { classes, intl: { formatMessage } } = this.props;
    const txFee = _.sumBy(txFees, ({ gasCost }) => gasCost ? parseFloat(gasCost) : 0);
    let confirmMessage = formatMessage(messages.redeemConfirmMessageMsg, { txDesc, txAmount, txToken });
    if (txFee) {
      confirmMessage = formatMessage(messages.redeemConfirmMessageWithFeeMsg, { txDesc, txAmount, txToken, txFee });
    }
    if (!open) {
      return null;
    }

    return (
      <Dialog open={open}>
        <DialogTitle>
          <FormattedMessage id="redeemConfirm.title" defaultMessage="Please Confirm Your Withdrawal" />
        </DialogTitle>
        <DialogContent>
          {confirmMessage}
          {Boolean(txFees.length) && (
            <Table className={classes.costTable}>
              <TableHead>
                <TableRow>
                  <Cell id={messages.strTypeMsg.id} defaultMessage={messages.strTypeMsg.defaultMessage} />
                  <Cell id={messages.strAmountMsg.id} defaultMessage={messages.strAmountMsg.defaultMessage} />
                  <Cell id={messages.strFeeMsg.id} defaultMessage={messages.strFeeMsg.defaultMessage} />
                  <Cell id={messages.strGasLimitMsg.id} defaultMessage={messages.strGasLimitMsg.defaultMessage} />
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>{txFees[0].props.type}</TableCell>
                  <TableCell>{txFees[0].props.amount} {txFees[0].props.token}</TableCell>
                  <TableCell>{txFees[0].props.gasCost}</TableCell>
                  <TableCell>{txFees[0].props.gasLimit}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          )}
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={onClose}>
            <FormattedMessage id="str.cancel" defaultMessage="Cancel" />
          </Button>
          <Button color="primary" onClick={onConfirm}>
            <FormattedMessage id="str.confirm" defaultMessage="OK" />
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

const Cell = injectIntl(({ id, defaultMessage, intl }) => (
  <TableCell>
    {intl.formatMessage({ id, defaultMessage })}
  </TableCell>
));
