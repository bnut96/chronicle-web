// @flow

import React from 'react';

import { Modal, ModalFooter, Spinner } from 'lattice-ui-kit';
import { RequestStates } from 'redux-reqseq';
import type { RequestState } from 'redux-reqseq';

type Props = {
  deleteTimeout :boolean;
  handleOnClose :() => void;
  handleOnDeleteParticipant :() => void;
  isVisible :boolean;
  participantId :UUID;
  requestState :?RequestState;
}
const DeleteParticipantModal = ({
  deleteTimeout,
  handleOnClose,
  handleOnDeleteParticipant,
  isVisible,
  participantId,
  requestState
} :Props) => {

  const textPrimary = 'Delete';
  const textSecondary = 'Cancel';

  const requestStateComponents = {
    [RequestStates.STANDBY]: (
      <span>
        {`Are you sure you want to delete ${participantId}'s data? This action is permanent and cannot be undone.`}
      </span>
    ),
    [RequestStates.PENDING]: (
      <div style={{ textAlign: 'center' }}>
        <Spinner size="2x" />
        <p>Deleting participant&apos;s data. Please wait.</p>
      </div>
    ),
    [RequestStates.FAILURE]: (
      <span>Failed to delete participant. Please try again or contact support@openlattice.com.</span>
    ),
    [RequestStates.SUCCESS]: (
      <span>
        {
          deleteTimeout
            ? "We are still processing your request to delete participant's data. You may close this window."
            : "Successfully deleted participant's data."
        }
      </span>
    )
  };

  const renderFooter = () => {
    if (requestState === RequestStates.PENDING) {
      return (
        <ModalFooter
            isPendingPrimary
            isDisabledSecondary={!deleteTimeout}
            onClickSecondary={handleOnClose}
            textPrimary={textPrimary}
            textSecondary={textSecondary}
            withFooter />
      );
    }
    if (requestState === RequestStates.SUCCESS || requestState === RequestStates.FAILURE) {
      return (
        <ModalFooter
            onClickPrimary={handleOnClose}
            textPrimary="Close"
            textSecondary="" />
      );
    }
    return (
      <ModalFooter
          onClickPrimary={handleOnDeleteParticipant}
          onClickSecondary={handleOnClose}
          textPrimary={textPrimary}
          textSecondary={textSecondary} />
    );
  };

  return (
    <Modal
        isVisible={isVisible}
        onClose={handleOnClose}
        requestState={requestState}
        shouldCloseOnEscape={false}
        shouldCloseOnOutsideClick={false}
        textPrimary={textPrimary}
        textSecondary={textSecondary}
        textTitle="Delete Participant's Data"
        withFooter={renderFooter}>
      <div>
        {
          requestStateComponents[requestState || RequestStates.STANDBY]
        }
      </div>
    </Modal>
  );
};

export default DeleteParticipantModal;
