import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Modal, ModalFooter, PrimaryButton, WarningButton } from '../index';

const meta = {
  title: 'Feedback/Modal',
  component: Modal,
  tags: ['autodocs', 'ai-generated'],
  args: { open: false, onClose: () => {}, children: 'Modal content' },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <>
        <PrimaryButton onClick={() => setOpen(true)}>Open modal</PrimaryButton>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="Confirm changes"
          footer={<ModalFooter onClose={() => setOpen(false)} onConfirm={() => setOpen(false)} confirmLabel="Save" />}
        >
          Are you sure you want to save these changes?
        </Modal>
      </>
    );
  },
};

export const Danger: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <>
        <WarningButton onClick={() => setOpen(true)}>Delete…</WarningButton>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="Delete item?"
          footer={<ModalFooter onClose={() => setOpen(false)} onConfirm={() => setOpen(false)} confirmLabel="Delete" />}
        >
          This action cannot be undone.
        </Modal>
      </>
    );
  },
};
