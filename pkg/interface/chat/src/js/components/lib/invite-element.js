import React, { Component } from 'react';
import classnames from 'classnames';
import { Sigil } from '/components/lib/icons/sigil';
import { deSig } from '/lib/util';
import urbitOb from 'urbit-ob';


export class InviteElement extends Component {

  constructor(props) {
    super(props);

    this.state = {
      members: '',
      error: false,
      success: false
    };
  }

  modifyMembers() {
    const { props, state } = this;

    let aud = [];
    let isValid = true;
    if (state.members.length > 2) {
      aud = state.members.split(',')
        .map((mem) => mem.trim())
        .map(deSig)
        .map((mem) => {
          return `~${mem}`;
        });

      aud.forEach((mem) => {
        if (!urbitOb.isValidPatp(mem)) {
          isValid = false;
        }
      });
    }

    if (!isValid || (state.members.length > 0 && state.members.length < 3)) {
      this.setState({
        error: true,
        success: false
      });
      return;
    }

    if (this.textarea) {
      this.textarea.value = '';
    }

    this.setState({
      error: false,
      success: true,
      members: ''
    }, () => {
      props.api.groups.add(aud, props.path);
      aud.forEach((recipient) => {
        props.api.invite.invite(
          '/chat',
          `/mailbox${props.station}`,
          window.ship,
          'chat-hook',
          `You have been invited to join ~${window.ship}/mailbox${props.station}`,
          recipient
        );
      });
    });
  }

  modifyMembersChange(e) {
    this.setState({
      members: e.target.value
    });
  }

  render() {
    const { props, state} = this;
    let errorElem = !!state.error ? (
      <p className="pt2 nice-red label-regular">Invalid ship name.</p>
    ) : (
      <div></div>
    );

    let successElem = !!state.success ? (
      <p className="pt2 nice-green label-regular">Success!</p>
    ) : (
      <div></div>
    );

    let modifyButtonClasses = "label-regular black underline btn-font pointer";
    if (!state.error) {
      modifyButtonClasses = modifyButtonClasses + ' black';
    }

    let buttonText = '';
    if (props.permissions.kind === 'black') {
      buttonText = '-> Ban';
    } else if (props.permissions.kind === 'white') {
      buttonText = '-> Invite';
    }

    return (
      <div>
        <textarea
          ref={ e => { this.textarea = e; } }
          className="w-90 db ba overflow-y-hidden mono gray mb2"
          style={{
            resize: 'none',
            height: 150
          }}
          spellCheck="false"
          onChange={this.modifyMembersChange.bind(this)}></textarea>
        <button
          onClick={this.modifyMembers.bind(this)}
          className={modifyButtonClasses}>
          {buttonText}
        </button>
        {errorElem}
        {successElem}
      </div>
    );
  }
}
