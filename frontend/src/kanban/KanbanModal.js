import React from "react";
import { DoingTitle, Title } from "./Title";
import InlineEdit from "@atlaskit/inline-edit";
import Textfield from "@atlaskit/textfield";
import Textarea from "@atlaskit/textarea";
import Modal from "@atlaskit/modal-dialog";
import { ReactComponent as ModalDeleteIcon } from "../img/modal-delete.svg";
import styled from "styled-components";
import { grid } from "./Constants";

const FormRowContainer = styled.div`
  padding-bottom: 50px;
`;

const DeleteContainer = styled.div`
  justify-content: center;
  display: flex;
`;

const ReadViewContainer = styled.div`
  display: flex;
  max-width: 100%;
  padding: ${grid}px ${grid - 2}px;
  word-break: break-word;
`;

const Header = ({ onClose }) => {
  return <div></div>;
};

export function KanbanModal(props) {
  const { card, onClose, onChange, onDelete } = props;
  const heading = card.title;
  return (
    <Modal
      onClose={onClose}
      heading={<Header heading={card.title} onClose={onClose} />}
      autoFocus={false}
    >
      <InlineEdit
        defaultValue={heading ? heading : ""}
        readView={() => (
          <DoingTitle style={{ textAlign: "left" }}>
            {heading ? heading : "Add Title Here"}
          </DoingTitle>
        )}
        editView={(fieldProps) => <Textfield {...fieldProps} autoFocus />}
        onConfirm={(value) => {
          card.title = value;
          onChange(card);
        }}
        readViewFitContainerWidth
      />

      <FormRowContainer>
        <Title className="ModalSubHeading">Description</Title>
        <InlineEdit
          defaultValue={card.description || ""}
          readView={() => {
            return (
              <ReadViewContainer>
                {card.description || "Click to enter value"}
              </ReadViewContainer>
            );
          }}
          editView={(fieldProps, ref) => <Textarea {...fieldProps} ref={ref} />}
          onConfirm={(value) => {
            card.description = value;
            onChange(card);
          }}
          readViewFitContainerWidth
        />
      </FormRowContainer>
      <DeleteContainer>
        <ModalDeleteIcon
          className="KanbanButton"
          onClick={() => {
            onDelete(card.id);
          }}
        />
      </DeleteContainer>
    </Modal>
  );
}
